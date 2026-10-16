import { ENV } from '../Config/env.js';

const LIMO_BASE = 'https://api.limosms.com/api';

// تابع کمکی: چون بعضی متدهای لیمو success/Success رو با حروف متفاوت برمی‌گردونن
const isSuccessResponse = (data) => Boolean(data.success ?? data.Success);
const getResponseMessage = (data) => data.message ?? data.Message;

export const requestLimoOtp = async (phone) => {
  if (!ENV.LIMOSMS_API_KEY) {
    console.log('\n📱 ------- OTP شبیه‌سازی‌شده (حالت توسعه) -------');
    console.log(`گیرنده: ${phone}`);
    console.log('----------------------------------------------\n');
    return true;
  }

  try {
    const response = await fetch(`${LIMO_BASE}/sendcode`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ApiKey: ENV.LIMOSMS_API_KEY,
      },
      body: JSON.stringify({
        Mobile: phone,
        Footer: 'آرمان انرژی',
      }),
    });

    const data = await response.json();

    if (!isSuccessResponse(data)) {
      console.error('LimoSMS sendcode error:', data);
      throw new Error(getResponseMessage(data) || 'ارسال کد تایید ناموفق بود');
    }

    return true;
  } catch (error) {
    console.error('LimoSMS OTP request error:', error.message);
    throw new Error('خطا در ارسال کد تایید');
  }
};

export const verifyLimoOtp = async (phone, code) => {
  try {
    const response = await fetch(`${LIMO_BASE}/checkcode`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ApiKey: ENV.LIMOSMS_API_KEY,
      },
      body: JSON.stringify({
        Mobile: phone,
        Code: code,
      }),
    });

    const data = await response.json();

    if (!isSuccessResponse(data)) {
      console.error('LimoSMS checkcode error:', data);
    }

    return isSuccessResponse(data);
  } catch (error) {
    console.error('LimoSMS OTP verify error:', error.message);
    return false;
  }
};