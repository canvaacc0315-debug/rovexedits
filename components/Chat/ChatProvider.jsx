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
  const [myEditorDocId, setMyEditorDocId] = useState(null);
  const [loading, setLoading] = useState(true);
  const unsubRef = useRef(null);

  // Track current user's online presence
  usePresenceTracker();

  const userId = user?.id;
  const userEmail = user?.primaryEmailAddress?.emailAddress;
  const userName = user?.fullName || user?.firstName || 'User';
  const userAvatar = user?.imageUrl || null;
  const isAdmin = userEmail === 'vaibhavpatilpro@gmail.com';

  // Check if the current user is an editor
  useEffect(() => {
    if (!userId) { setIsEditorUser(false); return; }
    
    const checkEditor = async () => {
      try {
        const { getEditorByClerkId, getEditors } = await import('@/lib/db');
        let editor = await getEditorByClerkId(userId);

        if (!editor && isAdmin) {
           const allEditors = await getEditors();
           editor = allEditors.find(e => e.isAdmin || e.email === 'vaibhavpatilpro@gmail.com' || e.name?.toLowerCase() === 'vaibhav' || e.name?.toLowerCase() === 'va1bhav');
        }

        setIsEditorUser(!!editor);
        setMyEditorDocId(editor?.id || null);
      } catch (err) {
        console.error("Chat checkEditor error:", err);
        setIsEditorUser(false);
        setMyEditorDocId(null);
      }
    };
    checkEditor();
  }, [userId, isAdmin]);

  // Real-time listener for conversations
  useEffect(() => {
    if (!isSignedIn || !userId) {
      setConversations([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    const queries = [];
    
    console.log('[CHAT DEBUG] Setting up listener for userId:', userId, 'isAdmin:', isAdmin, 'myEditorDocId:', myEditorDocId);

    // Normal query for user's actual Clerk ID
    queries.push(query(
      collection(db, 'conversations'),
      where('participants', 'array-contains', userId),
      orderBy('updatedAt', 'desc')
    ));

    // Admin query for 'admin' string
    if (isAdmin) {
      console.log('[CHAT DEBUG] Adding admin listener query');
      queries.push(query(
        collection(db, 'conversations'),
        where('participants', 'array-contains', 'admin'),
        orderBy('updatedAt', 'desc')
      ));
    }

    // Editor query for their editor profile ID
    if (myEditorDocId && myEditorDocId !== 'admin') {
      console.log('[CHAT DEBUG] Adding editor listener query for:', myEditorDocId);
      queries.push(query(
        collection(db, 'conversations'),
        where('participants', 'array-contains', myEditorDocId),
        orderBy('updatedAt', 'desc')
      ));
    }

    const unsubs = [];
    const convosMap = new Map();

    const handleSnapshot = (snapshot) => {
      snapshot.docs.forEach(doc => {
        convosMap.set(doc.id, { id: doc.id, ...doc.data() });
      });
      // Convert map to array and sort by updatedAt desc
      const sortedConvos = Array.from(convosMap.values()).sort((a, b) => b.updatedAt - a.updatedAt);
      setConversations(sortedConvos);
      setLoading(false);
    };

    queries.forEach(q => {
      const unsub = onSnapshot(q, handleSnapshot, (error) => {
        console.error('Chat listener error:', error);
        setLoading(false);
      });
      unsubs.push(unsub);
    });

    return () => {
      unsubs.forEach(u => u());
    };
  }, [isSignedIn, userId, isAdmin, myEditorDocId]);

  // Calculate total unread
  const totalUnread = conversations.reduce((sum, c) => {
    const userUnread = c.unreadCount?.[userId] || 0;
    const adminUnread = isAdmin ? (c.unreadCount?.['admin'] || 0) : 0;
    const editorUnread = (myEditorDocId && myEditorDocId !== 'admin') ? (c.unreadCount?.[myEditorDocId] || 0) : 0;
    return sum + userUnread + adminUnread + editorUnread;
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
      if (isAdmin) await markAsRead(conversation.id, 'admin');
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
      try { 
        await markAsRead(conversationId, userId);
        if (isAdmin) await markAsRead(conversationId, 'admin');
        if (myEditorDocId && myEditorDocId !== 'admin') await markAsRead(conversationId, myEditorDocId);
      } catch {}
    }
  }, [userId, isAdmin, myEditorDocId]);

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
    myEditorDocId,
    isAdmin,
    userEmail,
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
}
