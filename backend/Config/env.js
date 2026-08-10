import dotenv from 'dotenv';
dotenv.config();

export const ENV = {
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  NODE_ENV: process.env.NODE_ENV || 'development',
  ZARINPAL_MERCHANT_ID: process.env.ZARINPAL_MERCHANT_ID,
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:3000',
};