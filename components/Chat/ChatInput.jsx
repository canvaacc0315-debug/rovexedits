'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Smile, X } from 'lucide-react';
import { useChatContext } from './ChatProvider';
import { sendMessage } from '@/lib/chat';
import { sendNotificationViaAPI } from '@/lib/notifications';
import GifPicker from './GifPicker';

export default function ChatInput({ conversationId }) {
  const { userId, userName, userAvatar, conversations, isAdmin } = useChatContext();
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [showGifPicker, setShowGifPicker] = useState(false);
  const textareaRef = useRef(null);

  // Get the other participant for notification
  const convo = conversations.find(c => c.id === conversationId);
  const otherParticipantId = convo?.participants?.find(p => p !== userId && p !== 'admin');

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = '24px';
      el.style.height = Math.min(el.scrollHeight, 96) + 'px';
    }
  }, [text]);

  const handleSend = async () => {
    if (!text.trim() || sending || !userId) return;

    const msgText = text.trim();
    setText('');
    setSending(true);

    try {
      await sendMessage(conversationId, userId, userName, userAvatar, msgText, 'text', undefined, isAdmin);

      // Send push notification to other participant
      if (otherParticipantId) {
        sendNotificationViaAPI(
          otherParticipantId,
          `${userName}`,
          msgText.length > 80 ? msgText.slice(0, 80) + '...' : msgText,
          { conversationId, url: '/' }
        ).catch(() => {}); // fire and forget
      }
    } catch (err) {
      console.error('Failed to send message:', err);
      setText(msgText); // restore on failure
    } finally {
      setSending(false);
    }
  };

  const handleGifSelect = async (gifUrl, gifPreview) => {
    if (sending || !userId) return;
    setSending(true);
    setShowGifPicker(false);

    try {
      await sendMessage(conversationId, userId, userName, userAvatar, '🎞️ GIF', 'gif', gifUrl, isAdmin);

      if (otherParticipantId) {
        sendNotificationViaAPI(
          otherParticipantId,
          `${userName}`,
          '🎞️ Sent a GIF',
          { conversationId, url: '/' }
        ).catch(() => {});
      }
    } catch (err) {
      console.error('Failed to send GIF:', err);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div style={{ flexShrink: 0, position: 'relative' }}>
      {/* GIF Picker */}
      {showGifPicker && (
        <div style={{
          position: 'absolute',
          bottom: '100%',
          left: 0,
          right: 0,
          zIndex: 10,
        }}>
          <GifPicker onSelect={handleGifSelect} onClose={() => setShowGifPicker(false)} />
        </div>
      )}

      {/* Input bar */}
      <div style={{
        padding: '12px 16px',
        borderTop: '1px solid rgba(255, 255, 255, 0.06)',
        background: 'rgba(255, 255, 255, 0.02)',
        display: 'flex',
        alignItems: 'flex-end',
        gap: 8,
      }}>
        {/* GIF button */}
        <button
          onClick={() => setShowGifPicker(!showGifPicker)}
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: showGifPicker ? 'rgba(255, 70, 85, 0.15)' : 'rgba(255, 255, 255, 0.06)',
            border: showGifPicker ? '1px solid rgba(255, 70, 85, 0.3)' : '1px solid rgba(255, 255, 255, 0.06)',
            color: showGifPicker ? '#ff4655' : 'rgba(255, 255, 255, 0.4)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            transition: 'all 0.2s',
          }}
        >
          {showGifPicker ? <X size={16} /> : <Smile size={16} />}
        </button>

        {/* Text area */}
        <div style={{
          flex: 1,
          position: 'relative',
        }}>
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            rows={1}
            style={{
              width: '100%',
              padding: '8px 12px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: 12,
              color: '#fff',
              fontSize: '0.88rem',
              fontFamily: "'Inter', sans-serif",
              resize: 'none',
              outline: 'none',
              lineHeight: 1.5,
              maxHeight: 96,
              scrollbarWidth: 'none',
              transition: 'border-color 0.2s',
            }}
            onFocus={(e) => e.target.style.borderColor = 'rgba(255, 70, 85, 0.3)'}
            onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.08)'}
          />
        </div>

        {/* Send button */}
        <button
          onClick={handleSend}
          disabled={!text.trim() || sending}
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: text.trim()
              ? 'linear-gradient(135deg, #ff4655, #ff6b7a)'
              : 'rgba(255, 255, 255, 0.04)',
            border: 'none',
            color: text.trim() ? '#fff' : 'rgba(255, 255, 255, 0.2)',
            cursor: text.trim() ? 'pointer' : 'default',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            transition: 'all 0.2s',
            boxShadow: text.trim() ? '0 2px 12px rgba(255, 70, 85, 0.3)' : 'none',
            opacity: sending ? 0.6 : 1,
          }}
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}
