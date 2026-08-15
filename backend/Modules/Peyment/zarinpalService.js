import { ENV } from '../../Config/env.js';

const ZARINPAL_BASE = ENV.ZARINPAL_SANDBOX === 'true'
  ? 'https://sandbox.zarinpal.com/pg/v4/payment'
  : 'https://payment.zarinpal.com/pg/v4/payment';

const ZARINPAL_GATEWAY = ENV.ZARINPAL_SANDBOX === 'true'
  ? 'https://sandbox.zarinpal.com/pg/StartPay'
  : 'https://payment.zarinpal.com/pg/StartPay';

export const requestPayment = async ({ amount, description, callbackUrl, mobile }) => {
  const response = await fetch(`${ZARINPAL_BASE}/request.json`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      merchant_id: ENV.ZARINPAL_MERCHANT_ID,
      amount, 
      description,
      callback_url: callbackUrl,
      metadata: mobile ? { mobile } : undefined,
    }),
  });

  const data = await response.json();

  if (data.data?.code !== 100) {
    throw new Error(data.errors?.message || 'خطا در اتصال به درگاه پرداخت');
  }

  return {
    authority: data.data.authority,
    paymentUrl: `${ZARINPAL_GATEWAY}/${data.data.authority}`,
  };
};

export const verifyPayment = async ({ amount, authority }) => {
  const response = await fetch(`${ZARINPAL_BASE}/verify.json`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      merchant_id: ENV.ZARINPAL_MERCHANT_ID,
      amount,
      authority,
    }),
  });

  const data = await response.json();

  const isSuccess = data.data?.code === 100 || data.data?.code === 101;

  return {
    success: isSuccess,
    refId: data.data?.ref_id || null,
    rawResponse: data,
  };
};