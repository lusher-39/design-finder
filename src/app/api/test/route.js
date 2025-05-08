import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ 
    message: 'API route is working',
    env: {
      regionConfigured: !!process.env.AWS_REGION,
      bucketConfigured: !!process.env.BUCKET_NAME,
      accessKeyConfigured: !!process.env.AWS_ACCESS_KEY_ID,
      secretKeyConfigured: !!process.env.AWS_SECRET_ACCESS_KEY
    }
  });
}