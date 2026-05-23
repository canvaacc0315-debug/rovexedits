'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { onPresenceChange, formatPresenceStatus } from '@/lib/presence';

/**
 * Online status indicator for editors.
 * Shows a colored dot + status text (Online / 5m ago / Offline).
 * 
 * Props:
 *   userId — the editor's Firestore document ID
 *   showText — whether to show the text label (default: true)
 *   size — 'sm' | 'md' | 'lg' (default: 'sm')
 *   style — additional styles
 */
export default function OnlineStatus({ userId, showText = true, size = 'sm', style = {} }) {
  const [presence, setPresence] = useState(null);
  const [status, setStatus] = useState({ text: 'Offline', color: 'rgba(255,255,255,0.3)', dotColor: 'rgba(255,255,255,0.2)' });

  // Subscribe to real-time presence updates
  useEffect(() => {
    if (!userId) return;

    const unsub = onPresenceChange(userId, (data) => {
      setPresence(data);
    });

    return () => unsub();
  }, [userId]);

  // Re-compute status every 30s (for relative time updates)
  useEffect(() => {
    const compute = () => {
      if (presence) {
        setStatus(formatPresenceStatus(presence.lastSeen, presence.isOnline));
      } else {
        setStatus({ text: 'Offline', color: 'rgba(255,255,255,0.3)', dotColor: 'rgba(255,255,255,0.2)' });
      }
    };

    compute();
    const interval = setInterval(compute, 30000);
    return () => clearInterval(interval);
  }, [presence]);

  const dotSizes = {
    sm: 7,
    md: 9,
    lg: 11,
  };

  const fontSizes = {
    sm: '0.65rem',
    md: '0.72rem',
    lg: '0.78rem',
  };

  const dotSize = dotSizes[size] || 7;

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: size === 'sm' ? 4 : 6,
        ...style,
      }}
    >
      {/* Animated dot */}
      <div style={{ position: 'relative', width: dotSize, height: dotSize, flexShrink: 0 }}>
        <motion.div
          animate={{
            boxShadow: status.text === 'Online'
              ? ['0 0 0 0 rgba(0,255,212,0.4)', '0 0 0 4px rgba(0,255,212,0)', '0 0 0 0 rgba(0,255,212,0.4)']
              : 'none',
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{
            width: dotSize,
            height: dotSize,
            borderRadius: '50%',
            background: status.dotColor,
            transition: 'background 0.3s ease',
          }}
        />
      </div>

      {/* Text */}
      {showText && (
        <span
          style={{
            fontSize: fontSizes[size] || '0.65rem',
            color: status.color,
            fontFamily: "'JetBrains Mono', monospace",
            fontWeight: 500,
            letterSpacing: '0.02em',
            whiteSpace: 'nowrap',
            transition: 'color 0.3s ease',
          }}
        >
          {status.text}
        </span>
      )}
    </div>
  );
}
