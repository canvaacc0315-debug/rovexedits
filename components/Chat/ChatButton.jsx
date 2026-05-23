'use client';

import { useCallback } from 'react';
import { useUser, SignInButton } from '@clerk/nextjs';
import { MessageCircle } from 'lucide-react';
import { useChatContext } from './ChatProvider';

export default function ChatButton({ editorId, editorName, editorAvatar, className, style, children, variant = 'icon' }) {
  const { isSignedIn } = useUser();
  const { openChat, myEditorDocId } = useChatContext();

  // Hide button if this is the user's own editor profile
  if (myEditorDocId && editorId === myEditorDocId) {
    return null;
  }

  const handleClick = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isSignedIn) return; // SignInButton wrapper handles this

    openChat(editorId, {
      name: editorName || 'Editor',
      avatar: editorAvatar || null,
    });
  }, [isSignedIn, editorId, editorName, editorAvatar, openChat]);

  // If not signed in, wrap in SignInButton
  if (!isSignedIn) {
    return (
      <SignInButton mode="modal">
        {variant === 'text' ? (
          <button className={className || 'btn btn-wa'} style={style} onClick={(e) => e.stopPropagation()}>
            {children || <><MessageCircle size={14} /> MESSAGE</>}
          </button>
        ) : (
          <button
            style={{
              aspectRatio: '1/1',
              background: 'rgba(255,255,255,0.03)',
              borderRadius: 12,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              border: '1px solid rgba(255,255,255,0.05)',
              color: 'inherit',
              transition: 'all 0.2s',
              cursor: 'pointer',
              ...style,
            }}
            onMouseOver={e => e.currentTarget.style.background = 'rgba(255, 70, 85, 0.1)'}
            onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
            onClick={(e) => e.stopPropagation()}
          >
            <MessageCircle size={20} color="#ff4655" />
          </button>
        )}
      </SignInButton>
    );
  }

  // Signed in — open chat directly
  if (variant === 'text') {
    return (
      <button className={className || 'btn btn-wa'} style={style} onClick={handleClick}>
        {children || <><MessageCircle size={14} /> MESSAGE</>}
      </button>
    );
  }

  // Social link variant (for editor profile page)
  if (variant === 'social') {
    return (
      <button
        onClick={handleClick}
        className="btn btn-ghost"
        style={{
          borderColor: 'rgba(255, 70, 85, 0.25)',
          color: '#ff4655',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          fontSize: '0.8rem',
          cursor: 'pointer',
          ...style,
        }}
      >
        <MessageCircle size={14} /> Message
      </button>
    );
  }

  // Default icon variant (for editor card grid)
  return (
    <button
      onClick={handleClick}
      style={{
        aspectRatio: '1/1',
        background: 'rgba(255,255,255,0.03)',
        borderRadius: 12,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        border: '1px solid rgba(255,255,255,0.05)',
        color: 'inherit',
        transition: 'all 0.2s',
        cursor: 'pointer',
        ...style,
      }}
      onMouseOver={e => e.currentTarget.style.background = 'rgba(255, 70, 85, 0.1)'}
      onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
    >
      <MessageCircle size={20} color="#ff4655" />
    </button>
  );
}
