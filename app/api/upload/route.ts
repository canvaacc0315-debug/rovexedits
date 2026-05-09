import { NextResponse } from 'next/server';
import { uploadImage } from '@/lib/cdn';
import { auth } from '@clerk/nextjs/server';

export async function POST(req: Request) {
  try {
    // 1. Verify Authentication via Clerk
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Parse FormData
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });

    // 3. Upload to CDN
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    const uploadResult = await uploadImage(buffer, file.name);

    // 4. Return URLs to the client so it can save to Firestore
    return NextResponse.json({ success: true, ...uploadResult });
  } catch (err: any) {
    console.error("Upload route error:", err);
    return NextResponse.json({ error: err.message || 'Upload failed' }, { status: 500 });
  }
}
