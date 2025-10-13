export type EmailType =
  | 'welcome'
  | 'email_verification'
  | 'password_reset'
  | 'account_recovery'
  | 'new_login_alert'
  | 'friendship_follow'
  | 'playlist_sync'
  | 'voice_note_interaction'
  | 'engagement_boost'
  | 'order_confirmed'
  | 'order_shipped'
  | 'order_delivered'
  | 'seller_notification'
  | 'policy_update'
  | 'monthly_digest';

export type EmailTrigger =
  | 'user_signup_completed'
  | 'user_signup_initiated'
  | 'password_reset_requested'
  | 'account_recovery_requested'
  | 'new_login_detected'
  | 'user_followed'
  | 'playlist_updated'
  | 'voice_note_replied'
  | 'user_inactive_14days'
  | 'order_status_changed'
  | 'policy_update_published'
  | 'monthly_digest_ready';

export interface EmailPayload {
  username: string;
  user_id?: string;
  email: string;
  [key: string]: any;
}

export interface WelcomeEmailPayload extends EmailPayload {
  signup_time: string;
}

export interface EmailVerificationPayload extends EmailPayload {
  verify_link: string;
  expiry: string;
}

export interface PasswordResetPayload extends EmailPayload {
  reset_link: string;
  expiry: string;
}

export interface AccountRecoveryPayload extends EmailPayload {
  recovery_link: string;
  secondary_contact?: string;
}

export interface NewLoginAlertPayload extends EmailPayload {
  device: string;
  location: string;
  timestamp: string;
  secure_link: string;
}

export interface FriendshipFollowPayload extends EmailPayload {
  friend_name: string;
  friend_profile_link: string;
}

export interface PlaylistSyncPayload extends EmailPayload {
  friend_name: string;
  playlist_name: string;
  playlist_link: string;
}

export interface VoiceNoteInteractionPayload extends EmailPayload {
  friend_name: string;
  snippet_text: string;
  vibe_link: string;
}

export interface EngagementBoostPayload extends EmailPayload {
  new_followers_count: number;
  friend_name?: string;
  top_trending_vibe?: string;
}

export interface OrderEmailPayload extends EmailPayload {
  order_id: string;
  order_status: 'Confirmed' | 'Shipped' | 'Delivered';
  order_link: string;
  order_summary?: string;
}

export interface PolicyUpdatePayload extends EmailPayload {
  update_link: string;
}

export interface MonthlyDigestPayload extends EmailPayload {
  top_voice_note_title?: string;
  followers_count: number;
  top_vibe_title?: string;
  explore_link: string;
  month: string;
}

export interface EmailTemplate {
  type: EmailType;
  subject: string;
  htmlBody: string;
  textBody: string;
  category: 'transactional' | 'promotional' | 'notification';
}

export interface EmailPreferences {
  userId: string;
  email: string;
  notifications: {
    friendship_follow: boolean;
    playlist_sync: boolean;
    voice_note_interaction: boolean;
    engagement_boost: boolean;
    monthly_digest: boolean;
  };
  unsubscribed: boolean;
  unsubscribedAt?: string;
}

export interface EmailQueueItem {
  id: string;
  type: EmailType;
  trigger: EmailTrigger;
  payload: EmailPayload;
  status: 'pending' | 'sent' | 'failed' | 'retrying';
  attempts: number;
  maxAttempts: number;
  createdAt: string;
  sentAt?: string;
  error?: string;
}
