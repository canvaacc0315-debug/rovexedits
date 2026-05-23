// ═══════════════════════════════════════════════════════════════
// Firebase Client-Side Initialization
// ═══════════════════════════════════════════════════════════════

import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { initializeFirestore, type Firestore } from 'firebase/firestore';
import { getMessaging, type Messaging } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let app: FirebaseApp;
let db: Firestore;
let messaging: Messaging | null = null;

if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

// Fix Next.js API route GRPC errors by forcing long polling
db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
});

// Firebase Messaging — browser only (requires window/navigator)
if (typeof window !== 'undefined') {
  try {
    messaging = getMessaging(app);
  } catch (err) {
    console.warn('Firebase Messaging not supported in this browser:', err);
  }
}

export { app, db, messaging };
