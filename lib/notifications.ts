// ═══════════════════════════════════════════════════════════════
// Push Notification Helpers — Client-Side
// ═══════════════════════════════════════════════════════════════

import { getToken, deleteToken } from 'firebase/messaging';
import { collection, doc, setDoc, getDocs, deleteDoc, query, where } from 'firebase/firestore';
import { db, messaging } from './firebase';
import type { FCMToken } from './types';

// ── REQUEST NOTIFICATION PERMISSION ──

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) {
    console.warn('This browser does not support notifications');
    return 'denied';
  }

  const permission = await Notification.requestPermission();
  return permission;
}

// ── GET FCM TOKEN ──

export async function getFCMToken(): Promise<string | null> {
  if (!messaging) {
    console.warn('Firebase Messaging is not initialized');
    return null;
  }

  try {
    const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
    if (!vapidKey) {
      console.error('VAPID key is not configured');
      return null;
    }

    // Ensure service worker is registered
    const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');

    const token = await getToken(messaging, {
      vapidKey,
      serviceWorkerRegistration: registration,
    });

    return token || null;
  } catch (error) {
    console.error('Error getting FCM token:', error);
    return null;
  }
}

// ── SAVE FCM TOKEN TO FIRESTORE ──

export async function saveFCMToken(userId: string, token: string): Promise<void> {
  try {
    const isMobile = /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );

    const tokenDocRef = doc(db, 'fcmTokens', token);
    const tokenData: FCMToken = {
      id: token,
      userId,
      token,
      platform: isMobile ? 'web-mobile' : 'web-desktop',
      createdAt: Date.now(),
      lastActive: Date.now(),
    };

    await setDoc(tokenDocRef, tokenData, { merge: true });
  } catch (error) {
    console.error('Error saving FCM token:', error);
    throw error;
  }
}

// ── REMOVE FCM TOKEN FROM FIRESTORE ──

export async function removeFCMToken(token: string): Promise<void> {
  try {
    // Remove from Firestore
    await deleteDoc(doc(db, 'fcmTokens', token));

    // Also unsubscribe from FCM
    if (messaging) {
      await deleteToken(messaging);
    }
  } catch (error) {
    console.error('Error removing FCM token:', error);
    throw error;
  }
}

// ── SEND NOTIFICATION VIA API ──

export async function sendNotificationViaAPI(
  targetUserId: string,
  title: string,
  body: string,
  data?: Record<string, string>
): Promise<boolean> {
  try {
    const response = await fetch('/api/notifications/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ targetUserId, title, body, data }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Notification API error:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error sending notification:', error);
    return false;
  }
}
