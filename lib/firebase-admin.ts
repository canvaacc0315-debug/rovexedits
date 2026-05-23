// ═══════════════════════════════════════════════════════════════
// Firebase Admin SDK — Server-Side Only
// ═══════════════════════════════════════════════════════════════

import { initializeApp, getApps, cert, type App } from 'firebase-admin/app';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';
import { getMessaging, type Messaging } from 'firebase-admin/messaging';

let adminApp: App;
let adminDb: Firestore;
let adminMessaging: Messaging;

if (getApps().length === 0) {
  adminApp = initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
} else {
  adminApp = getApps()[0];
}

adminDb = getFirestore(adminApp);
adminMessaging = getMessaging(adminApp);

export { adminApp, adminDb, adminMessaging };
