# VibeSync Email System - Complete Documentation

## 📧 Overview

The VibeSync Email System is a production-ready, enterprise-grade email infrastructure that handles all transactional, notification, and promotional emails for the VibeSync platform. It includes:

- **13 Email Templates** with responsive HTML/CSS
- **12 Trigger Events** for automated email sending
- **Email Queue System** with retry logic
- **User Preference Management** with granular controls
- **Multi-Provider Support** (SendGrid, AWS SES, Mock)
- **Backend API** via tRPC
- **Full Type Safety** with TypeScript

---

## 🏗️ Architecture

### File Structure

```
types/
  └── email.ts                          # Email type definitions

utils/
  ├── email-service.ts                  # Email service & queue
  ├── email-templates.ts                # HTML email templates

hooks/
  ├── email-triggers.ts                 # Frontend trigger hooks
  └── email-preferences-store.ts        # User preferences store

backend/trpc/routes/email/
  ├── trigger/route.ts                  # Email trigger endpoint
  ├── updatePreferences/route.ts        # Preferences update endpoint
  └── getQueueStatus/route.ts           # Queue status endpoint

app/
  └── email-preferences.tsx             # Email preferences UI
```

---

## 📨 Email Templates

### 1. Welcome Email
**Trigger:** `user_signup_completed`  
**Subject:** Welcome to VibeSync – Your World of Vibes & Connection 🎶  
**Payload:**
```typescript
{
  username: string;
  email: string;
  signup_time: string;
}
```

### 2. Email Verification
**Trigger:** `user_signup_initiated`  
**Subject:** Verify Your Email to Unlock VibeSync 🚀  
**Payload:**
```typescript
{
  username: string;
  email: string;
  verify_link: string;
  expiry: string; // e.g., "24h"
}
```

### 3. Password Reset
**Trigger:** `password_reset_requested`  
**Subject:** Reset Your VibeSync Password 🔑  
**Payload:**
```typescript
{
  username: string;
  email: string;
  reset_link: string;
  expiry: string; // e.g., "2h"
}
```

### 4. Account Recovery
**Trigger:** `account_recovery_requested`  
**Subject:** Need Help Recovering Your VibeSync Account? 🛡️  
**Payload:**
```typescript
{
  username: string;
  email: string;
  recovery_link: string;
  secondary_contact?: string;
}
```

### 5. New Login Alert
**Trigger:** `new_login_detected`  
**Subject:** New Login Detected on Your VibeSync Account ⚠️  
**Payload:**
```typescript
{
  username: string;
  email: string;
  device: string;
  location: string;
  timestamp: string;
  secure_link: string;
}
```

### 6. Friendship & Follow Notification
**Trigger:** `user_followed`  
**Subject:** {friend_name} Just Followed You on VibeSync 🎉  
**Payload:**
```typescript
{
  username: string;
  email: string;
  friend_name: string;
  friend_profile_link: string;
}
```

### 7. Playlist & Sync Activity
**Trigger:** `playlist_updated`  
**Subject:** {friend_name} Updated {playlist_name} on VibeSync 🎶  
**Payload:**
```typescript
{
  username: string;
  email: string;
  friend_name: string;
  playlist_name: string;
  playlist_link: string;
}
```

### 8. Voice Note Interaction
**Trigger:** `voice_note_replied`  
**Subject:** New Voice Note Reply from {friend_name} 🎤  
**Payload:**
```typescript
{
  username: string;
  email: string;
  friend_name: string;
  snippet_text: string;
  vibe_link: string;
}
```

### 9. Engagement Boost (Re-activation)
**Trigger:** `user_inactive_14days`  
**Subject:** We Miss You at VibeSync 💜  
**Payload:**
```typescript
{
  username: string;
  email: string;
  new_followers_count: number;
  friend_name?: string;
  top_trending_vibe?: string;
}
```

### 10-12. Marketplace Emails
**Triggers:** `order_status_changed`  
**Subjects:**
- Order Confirmed: Your VibeSync Order #{order_id} is Confirmed ✅
- Order Shipped: Your VibeSync Order #{order_id} is on the Way 📦
- Order Delivered: Your VibeSync Order #{order_id} has Arrived 🎁

**Payload:**
```typescript
{
  username: string;
  email: string;
  order_id: string;
  order_status: 'Confirmed' | 'Shipped' | 'Delivered';
  order_link: string;
  order_summary?: string;
}
```

### 13. Seller Notification
**Trigger:** `order_status_changed`  
**Subject:** You've Got a New Order on VibeSync Marketplace  
**Payload:**
```typescript
{
  username: string;
  email: string;
  order_id: string;
  order_link: string;
}
```

