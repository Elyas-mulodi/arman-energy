import sharp from 'sharp';
import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import s3Client from '../Config/storage.js';
import { ENV } from '../Config/env.js';

export const processAndUploadImage = async (fileBuffer, folder) => {
  const processedBuffer = await sharp(fileBuffer)
    .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 80 })
    .toBuffer();

  const fileName = `${folder}/${Date.now()}-${Math.round(Math.random() * 1e9)}.webp`;

  await s3Client.send(
    new PutObjectCommand({
      Bucket: ENV.STORAGE_BUCKET,
      Key: fileName,
      Body: processedBuffer,
      ContentType: 'image/webp',
      ACL: 'public-read',
    })
  );

  return `${ENV.STORAGE_PUBLIC_URL}/${fileName}`;
};

export const deleteImage = async (imageUrl) => {
  try {
    const key = imageUrl.replace(`${ENV.STORAGE_PUBLIC_URL}/`, '');
    await s3Client.send(
      new DeleteObjectCommand({ Bucket: ENV.STORAGE_BUCKET, Key: key })
    );
  } catch (error) {
    console.error('خطا در حذف تصویر:', error.message);
  }
};