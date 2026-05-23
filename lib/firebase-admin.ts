// ═══════════════════════════════════════════════════════════════
// Firebase Admin SDK — Server-Side Only
// ═══════════════════════════════════════════════════════════════

import { initializeApp, getApps, cert, type App } from 'firebase-admin/app';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';
import { getMessaging, type Messaging } from 'firebase-admin/messaging';

function getPrivateKey(): string | undefined {
  const key = process.env.FIREBASE_ADMIN_PRIVATE_KEY;
  if (!key) return undefined;
  // Handle all possible formats Vercel might store the key in
  return key.replace(/\\n/g, '\n');
}

let adminApp: App;
let adminDb: Firestore;
let adminMessaging: Messaging;

const privateKey = getPrivateKey();

if (getApps().length === 0 && privateKey) {
  adminApp = initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: privateKey,
    }),
  });
} else if (getApps().length > 0) {
  adminApp = getApps()[0];
} else {
  // No private key and no existing app — create a dummy to prevent build errors
  console.warn('Firebase Admin: FIREBASE_ADMIN_PRIVATE_KEY not set. Push notifications will not work.');
  adminApp = initializeApp();
}

adminDb = getFirestore(adminApp);
adminMessaging = getMessaging(adminApp);

export { adminApp, adminDb, adminMessaging };