### 14. Policy & Privacy Update
**Trigger:** `policy_update_published`  
**Subject:** Updates to VibeSync's Terms & Privacy Policy 📜  
**Payload:**
```typescript
{
  username: string;
  email: string;
  update_link: string;
}
```

### 15. Monthly Digest
**Trigger:** `monthly_digest_ready`  
**Subject:** Your VibeSync Recap – {month} ✨  
**Payload:**
```typescript
{
  username: string;
  email: string;
  top_voice_note_title?: string;
  followers_count: number;
  top_vibe_title?: string;
  explore_link: string;
  month: string;
}
```

---

## 🔧 Usage Examples

### Frontend: Triggering Emails

```typescript
import { EmailTriggerService } from '@/hooks/email-triggers';

// Welcome email after signup
await EmailTriggerService.triggerWelcomeEmail({
  username: 'JohnDoe',
  email: 'john@example.com',
  signup_time: new Date().toISOString(),
});

// Email verification
await EmailTriggerService.triggerEmailVerification({
  username: 'JohnDoe',
  email: 'john@example.com',
  verify_link: 'https://vibesync.com/verify?token=abc123',
  expiry: '24h',
});

// Password reset
await EmailTriggerService.triggerPasswordReset({
  username: 'JohnDoe',
  email: 'john@example.com',
  reset_link: 'https://vibesync.com/reset?token=xyz789',
  expiry: '2h',
});

// New login alert
await EmailTriggerService.triggerNewLoginAlert({
  username: 'JohnDoe',
  email: 'john@example.com',
  device: 'iPhone 14',
  location: 'Cape Town, South Africa',
  timestamp: new Date().toISOString(),
  secure_link: 'https://vibesync.com/secure',
});

// Friend followed
await EmailTriggerService.triggerFriendshipFollow({
  username: 'JohnDoe',
  email: 'john@example.com',
  friend_name: 'Minentle',
  friend_profile_link: 'https://vibesync.com/u/minentle',
});

// Voice note reply
await EmailTriggerService.triggerVoiceNoteInteraction({
  username: 'JohnDoe',
  email: 'john@example.com',
  friend_name: 'Tumi',
  snippet_text: '🔥 That was hilarious!',
  vibe_link: 'https://vibesync.com/vibe/24680',
});
```

### Backend: Direct Email Sending

```typescript
import { emailQueue } from '@/utils/email-service';

// Queue an email
const queueId = await emailQueue.enqueue(
  'welcome',
  'user_signup_completed',
  {
    username: 'JohnDoe',
    email: 'john@example.com',
    signup_time: new Date().toISOString(),
  }
);

// Check queue status
const status = emailQueue.getQueueStatus();
console.log(status);
// { pending: 2, sent: 15, failed: 0, retrying: 1 }
```

---

## ���️ Email Preferences Management

### User Preferences Store

```typescript
import { useEmailPreferences } from '@/hooks/email-preferences-store';

function MyComponent() {
  const {
    preferences,
    loading,
    initializePreferences,
    updateNotificationPreference,
    unsubscribeFromAll,
    resubscribe,
    canSendEmail,
  } = useEmailPreferences();

  // Initialize preferences for new user
  await initializePreferences('user123', 'user@example.com');

  // Update a specific preference
  await updateNotificationPreference('friendship_follow', false);

  // Unsubscribe from all promotional emails
  await unsubscribeFromAll();

  // Resubscribe
  await resubscribe();

  // Check if email can be sent
  const canSend = canSendEmail('monthly_digest');
}
```

### Preference Categories

**Notification Emails** (User can toggle):
- `friendship_follow` - Friend follows
- `playlist_sync` - Playlist updates
- `voice_note_interaction` - Voice note replies
- `engagement_boost` - Engagement reminders
- `monthly_digest` - Monthly digest

**Transactional Emails** (Always sent):
- Email verification
- Password reset
- Account recovery
- New login alerts
- Order confirmations/updates

---

## 🔌 Email Provider Configuration

### Environment Variables

```bash
# SendGrid (Recommended)
SENDGRID_API_KEY=your_sendgrid_api_key

# AWS SES (Alternative)
AWS_SES_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key

# Email Settings
FROM_EMAIL=noreply@vibesync.com
FROM_NAME=VibeSync
```

### Provider Priority

1. **SendGrid** - If `SENDGRID_API_KEY` is set
2. **AWS SES** - If AWS credentials are set
3. **Mock** - Development mode (logs to console)

---

## 🚀 Backend API Endpoints

### 1. Trigger Email
**Endpoint:** `POST /api/trpc/email.trigger`

```typescript
{
  trigger: 'user_signup_completed',
  type: 'welcome',
  payload: {
    username: 'JohnDoe',
    email: 'john@example.com',
    signup_time: '2025-10-02T12:00:00Z'
  }
}
```

