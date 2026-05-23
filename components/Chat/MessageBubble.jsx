'use client';

import { motion } from 'framer-motion';
import { Check, CheckCheck } from 'lucide-react';

export default function MessageBubble({ message, isOwn }) {
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.2 }}
      style={{
        display: 'flex',
        justifyContent: isOwn ? 'flex-end' : 'flex-start',
        padding: '2px 0',
      }}
    >
      <div style={{
        maxWidth: '80%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: isOwn ? 'flex-end' : 'flex-start',
      }}>
        {/* Message body */}
        <div style={{
          padding: message.type === 'gif' ? 4 : '10px 14px',
          borderRadius: isOwn ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
          background: isOwn
            ? 'linear-gradient(135deg, rgba(255, 70, 85, 0.9), rgba(255, 70, 85, 0.75))'
            : 'rgba(255, 255, 255, 0.06)',
          border: isOwn
            ? '1px solid rgba(255, 70, 85, 0.3)'
            : '1px solid rgba(255, 255, 255, 0.06)',
          boxShadow: isOwn
            ? '0 2px 12px rgba(255, 70, 85, 0.2)'
            : '0 1px 4px rgba(0, 0, 0, 0.2)',
          overflow: 'hidden',
        }}>
          {message.type === 'gif' && message.mediaUrl ? (
            <img
              src={message.mediaUrl}
              alt="GIF"
              style={{
                maxWidth: 240,
                maxHeight: 200,
                borderRadius: 12,
                display: 'block',
              }}
              loading="lazy"
            />
          ) : (
            <p style={{
              fontSize: '0.88rem',
              lineHeight: 1.5,
              color: isOwn ? '#fff' : 'rgba(255, 255, 255, 0.85)',
              wordBreak: 'break-word',
              margin: 0,
              whiteSpace: 'pre-wrap',
            }}>
              {message.text}
            </p>
          )}
        </div>

        {/* Timestamp + read receipt */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          marginTop: 3,
          padding: '0 4px',
        }}>
          <span style={{
            fontSize: '0.62rem',
            color: 'rgba(255, 255, 255, 0.2)',
            fontFamily: "'JetBrains Mono', monospace",
          }}>
            {formatTime(message.createdAt)}
          </span>
          {isOwn && (
            message.readBy?.length > 1
              ? <CheckCheck size={12} color="#00ffd4" />
              : <Check size={12} color="rgba(255, 255, 255, 0.25)" />
          )}
        </div>
      </div>
    </motion.div>
  );
}
