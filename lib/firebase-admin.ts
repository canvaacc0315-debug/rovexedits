// ═══════════════════════════════════════════════════════════════
// Firebase Admin SDK — Server-Side Only (Lazy Initialization)
// ═══════════════════════════════════════════════════════════════

import { initializeApp, getApps, cert, type App } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getMessaging } from 'firebase-admin/messaging';

function getAdminApp(): App {
  if (getApps().length > 0) {
    return getApps()[0];
  }

  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY;
  
  if (!privateKey) {
    console.warn('Firebase Admin: FIREBASE_ADMIN_PRIVATE_KEY not set.');
    return initializeApp();
  }

  // Replace literal \n with actual newlines
  const formattedKey = privateKey.replace(/\\n/g, '\n');

  return initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: formattedKey,
    }),
  });
}

// Lazy getters — only initialize when actually called from an API route
export function getAdminDb() {
  return getFirestore(getAdminApp());
}

export function getAdminMessaging() {
  return getMessaging(getAdminApp());
}
