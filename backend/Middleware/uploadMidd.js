import multer from 'multer';

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) return cb(null, true);

  const error = new Error('فقط فایل‌های تصویری (jpg, png, webp) مجاز هستند');
  error.status = 400;
  cb(error, false);
};

export const uploadCategoryImage = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

export const uploadProductImages = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});
