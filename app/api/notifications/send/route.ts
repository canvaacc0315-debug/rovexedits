import { NextResponse } from 'next/server';
import { adminDb, adminMessaging } from '@/lib/firebase-admin';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { targetUserId, title, body, data } = await request.json();

    if (!targetUserId || !title || !body) {
      return NextResponse.json(
        { error: 'Missing required fields: targetUserId, title, body' },
        { status: 400 }
      );
    }

    // Look up all FCM tokens for the target user
    const tokensSnapshot = await adminDb
      .collection('fcmTokens')
      .where('userId', '==', targetUserId)
      .get();

    if (tokensSnapshot.empty) {
      return NextResponse.json({ success: true, sent: 0, reason: 'No tokens found' });
    }

    let sent = 0;
    const invalidTokens: string[] = [];

    for (const tokenDoc of tokensSnapshot.docs) {
      const tokenData = tokenDoc.data();

      try {
        await adminMessaging.send({
          token: tokenData.token,
          notification: { title, body },
          webpush: {
            notification: {
              icon: '/logo.png',
              badge: '/logo.png',
              vibrate: [200, 100, 200] as any,
            },
            fcmOptions: { link: data?.url || '/' },
          },
          data: data || {},
        });
        sent++;
      } catch (err: any) {
        // Handle invalid/expired tokens
        if (
          err?.code === 'messaging/registration-token-not-registered' ||
          err?.code === 'messaging/invalid-registration-token'
        ) {
          invalidTokens.push(tokenDoc.id);
        } else {
          console.error('FCM send error:', err);
        }
      }
    }

    // Clean up invalid tokens
    for (const tokenId of invalidTokens) {
      await adminDb.collection('fcmTokens').doc(tokenId).delete();
    }

    return NextResponse.json({ success: true, sent, cleaned: invalidTokens.length });
  } catch (error) {
    console.error('Notification send error:', error);
    return NextResponse.json(
      { error: 'Failed to send notification' },
      { status: 500 }
    );
  }
}
