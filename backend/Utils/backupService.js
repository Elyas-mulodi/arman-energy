import fs from 'fs';
import fsp from 'fs/promises';
import path from 'path';
import zlib from 'zlib';
import readline from 'readline';
import { PassThrough } from 'stream';
import { pipeline } from 'stream/promises';
import { once } from 'events';
import mongoose from 'mongoose';
import { EJSON } from 'bson';
import { ENV } from '../Config/env.js';
import { UPLOAD_ROOT } from '../Config/paths.js';

const BACKUP_ROOT = path.resolve(ENV.BACKUP_DIR || path.join(process.cwd(), 'backups'));
const DB_DIR = path.join(BACKUP_ROOT, 'db');
const UPLOADS_MIRROR = path.join(BACKUP_ROOT, 'uploads');
const BATCH_SIZE = 500;

const isInside = (child, parent) => child === parent || child.startsWith(parent + path.sep);

const assertSafePaths = () => {
  // اگر بک‌آپ داخل پوشه‌ی آپلود باشد، کپی عکس‌ها بی‌نهایت تکرار می‌شود
  if (isInside(BACKUP_ROOT, UPLOAD_ROOT) || isInside(UPLOAD_ROOT, BACKUP_ROOT)) {
    throw new Error('مسیر BACKUP_DIR و UPLOAD_DIR نباید داخل هم باشند');
  }
};

// ---------- خواندن / نوشتن فایل‌های NDJSON فشرده ----------

const exportCollection = async (name, targetFile) => {
  const cursor = mongoose.connection.db.collection(name).find({});
  const gzip = zlib.createGzip();
  const out = fs.createWriteStream(targetFile);
  gzip.pipe(out);

  let count = 0;
  for await (const doc of cursor) {
    // EJSON نوع‌ها (ObjectId، Date) را حفظ می‌کند؛ JSON ساده همه را رشته می‌کرد
    if (!gzip.write(`${EJSON.stringify(doc, { relaxed: true })}\n`)) {
      await once(gzip, 'drain');
    }
    count++;
  }

  gzip.end();
  await once(out, 'finish');
  return count;
};

async function* readNdjson(file) {
  const input = new PassThrough();
  const piped = pipeline(fs.createReadStream(file), zlib.createGunzip(), input);
  piped.catch(() => {}); // خطا پایین‌تر با await دوباره پرتاب می‌شود
  const rl = readline.createInterface({ input, crlfDelay: Infinity });

  for await (const line of rl) {
    if (line.trim()) yield EJSON.parse(line);
  }
  await piped; // اگر فایل خراب بود اینجا خطا می‌دهد (نه یک بازیابی ناقص بی‌صدا)
}

// ---------- عکس‌ها ----------

// اسم فایل‌ها یکتا و تغییرناپذیر است، پس وجود داشتن فایل در مقصد یعنی کپی شده.
// عکس‌های حذف‌شده عمداً در آینه می‌مانند (برای بازیابی اشتباهی‌ها)
const mirrorFiles = async (fromRoot, toRoot) => {
  let copied = 0;

  const walk = async (dir) => {
    let entries;
    try {
      entries = await fsp.readdir(dir, { withFileTypes: true });
    } catch (error) {
      if (error.code === 'ENOENT') return;
      throw error;
    }

    for (const entry of entries) {
      const src = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        await walk(src);
        continue;
      }
      if (!entry.isFile()) continue;

      const dest = path.join(toRoot, path.relative(fromRoot, src));
      try {
        await fsp.access(dest);
        continue;
      } catch {
        // وجود ندارد، کپی می‌شود
      }
      await fsp.mkdir(path.dirname(dest), { recursive: true });
      await fsp.copyFile(src, dest);
      copied++;
    }
  };

  await walk(fromRoot);
  return copied;
};

// ---------- مدیریت نسخه‌ها ----------

export const listBackups = async () => {
  try {
    const entries = await fsp.readdir(DB_DIR, { withFileTypes: true });
    return entries
      .filter((e) => e.isDirectory() && !e.name.startsWith('.tmp-'))
      .map((e) => e.name)
      .sort()
      .reverse(); // جدیدترین اول
  } catch (error) {
    if (error.code === 'ENOENT') return [];
    throw error;
  }
};

