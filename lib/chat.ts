// ═══════════════════════════════════════════════════════════════
// Chat Operations — Firestore Client-Side
// ═══════════════════════════════════════════════════════════════

import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  addDoc,
} from 'firebase/firestore';
import { db } from './firebase';
import type { Conversation, Message } from './types';

// ── GET OR CREATE CONVERSATION ──

export async function getOrCreateConversation(
  userId: string,
  editorId: string,
  userDetails: { name: string; avatar: string | null; role: 'user' | 'admin' },
  editorDetails: { name: string; avatar: string | null }
): Promise<Conversation> {
  try {
    // Query for existing conversation with both participants
    const q = query(
      collection(db, 'conversations'),
      where('participants', 'array-contains', userId)
    );
    const snapshot = await getDocs(q);

    // Find a conversation that also contains the editorId
    for (const docSnap of snapshot.docs) {
      const data = docSnap.data();
      if (data.participants.includes(editorId)) {
        return { id: docSnap.id, ...data } as Conversation;
      }
    }

    // No existing conversation — create one
    const newConversation: Omit<Conversation, 'id'> = {
      participants: [userId, editorId],
      participantDetails: {
        [userId]: {
          name: userDetails.name,
          avatar: userDetails.avatar,
          role: userDetails.role,
        },
        [editorId]: {
          name: editorDetails.name,
          avatar: editorDetails.avatar,
          role: 'editor',
        },
      },
      lastMessage: null,
      unreadCount: { [userId]: 0, [editorId]: 0 },
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    const newDocRef = doc(collection(db, 'conversations'));
    await setDoc(newDocRef, { id: newDocRef.id, ...newConversation });

    return { id: newDocRef.id, ...newConversation };
  } catch (error) {
    console.error('Error getting/creating conversation:', error);
    throw error;
  }
}

// ── SEND MESSAGE ──

export async function sendMessage(
  conversationId: string,
  senderId: string,
  senderName: string,
  senderAvatar: string | null,
  text: string,
  type: 'text' | 'gif' = 'text',
  mediaUrl?: string,
  senderAliases: string[] = []
): Promise<string> {
  try {
    const messagesRef = collection(db, 'conversations', conversationId, 'messages');
    const messageData: Omit<Message, 'id'> = {
      senderId,
      senderName,
      senderAvatar,
      text,
      type,
      ...(mediaUrl && { mediaUrl }),
      createdAt: Date.now(),
      readBy: [senderId],
    };

    const msgDocRef = await addDoc(messagesRef, messageData);

    // Update the parent conversation document
    const convRef = doc(db, 'conversations', conversationId);
    const convSnap = await getDoc(convRef);

    if (convSnap.exists()) {
      const convData = convSnap.data() as Conversation;
      const newUnreadCount = { ...convData.unreadCount };

      // Increment unread count for all participants except the sender and their aliases
      for (const participantId of convData.participants) {
        if (participantId !== senderId && !senderAliases.includes(participantId)) {
          newUnreadCount[participantId] = (newUnreadCount[participantId] || 0) + 1;
        }
      }

      await updateDoc(convRef, {
        lastMessage: {
          text,
          senderId,
          timestamp: Date.now(),
          type,
        },
        unreadCount: newUnreadCount,
        updatedAt: Date.now(),
      });
    }

    return msgDocRef.id;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
}

// ── MARK AS READ ──

export async function markAsRead(conversationId: string, userId: string): Promise<void> {
  try {
    const convRef = doc(db, 'conversations', conversationId);
    const convSnap = await getDoc(convRef);

    if (convSnap.exists()) {
      const convData = convSnap.data() as Conversation;
      const newUnreadCount = { ...convData.unreadCount };
      newUnreadCount[userId] = 0;

      await updateDoc(convRef, { unreadCount: newUnreadCount });
    }
  } catch (error) {
    console.error('Error marking as read:', error);
    throw error;
  }
}

// ── DELETE MESSAGE ──

export async function deleteMessage(conversationId: string, messageId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'conversations', conversationId, 'messages', messageId));
  } catch (error) {
    console.error('Error deleting message:', error);
    throw error;
  }
}

// ── GET CONVERSATIONS FOR USER ──

export async function getConversationsForUser(userId: string): Promise<Conversation[]> {
  try {
    const q = query(
      collection(db, 'conversations'),
      where('participants', 'array-contains', userId)
    );
    const snapshot = await getDocs(q);
    const convos = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Conversation));
    return convos.sort((a, b) => b.updatedAt - a.updatedAt);
  } catch (error) {
    console.error('Error fetching user conversations:', error);
    return [];
  }
}

// ── GET CONVERSATIONS FOR EDITOR ──

export async function getConversationsForEditor(editorId: string): Promise<Conversation[]> {
  try {
    const q = query(
      collection(db, 'conversations'),
      where('participants', 'array-contains', editorId)
    );
    const snapshot = await getDocs(q);
    const convos = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Conversation));
    return convos.sort((a, b) => b.updatedAt - a.updatedAt);
  } catch (error) {
    console.error('Error fetching editor conversations:', error);
    return [];
  }
}

// ── BROADCAST FROM ADMIN ──

export async function broadcastFromAdmin(
  adminId: string,
  adminName: string,
  adminAvatar: string | null,
  text: string,
  allEditorIds: string[]
): Promise<void> {
  try {
    for (const editorId of allEditorIds) {
      // Get or create conversation with each editor
      const conversation = await getOrCreateConversation(
        adminId,
        editorId,
        { name: adminName, avatar: adminAvatar, role: 'admin' },
        { name: editorId, avatar: null } // editor details will be updated by participantDetails if conversation exists
      );

      // Send the broadcast message
      await sendMessage(
        conversation.id,
        adminId,
        adminName,
        adminAvatar,
        text,
        'text'
      );
    }
  } catch (error) {
    console.error('Error broadcasting from admin:', error);
    throw error;
  }
}
