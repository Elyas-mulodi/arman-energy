import jwt from 'jsonwebtoken';
import { ENV } from '../Config/env.js';

// این گزینه‌ها باید هنگام ساخت و پاک کردن کوکی دقیقا یکسان باشند
export const authCookieOptions = {
  httpOnly: true,
  secure: ENV.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/',
  ...(ENV.COOKIE_DOMAIN && { domain: ENV.COOKIE_DOMAIN }),
};

const generateToken = (res, userId, role) => {
  const token = jwt.sign({ userId, role }, ENV.JWT_SECRET, { expiresIn: '30d' });

  res.cookie('token', token, {
    ...authCookieOptions,
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  return token;
};

export default generateToken;