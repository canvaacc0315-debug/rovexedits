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
        // Register the dynamic service worker (served from API with real Firebase config)
        let registration;
        if ('serviceWorker' in navigator) {
          registration = await navigator.serviceWorker.register(
            '/api/firebase-messaging-sw',
            { scope: '/' }
          );
          // Wait for the service worker to be ready
          await navigator.serviceWorker.ready;
          console.log('[Notifications] Service worker registered');
        }

        // Request permission
        const permission = await requestNotificationPermission();
        if (permission !== 'granted') {
          console.log('[Notifications] Permission not granted');
          return;
        }

        // Get and save FCM token
        const token = await getFCMToken();
        if (token) {
          await saveFCMToken(user.id, token);
          console.log('[Notifications] FCM token saved');
        }

        initializedRef.current = true;
      } catch (err) {
        console.error('[Notifications] Init error:', err);
      }
    };

    init();
  }, [isSignedIn, user?.id]);

  // Listen for foreground messages
  useEffect(() => {
    if (!messaging || typeof window === 'undefined') return;

    const unsubscribe = onMessage(messaging, (payload) => {
      // Handle data-only messages in foreground
      const data = payload.data || {};
      const title = data.title || payload.notification?.title || 'RovexEdits';
      const body = data.body || payload.notification?.body || 'New message';

      // Show browser notification even when app is in foreground
      if (Notification.permission === 'granted') {
        new Notification(title, {
          body,
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
