import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';
import { randomUUID } from 'crypto';
import { UPLOAD_ROOT } from '../Config/paths.js';

const ALLOWED_FOLDERS = new Set(['products', 'categories']);

export const saveImage = async (fileBuffer, folder) => {
  if (!ALLOWED_FOLDERS.has(folder)) {
    throw new Error('پوشه‌ی آپلود نامعتبر است');
  }

  const uploadDir = path.join(UPLOAD_ROOT, folder);
  await fs.mkdir(uploadDir, { recursive: true });

  const fileName = `${Date.now()}-${randomUUID()}.jpg`;

  await sharp(fileBuffer)
    .rotate() // جهت صحیح بر اساس EXIF
    .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
    .flatten({ background: '#ffffff' }) // PNG شفاف روی زمینه‌ی سفید، نه مشکی
    .jpeg({ quality: 85 })
    .toFile(path.join(uploadDir, fileName));

  return `/uploads/${folder}/${fileName}`;
};

export const deleteImageFile = async (imageUrl) => {
  try {
    if (typeof imageUrl !== 'string' || !imageUrl.startsWith('/uploads/')) return;

    const target = path.resolve(UPLOAD_ROOT, imageUrl.slice('/uploads/'.length));

    // جلوگیری از path traversal (مثلا /uploads/../.env)
    if (!target.startsWith(UPLOAD_ROOT + path.sep)) return;

    await fs.unlink(target);
  } catch (error) {
    if (error.code !== 'ENOENT') console.error('خطا در حذف فایل تصویر:', error.message);
  }
};