'use client';

import { useEffect, useRef } from 'react';
import { useUser } from '@clerk/nextjs';
import { onMessage } from 'firebase/messaging';
import { messaging } from '@/lib/firebase';
import {
  requestNotificationPermission,
  getFCMToken,
  saveFCMToken,
} from '@/lib/notifications';

export default function NotificationProvider({ children }) {
  const { user, isSignedIn } = useUser();
  const initializedRef = useRef(false);

  useEffect(() => {
    if (!isSignedIn || !user?.id || initializedRef.current) return;
    if (typeof window === 'undefined') return;

    const init = async () => {
      try {
        // Register service worker
        if ('serviceWorker' in navigator) {
          await navigator.serviceWorker.register('/firebase-messaging-sw.js');
        }

        // Request permission
        const permission = await requestNotificationPermission();
        if (permission !== 'granted') {
          console.log('Notification permission not granted');
          return;
        }

        // Get and save FCM token
        const token = await getFCMToken();
        if (token) {
          await saveFCMToken(user.id, token);
        }

        initializedRef.current = true;
      } catch (err) {
        console.error('Error initializing notifications:', err);
      }
    };

    init();
  }, [isSignedIn, user?.id]);

  // Listen for foreground messages
  useEffect(() => {
    if (!messaging || typeof window === 'undefined') return;

    const unsubscribe = onMessage(messaging, (payload) => {
      const { title, body } = payload.notification || {};
      const data = payload.data || {};

      // Show browser notification even when app is in foreground
      if (Notification.permission === 'granted') {
        new Notification(title || 'RovexEdits', {
          body: body || 'New notification',
          icon: '/logo.png',
          badge: '/logo.png',
          tag: data.conversationId || 'general',
          data: data,
        });
      }
    });

    return () => unsubscribe();
  }, []);

  return children;
}
