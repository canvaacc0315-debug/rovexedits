import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { auth } from '@clerk/nextjs/server';

export async function GET(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const timestamp = Math.round(new Date().getTime() / 1000);
    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp: timestamp,
        folder: 'rovexedits',
      },
      process.env.CLOUDINARY1_API_SECRET!
    );

    return NextResponse.json({
      signature,
      timestamp,
      cloudName: process.env.CLOUDINARY1_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY1_API_KEY,
    });
  } catch (error: any) {
    console.error("Signature generation error:", error);
    return NextResponse.json({ error: error.message || 'Failed to generate signature' }, { status: 500 });
  }
}
