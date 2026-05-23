// ═══════════════════════════════════════════════════════════════
// Editor Presence / Online Status — Firestore Client-Side
// ═══════════════════════════════════════════════════════════════

import { doc, setDoc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';

// Thresholds (in milliseconds)
export const ONLINE_THRESHOLD = 2 * 60 * 1000;      // 2 minutes = "Online"
export const RECENTLY_THRESHOLD = 60 * 60 * 1000;    // 60 minutes = "X min ago"

/**
 * Update the current user's presence timestamp.
 * Called periodically while the user is on the site.
 */
export async function updatePresence(userId: string): Promise<void> {
  try {
    const presenceRef = doc(db, 'presence', userId);
    await setDoc(presenceRef, {
      userId,
      lastSeen: Date.now(),
      isOnline: true,
    }, { merge: true });
  } catch (error) {
    console.error('Error updating presence:', error);
  }
}

/**
 * Mark the user as offline (called on page unload).
 */
export async function setOffline(userId: string): Promise<void> {
  try {
    const presenceRef = doc(db, 'presence', userId);
    await setDoc(presenceRef, {
      isOnline: false,
      lastSeen: Date.now(),
    }, { merge: true });
  } catch (error) {
    console.error('Error setting offline:', error);
  }
}

/**
 * Get a single editor's presence data.
 */
export async function getPresence(userId: string): Promise<{ lastSeen: number; isOnline: boolean } | null> {
  try {
    const presenceRef = doc(db, 'presence', userId);
    const snap = await getDoc(presenceRef);
    if (snap.exists()) {
      return snap.data() as { lastSeen: number; isOnline: boolean };
    }
    return null;
  } catch (error) {
    console.error('Error getting presence:', error);
    return null;
  }
}

/**
 * Subscribe to real-time presence updates for a specific user.
 */
export function onPresenceChange(
  userId: string,
  callback: (data: { lastSeen: number; isOnline: boolean } | null) => void
): () => void {
  const presenceRef = doc(db, 'presence', userId);
  return onSnapshot(presenceRef, (snap) => {
    if (snap.exists()) {
      callback(snap.data() as { lastSeen: number; isOnline: boolean });
    } else {
      callback(null);
    }
  });
}

/**
 * Format the presence status into a human-readable string.
 */
export function formatPresenceStatus(
  lastSeen: number | null,
  isOnline: boolean
): { text: string; color: string; dotColor: string } {
  if (!lastSeen) {
    return { text: 'Offline', color: 'rgba(255, 255, 255, 0.3)', dotColor: 'rgba(255, 255, 255, 0.2)' };
  }

  const now = Date.now();
  const diff = now - lastSeen;

  if (isOnline && diff < ONLINE_THRESHOLD) {
    return { text: 'Online', color: '#00ffd4', dotColor: '#00ffd4' };
  }

  if (diff < 60 * 1000) {
    return { text: 'Just now', color: 'rgba(0, 255, 212, 0.6)', dotColor: 'rgba(0, 255, 212, 0.5)' };
  }

  if (diff < 60 * 60 * 1000) {
    const mins = Math.floor(diff / 60000);
    return { text: `${mins}m ago`, color: 'rgba(255, 255, 255, 0.45)', dotColor: '#fbbf24' };
  }

  if (diff < 24 * 60 * 60 * 1000) {
    const hours = Math.floor(diff / 3600000);
    return { text: `${hours}h ago`, color: 'rgba(255, 255, 255, 0.35)', dotColor: 'rgba(255, 255, 255, 0.25)' };
  }

  const days = Math.floor(diff / 86400000);
  if (days < 7) {
    return { text: `${days}d ago`, color: 'rgba(255, 255, 255, 0.3)', dotColor: 'rgba(255, 255, 255, 0.2)' };
  }

  return { text: 'Offline', color: 'rgba(255, 255, 255, 0.3)', dotColor: 'rgba(255, 255, 255, 0.2)' };
}
