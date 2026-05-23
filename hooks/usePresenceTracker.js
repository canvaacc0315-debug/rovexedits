'use client';

import { useEffect, useRef } from 'react';
import { useUser } from '@clerk/nextjs';
import { updatePresence, setOffline } from '@/lib/presence';

/**
 * Hook that tracks the current user's presence.
 * Updates Firestore every 60 seconds while the user is active.
 * Marks offline on page unload/visibility change.
 */
export default function usePresenceTracker() {
  const { user, isSignedIn } = useUser();
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!isSignedIn || !user?.id) return;

    const userId = user.id;

    // Update presence immediately
    updatePresence(userId);

    // Update every 60 seconds
    intervalRef.current = setInterval(() => {
      updatePresence(userId);
    }, 60000);

    // Handle visibility change (tab switch)
    const handleVisibility = () => {
      if (document.hidden) {
        setOffline(userId);
      } else {
        updatePresence(userId);
      }
    };

    // Handle page unload
    const handleBeforeUnload = () => {
      // Use sendBeacon for reliability on unload
      const presenceData = JSON.stringify({
        userId,
        lastSeen: Date.now(),
        isOnline: false,
      });

      // Try sendBeacon first (most reliable on unload)
      if (navigator.sendBeacon) {
        // Can't use sendBeacon with Firestore directly, so just set offline
        setOffline(userId);
      } else {
        setOffline(userId);
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      setOffline(userId);
    };
  }, [isSignedIn, user?.id]);
}
