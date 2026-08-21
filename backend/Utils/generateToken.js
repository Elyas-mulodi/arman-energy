import jwt from "jsonwebtoken";
import { ENV } from "../Config/env.js";

const generateToken = (res, userId, role) => {
  const token = jwt.sign(
    {
      userId,
      role,
    },
    ENV.JWT_SECRET,
    {
      expiresIn: "30d",
    }
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: ENV.NODE_ENV === "production",
    sameSite: ENV.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  return token;
};

export default generateToken;