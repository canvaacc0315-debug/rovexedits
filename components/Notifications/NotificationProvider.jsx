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
import { useChatContext } from '@/components/Chat/ChatProvider';

export default function NotificationProvider({ children }) {
  const { user, isSignedIn } = useUser();
  const { isAdmin, myEditorDocId } = useChatContext();
  const initializedRef = useRef(false);

  useEffect(() => {
    if (!isSignedIn || !user?.id || initializedRef.current) return;
    if (typeof window === 'undefined') return;

    // We only want to init once, but if isAdmin or myEditorDocId changes, we might need to update tokens.
    // However, saving them multiple times is idempotent, so we can just run this when they become available.

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
        }

        // Request permission
        const permission = await requestNotificationPermission();
        if (permission !== 'granted') {
          return;
        }

        // Get and save FCM token
        const token = await getFCMToken();
        if (token) {
          // Save for base Clerk ID
          await saveFCMToken(user.id, token);
          // Save for admin alias if applicable
          if (isAdmin) await saveFCMToken('admin', token);
          // Save for editor doc ID if applicable
          if (myEditorDocId && myEditorDocId !== 'admin') await saveFCMToken(myEditorDocId, token);
        }

        initializedRef.current = true;
      } catch (err) {
        console.error('[Notifications] Init error:', err);
      }
    };

    init();
  }, [isSignedIn, user?.id, isAdmin, myEditorDocId]);

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
