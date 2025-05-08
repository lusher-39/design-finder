import { S3Client } from '@aws-sdk/client-s3';

// Log environment variables (sanitized)
console.log('AWS Region configured:', process.env.AWS_REGION);
console.log('Bucket Name configured:', process.env.BUCKET_NAME);
console.log('AWS Access Key exists:', !!process.env.AWS_ACCESS_KEY_ID);
console.log('AWS Secret Access Key exists:', !!process.env.AWS_SECRET_ACCESS_KEY);

// Initialize S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export default s3Client;