'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowLeft, MessageCircle } from 'lucide-react';
import { useChatContext } from './ChatProvider';
import ConversationList from './ConversationList';
import MessageBubble from './MessageBubble';
import ChatInput from './ChatInput';
import OnlineStatus from '@/components/OnlineStatus';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { markAsRead } from '@/lib/chat';

export default function ChatPanel() {
  const {
    isChatOpen, closeChat, activeConversation, goBackToList,
    conversations, userId, activeChatPartner, isAdmin
  } = useChatContext();

  const [messages, setMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  // Get active conversation details
  const activeConvo = conversations.find(c => c.id === activeConversation);
  const otherParticipantId = activeConvo?.participants?.find(p => p !== userId && p !== 'admin') || activeChatPartner?.id;
  const otherParticipant = activeConvo?.participantDetails?.[otherParticipantId] || activeChatPartner || {};

  // Listen for messages in active conversation
  useEffect(() => {
    if (!activeConversation) { setMessages([]); return; }
    
    setMessagesLoading(true);
    const q = query(
      collection(db, 'conversations', activeConversation, 'messages'),
      orderBy('createdAt', 'asc')
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMessages(msgs);
      setMessagesLoading(false);

      // Mark as read
      if (userId) {
        markAsRead(activeConversation, userId).catch(() => {});
        if (isAdmin) markAsRead(activeConversation, 'admin').catch(() => {});
      }
    });

    return () => unsub();
  }, [activeConversation, userId]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Lock body scroll when chat is open
  useEffect(() => {
    if (isChatOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isChatOpen]);

  return (
    <AnimatePresence>
      {isChatOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={closeChat}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.6)',
              backdropFilter: 'blur(4px)',
              WebkitBackdropFilter: 'blur(4px)',
              zIndex: 9997,
            }}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              bottom: 0,
              width: 'min(400px, 100vw)',
              zIndex: 9998,
              display: 'flex',
              flexDirection: 'column',
              background: 'linear-gradient(180deg, rgba(12, 12, 18, 0.98), rgba(6, 6, 10, 0.99))',
              backdropFilter: 'blur(40px) saturate(180%)',
              WebkitBackdropFilter: 'blur(40px) saturate(180%)',
              borderLeft: '1px solid rgba(255, 255, 255, 0.06)',
              boxShadow: '-20px 0 60px rgba(0, 0, 0, 0.5)',
            }}
          >
            {/* Header */}
            <div style={{
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
              background: 'rgba(255, 255, 255, 0.02)',
              minHeight: 64,
              flexShrink: 0,
            }}>
              {activeConversation ? (
                <>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={goBackToList}
                    style={{
                      background: 'rgba(255, 255, 255, 0.06)',
                      border: 'none',
                      color: 'rgba(255, 255, 255, 0.7)',
                      cursor: 'pointer',
                      padding: 8,
                      borderRadius: 10,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s',
                    }}
                  >
                    <ArrowLeft size={18} />
                  </motion.button>

                  {/* Avatar */}
                  <div style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    overflow: 'hidden',
                    border: '2px solid rgba(255, 70, 85, 0.3)',
                    flexShrink: 0,
                    background: 'linear-gradient(135deg, rgba(255, 70, 85, 0.2), rgba(88, 101, 242, 0.2))',
                  }}>
                    {otherParticipant.avatar ? (
                      <img src={otherParticipant.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{
                        width: '100%', height: '100%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '0.85rem', fontWeight: 700, color: '#ff4655',
                      }}>
                        {(otherParticipant.name || '?')[0]?.toUpperCase()}
                      </div>
                    )}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      color: '#fff',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}>
                      {otherParticipant.name || 'Chat'}
                    </div>
                    <div style={{
                      fontSize: '0.7rem',
                      color: otherParticipant.role === 'editor' ? '#ff4655' : 'rgba(255, 255, 255, 0.4)',
                      fontFamily: "'JetBrains Mono', monospace",
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                    }}>
                      <OnlineStatus userId={otherParticipantId} size="sm" />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div style={{
                    width: 36,
                    height: 36,
                    borderRadius: 12,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'linear-gradient(135deg, rgba(255, 70, 85, 0.15), rgba(255, 70, 85, 0.05))',
                    border: '1px solid rgba(255, 70, 85, 0.2)',
                  }}>
                    <MessageCircle size={18} color="#ff4655" />
                  </div>
                  <div>
                    <div style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: '1rem',
                      fontWeight: 700,
                      color: '#fff',
                      letterSpacing: '0.02em',
                    }}>
                      Messages
                    </div>
                    <div style={{
                      fontSize: '0.7rem',
                      color: 'rgba(255, 255, 255, 0.35)',
                      fontFamily: "'JetBrains Mono', monospace",
                    }}>
                      {conversations.length} conversation{conversations.length !== 1 ? 's' : ''}
                    </div>
                  </div>
                </>
              )}

              {/* Close button */}
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={closeChat}
                style={{
                  marginLeft: 'auto',
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: 'none',
                  color: 'rgba(255, 255, 255, 0.5)',
                  cursor: 'pointer',
                  padding: 8,
                  borderRadius: 10,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'color 0.2s',
                }}
              >
                <X size={18} />
              </motion.button>
            </div>

            {/* Body */}
            <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <AnimatePresence mode="wait">
                {activeConversation ? (
                  <motion.div
                    key="chat"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.2 }}
                    style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
                  >
                    {/* Messages area */}
                    <div
                      ref={messagesContainerRef}
                      style={{
                        flex: 1,
                        overflowY: 'auto',
                        padding: '16px 16px 8px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 4,
                        scrollbarWidth: 'thin',
                        scrollbarColor: 'rgba(255,255,255,0.1) transparent',
                      }}
                    >
                      {messagesLoading ? (
                        <div style={{
                          flex: 1,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                            style={{
                              width: 28,
                              height: 28,
                              borderRadius: '50%',
                              border: '2px solid rgba(255, 70, 85, 0.2)',
                              borderTopColor: '#ff4655',
                            }}
                          />
                        </div>
                      ) : messages.length === 0 ? (
                        <div style={{
                          flex: 1,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 12,
                          padding: 32,
                        }}>
                          <div style={{
                            width: 64,
                            height: 64,
                            borderRadius: 20,
                            background: 'linear-gradient(135deg, rgba(255, 70, 85, 0.1), rgba(88, 101, 242, 0.1))',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '1px solid rgba(255, 255, 255, 0.05)',
                          }}>
                            <MessageCircle size={28} color="rgba(255, 70, 85, 0.5)" />
                          </div>
                          <p style={{
                            color: 'rgba(255, 255, 255, 0.35)',
                            fontSize: '0.85rem',
                            textAlign: 'center',
                            lineHeight: 1.5,
                          }}>
                            No messages yet.<br />Say hello! 👋
                          </p>
                        </div>
                      ) : (
                        messages.map((msg) => (
                          <MessageBubble
                            key={msg.id}
                            message={msg}
                            isOwn={msg.senderId === userId}
                          />
                        ))
                      )}
                      <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <ChatInput conversationId={activeConversation} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="list"
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 30 }}
                    transition={{ duration: 0.2 }}
                    style={{ flex: 1, overflow: 'hidden' }}
                  >
                    <ConversationList />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
