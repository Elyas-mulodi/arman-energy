import {
  asString,
  isObjectId,
  normalizeVariants,
  parseJsonArray,
} from "../../Utils/validate.js";

const toBool = (value) => {
  if (value === true || value === "true") return true;
  if (value === false || value === "false") return false;
  return undefined;
};

// partial=true برای ویرایش: فقط فیلدهای ارسال‌شده بررسی و برگردانده می‌شوند
export const parseProductInput = (body = {}, { partial = false } = {}) => {
  const data = {};

  if (!partial || body.name !== undefined) {
    const name = asString(body.name);
    if (name.length < 2 || name.length > 150) {
      return { error: "نام محصول باید بین ۲ تا ۱۵۰ کاراکتر باشد" };
    }
    data.name = name;
  }

  if (body.description !== undefined) {
    data.description = asString(body.description).slice(0, 5000);
  }

  if (!partial || body.category !== undefined) {
    const category = asString(body.category);
    if (!isObjectId(category)) return { error: "دسته‌بندی نامعتبر است" };
    data.category = category;
  }

  if (!partial || body.variants !== undefined) {
    const raw = parseJsonArray(body.variants);
    if (!raw) return { error: "فرمت وریانت‌ها نامعتبر است" };

    const { error, variants } = normalizeVariants(raw);
    if (error) return { error };
    data.variants = variants;
  }

  if (body.specifications !== undefined && body.specifications !== "") {
    const raw = parseJsonArray(body.specifications);
    if (!raw) return { error: "فرمت مشخصات فنی نامعتبر است" };

    data.specifications = raw
      .filter(
        (s) => s && typeof s.key === "string" && typeof s.value === "string",
      )
      .map((s) => ({
        key: s.key.trim().slice(0, 80),
        value: s.value.trim().slice(0, 200),
      }))
      .filter((s) => s.key && s.value);
  }

  const isFeatured = toBool(body.isFeatured);
  if (isFeatured !== undefined) data.isFeatured = isFeatured;

  const isActive = toBool(body.isActive);
  if (isActive !== undefined) data.isActive = isActive;

  return { data };
};
