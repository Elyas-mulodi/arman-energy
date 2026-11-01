import { ENV } from "../Config/env.js";

const hasPersian = (text) => /[\u0600-\u06FF]/.test(text || "");

export const sendError = (res, error, fallbackMessage) => {
  if (error?.name === "CastError") {
    return res
      .status(400)
      .json({ message: "شناسه یا مقدار ارسالی نامعتبر است" });
  }

  if (error?.name === "ValidationError") {
    const first = Object.values(error.errors || {})[0]?.message;
    return res
      .status(400)
      .json({
        message: hasPersian(first) ? first : "اطلاعات ارسالی نامعتبر است",
      });
  }

  if (error?.code === 11000) {
    return res.status(409).json({ message: "این مقدار قبلا ثبت شده است" });
  }

  console.error(fallbackMessage, error);
  return res.status(500).json({
    message: fallbackMessage,
    ...(ENV.NODE_ENV !== "production" && { error: error?.message }),
  });
};
