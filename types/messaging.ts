export type MessageType = 'text' | 'image' | 'video' | 'voice' | 'gif' | 'sticker' | 'file';
export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'seen';
export type ConversationType = 'direct' | 'group';
export type GroupRole = 'admin' | 'member';

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  type: MessageType;
  content: string;
  mediaUrl?: string;
  thumbnailUrl?: string;
  duration?: number;
  fileName?: string;
  fileSize?: number;
  replyTo?: string;
  status: MessageStatus;
  reactions: MessageReaction[];
  createdAt: Date;
  updatedAt: Date;
  deletedForMe?: boolean;
  deletedForEveryone?: boolean;
}

export interface MessageReaction {
  userId: string;
  emoji: string;
  createdAt: Date;
}

export interface Conversation {
  id: string;
  type: ConversationType;
  name?: string;
  image?: string;
  description?: string;
  participants: string[];
  lastMessage?: Message;
  unreadCount: number;
  isPinned: boolean;
  isMuted: boolean;
  isArchived: boolean;
  isRequest: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface GroupMember {
  userId: string;
  role: GroupRole;
  joinedAt: Date;
}

export interface GroupChat extends Conversation {
  type: 'group';
  members: GroupMember[];
  createdBy: string;
}

export interface TypingIndicator {
  conversationId: string;
  userId: string;
  timestamp: Date;
}

export interface MessageDraft {
  conversationId: string;
  text: string;
  replyTo?: string;
}
