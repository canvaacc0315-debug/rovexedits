import { NextResponse } from 'next/server';
import { getAdminDb, getAdminMessaging } from '@/lib/firebase-admin';

export const dynamic = 'force-dynamic';

// Default marketing messages to seed if collection is empty
const DEFAULT_MESSAGES = [
  { title: '🔥 Flash Sale!', body: 'Premium edits at unbeatable prices. Limited time only!', url: '/gallery' },
  { title: '⚡ Lightning Fast Delivery', body: 'Get your custom Valorant edit in under 10 minutes!', url: '/services' },
  { title: '🎨 New Edits Dropped!', body: 'Fresh premium designs just uploaded. Check them out now!', url: '/gallery' },
  { title: '👑 VIP Collection', body: "Exclusive high-premium edits available. Don't miss out!", url: '/gallery' },
  { title: '💎 Premium Quality', body: 'Trusted by 500+ satisfied clients. See why everyone loves us!', url: '/reviews' },
  { title: '🏆 Top Editors Online', body: 'Our verified editors are ready to create your perfect edit!', url: '/editors' },
  { title: '✨ Custom Designs', body: 'Want something unique? Message our editors for a custom commission!', url: '/editors' },
  { title: '🔓 Unlock Premium', body: 'Upgrade your Valorant inventory with stunning premium edits!', url: '/gallery' },
  { title: "💫 Editor's Choice", body: "Hand-picked edits by our top creators. See what's trending!", url: '/gallery' },
  { title: '🎯 Perfect Match', body: 'Find the exact edit for your style. Browse our curated collection!', url: '/gallery' },
  { title: '🛡️ Verified & Secure', body: 'All transactions are secure. All editors are verified. Shop with confidence!', url: '/store' },
  { title: '⭐ 5-Star Service', body: 'Join hundreds of happy clients. Read their reviews!', url: '/reviews' },
];

async function seedDefaultMessages() {
  const batch = getAdminDb().batch();
  for (const msg of DEFAULT_MESSAGES) {
    const ref = getAdminDb().collection('marketingMessages').doc();
    batch.set(ref, {
      id: ref.id,
      title: msg.title,
      body: msg.body,
      icon: '/logo.png',
      url: msg.url,
      active: true,
      sentCount: 0,
      lastSentAt: null,
      createdAt: Date.now(),
    });
  }
  await batch.commit();
}

export async function GET(request: Request) {
  try {
    // Verify cron secret
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch active marketing messages
    const msgsSnapshot = await getAdminDb()
      .collection('marketingMessages')
      .where('active', '==', true)
      .get();

    // Seed defaults if empty
    if (msgsSnapshot.empty) {
      await seedDefaultMessages();
      return NextResponse.json({ success: true, message: 'Seeded default marketing messages' });
    }

    // Pick the message with lowest sentCount (round-robin)
    const messages = msgsSnapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    messages.sort((a: any, b: any) => (a.sentCount || 0) - (b.sentCount || 0));
    const selected = messages[0] as any;

    // Fetch all FCM tokens
    const tokensSnapshot = await getAdminDb().collection('fcmTokens').get();

    if (tokensSnapshot.empty) {
      return NextResponse.json({ success: true, message: selected.title, recipientCount: 0 });
    }

    const tokens = tokensSnapshot.docs.map(d => d.data().token);

    // Send to all tokens using sendEachForMulticast
    const response = await getAdminMessaging().sendEachForMulticast({
      tokens,
      notification: {
        title: selected.title,
        body: selected.body,
      },
      webpush: {
        notification: {
          icon: selected.icon || '/logo.png',
          badge: '/logo.png',
          vibrate: [200, 100, 200] as any,
        },
        fcmOptions: { link: selected.url || '/' },
      },
    });

    // Clean up failed tokens
    const invalidTokens: string[] = [];
    response.responses.forEach((resp, idx) => {
      if (!resp.success) {
        const code = resp.error?.code;
        if (
          code === 'messaging/registration-token-not-registered' ||
          code === 'messaging/invalid-registration-token'
        ) {
          invalidTokens.push(tokens[idx]);
        }
      }
    });

    // Delete invalid tokens
    for (const invalidToken of invalidTokens) {
      const tokenDocs = await getAdminDb()
        .collection('fcmTokens')
        .where('token', '==', invalidToken)
        .get();
      for (const doc of tokenDocs.docs) {
        await doc.ref.delete();
      }
    }

    // Update sent count
    await getAdminDb().collection('marketingMessages').doc(selected.id).update({
      sentCount: (selected.sentCount || 0) + 1,
      lastSentAt: Date.now(),
    });

    return NextResponse.json({
      success: true,
      message: selected.title,
      recipientCount: response.successCount,
      failedCount: response.failureCount,
      cleanedTokens: invalidTokens.length,
    });
  } catch (error) {
    console.error('Marketing notification error:', error);
    return NextResponse.json(
      { error: 'Failed to send marketing notifications' },
      { status: 500 }
    );
  }
}
