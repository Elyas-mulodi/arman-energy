import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

export const saveImage = async (fileBuffer, folder) => {
  console.log('📁 saveImage صدا زده شد، folder:', folder);
  console.log('📁 process.cwd():', process.cwd());

  const uploadDir = path.join(process.cwd(), 'uploads', folder);
  console.log('📁 مسیر کامل پوشه:', uploadDir);

  if (!fs.existsSync(uploadDir)) {
    console.log('📁 پوشه وجود نداشت، در حال ساخت...');
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log('📁 پوشه ساخته شد:', fs.existsSync(uploadDir));
  }

  const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}.jpg`;
  const filePath = path.join(uploadDir, fileName);
  console.log('📁 مسیر نهایی فایل:', filePath);

  try {
    await sharp(fileBuffer)
      .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 85 })
      .toFile(filePath);
    console.log('✅ فایل با موفقیت ذخیره شد:', fs.existsSync(filePath));
  } catch (err) {
    console.error('❌ خطای Sharp:', err.message);
    throw err;
  }

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