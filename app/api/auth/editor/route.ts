import { NextResponse } from 'next/server';
import { signJWT } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    const editor = await req.json();
    if (!editor || !editor.id || !editor.code) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    // Sign JWT with editor info
    const token = await signJWT({
      role: 'editor',
      name: editor.name,
      editorId: editor.id,
      slug: editor.slug,
      quotaRemaining: Math.max(0, editor.maxUploads - editor.usedCount),
    }, '12h');

    // Set session cookie
    (await cookies()).set('session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 43200, // 12 hours
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Editor auth session error:', err);
    return NextResponse.json({ error: 'Server error: ' + err.message }, { status: 500 });
  }
}
