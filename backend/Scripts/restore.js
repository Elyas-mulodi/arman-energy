import readline from "readline";
import mongoose from "mongoose";
import { ENV } from "../Config/env.js";
import {
  listBackups,
  readManifest,
  restoreBackup,
} from "../Utils/backupService.js";

const ask = (question) =>
  new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });

try {
  const backupName = process.argv[2];
  const backups = await listBackups();

  if (!backupName) {
    console.log("بک‌آپ‌های موجود (جدیدترین اول):");
    backups.forEach((name) => console.log(`  ${name}`));
    console.log("\nاجرا: npm run restore -- <اسم-بک‌آپ>");
    process.exit(0);
  }

  const { manifest } = await readManifest(backupName);
  await mongoose.connect(ENV.MONGO_URI);
  const targetDb = mongoose.connection.name;

  console.log(`\nبک‌آپ: ${backupName} (ساخته‌شده در ${manifest.createdAt})`);
  console.log(`دیتابیس مقصد: ${targetDb}`);
  console.log(
    "⚠️  تمام داده‌های فعلی این کالکشن‌ها پاک و با بک‌آپ جایگزین می‌شوند:",
  );
  Object.entries(manifest.collections).forEach(([name, count]) =>
    console.log(`   - ${name}: ${count} سند`),
  );

  const answer = await ask(
    `\nبرای تایید، نام دیتابیس مقصد (${targetDb}) را تایپ کن: `,
  );
  if (answer !== targetDb) {
    console.log("لغو شد.");
    process.exit(0);
  }

  const result = await restoreBackup(backupName);
  console.log("\n✅ بازیابی کامل شد:");
  Object.entries(result.restored).forEach(([name, count]) =>
    console.log(`   - ${name}: ${count} سند`),
  );
  console.log(`🖼️  ${result.restoredImages} تصویر به پوشه‌ی آپلود برگشت`);
} catch (error) {
  console.error("❌ خطا در بازیابی:", error.message);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
