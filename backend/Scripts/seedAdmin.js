import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../Modules/User/UserMd.js';

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('متصل به دیتابیس شد');

    const adminPhone = process.env.SEED_ADMIN_PHONE;
    const adminPassword = process.env.SEED_ADMIN_PASSWORD;

    if (!adminPhone || !adminPassword) {
      console.error('لطفا SEED_ADMIN_PHONE و SEED_ADMIN_PASSWORD را در .env تنظیم کنید');
      process.exit(1);
    }

    const existingAdmin = await User.findOne({ phone: adminPhone });

    if (existingAdmin) {
      console.log('کاربر با این شماره از قبل وجود دارد.');
      if (existingAdmin.role !== 'admin') {
        existingAdmin.role = 'admin';
        await existingAdmin.save();
        console.log('نقش کاربر به admin تغییر یافت.');
      } else {
        console.log('این کاربر از قبل ادمین است.');
      }
      process.exit(0);
    }

    await User.create({
      fullName: 'مدیر سیستم',
      phone: adminPhone,
      password: adminPassword,
      role: 'admin',
    });

    console.log('✅ ادمین با موفقیت ساخته شد');
    console.log(`شماره موبایل: ${adminPhone}`);
    process.exit(0);
  } catch (error) {
    console.error('خطا در ساخت ادمین:', error.message);
    process.exit(1);
  }
};

seedAdmin();