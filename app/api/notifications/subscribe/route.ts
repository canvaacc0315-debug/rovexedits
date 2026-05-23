import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { userId, token, platform } = await request.json();

    if (!userId || !token) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, token' },
        { status: 400 }
      );
    }

    // Check if token already exists
    const existingDoc = await adminDb.collection('fcmTokens').doc(token).get();

    if (existingDoc.exists) {
      // Update lastActive
      await adminDb.collection('fcmTokens').doc(token).update({
        lastActive: Date.now(),
        userId, // Update userId in case it changed
      });
    } else {
      // Create new token doc
      await adminDb.collection('fcmTokens').doc(token).set({
        id: token,
        userId,
        token,
        platform: platform || 'web-desktop',
        createdAt: Date.now(),
        lastActive: Date.now(),
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Subscribe error:', error);
    return NextResponse.json(
      { error: 'Failed to save token' },
      { status: 500 }
    );
  }
}
