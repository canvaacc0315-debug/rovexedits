import { NextResponse } from 'next/server';
import { verifyJWT } from '@/lib/auth';
import { cookies } from 'next/headers';
import { updateEditorProfile } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const sessionCookie = (await cookies()).get('session')?.value;
    if (!sessionCookie) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    const payload = await verifyJWT(sessionCookie);
    if (!payload || payload.role !== 'editor') return NextResponse.json({ error: 'Editor access required' }, { status: 403 });

    const data = await req.json();
    
    // Safety check: Only allow updating safe fields
    const safeData = {
      bio: data.bio,
      avatar: data.avatar,
      banner: data.banner,
      commissionStatus: data.commissionStatus,
      socialLinks: data.socialLinks,
    };

    // Remove undefined fields
    Object.keys(safeData).forEach(key => (safeData as any)[key] === undefined && delete (safeData as any)[key]);

    await updateEditorProfile(payload.editorId as string, safeData);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Update profile error:", err);
    return NextResponse.json({ error: err.message || 'Update failed' }, { status: 500 });
  }
}
