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
  writeBatch,
  arrayUnion,
  arrayRemove
} from 'firebase/firestore';
import { db } from './firebase';
import type { Conversation, Message } from './types';

// ── GET OR CREATE CONVERSATION ──

export async function getOrCreateConversation(
  userId: string,
  editorId: string,
  userDetails: { name: string; avatar: string | null; role: 'user' | 'admin' },
  editorDetails: { name: string; avatar: string | null },
  callerAliases: string[] = [],
  targetAliases: string[] = []
): Promise<Conversation> {
  try {
    // Build full alias sets (include the primary IDs)
    const allCallerIds = [userId, ...callerAliases].filter((v, i, a) => v && a.indexOf(v) === i);
    const allTargetIds = [editorId, ...targetAliases].filter((v, i, a) => v && a.indexOf(v) === i);

    // Query for conversations containing any of the caller's IDs
    for (const callerId of allCallerIds) {
      const q = query(
        collection(db, 'conversations'),
        where('participants', 'array-contains', callerId)
      );
      const snapshot = await getDocs(q);

      for (const docSnap of snapshot.docs) {
        const data = docSnap.data();
        // Check if any target alias is also a participant
        const hasTarget = allTargetIds.some(tid => data.participants.includes(tid));
        if (hasTarget) {
          return { id: docSnap.id, ...data } as Conversation;
        }
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

      // Explicitly clear unread count for sender
      const allSenderIds = [senderId, ...senderAliases].filter(Boolean);
      for (const id of allSenderIds) {
        if (id in newUnreadCount) {
          newUnreadCount[id] = 0;
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
        deletedBy: [], // Reset deletedBy so it reappears for everyone
      });
    }

    return msgDocRef.id;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
}

// ── MARK AS READ ──

export async function markAsRead(conversationId: string, userId: string, aliases: string[] = []): Promise<void> {
  try {
    const convRef = doc(db, 'conversations', conversationId);
    const convSnap = await getDoc(convRef);

    if (convSnap.exists()) {
      const convData = convSnap.data() as Conversation;
      const newUnreadCount = { ...convData.unreadCount };
      
      // Reset unread for the user and all their aliases
      const allIds = [userId, ...aliases].filter(Boolean);
      for (const id of allIds) {
        if (id in newUnreadCount) {
          newUnreadCount[id] = 0;
        }
      }

      await updateDoc(convRef, { unreadCount: newUnreadCount });

      // Also update readBy on recent messages
      const messagesRef = collection(db, 'conversations', conversationId, 'messages');
      const msgQuery = query(messagesRef, orderBy('createdAt', 'desc'));
      const msgSnap = await getDocs(msgQuery);
      
      const batch = writeBatch(db);
      let batchCount = 0;
      for (const msgDoc of msgSnap.docs) {
        const msgData = msgDoc.data();
        if (!msgData.readBy?.includes(userId)) {
          batch.update(msgDoc.ref, { readBy: arrayUnion(userId) });
          batchCount++;
        }
        if (batchCount >= 20) break; // Limit batch size
      }
      if (batchCount > 0) {
        await batch.commit();
      }
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

// ── DELETE / CLEAR CONVERSATION ──

export async function clearConversation(conversationId: string, aliases: string[] = []): Promise<void> {
  if (!aliases || aliases.length === 0) return;
  try {
    const updates: Record<string, any> = {};
    const now = Date.now();
    for (const alias of aliases) {
      updates[`clearedAt.${alias}`] = now;
    }
    await updateDoc(doc(db, 'conversations', conversationId), updates);
  } catch (error) {
    console.error('Error clearing conversation:', error);
    throw error;
  }
}

export async function deleteConversation(conversationId: string, aliases: string[] = []): Promise<void> {
  if (!aliases || aliases.length === 0) return;
  try {
    await updateDoc(doc(db, 'conversations', conversationId), {
      deletedBy: arrayUnion(...aliases)
    });
  } catch (error) {
    console.error('Error deleting conversation:', error);
    throw error;
  }
}
