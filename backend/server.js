import mongoose from 'mongoose';
import app from './app.js';
import connectDB from './Config/db.js';
import { ENV } from './Config/env.js';
import { startCleanupJob } from './jobs/cleanupPendingOrders.js';

const start = async () => {
  await connectDB();
  startCleanupJob();

  const server = app.listen(ENV.PORT, () => {
    console.log(`Server running on port ${ENV.PORT} in ${ENV.NODE_ENV} mode`);
  });

  const shutdown = (signal) => {
    console.log(`${signal} دریافت شد، در حال خاموش شدن...`);
    server.close(async () => {
      await mongoose.connection.close();
      process.exit(0);
    });
    setTimeout(() => process.exit(1), 10000).unref(); // اگر تمیز بسته نشد، اجباری
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('unhandledRejection', (reason) => console.error('unhandledRejection:', reason));
};

start();