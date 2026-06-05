import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
  };

  const swContent = `
// ═══════════════════════════════════════════════════════════════
// Firebase Messaging Service Worker — Auto-generated with config
// ═══════════════════════════════════════════════════════════════

importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

firebase.initializeApp(${JSON.stringify(firebaseConfig)});

const messaging = firebase.messaging();

// Handle background messages (when page is closed or not focused)
messaging.onBackgroundMessage((payload) => {
  // If the message contains a notification object, the Firebase SDK automatically
  // displays it. We should not manually show another one, otherwise the user gets duplicates.
  if (payload.notification) {
    return;
  }

  // Data-only messages — we control the notification display
  const data = payload.data || {};
  const title = data.title || 'RovexEdits';
  const body = data.body || 'You have a new message';

  const notificationOptions = {
    body,
    icon: '/logo.png',
    badge: '/logo.png',
    tag: data.conversationId || 'chat-' + Date.now(),
    data: {
      url: data.url || '/',
      conversationId: data.conversationId || '',
    },
    vibrate: [200, 100, 200],
    actions: [
      { action: 'open', title: 'Open Chat' },
      { action: 'dismiss', title: 'Dismiss' },
    ],
    requireInteraction: true,
    renotify: true,
  };

  return self.registration.showNotification(title, notificationOptions);
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'dismiss') return;

  const url = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Try to focus an existing tab
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          return client.focus();
        }
      }
      // Open new tab if no existing tab found
      return clients.openWindow(self.location.origin + url);
    })
  );
});

// Handle push event directly (fallback for data-only pushes)
self.addEventListener('push', (event) => {
  if (event.data) {
    try {
      const payload = event.data.json();
      // If it has a notification field, Firebase SDK handles it
      // If data-only, the onBackgroundMessage handler above will fire
    } catch (e) {
      // Non-JSON push — show generic notification
      const text = event.data.text();
      event.waitUntil(
        self.registration.showNotification('RovexEdits', {
          body: text || 'New notification',
          icon: '/logo.png',
          badge: '/logo.png',
        })
      );
    }
  }
});
`;

  return new NextResponse(swContent, {
    headers: {
      'Content-Type': 'application/javascript',
      'Service-Worker-Allowed': '/',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  });
}
