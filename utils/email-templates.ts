import { EmailTemplate } from '@/types/email';

const baseStyles = `
  body {
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    background-color: #f5f5f5;
    color: #1a1a1a;
  }
  .email-container {
    max-width: 600px;
    margin: 0 auto;
    background-color: #ffffff;
  }
  .email-header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 40px 20px;
    text-align: center;
  }
  .email-logo {
    font-size: 32px;
    font-weight: bold;
    color: #ffffff;
    margin: 0;
  }
  .email-body {
    padding: 40px 30px;
  }
  .email-title {
    font-size: 24px;
    font-weight: 600;
    color: #1a1a1a;
    margin: 0 0 20px 0;
  }
  .email-text {
    font-size: 16px;
    line-height: 1.6;
    color: #4a4a4a;
    margin: 0 0 20px 0;
  }
  .email-list {
    margin: 20px 0;
    padding-left: 20px;
  }
  .email-list li {
    font-size: 16px;
    line-height: 1.8;
    color: #4a4a4a;
    margin-bottom: 10px;
  }
  .email-button {
    display: inline-block;
    padding: 14px 32px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: #ffffff !important;
    text-decoration: none;
    border-radius: 8px;
    font-weight: 600;
    font-size: 16px;
    margin: 20px 0;
  }
  .email-footer {
    padding: 30px;
    text-align: center;
    background-color: #f9f9f9;
    border-top: 1px solid #e0e0e0;
  }
  .email-footer-text {
    font-size: 14px;
    color: #888888;
    margin: 5px 0;
  }
  .email-footer-link {
    color: #667eea;
    text-decoration: none;
  }
  .email-divider {
    height: 1px;
    background-color: #e0e0e0;
    margin: 30px 0;
  }
  .email-highlight {
    background-color: #f0f4ff;
    padding: 15px;
    border-radius: 8px;
    margin: 20px 0;
  }
  @media (prefers-color-scheme: dark) {
    body {
      background-color: #1a1a1a;
      color: #ffffff;
    }
    .email-container {
      background-color: #2a2a2a;
    }
    .email-title {
      color: #ffffff;
    }
    .email-text, .email-list li {
      color: #cccccc;
    }
    .email-footer {
      background-color: #1f1f1f;
      border-top-color: #3a3a3a;
    }
    .email-highlight {
      background-color: #2f3542;
    }
  }
  @media only screen and (max-width: 600px) {
    .email-body {
      padding: 30px 20px;
    }
    .email-title {
      font-size: 20px;
    }
    .email-text {
      font-size: 15px;
    }
  }
`;

const createEmailHTML = (content: string): string => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light dark">
  <meta name="supported-color-schemes" content="light dark">
  <style>${baseStyles}</style>
</head>
<body>
  <div class="email-container">
    <div class="email-header">
      <h1 class="email-logo">VibeSync</h1>
    </div>
    ${content}
    <div class="email-footer">
      <p class="email-footer-text">You are receiving this email because you have an account with VibeSync.</p>
      <p class="email-footer-text">
        <a href="{unsubscribe_link}" class="email-footer-link">Manage email preferences</a> | 
        <a href="{unsubscribe_link}" class="email-footer-link">Unsubscribe</a>
      </p>
      <p class="email-footer-text">&copy; 2025 VibeSync. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;

