import { ENV } from '../config/env.js';

export const sendSms = async (phone, message) => {
  if (!ENV.LIMOSMS_API_KEY) {
    console.log('\n📱 ------- SMS شبیه‌سازی‌شده (حالت توسعه) -------');
    console.log(`گیرنده: ${phone}`);
    console.log(`متن: ${message}`);
    console.log('----------------------------------------------\n');
    return true;
  }

  try {
    const response = await fetch('https://api.limosms.com/api/sendsms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ApiKey: ENV.LIMOSMS_API_KEY,
      },
      body: JSON.stringify({
        SenderNumber: ENV.LIMOSMS_SENDER,
        Message: message,
        MobileNumber: [phone],
        SendToBlocksNumber: false,
      }),
    });

    const data = await response.json();

    if (!data.Success) {
      console.error('LimoSMS error response:', data);
      throw new Error(data.Message || 'ارسال پیامک ناموفق بود');
    }

    return true;
  } catch (error) {
    console.error('SMS Error:', error.message);
    throw new Error('خطا در ارسال کد تایید');
  }
};