import { NextResponse } from 'next/server';
import { verifyJWT } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const sessionCookie = (await cookies()).get('session')?.value;
    if (!sessionCookie) return NextResponse.json({ authenticated: false });

    const payload = await verifyJWT(sessionCookie);
    if (!payload) return NextResponse.json({ authenticated: false });

    return NextResponse.json({
      authenticated: true,
      role: payload.role,
      name: payload.name,
      editorId: payload.editorId,
      slug: payload.slug,
      quotaRemaining: payload.quotaRemaining
    });
  } catch (error) {
    return NextResponse.json({ authenticated: false });
  }
}
