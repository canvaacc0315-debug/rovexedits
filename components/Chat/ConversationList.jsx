'use client';

import { motion } from 'framer-motion';
import { useChatContext } from './ChatProvider';
import { MessageCircle } from 'lucide-react';

export default function ConversationList() {
  const { conversations, selectConversation, userId, loading } = useChatContext();

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Now';
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexDirection: 'column', gap: 12, padding: 32,
      }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
          style={{
            width: 28, height: 28, borderRadius: '50%',
            border: '2px solid rgba(255, 70, 85, 0.2)',
            borderTopColor: '#ff4655',
          }}
        />
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        gap: 16, padding: 40, height: '100%',
      }}>
        <div style={{
          width: 72, height: 72, borderRadius: 20,
          background: 'linear-gradient(135deg, rgba(255, 70, 85, 0.1), rgba(88, 101, 242, 0.1))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: '1px solid rgba(255, 255, 255, 0.05)',
        }}>
          <MessageCircle size={32} color="rgba(255, 70, 85, 0.4)" />
        </div>
        <div style={{ textAlign: 'center' }}>
          <p style={{
            color: 'rgba(255, 255, 255, 0.5)',
            fontSize: '0.95rem', fontWeight: 600,
            fontFamily: "'Space Grotesk', sans-serif",
            marginBottom: 6,
          }}>
            No conversations yet
          </p>
          <p style={{
            color: 'rgba(255, 255, 255, 0.3)',
            fontSize: '0.8rem', lineHeight: 1.5,
          }}>
            Message an editor to get started!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ overflowY: 'auto', flex: 1, padding: '8px 0' }}>
      {conversations.map((convo, i) => {
        const otherParticipantId = convo.participants?.find(p => p !== userId);
        const other = convo.participantDetails?.[otherParticipantId] || {};
        const unread = convo.unreadCount?.[userId] || 0;
        const lastMsg = convo.lastMessage;

        return (
          <motion.button
            key={convo.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            onClick={() => selectConversation(convo.id)}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '12px 20px',
              background: unread > 0
                ? 'rgba(255, 70, 85, 0.04)'
                : 'transparent',
              border: 'none',
              borderLeft: unread > 0 ? '2px solid #ff4655' : '2px solid transparent',
              cursor: 'pointer',
              transition: 'all 0.2s',
              textAlign: 'left',
              color: 'inherit',
            }}
            onMouseOver={e => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
            }}
            onMouseOut={e => {
              e.currentTarget.style.background = unread > 0
                ? 'rgba(255, 70, 85, 0.04)' : 'transparent';
            }}
          >
            {/* Avatar */}
            <div style={{
              width: 44, height: 44, borderRadius: '50%',
              overflow: 'hidden', flexShrink: 0,
              border: `2px solid ${unread > 0 ? 'rgba(255, 70, 85, 0.4)' : 'rgba(255, 255, 255, 0.08)'}`,
              background: 'linear-gradient(135deg, rgba(255, 70, 85, 0.15), rgba(88, 101, 242, 0.15))',
            }}>
              {other.avatar ? (
                <img src={other.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{
                  width: '100%', height: '100%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1rem', fontWeight: 700, color: '#ff4655',
                  fontFamily: "'Space Grotesk', sans-serif",
                }}>
                  {(other.name || '?')[0]?.toUpperCase()}
                </div>
              )}
            </div>

            {/* Content */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                <span style={{
                  fontWeight: unread > 0 ? 700 : 500,
                  fontSize: '0.88rem',
                  color: unread > 0 ? '#fff' : 'rgba(255, 255, 255, 0.8)',
                  fontFamily: "'Space Grotesk', sans-serif",
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>
                  {other.name || 'User'}
                </span>
                {lastMsg && (
                  <span style={{
                    fontSize: '0.68rem',
                    color: unread > 0 ? '#ff4655' : 'rgba(255, 255, 255, 0.25)',
                    fontFamily: "'JetBrains Mono', monospace",
                    flexShrink: 0,
                    marginLeft: 8,
                  }}>
                    {formatTime(lastMsg.timestamp)}
                  </span>
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{
                  fontSize: '0.78rem',
                  color: unread > 0 ? 'rgba(255, 255, 255, 0.6)' : 'rgba(255, 255, 255, 0.3)',
                  fontWeight: unread > 0 ? 500 : 400,
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  flex: 1,
                }}>
                  {lastMsg
                    ? lastMsg.type === 'gif' ? '🎞️ GIF' : lastMsg.text
                    : 'No messages yet'}
                </span>
                {unread > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    style={{
                      minWidth: 20, height: 20,
                      borderRadius: 10,
                      background: 'linear-gradient(135deg, #ff4655, #ff6b7a)',
                      color: '#fff',
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      padding: '0 6px',
                      flexShrink: 0,
                      boxShadow: '0 2px 8px rgba(255, 70, 85, 0.4)',
                    }}
                  >
                    {unread > 9 ? '9+' : unread}
                  </motion.span>
                )}
              </div>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
