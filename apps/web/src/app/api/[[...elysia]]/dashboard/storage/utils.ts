import { S3Client } from '@aws-sdk/client-s3'

export const s3 = new S3Client({
  endpoint: process.env.R2_S3_API,
  region: 'auto',
  requestChecksumCalculation: 'WHEN_REQUIRED',
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY
  }
})
