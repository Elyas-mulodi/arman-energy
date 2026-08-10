import { ENV } from '../config/env.js';

export const sendSms = async (phone, message) => {
  try {
    const response = await fetch(
      `https://api.kavenegar.com/v1/${ENV.KAVENEGAR_API_KEY}/sms/send.json`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          receptor: phone,
          message,
          sender: ENV.KAVENEGAR_SENDER,
        }),
      }
    );

    const data = await response.json();

    if (data.return?.status !== 200) {
      throw new Error('ارسال پیامک ناموفق بود');
    }

    return true;
  } catch (error) {
    console.error('SMS Error:', error.message);
    throw new Error('خطا در ارسال کد تایید');
  }
};