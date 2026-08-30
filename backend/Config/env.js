import dotenv from "dotenv";
dotenv.config();

export const ENV = {
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  NODE_ENV: process.env.NODE_ENV || "development",
  ZARINPAL_MERCHANT_ID: process.env.ZARINPAL_MERCHANT_ID,
  ZARINPAL_SANDBOX: process.env.ZARINPAL_SANDBOX,
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:3000",
  STORAGE_ENDPOINT: process.env.STORAGE_ENDPOINT,
  STORAGE_ACCESS_KEY: process.env.STORAGE_ACCESS_KEY,
  STORAGE_SECRET_KEY: process.env.STORAGE_SECRET_KEY,
  STORAGE_BUCKET: process.env.STORAGE_BUCKET,
  STORAGE_PUBLIC_URL: process.env.STORAGE_PUBLIC_URL,
  SERVER_URL: process.env.SERVER_URL || "http://localhost:5000",
  LIMOSMS_API_KEY: process.env.LIMOSMS_API_KEY,
  LIMOSMS_SENDER: process.env.LIMOSMS_SENDER,
};
