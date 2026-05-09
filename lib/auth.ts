// ═══════════════════════════════════════════════════════════════
// Custom JWT Auth System — Server-side only
// ═══════════════════════════════════════════════════════════════

import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';
import type { AuthPayload } from './types';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fallback-dev-secret-change-in-production'
);

export async function signJWT(payload: AuthPayload, expiresIn: string = '24h'): Promise<string> {
  return new SignJWT({ ...payload } as Record<string, unknown>)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(JWT_SECRET);
}

export async function verifyJWT(token: string): Promise<AuthPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as AuthPayload;
  } catch {
    return null;
  }
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function hashPassword(password: string): string {
  return bcrypt.hashSync(password, 12);
}
