import cron from "node-cron";
import { ENV } from "../Config/env.js";
import { createBackup } from "../Utils/backupService.js";

let running = false;

const runBackup = async () => {
  if (running) return; // اگر بک‌آپ قبلی هنوز تمام نشده، همپوشانی نکن
  running = true;
  try {
    const r = await createBackup();
    console.log(
      `💾 بک‌آپ ساخته شد: ${r.folder} | ${r.totalDocs} سند | ${r.newImages} تصویر جدید | ${r.removed} نسخه‌ی قدیمی حذف شد`,
    );
  } catch (error) {
    console.error("❌ خطا در بک‌آپ خودکار:", error.message);
  } finally {
    running = false;
  }
};

export const startBackupJob = () => {
  if (!ENV.BACKUP_CRON_ENABLED) return;

  if (!cron.validate(ENV.BACKUP_CRON)) {
    console.error(`❌ BACKUP_CRON نامعتبر است: ${ENV.BACKUP_CRON}`);
    return;
  }

  cron.schedule(ENV.BACKUP_CRON, runBackup, { timezone: "Asia/Tehran" });
  console.log(`✅ بک‌آپ خودکار فعال شد (${ENV.BACKUP_CRON})`);
};
