import { NextResponse } from 'next/server';
import { comparePassword, signJWT } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    const { password, rememberMe } = await req.json();
    if (!password) return NextResponse.json({ error: 'Password required' }, { status: 400 });

    const hash1 = process.env.ADMIN_PASSWORD_HASH_1 ? `$2b$12$${process.env.ADMIN_PASSWORD_HASH_1}` : '';
    const hash2 = process.env.ADMIN_PASSWORD_HASH_2 ? `$2b$12$${process.env.ADMIN_PASSWORD_HASH_2}` : '';

    console.log("Auth Debug - Received password:", password);
    console.log("Auth Debug - Hash 1 loaded:", hash1);
    console.log("Auth Debug - Hash 2 loaded:", hash2);

    let isValid = false;
    if (hash1) isValid = await comparePassword(password, hash1);
    if (!isValid && hash2) isValid = await comparePassword(password, hash2);

    console.log("Auth Debug - isValid:", isValid);

    if (!isValid) return NextResponse.json({ error: 'Invalid password' }, { status: 401 });

    const expiresIn = rememberMe ? '30d' : '24h';
    const maxAge = rememberMe ? 30 * 24 * 60 * 60 : 86400; // 30 days or 24 hours

    const token = await signJWT({ role: 'admin', name: 'RovexAdmin' }, expiresIn);

    (await cookies()).set('session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: maxAge,
    });

    return NextResponse.json({ success: true, role: 'admin' });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
