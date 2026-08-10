import crypto from 'crypto';

export const generateOtp = () => {
  return Math.floor(10000 + Math.random() * 90000).toString();
};

export const hashOtp = (otp) => {
  return crypto.createHash('sha256').update(otp).digest('hex');
};