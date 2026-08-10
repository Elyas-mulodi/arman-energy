import jwt from 'jsonwebtoken';
import { ENV } from '../Config/env.js';
import User from '../Modules/User/UserMd.js';

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

    req.user = user;
    next();
  } catch (error) {
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