import { useEffect } from 'react';
import {
  EmailType,
  EmailTrigger,
  WelcomeEmailPayload,
  EmailVerificationPayload,
  PasswordResetPayload,
  AccountRecoveryPayload,
  NewLoginAlertPayload,
  FriendshipFollowPayload,
  PlaylistSyncPayload,
  VoiceNoteInteractionPayload,
  EngagementBoostPayload,
  OrderEmailPayload,
  PolicyUpdatePayload,
  MonthlyDigestPayload,
} from '@/types/email';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

export class EmailTriggerService {
  private static async sendEmailTrigger(
    trigger: EmailTrigger,
    type: EmailType,
    payload: any
  ): Promise<void> {
    try {
      console.log(`[EmailTrigger] Triggering ${trigger} -> ${type}`);
      
      const response = await fetch(`${API_URL}/api/trpc/email.trigger`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          trigger,
          type,
          payload,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to trigger email: ${response.statusText}`);
      }

      console.log(`[EmailTrigger] Successfully triggered ${type}`);
    } catch (error) {
      console.error(`[EmailTrigger] Error triggering ${type}:`, error);
    }
  }

  static async triggerWelcomeEmail(payload: WelcomeEmailPayload): Promise<void> {
    await this.sendEmailTrigger('user_signup_completed', 'welcome', payload);
  }

  static async triggerEmailVerification(payload: EmailVerificationPayload): Promise<void> {
    await this.sendEmailTrigger('user_signup_initiated', 'email_verification', payload);
  }

  static async triggerPasswordReset(payload: PasswordResetPayload): Promise<void> {
    await this.sendEmailTrigger('password_reset_requested', 'password_reset', payload);
  }

  static async triggerAccountRecovery(payload: AccountRecoveryPayload): Promise<void> {
    await this.sendEmailTrigger('account_recovery_requested', 'account_recovery', payload);
  }

  static async triggerNewLoginAlert(payload: NewLoginAlertPayload): Promise<void> {
    await this.sendEmailTrigger('new_login_detected', 'new_login_alert', payload);
  }

  static async triggerFriendshipFollow(payload: FriendshipFollowPayload): Promise<void> {
    await this.sendEmailTrigger('user_followed', 'friendship_follow', payload);
  }

  static async triggerPlaylistSync(payload: PlaylistSyncPayload): Promise<void> {
    await this.sendEmailTrigger('playlist_updated', 'playlist_sync', payload);
  }

  static async triggerVoiceNoteInteraction(payload: VoiceNoteInteractionPayload): Promise<void> {
    await this.sendEmailTrigger('voice_note_replied', 'voice_note_interaction', payload);
  }

  static async triggerEngagementBoost(payload: EngagementBoostPayload): Promise<void> {
    await this.sendEmailTrigger('user_inactive_14days', 'engagement_boost', payload);
  }

  static async triggerOrderEmail(
    status: 'Confirmed' | 'Shipped' | 'Delivered',
    payload: OrderEmailPayload
  ): Promise<void> {
    const typeMap = {
      Confirmed: 'order_confirmed',
      Shipped: 'order_shipped',
      Delivered: 'order_delivered',
    };
    await this.sendEmailTrigger(
      'order_status_changed',
      typeMap[status] as EmailType,
      payload
    );
  }

  static async triggerSellerNotification(payload: OrderEmailPayload): Promise<void> {
    await this.sendEmailTrigger('order_status_changed', 'seller_notification', payload);
  }

  static async triggerPolicyUpdate(payload: PolicyUpdatePayload): Promise<void> {
    await this.sendEmailTrigger('policy_update_published', 'policy_update', payload);
  }

  static async triggerMonthlyDigest(payload: MonthlyDigestPayload): Promise<void> {
    await this.sendEmailTrigger('monthly_digest_ready', 'monthly_digest', payload);
  }
}

export function useEmailTriggers() {
  return {
    triggerWelcomeEmail: EmailTriggerService.triggerWelcomeEmail,
    triggerEmailVerification: EmailTriggerService.triggerEmailVerification,
    triggerPasswordReset: EmailTriggerService.triggerPasswordReset,
    triggerAccountRecovery: EmailTriggerService.triggerAccountRecovery,
    triggerNewLoginAlert: EmailTriggerService.triggerNewLoginAlert,
    triggerFriendshipFollow: EmailTriggerService.triggerFriendshipFollow,
    triggerPlaylistSync: EmailTriggerService.triggerPlaylistSync,
    triggerVoiceNoteInteraction: EmailTriggerService.triggerVoiceNoteInteraction,
    triggerEngagementBoost: EmailTriggerService.triggerEngagementBoost,
    triggerOrderEmail: EmailTriggerService.triggerOrderEmail,
    triggerSellerNotification: EmailTriggerService.triggerSellerNotification,
    triggerPolicyUpdate: EmailTriggerService.triggerPolicyUpdate,
    triggerMonthlyDigest: EmailTriggerService.triggerMonthlyDigest,
  };
}

export function useAutoEmailTriggers(userId: string, userEmail: string) {
  useEffect(() => {
    const checkInactivity = async () => {
      const lastActiveKey = `last_active_${userId}`;
      const lastActive = localStorage.getItem(lastActiveKey);
      
      if (lastActive) {
        const daysSinceActive = Math.floor(
          (Date.now() - parseInt(lastActive)) / (1000 * 60 * 60 * 24)
        );
        
        if (daysSinceActive >= 14) {
          await EmailTriggerService.triggerEngagementBoost({
            username: userId,
            email: userEmail,
            new_followers_count: 0,
          });
        }
      }
      
      localStorage.setItem(lastActiveKey, Date.now().toString());
    };

    checkInactivity();
    const interval = setInterval(checkInactivity, 1000 * 60 * 60 * 24);

    return () => clearInterval(interval);
  }, [userId, userEmail]);
}
