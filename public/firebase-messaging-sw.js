// ═══════════════════════════════════════════════════════════════
// Firebase Messaging Service Worker — Placeholder
// The real service worker is served dynamically from
// /api/firebase-messaging-sw with injected Firebase config.
// This file exists as a fallback for Firebase SDK discovery.
// ═══════════════════════════════════════════════════════════════

// This file intentionally left minimal.
// The actual SW is registered from /api/firebase-messaging-sw
// by the NotificationProvider component, which injects the
// Firebase config from server-side environment variables.

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));
