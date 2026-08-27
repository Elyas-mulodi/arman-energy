import User from "./UserMd.js";
import generateToken from "../../Utils/generateToken.js";
import { sendSms } from "../../Utils/sendSms.js";
import { generateOtp, hashOtp } from "../../Utils/otp.js";

export const registerUser = async (req, res) => {
  try {
    const { fullName, phone, email, password } = req.body;

    if (!fullName || !phone || !password) {
      return res.status(400).json({ message: "لطفا تمام فیلدها را پر کنید" });
    }
    console.log("1 - request received");

    const userExists = await User.findOne({ phone });

    console.log("2 - user checked");

    if (userExists) {
      return res.status(400).json({
        message: "کاربری با این شماره موبایل قبلا ثبت شده است",
      });
    }

    console.log("3 - creating user");

    const user = await User.create({
      fullName,
      phone,
      email,
      password,
    });

    console.log("4 - user created");

    generateToken(res, user._id, user.role);

    console.log("5 - token generated");

    res.status(201).json({
      _id: user._id,
      fullName: user.fullName,
      phone: user.phone,
      role: user.role,
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);

    res.status(500).json({
      message: "خطا در ثبت‌نام کاربر",
      error: error.message,
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { phone, password } = req.body;

    const cleanPhone = phone?.trim();

    console.log("LOGIN ATTEMPT - raw phone:", JSON.stringify(phone));
    console.log("LOGIN ATTEMPT - cleaned phone:", JSON.stringify(cleanPhone));

    const user = await User.findOne({ phone: cleanPhone });

    console.log("LOGIN ATTEMPT - user found:", !!user);

    if (!user) {
      return res
        .status(401)
        .json({ message: "شماره موبایل یا رمز عبور اشتباه است" });
    }

    const isMatch = await user.matchPassword(password);
    console.log("LOGIN ATTEMPT - password match:", isMatch);

    if (!isMatch) {
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
    console.error("LOGIN ERROR:", error);
    res
      .status(500)
      .json({ message: "خطا در ورود کاربر", error: error.message });
  }
};

export const logoutUser = (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
  });
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

export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "کاربر یافت نشد" });
    }

    user.fullName = req.body.fullName || user.fullName;
    user.email = req.body.email || user.email;
    user.address = req.body.address || user.address;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      fullName: updatedUser.fullName,
      phone: updatedUser.phone,
      email: updatedUser.email,
      role: updatedUser.role,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "خطا در بروزرسانی اطلاعات", error: error.message });
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

export const forgotPassword = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ message: "شماره موبایل الزامی است" });
    }

    const user = await User.findOne({ phone });

    if (!user) {
      return res
        .status(200)
        .json({ message: "در صورت وجود حساب، کد تایید ارسال شد" });
    }

    const otp = generateOtp();
    user.resetPasswordOtp = hashOtp(otp);
    user.resetPasswordExpires = Date.now() + 2 * 60 * 1000;
    await user.save();

    await sendSms(phone, `کد بازیابی رمز عبور شما: ${otp}`);

    res.status(200).json({ message: "کد تایید ارسال شد" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "خطا در ارسال کد تایید", error: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { phone, otp, newPassword } = req.body;

    if (!phone || !otp || !newPassword) {
      return res.status(400).json({ message: "لطفا تمام فیلدها را پر کنید" });
    }

    const user = await User.findOne({ phone }).select(
      "+resetPasswordOtp +resetPasswordExpires",
    );

    if (!user || !user.resetPasswordOtp) {
      return res.status(400).json({ message: "درخواست نامعتبر است" });
    }

    if (user.resetPasswordExpires < Date.now()) {
      return res.status(400).json({ message: "کد تایید منقضی شده است" });
    }

    if (hashOtp(otp) !== user.resetPasswordOtp) {
      return res.status(400).json({ message: "کد تایید اشتباه است" });
    }

    user.password = newPassword;
    user.resetPasswordOtp = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: "رمز عبور با موفقیت تغییر کرد" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "خطا در تغییر رمز عبور", error: error.message });
  }
};
