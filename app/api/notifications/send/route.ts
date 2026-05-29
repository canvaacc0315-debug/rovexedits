import { NextResponse } from 'next/server';
import { getAdminDb, getAdminMessaging } from '@/lib/firebase-admin';

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
    const tokensSnapshot = await getAdminDb()
      .collection('fcmTokens')
      .where('userId', '==', targetUserId)
      .get();

    if (tokensSnapshot.empty) {
      return NextResponse.json({ success: true, sent: 0, reason: 'No tokens found' });
    }

    let sent = 0;
    const invalidTokens: string[] = [];

    // Deduplicate by token string just in case
    const uniqueTokens = new Map();
    for (const doc of tokensSnapshot.docs) {
      uniqueTokens.set(doc.data().token, doc);
    }

    for (const tokenDoc of uniqueTokens.values()) {
      const tokenData = tokenDoc.data();

      try {
        // We include BOTH notification and data fields.
        // The 'notification' field ensures Desktop browsers (Windows/Mac) reliably 
        // show the native push notification even if the service worker is sleeping.
        // The 'data' field handles our custom routing logic.
        await getAdminMessaging().send({
          token: tokenData.token,
          notification: {
            title,
            body,
          },
          data: {
            title,
            body,
            url: data?.url || '/',
            conversationId: data?.conversationId || '',
            timestamp: String(Date.now()),
          },
          webpush: {
            headers: {
              Urgency: 'high',
            },
            notification: {
              icon: '/logo.png',
              badge: '/logo.png',
              requireInteraction: true,
            },
            fcmOptions: {
              link: data?.url || '/',
            },
          },
          // Android config for PWA on Android devices
          android: {
            priority: 'high' as const,
            notification: {
              icon: 'logo',
              color: '#ff4655'
            }
          },
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
      await getAdminDb().collection('fcmTokens').doc(tokenId).delete();
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