const pruneOldBackups = async () => {
  const keep = Math.max(ENV.BACKUP_KEEP, 1);
  const names = await listBackups();
  const stale = names.slice(keep);

  for (const name of stale) {
    await fsp.rm(path.join(DB_DIR, name), { recursive: true, force: true });
  }

  // پوشه‌های نیمه‌کاره‌ی بیش از ۲۴ ساعت (مثلا بعد از کرش سرور)
  try {
    const entries = await fsp.readdir(DB_DIR, { withFileTypes: true });
    for (const entry of entries) {
      if (!entry.isDirectory() || !entry.name.startsWith('.tmp-')) continue;
      const full = path.join(DB_DIR, entry.name);
      const { mtimeMs } = await fsp.stat(full);
      if (Date.now() - mtimeMs > 24 * 60 * 60 * 1000) {
        await fsp.rm(full, { recursive: true, force: true });
      }
    }
  } catch {
    // مهم نیست
  }

  return stale.length;
};

// ---------- ساخت بک‌آپ ----------

export const createBackup = async () => {
  assertSafePaths();

  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const tmpDir = path.join(DB_DIR, `.tmp-${stamp}`);
  const finalDir = path.join(DB_DIR, stamp);
  await fsp.mkdir(tmpDir, { recursive: true });

  const manifest = {
    createdAt: new Date().toISOString(),
    database: mongoose.connection.name,
    collections: {},
  };

  try {
    const collections = await mongoose.connection.db
      .listCollections({}, { nameOnly: true })
      .toArray();

    for (const { name } of collections) {
      if (name.startsWith('system.')) continue;
      manifest.collections[name] = await exportCollection(
        name,
        path.join(tmpDir, `${name}.ndjson.gz`)
      );
    }

    await fsp.writeFile(path.join(tmpDir, 'manifest.json'), JSON.stringify(manifest, null, 2));
    // تا آخر کار با اسم .tmp می‌ماند؛ پس بک‌آپ ناقص هرگز «کامل» دیده نمی‌شود
    await fsp.rename(tmpDir, finalDir);
  } catch (error) {
    await fsp.rm(tmpDir, { recursive: true, force: true });
    throw error;
  }

  const newImages = await mirrorFiles(UPLOAD_ROOT, UPLOADS_MIRROR);
  const removed = await pruneOldBackups();
  const totalDocs = Object.values(manifest.collections).reduce((sum, n) => sum + n, 0);

  return { folder: finalDir, collections: manifest.collections, totalDocs, newImages, removed };
};

// ---------- بازیابی ----------

export const readManifest = async (backupName) => {
  const dir = path.join(DB_DIR, path.basename(backupName)); // basename: جلوگیری از path traversal
  const manifest = JSON.parse(await fsp.readFile(path.join(dir, 'manifest.json'), 'utf8'));
  return { dir, manifest };
};

export const restoreBackup = async (backupName) => {
  assertSafePaths();
  const { dir, manifest } = await readManifest(backupName);

  // مرحله ۱: همه‌ی فایل‌ها را بدون دست زدن به دیتابیس بخوان و تعداد را با manifest بسنج.
  // اگر فایلی خراب باشد، قبل از پاک شدن هر چیزی متوقف می‌شویم
  for (const [name, expected] of Object.entries(manifest.collections)) {
    let count = 0;
    for await (const doc of readNdjson(path.join(dir, `${name}.ndjson.gz`))) {
      if (doc) count++;
    }
    if (count !== expected) {
      throw new Error(`فایل «${name}» ناقص یا خراب است (${count} از ${expected} سند)`);
    }
  }

  // مرحله ۲: جایگزینی داده‌ها
  const restored = {};
  for (const name of Object.keys(manifest.collections)) {
    const collection = mongoose.connection.db.collection(name);
    await collection.deleteMany({}); // ایندکس‌ها (مثل یکتایی SKU) سر جایشان می‌مانند

    let batch = [];
    let count = 0;
    for await (const doc of readNdjson(path.join(dir, `${name}.ndjson.gz`))) {
      batch.push(doc);
      if (batch.length >= BATCH_SIZE) {
        await collection.insertMany(batch, { ordered: false });
        count += batch.length;
        batch = [];
      }
    }
    if (batch.length > 0) {
      await collection.insertMany(batch, { ordered: false });
      count += batch.length;
    }
    restored[name] = count;
  }

  // مرحله ۳: عکس‌هایی که در پوشه‌ی آپلود نیستند از آینه برگردند (چیزی بازنویسی نمی‌شود)
  const restoredImages = await mirrorFiles(UPLOADS_MIRROR, UPLOAD_ROOT);

  return { database: manifest.database, restored, restoredImages };
};