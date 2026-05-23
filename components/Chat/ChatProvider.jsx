'use client';

import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useUser } from '@clerk/nextjs';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { getOrCreateConversation, markAsRead, getConversationsForUser } from '@/lib/chat';
import usePresenceTracker from '@/hooks/usePresenceTracker';

const ChatContext = createContext(null);

export function useChatContext() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChatContext must be used within ChatProvider');
  return ctx;
}

export default function ChatProvider({ children }) {
  const { user, isSignedIn } = useUser();
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [activeChatPartner, setActiveChatPartner] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isEditorUser, setIsEditorUser] = useState(false);
  const [loading, setLoading] = useState(true);
  const unsubRef = useRef(null);

  // Track current user's online presence
  usePresenceTracker();

  const userId = user?.id;
  const userName = user?.fullName || user?.firstName || 'User';
  const userAvatar = user?.imageUrl || null;

  // Check if the current user is an editor
  useEffect(() => {
    if (!userId) { setIsEditorUser(false); return; }
    
    const checkEditor = async () => {
      try {
        const { getEditorByClerkId } = await import('@/lib/db');
        const editor = await getEditorByClerkId(userId);
        setIsEditorUser(!!editor);
      } catch {
        setIsEditorUser(false);
      }
    };
    checkEditor();
  }, [userId]);

  // Real-time listener for conversations
  useEffect(() => {
    if (!isSignedIn || !userId) {
      setConversations([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    const q = query(
      collection(db, 'conversations'),
      where('participants', 'array-contains', userId),
      orderBy('updatedAt', 'desc')
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const convos = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setConversations(convos);
      setLoading(false);
    }, (error) => {
      console.error('Chat listener error:', error);
      setLoading(false);
    });

    unsubRef.current = unsub;
    return () => { if (unsubRef.current) unsubRef.current(); };
  }, [isSignedIn, userId]);

  // Calculate total unread
  const totalUnread = conversations.reduce((sum, c) => {
    return sum + (c.unreadCount?.[userId] || 0);
  }, 0);

  // Open chat with a specific editor
  const openChat = useCallback(async (editorId, editorDetails) => {
    if (!userId) return;

    const userDetails = {
      name: userName,
      avatar: userAvatar,
      role: isEditorUser ? 'editor' : 'user',
    };

    try {
      const conversation = await getOrCreateConversation(userId, editorId, userDetails, editorDetails);
      setActiveChatPartner({
        id: editorId,
        name: editorDetails.name,
        avatar: editorDetails.avatar,
        role: 'editor',
      });
      setActiveConversation(conversation.id);
      setIsChatOpen(true);

      // Mark as read
      await markAsRead(conversation.id, userId);
    } catch (err) {
      console.error('Error opening chat:', err);
    }
  }, [userId, userName, userAvatar, isEditorUser]);

  // Open to conversation list
  const openChatPanel = useCallback(() => {
    setIsChatOpen(true);
  }, []);

  // Close chat
  const closeChat = useCallback(() => {
    setIsChatOpen(false);
    // Delay clearing active conversation for exit animation
    setTimeout(() => setActiveConversation(null), 350);
  }, []);

  // Select a conversation
  const selectConversation = useCallback(async (conversationId) => {
    setActiveConversation(conversationId);
    if (userId) {
      try { await markAsRead(conversationId, userId); } catch {}
    }
  }, [userId]);

  // Go back to list
  const goBackToList = useCallback(() => {
    setActiveConversation(null);
    setActiveChatPartner(null);
  }, []);

  const value = {
    conversations,
    totalUnread,
    activeConversation,
    isChatOpen,
    isEditorUser,
    loading,
    userId,
    userName,
    userAvatar,
    openChat,
    openChatPanel,
    closeChat,
    selectConversation,
    goBackToList,
    activeChatPartner,
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
}
