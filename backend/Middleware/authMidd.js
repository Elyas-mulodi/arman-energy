import jwt from 'jsonwebtoken';
import { ENV } from '../Config/env.js';
import User from '../Modules/User/UserMd.js';
import { authCookieOptions } from '../Utils/generateToken.js';

export const verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: 'دسترسی غیرمجاز - لطفا وارد شوید' });
    }

    const decoded = jwt.verify(token, ENV.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return res.status(401).json({ message: 'کاربر یافت نشد' });
    }

    // کاربری که ادمین غیرفعالش کرده نباید تا انقضای توکن (۳۰ روز) کار کند
    if (!user.isActive) {
      res.clearCookie('token', authCookieOptions);
      return res.status(403).json({ message: 'حساب کاربری شما غیرفعال شده است' });
    }

    req.user = user;
    next();
  } catch {
    return res.status(401).json({ message: 'توکن نامعتبر است' });
  }
};
export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'دسترسی فقط برای ادمین مجاز است' });
  }
};