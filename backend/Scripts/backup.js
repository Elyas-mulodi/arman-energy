import mongoose from "mongoose";
import { ENV } from "../Config/env.js";
import { createBackup } from "../Utils/backupService.js";

try {
  await mongoose.connect(ENV.MONGO_URI);
  const result = await createBackup();

  console.log(`✅ بک‌آپ ساخته شد: ${result.folder}`);
  Object.entries(result.collections).forEach(([name, count]) =>
    console.log(`   - ${name}: ${count} سند`),
  );
  console.log(`🖼️  ${result.newImages} تصویر جدید به آینه اضافه شد`);
  console.log(`🧹 ${result.removed} بک‌آپ قدیمی حذف شد`);
} catch (error) {
  console.error("❌ خطا در بک‌آپ:", error.message);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
