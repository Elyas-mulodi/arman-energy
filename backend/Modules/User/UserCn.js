import User from "./UserMd.js";
import generateToken from "../../Utils/generateToken.js";
import { requestLimoOtp, verifyLimoOtp } from "../../Utils/limoOtpService.js";
import { authCookieOptions } from "../../Utils/generateToken.js";
import { asString, normalizePhone, normalizePostalCode } from "../../Utils/validate.js";
import { sendError } from "../../Utils/sendError.js";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// @route POST /api/users/register
export const registerUser = async (req, res) => {
  try {
    const body = req.body ?? {};
    const fullName = asString(body.fullName);
    const phone = normalizePhone(body.phone);
    const email = asString(body.email).toLowerCase();
    const password = typeof body.password === "string" ? body.password : "";

    if (fullName.length < 3 || fullName.length > 80) {
      return res
        .status(400)
        .json({ message: "نام باید بین ۳ تا ۸۰ کاراکتر باشد" });
    }
    if (!phone) {
      return res
        .status(400)
        .json({ message: "شماره موبایل نامعتبر است (مثال: 09123456789)" });
    }
    if (email && !EMAIL_REGEX.test(email)) {
      return res.status(400).json({ message: "ایمیل نامعتبر است" });
    }
    // bcrypt بیشتر از ۷۲ بایت را نادیده می‌گیرد
    if (password.length < 6 || password.length > 72) {
      return res
        .status(400)
        .json({ message: "رمز عبور باید بین ۶ تا ۷۲ کاراکتر باشد" });
    }

    if (await User.exists({ phone })) {
      return res
        .status(400)
        .json({ message: "کاربری با این شماره موبایل قبلا ثبت شده است" });
    }

    const user = await User.create({
      fullName,
      phone,
      ...(email && { email }),
      password,
    });

    generateToken(res, user._id, user.role);

    res.status(201).json({
      _id: user._id,
      fullName: user.fullName,
      phone: user.phone,
      role: user.role,
    });
  } catch (error) {
    return sendError(res, error, "خطا در ثبت‌نام کاربر");
  }
};

// @route POST /api/users/login
export const loginUser = async (req, res) => {
  try {
    const body = req.body ?? {};
    const phone = normalizePhone(body.phone);
    const password = typeof body.password === "string" ? body.password : "";

    if (!phone || !password) {
      return res
        .status(401)
        .json({ message: "شماره موبایل یا رمز عبور اشتباه است" });
    }

    const user = await User.findOne({ phone });

    if (!user || !(await user.matchPassword(password))) {
      return res
        .status(401)
        .json({ message: "شماره موبایل یا رمز عبور اشتباه است" });
    }

    if (!user.isActive) {
      return res
        .status(403)
        .json({ message: "حساب کاربری شما غیرفعال شده است" });
    }

    generateToken(res, user._id, user.role);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      phone: user.phone,
      role: user.role,
    });
  } catch (error) {
    return sendError(res, error, "خطا در ورود کاربر");
  }
};

export const logoutUser = (req, res) => {
  res.clearCookie("token", authCookieOptions);
  res.status(200).json({ message: "با موفقیت خارج شدید" });
};

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.status(200).json(user);
  } catch (error) {
    res
      .status(500)
      .json({ message: "خطا در دریافت اطلاعات کاربر", error: error.message });
  }
};

