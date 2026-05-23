// ═══════════════════════════════════════════════════════════════
// RovexEdits V2 — TypeScript Interfaces
// ═══════════════════════════════════════════════════════════════

export type TierType = 'high-prem' | 'mid-prem' | 'low-prem';
export type StyleType = 'php' | 'regular';
export type SortMode = 'newest' | 'popular' | 'random';
export type CommissionStatus = 'open' | 'closed';

export interface Edit {
  id: string;
  name: string;
  imageUrl: string;
  thumbUrl: string;
  provider: string;           // 'cloudinary' | 'imagekit:rovex-ik-01' etc.
  tier: TierType;
  style: StyleType;
  editorId: string;
  editorName: string;
  editorSlug: string;
  isPinned: boolean;
  downloads: number;
  views: number;
  createdAt: number;          // timestamp ms
  editorAvatar?: string;
  editorWhatsapp?: string;
}

export interface Editor {
  id: string;
  code: string;
  name: string;
  slug: string;
  bio: string;
  avatar: string;
  banner: string;
  socialLinks: {
    instagram?: string;
    discord?: string;
    youtube?: string;
    whatsapp?: string;
  };
  commissionStatus: CommissionStatus;
  maxUploads: number;
  usedCount: number;
  revoked: boolean;
  verified?: boolean;
  clerkId?: string;
  sessionDurationHours: number;
  createdAt: number;
  expiresAt?: number;
}

export interface Review {
  id: string;
  name: string;
  rating: number;             // 1-5
  text: string;
  approved: boolean;
  createdAt: number;
}

export interface CDNAccount {
  id: string;
  provider: 'cloudinary' | 'imagekit';
  accountId: string;
  storageUsedMB: number;
  bandwidthUsedMB: number;
  storageLimitMB: number;
  bandwidthLimitMB: number;
  isActive: boolean;
}

export type StoreLinkType = 'store' | 'whatsapp';

export interface StoreLink {
  id: string;
  name: string;
  url: string;
  description: string;
  image: string;              // URL to logo/icon
  color: string;              // accent color hex
  type: StoreLinkType;        // 'store' or 'whatsapp'
  verified: boolean;
  order: number;              // for sorting
  createdAt: number;          // timestamp ms
}

export interface SiteSettings {
  maintenanceMode: boolean;
  heroText: string;
  announcement: string;
  announcementActive: boolean;
}

export interface FilterState {
  tier: TierType | 'all';
  style: StyleType | 'all';
  sort: SortMode;
  search: string;
}

export interface AuthPayload {
  role: 'admin' | 'editor';
  name?: string;
  editorId?: string;
  slug?: string;
  quotaRemaining?: number;
}

// ── CHAT SYSTEM ──

export interface Conversation {
  id: string;
  participants: string[];           // [clerkUserId, editorFirestoreId]
  participantDetails: {
    [id: string]: {
      name: string;
      avatar: string | null;
      role: 'user' | 'editor' | 'admin';
    };
  };
  lastMessage: {
    text: string;
    senderId: string;
    timestamp: number;
    type: 'text' | 'gif';
  } | null;
  unreadCount: { [userId: string]: number };
  createdAt: number;
  updatedAt: number;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string | null;
  text: string;
  type: 'text' | 'gif';
  mediaUrl?: string;
  createdAt: number;
  readBy: string[];
}

// ── PUSH NOTIFICATIONS ──

export interface FCMToken {
  id: string;
  userId: string;
  token: string;
  platform: 'web-desktop' | 'web-mobile';
  createdAt: number;
  lastActive: number;
}

export interface MarketingMessage {
  id: string;
  title: string;
  body: string;
  icon?: string;
  url?: string;
  active: boolean;
  sentCount: number;
  lastSentAt: number | null;
  createdAt: number;
}
