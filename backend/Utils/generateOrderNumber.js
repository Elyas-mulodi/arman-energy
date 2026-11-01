import { randomInt } from 'crypto';

const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

export const generateOrderNumber = () => {
  const date = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Tehran' }); // 2026-10-21
  const datePart = date.replaceAll('-', '').slice(2); // 261021
  const randomPart = Array.from({ length: 6 }, () => ALPHABET[randomInt(ALPHABET.length)]).join('');
  return `AE-${datePart}-${randomPart}`;
};