// @route PUT /api/users/profile
export const updateUserProfile = async (req, res) => {
  try {
    const body = req.body ?? {};
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "کاربر یافت نشد" });
    }

    if (body.fullName !== undefined) {
      const fullName = asString(body.fullName);
      if (fullName.length < 3 || fullName.length > 80) {
        return res
          .status(400)
          .json({ message: "نام باید بین ۳ تا ۸۰ کاراکتر باشد" });
      }
      user.fullName = fullName;
    }

    if (body.email !== undefined) {
      const email = asString(body.email).toLowerCase();
      if (email && !EMAIL_REGEX.test(email)) {
        return res.status(400).json({ message: "ایمیل نامعتبر است" });
      }
      user.email = email || undefined;
    }

    if (body.address !== undefined) {
      const address = body.address;
      if (!address || typeof address !== "object") {
        return res.status(400).json({ message: "آدرس نامعتبر است" });
      }

      const postalCode = asString(address.postalCode)
        ? normalizePostalCode(address.postalCode)
        : "";
      if (postalCode === null) {
        return res.status(400).json({ message: "کد پستی باید ۱۰ رقم باشد" });
      }

      user.address = {
        province: asString(address.province).slice(0, 50),
        city: asString(address.city).slice(0, 50),
        fullAddress: asString(address.fullAddress).slice(0, 500),
        postalCode,
      };
    }

    if (body.password !== undefined && body.password !== "") {
      const currentPassword =
        typeof body.currentPassword === "string" ? body.currentPassword : "";
      const newPassword =
        typeof body.password === "string" ? body.password : "";

      if (!currentPassword) {
        return res.status(400).json({ message: "رمز عبور فعلی را وارد کنید" });
      }
      // ۴۰۰ و نه ۴۰۱؛ چون اینترسپتور axios روی ۴۰۱ کاربر را به لاگین می‌فرستد
      if (!(await user.matchPassword(currentPassword))) {
        return res.status(400).json({ message: "رمز عبور فعلی اشتباه است" });
      }
      if (newPassword.length < 6 || newPassword.length > 72) {
        return res
          .status(400)
          .json({ message: "رمز عبور باید بین ۶ تا ۷۲ کاراکتر باشد" });
      }
      user.password = newPassword;
    }

    const updated = await user.save();

    // کاربر کامل (با آدرس و تاریخ عضویت) برگردد، تا استور فرانت فیلدهایش را از دست ندهد
    const safeUser = updated.toObject();
    delete safeUser.password;

    res.status(200).json(safeUser);
  } catch (error) {
    return sendError(res, error, "خطا در بروزرسانی اطلاعات");
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    res.status(200).json(users);
  } catch (error) {
    res
      .status(500)
      .json({ message: "خطا در دریافت لیست کاربران", error: error.message });
  }
};

export const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "کاربر یافت نشد" });
    }
    user.isActive = !user.isActive;
    await user.save();
    res
      .status(200)
      .json({ message: "وضعیت کاربر بروزرسانی شد", isActive: user.isActive });
  } catch (error) {
    res
      .status(500)
      .json({ message: "خطا در تغییر وضعیت کاربر", error: error.message });
  }
};

// @route POST /api/users/forgot-password
export const forgotPassword = async (req, res) => {
  try {
    const phone = normalizePhone(req.body?.phone);

    if (!phone) {
      return res.status(400).json({ message: "شماره موبایل نامعتبر است" });
    }

    const user = await User.findOne({ phone });

    // پیام یکسان، تا نشود فهمید شماره ثبت‌نام کرده یا نه
    if (!user || !user.isActive) {
      return res
        .status(200)
        .json({ message: "در صورت وجود حساب، کد تایید ارسال شد" });
    }

    await requestLimoOtp(phone);

    res.status(200).json({ message: "کد تایید ارسال شد" });
  } catch (error) {
    return sendError(res, error, "خطا در ارسال کد تایید");
  }
};

// @route POST /api/users/reset-password
export const resetPassword = async (req, res) => {
  try {
    const body = req.body ?? {};
    const phone = normalizePhone(body.phone);
    const otp = toEnglishDigits(asString(body.otp));
    const newPassword =
      typeof body.newPassword === "string" ? body.newPassword : "";

    if (!phone || !/^\d{4,8}$/.test(otp)) {
      return res
        .status(400)
        .json({ message: "شماره موبایل یا کد تایید نامعتبر است" });
    }
    if (newPassword.length < 6 || newPassword.length > 72) {
      return res
        .status(400)
        .json({ message: "رمز عبور باید بین ۶ تا ۷۲ کاراکتر باشد" });
    }

    const user = await User.findOne({ phone });
    if (!user || !user.isActive) {
      return res.status(400).json({ message: "درخواست نامعتبر است" });
    }

    const isValid = await verifyLimoOtp(phone, otp);
    if (!isValid) {
      return res
        .status(400)
        .json({ message: "کد تایید نامعتبر یا منقضی شده است" });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: "رمز عبور با موفقیت تغییر کرد" });
  } catch (error) {
    return sendError(res, error, "خطا در تغییر رمز عبور");
  }
};