export const emailTemplates: Record<string, EmailTemplate> = {
  welcome: {
    type: 'welcome',
    subject: 'Welcome to VibeSync – Your World of Vibes & Connection 🎶',
    htmlBody: createEmailHTML(`
      <div class="email-body">
        <h2 class="email-title">Hi {username},</h2>
        <p class="email-text">Welcome to VibeSync — where vibes, voice notes, and real connections come alive. 🎧</p>
        <p class="email-text">With VibeSync, you can:</p>
        <ul class="email-list">
          <li>Post and comment with voice notes to make conversations feel real</li>
          <li>Share vibes and playlists with friends</li>
          <li>Discover people near you through our Friendship Heatmap</li>
          <li>Sync experiences in real-time</li>
        </ul>
        <p class="email-text">👉 Get started now and set up your profile.</p>
        <a href="https://vibesync.com/profile/setup" class="email-button">Start Vibing</a>
      </div>
    `),
    textBody: `Hi {username},\n\nWelcome to VibeSync — where vibes, voice notes, and real connections come alive.\n\nWith VibeSync, you can:\n- Post and comment with voice notes to make conversations feel real\n- Share vibes and playlists with friends\n- Discover people near you through our Friendship Heatmap\n- Sync experiences in real-time\n\nGet started now: https://vibesync.com/profile/setup`,
    category: 'transactional',
  },

  email_verification: {
    type: 'email_verification',
    subject: 'Verify Your Email to Unlock VibeSync 🚀',
    htmlBody: createEmailHTML(`
      <div class="email-body">
        <h2 class="email-title">Hi {username},</h2>
        <p class="email-text">Thanks for signing up! Please confirm your email to unlock all VibeSync features.</p>
        <a href="{verify_link}" class="email-button">Verify My Email</a>
        <p class="email-text" style="color: #888888; font-size: 14px;">This link will expire in {expiry}.</p>
      </div>
    `),
    textBody: `Hi {username},\n\nThanks for signing up! Please confirm your email to unlock all VibeSync features.\n\nVerify your email: {verify_link}\n\nThis link will expire in {expiry}.`,
    category: 'transactional',
  },

  password_reset: {
    type: 'password_reset',
    subject: 'Reset Your VibeSync Password 🔑',
    htmlBody: createEmailHTML(`
      <div class="email-body">
        <h2 class="email-title">Hi {username},</h2>
        <p class="email-text">We received a request to reset your VibeSync password. If it was you, click below to set a new password.</p>
        <a href="{reset_link}" class="email-button">Reset Password</a>
        <p class="email-text" style="color: #888888; font-size: 14px;">This link will expire in {expiry}.</p>
        <div class="email-divider"></div>
        <p class="email-text" style="font-size: 14px;">If you didn't request this, you can ignore this email.</p>
      </div>
    `),
    textBody: `Hi {username},\n\nWe received a request to reset your VibeSync password. If it was you, click below to set a new password.\n\nReset password: {reset_link}\n\nThis link will expire in {expiry}.\n\nIf you didn't request this, you can ignore this email.`,
    category: 'transactional',
  },

  account_recovery: {
    type: 'account_recovery',
    subject: 'Need Help Recovering Your VibeSync Account? 🛡️',
    htmlBody: createEmailHTML(`
      <div class="email-body">
        <h2 class="email-title">Hi {username},</h2>
        <p class="email-text">We noticed you requested help recovering your account. To keep your account secure, follow the steps below:</p>
        <ul class="email-list">
          <li>Click the secure recovery link</li>
          <li>Verify your identity by confirming the code sent to your phone/email</li>
          <li>Reset your password and review recent activity</li>
        </ul>
        <a href="{recovery_link}" class="email-button">Start Account Recovery</a>
        <div class="email-divider"></div>
        <p class="email-text" style="font-size: 14px; color: #d32f2f;">If you didn't request account recovery, please secure your account immediately or contact support.</p>
      </div>
    `),
    textBody: `Hi {username},\n\nWe noticed you requested help recovering your account. To keep your account secure, follow the steps below:\n\n1. Click the secure recovery link\n2. Verify your identity by confirming the code sent to your phone/email\n3. Reset your password and review recent activity\n\nStart recovery: {recovery_link}\n\nIf you didn't request account recovery, please secure your account immediately or contact support.`,
    category: 'transactional',
  },

  new_login_alert: {
    type: 'new_login_alert',
    subject: 'New Login Detected on Your VibeSync Account ⚠️',
    htmlBody: createEmailHTML(`
      <div class="email-body">
        <h2 class="email-title">Hi {username},</h2>
        <p class="email-text">A new login was detected on your account.</p>
        <div class="email-highlight">
          <p class="email-text" style="margin: 5px 0;"><strong>Device:</strong> {device}</p>
          <p class="email-text" style="margin: 5px 0;"><strong>Location:</strong> {location}</p>
          <p class="email-text" style="margin: 5px 0;"><strong>Time:</strong> {timestamp}</p>
        </div>
        <p class="email-text">If this wasn't you, secure your account immediately.</p>
        <a href="{secure_link}" class="email-button">Secure My Account</a>
      </div>
    `),
    textBody: `Hi {username},\n\nA new login was detected on your account.\n\nDevice: {device}\nLocation: {location}\nTime: {timestamp}\n\nIf this wasn't you, secure your account immediately: {secure_link}`,
    category: 'transactional',
  },

  friendship_follow: {
    type: 'friendship_follow',
    subject: '{friend_name} Just Followed You on VibeSync 🎉',
    htmlBody: createEmailHTML(`
      <div class="email-body">
        <h2 class="email-title">Hi {username},</h2>
        <p class="email-text">Great news — <strong>{friend_name}</strong> just followed you on VibeSync!</p>
        <p class="email-text">Check out their profile and follow back to stay connected.</p>
        <a href="{friend_profile_link}" class="email-button">View Profile</a>
      </div>
    `),
    textBody: `Hi {username},\n\nGreat news — {friend_name} just followed you on VibeSync!\n\nCheck out their profile and follow back to stay connected.\n\nView profile: {friend_profile_link}`,
    category: 'notification',
  },

  playlist_sync: {
    type: 'playlist_sync',
    subject: '{friend_name} Updated {playlist_name} on VibeSync 🎶',
    htmlBody: createEmailHTML(`
      <div class="email-body">
        <h2 class="email-title">Hi {username},</h2>
        <p class="email-text"><strong>{friend_name}</strong> just updated <strong>{playlist_name}</strong> — new vibes and voice notes were added.</p>
        <p class="email-text">Don't miss out — open it now and vibe together.</p>
        <a href="{playlist_link}" class="email-button">Open Playlist</a>
      </div>
    `),
    textBody: `Hi {username},\n\n{friend_name} just updated {playlist_name} — new vibes and voice notes were added.\n\nDon't miss out — open it now and vibe together.\n\nOpen playlist: {playlist_link}`,
    category: 'notification',
  },

  voice_note_interaction: {
    type: 'voice_note_interaction',
    subject: 'New Voice Note Reply from {friend_name} 🎤',
    htmlBody: createEmailHTML(`
      <div class="email-body">
        <h2 class="email-title">Hi {username},</h2>
        <p class="email-text"><strong>{friend_name}</strong> replied to your vibe with a voice note:</p>
        <div class="email-highlight">
          <p class="email-text" style="font-style: italic;">"{snippet_text}…"</p>
        </div>
        <p class="email-text">Tap below to listen and reply.</p>
        <a href="{vibe_link}" class="email-button">Listen Now</a>
      </div>
    `),
    textBody: `Hi {username},\n\n{friend_name} replied to your vibe with a voice note:\n\n"{snippet_text}…"\n\nTap below to listen and reply: {vibe_link}`,
    category: 'notification',
  },

  engagement_boost: {
    type: 'engagement_boost',
    subject: 'We Miss You at VibeSync 💜',
    htmlBody: createEmailHTML(`
      <div class="email-body">
        <h2 class="email-title">Hi {username},</h2>
        <p class="email-text">It's been a while since your last vibe. Here's what you've missed:</p>
        <ul class="email-list">
          <li><strong>{new_followers_count}</strong> new people followed you</li>
          <li><strong>{friend_name}</strong> shared a new playlist</li>
          <li>Trending vibes and voice notes in your city</li>
        </ul>
        <p class="email-text">Jump back in and catch up on the community.</p>
        <a href="https://vibesync.com" class="email-button">Open VibeSync</a>
      </div>
    `),
    textBody: `Hi {username},\n\nIt's been a while since your last vibe. Here's what you've missed:\n\n- {new_followers_count} new people followed you\n- {friend_name} shared a new playlist\n- Trending vibes and voice notes in your city\n\nJump back in and catch up on the community: https://vibesync.com`,
    category: 'promotional',
  },

  order_confirmed: {
    type: 'order_confirmed',
    subject: 'Your VibeSync Order #{order_id} is Confirmed ✅',
    htmlBody: createEmailHTML(`
      <div class="email-body">
        <h2 class="email-title">Hi {username},</h2>
        <p class="email-text">Your order has been confirmed! We're preparing it for shipment.</p>
        <div class="email-highlight">
          <p class="email-text" style="margin: 5px 0;"><strong>Order ID:</strong> #{order_id}</p>
          <p class="email-text" style="margin: 5px 0;"><strong>Status:</strong> {order_status}</p>
        </div>
        <a href="{order_link}" class="email-button">View Order Details</a>
      </div>
    `),
    textBody: `Hi {username},\n\nYour order has been confirmed! We're preparing it for shipment.\n\nOrder ID: #{order_id}\nStatus: {order_status}\n\nView order details: {order_link}`,
    category: 'transactional',
  },

  order_shipped: {
    type: 'order_shipped',
    subject: 'Your VibeSync Order #{order_id} is on the Way 📦',
    htmlBody: createEmailHTML(`
      <div class="email-body">
        <h2 class="email-title">Hi {username},</h2>
        <p class="email-text">Great news! Your order has been shipped and is on its way to you.</p>
        <div class="email-highlight">
          <p class="email-text" style="margin: 5px 0;"><strong>Order ID:</strong> #{order_id}</p>
          <p class="email-text" style="margin: 5px 0;"><strong>Status:</strong> {order_status}</p>
        </div>
        <a href="{order_link}" class="email-button">Track Your Order</a>
      </div>
    `),
    textBody: `Hi {username},\n\nGreat news! Your order has been shipped and is on its way to you.\n\nOrder ID: #{order_id}\nStatus: {order_status}\n\nTrack your order: {order_link}`,
    category: 'transactional',
  },

  order_delivered: {
    type: 'order_delivered',
    subject: 'Your VibeSync Order #{order_id} has Arrived 🎁',
    htmlBody: createEmailHTML(`
      <div class="email-body">
        <h2 class="email-title">Hi {username},</h2>
        <p class="email-text">Your order has been delivered! We hope you love it.</p>
        <div class="email-highlight">
          <p class="email-text" style="margin: 5px 0;"><strong>Order ID:</strong> #{order_id}</p>
          <p class="email-text" style="margin: 5px 0;"><strong>Status:</strong> {order_status}</p>
        </div>
        <a href="{order_link}" class="email-button">View Order Details</a>
      </div>
    `),
    textBody: `Hi {username},\n\nYour order has been delivered! We hope you love it.\n\nOrder ID: #{order_id}\nStatus: {order_status}\n\nView order details: {order_link}`,
    category: 'transactional',
  },

  seller_notification: {
    type: 'seller_notification',
    subject: "You've Got a New Order on VibeSync Marketplace",
    htmlBody: createEmailHTML(`
      <div class="email-body">
        <h2 class="email-title">Hi {username},</h2>
        <p class="email-text">Congratulations! You have a new order on VibeSync Marketplace.</p>
        <div class="email-highlight">
          <p class="email-text" style="margin: 5px 0;"><strong>Order ID:</strong> #{order_id}</p>
        </div>
        <p class="email-text">Please prepare the order for shipment as soon as possible.</p>
        <a href="{order_link}" class="email-button">View Order Details</a>
      </div>
    `),
    textBody: `Hi {username},\n\nCongratulations! You have a new order on VibeSync Marketplace.\n\nOrder ID: #{order_id}\n\nPlease prepare the order for shipment as soon as possible.\n\nView order details: {order_link}`,
    category: 'transactional',
  },

  policy_update: {
    type: 'policy_update',
    subject: "Updates to VibeSync's Terms & Privacy Policy 📜",
    htmlBody: createEmailHTML(`
      <div class="email-body">
        <h2 class="email-title">Hi {username},</h2>
        <p class="email-text">We've made important updates to our Terms of Service and Privacy Policy.</p>
        <p class="email-text">Please review them to stay informed about how we protect and use your data.</p>
        <a href="{update_link}" class="email-button">Read Updates</a>
      </div>
    `),
    textBody: `Hi {username},\n\nWe've made important updates to our Terms of Service and Privacy Policy.\n\nPlease review them to stay informed about how we protect and use your data.\n\nRead updates: {update_link}`,
    category: 'promotional',
  },

  monthly_digest: {
    type: 'monthly_digest',
    subject: 'Your VibeSync Recap – {month} ✨',
    htmlBody: createEmailHTML(`
      <div class="email-body">
        <h2 class="email-title">Hi {username},</h2>
        <p class="email-text">Here's your month at a glance:</p>
        <ul class="email-list">
          <li><strong>Top voice note:</strong> {top_voice_note_title}</li>
          <li><strong>New followers:</strong> {followers_count}</li>
          <li><strong>Top vibe in your area:</strong> {top_vibe_title}</li>
        </ul>
        <p class="email-text">Ready for a fresh month of vibes?</p>
        <a href="{explore_link}" class="email-button">Explore Now</a>
      </div>
    `),
    textBody: `Hi {username},\n\nHere's your month at a glance:\n\n- Top voice note: {top_voice_note_title}\n- New followers: {followers_count}\n- Top vibe in your area: {top_vibe_title}\n\nReady for a fresh month of vibes?\n\nExplore now: {explore_link}`,
    category: 'promotional',
  },
};
