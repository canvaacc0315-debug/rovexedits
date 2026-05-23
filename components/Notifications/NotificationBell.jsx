'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Bell } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import { useChatContext } from '../Chat/ChatProvider';

export default function NotificationBell() {
  const { isSignedIn } = useUser();
  const { totalUnread, openChatPanel, isChatOpen } = useChatContext();

  if (!isSignedIn) return null;

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={openChatPanel}
      style={{
        position: 'relative',
        background: isChatOpen ? 'rgba(255, 70, 85, 0.12)' : 'rgba(255, 255, 255, 0.06)',
        border: isChatOpen ? '1px solid rgba(255, 70, 85, 0.25)' : '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: 10,
        width: 36,
        height: 36,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        color: isChatOpen ? '#ff4655' : 'rgba(255, 255, 255, 0.6)',
        transition: 'all 0.2s',
      }}
    >
      <Bell size={16} />

      {/* Unread badge */}
      <AnimatePresence>
        {totalUnread > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            style={{
              position: 'absolute',
              top: -4,
              right: -4,
              minWidth: 18,
              height: 18,
              borderRadius: 9,
              background: 'linear-gradient(135deg, #ff4655, #ff6b7a)',
              color: '#fff',
              fontSize: '0.6rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0 4px',
              border: '2px solid var(--color-bg)',
              boxShadow: '0 2px 8px rgba(255, 70, 85, 0.5)',
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            {totalUnread > 9 ? '9+' : totalUnread}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
