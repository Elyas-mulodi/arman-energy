import path from 'path';
import { ENV } from './env.js';

// پیش‌فرض همان backend/uploads است، پس عکس‌های فعلی سر جایشان می‌مانند
export const UPLOAD_ROOT = path.resolve(ENV.UPLOAD_DIR || path.join(process.cwd(), 'uploads'));