**Response:**
```typescript
{
  success: true,
  queueId: 'email-1696248000000-abc123',
  message: 'Email welcome queued successfully'
}
```

### 2. Update Preferences
**Endpoint:** `POST /api/trpc/email.updatePreferences`

```typescript
{
  userId: 'user123',
  email: 'john@example.com',
  notifications: {
    friendship_follow: true,
    playlist_sync: true,
    voice_note_interaction: false,
    engagement_boost: true,
    monthly_digest: false
  },
  unsubscribed: false
}
```

**Response:**
```typescript
{
  success: true,
  message: 'Email preferences updated successfully',
  preferences: { ... }
}
```

### 3. Get Queue Status
**Endpoint:** `GET /api/trpc/email.getQueueStatus`

**Response:**
```typescript
{
  success: true,
  status: {
    pending: 2,
    sent: 15,
    failed: 0,
    retrying: 1
  }
}
```

---

## 🎨 Email Design Features

### Responsive Design
- Mobile-first approach
- Optimized for Gmail, Outlook, Apple Mail
- Supports light & dark mode

### Brand Consistency
- VibeSync gradient colors
- Consistent typography
- Professional layout

### Accessibility
- High contrast text
- Clear CTAs
- Semantic HTML

---

## 🔒 Security & Compliance

### GDPR Compliance
- User consent for promotional emails
- Easy unsubscribe mechanism
- Data retention policies

### CAN-SPAM Compliance
- Clear sender identification
- Physical address in footer
- Unsubscribe link in all promotional emails

### Security Features
- DKIM/SPF authentication
- Rate limiting
- Retry logic with exponential backoff

---

## 📊 Monitoring & Analytics

### Email Queue Monitoring
```typescript
const status = emailQueue.getQueueStatus();
console.log(`Pending: ${status.pending}`);
console.log(`Sent: ${status.sent}`);
console.log(`Failed: ${status.failed}`);
console.log(`Retrying: ${status.retrying}`);
```

### Logging
All email operations are logged with:
- Timestamp
- Email type
- Recipient
- Status (queued, sent, failed)
- Error messages (if failed)

---

## 🧪 Testing

### Mock Mode
When no email provider is configured, the system runs in mock mode:
- Emails are logged to console
- No actual emails are sent
- Useful for development and testing

### Test Email Triggers
```typescript
// Test welcome email
await EmailTriggerService.triggerWelcomeEmail({
  username: 'TestUser',
  email: 'test@example.com',
  signup_time: new Date().toISOString(),
});

// Check console for mock email output
```

---

## 🚨 Error Handling

### Retry Logic
- Failed emails are automatically retried
- Maximum 3 attempts per email
- Exponential backoff between retries

### Error States
- `pending` - Email queued, not yet sent
- `sent` - Email successfully sent
- `failed` - Email failed after max retries
- `retrying` - Email failed, will retry

---

## 📱 UI Components

### Email Preferences Screen
**Route:** `/email-preferences`

Features:
- Toggle individual notification types
- Unsubscribe from all emails
- Resubscribe option
- View current email address
- See unsubscribe date

---

## 🔄 Integration with Auth System

### Auto-trigger on Signup
```typescript
import { useAuth } from '@/hooks/auth-store';
import { EmailTriggerService } from '@/hooks/email-triggers';

// In signup flow
const { signup } = useAuth();

const handleSignup = async (email: string, password: string) => {
  const user = await signup(email, password);
  
  // Trigger verification email
  await EmailTriggerService.triggerEmailVerification({
    username: user.username,
    email: user.email,
    verify_link: `https://vibesync.com/verify?token=${user.verificationToken}`,
    expiry: '24h',
  });
};
```

---

## 📈 Future Enhancements

- [ ] Email analytics dashboard
- [ ] A/B testing for email templates
- [ ] Scheduled email campaigns
- [ ] Email template builder UI
- [ ] Advanced segmentation
- [ ] Webhook support for email events
- [ ] Multi-language support

---

## 🆘 Troubleshooting

### Emails Not Sending
1. Check environment variables are set
2. Verify email provider credentials
3. Check queue status for errors
4. Review console logs for error messages

### User Not Receiving Emails
1. Check spam folder
2. Verify email address is correct
3. Check user preferences (not unsubscribed)
4. Verify email provider status

### Queue Stuck
1. Check backend logs
2. Restart email queue
3. Clear failed items
4. Verify network connectivity

---

## 📞 Support

For issues or questions:
- Check console logs for detailed error messages
- Review email queue status
- Contact VibeSync support team

---

**Last Updated:** October 2, 2025  
**Version:** 1.0.0  
**Status:** Production Ready ✅
