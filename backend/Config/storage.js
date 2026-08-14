import { S3Client } from '@aws-sdk/client-s3';
import { ENV } from './env.js';

const s3Client = new S3Client({
  region: 'default',
  endpoint: ENV.STORAGE_ENDPOINT,
  credentials: {
    accessKeyId: ENV.STORAGE_ACCESS_KEY,
    secretAccessKey: ENV.STORAGE_SECRET_KEY,
  },
});

export default s3Client;