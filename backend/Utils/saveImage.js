import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

export const saveImage = async (fileBuffer, folder) => {
  const uploadDir = path.join(process.cwd(), 'uploads', folder);

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}.jpg`;
  const filePath = path.join(uploadDir, fileName);

  await sharp(fileBuffer)
    .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 85 })
    .toFile(filePath);

  return `/uploads/${folder}/${fileName}`;
};

export const deleteImageFile = (imageUrl) => {
  try {
    const filePath = path.join(process.cwd(), imageUrl);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (error) {
    console.error('خطا در حذف فایل تصویر:', error.message);
  }
};