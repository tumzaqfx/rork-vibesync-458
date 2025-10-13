import {
  EmailType,
  EmailPayload,
  EmailTemplate,
  EmailQueueItem,
  EmailPreferences,
} from '@/types/email';

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY || '';
const AWS_SES_REGION = process.env.AWS_SES_REGION || 'us-east-1';
const AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY_ID || '';
const AWS_SECRET_KEY = process.env.AWS_SECRET_ACCESS_KEY || '';
const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@vibesync.com';
const FROM_NAME = process.env.FROM_NAME || 'VibeSync';

export class EmailService {
  private provider: 'sendgrid' | 'aws-ses' | 'mock';

  constructor() {
    if (SENDGRID_API_KEY && SENDGRID_API_KEY !== '') {
      this.provider = 'sendgrid';
      console.log('[EmailService] Using SendGrid provider');
    } else if (AWS_ACCESS_KEY && AWS_SECRET_KEY && AWS_ACCESS_KEY !== '' && AWS_SECRET_KEY !== '') {
      this.provider = 'aws-ses';
      console.log('[EmailService] Using AWS SES provider');
    } else {
      this.provider = 'mock';
      console.log('[EmailService] No email provider configured. Using mock mode.');
      console.log('[EmailService] To enable real emails, set SENDGRID_API_KEY or AWS credentials in .env');
    }
  }

  async sendEmail(
    to: string,
    subject: string,
    htmlBody: string,
    textBody: string,
    category: 'transactional' | 'promotional' | 'notification' = 'transactional'
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    console.log(`[EmailService] Sending ${category} email to ${to}: ${subject}`);

    try {
      switch (this.provider) {
        case 'sendgrid':
          return await this.sendViaSendGrid(to, subject, htmlBody, textBody, category);
        case 'aws-ses':
          return await this.sendViaAWSSES(to, subject, htmlBody, textBody);
        case 'mock':
          return this.sendViaMock(to, subject, htmlBody, textBody);
        default:
          throw new Error('Unknown email provider');
      }
    } catch (error) {
      console.error('[EmailService] Error sending email:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  private async sendViaSendGrid(
    to: string,
    subject: string,
    htmlBody: string,
    textBody: string,
    category: string
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: to }] }],
        from: { email: FROM_EMAIL, name: FROM_NAME },
        subject,
        content: [
          { type: 'text/plain', value: textBody },
          { type: 'text/html', value: htmlBody },
        ],
        categories: [category],
        tracking_settings: {
          click_tracking: { enable: true },
          open_tracking: { enable: true },
        },
      }),
    });

    if (response.ok) {
      const messageId = response.headers.get('x-message-id') || 'unknown';
      return { success: true, messageId };
    } else {
      const error = await response.text();
      return { success: false, error };
    }
  }

  private async sendViaAWSSES(
    to: string,
    subject: string,
    htmlBody: string,
    textBody: string
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    console.log('[EmailService] AWS SES integration not fully implemented. Using mock.');
    return this.sendViaMock(to, subject, htmlBody, textBody);
  }

  private sendViaMock(
    to: string,
    subject: string,
    htmlBody: string,
    textBody: string
  ): { success: boolean; messageId: string } {
    console.log('\n========== MOCK EMAIL ==========');
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log('\n--- Text Body ---');
    console.log(textBody);
    console.log('\n--- HTML Body Preview ---');
    console.log(`${htmlBody.substring(0, 500)}...`);
    console.log('================================\n');
    return { success: true, messageId: `mock-${Date.now()}` };
  }

  async sendTemplateEmail(
    template: EmailTemplate,
    payload: EmailPayload
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    const subject = this.replaceTokens(template.subject, payload);
    const htmlBody = this.replaceTokens(template.htmlBody, payload);
    const textBody = this.replaceTokens(template.textBody, payload);

    return this.sendEmail(payload.email, subject, htmlBody, textBody, template.category);
  }

  private replaceTokens(template: string, payload: Record<string, any>): string {
    let result = template;
    for (const [key, value] of Object.entries(payload)) {
      const token = `{${key}}`;
      result = result.replace(new RegExp(token, 'g'), String(value || ''));
    }
    return result;
  }

  async verifyEmailDeliverability(email: string): Promise<boolean> {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

export class EmailQueue {
  private queue: EmailQueueItem[] = [];
  private processing = false;
  private emailService: EmailService;

  constructor() {
    this.emailService = new EmailService();
  }

  async enqueue(
    type: EmailType,
    trigger: any,
    payload: EmailPayload,
    maxAttempts = 3
  ): Promise<string> {
    const item: EmailQueueItem = {
      id: `email-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      trigger,
      payload,
      status: 'pending',
      attempts: 0,
      maxAttempts,
      createdAt: new Date().toISOString(),
    };

    this.queue.push(item);
    console.log(`[EmailQueue] Enqueued ${type} email for ${payload.email}`);

    if (!this.processing) {
      this.processQueue();
    }

    return item.id;
  }

  private async processQueue(): Promise<void> {
    if (this.processing || this.queue.length === 0) return;

    this.processing = true;

    while (this.queue.length > 0) {
      const item = this.queue[0];

      if (item.status === 'pending' || item.status === 'retrying') {
        await this.processItem(item);
      }

      if (item.status === 'sent' || item.status === 'failed') {
        this.queue.shift();
      } else {
        break;
      }
    }

    this.processing = false;
  }

  private async processItem(item: EmailQueueItem): Promise<void> {
    item.attempts++;
    console.log(
      `[EmailQueue] Processing ${item.type} (attempt ${item.attempts}/${item.maxAttempts})`
    );

    try {
      const template = getEmailTemplate(item.type);
      const result = await this.emailService.sendTemplateEmail(template, item.payload);

      if (result.success) {
        item.status = 'sent';
        item.sentAt = new Date().toISOString();
        console.log(`[EmailQueue] Successfully sent ${item.type} to ${item.payload.email}`);
      } else {
        throw new Error(result.error || 'Unknown error');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(`[EmailQueue] Error sending ${item.type}:`, errorMessage);

      if (item.attempts >= item.maxAttempts) {
        item.status = 'failed';
        item.error = errorMessage;
        console.error(`[EmailQueue] Failed to send ${item.type} after ${item.attempts} attempts`);
      } else {
        item.status = 'retrying';
        await new Promise((resolve) => setTimeout(resolve, 1000 * item.attempts));
      }
    }
  }

  getQueueStatus(): {
    pending: number;
    sent: number;
    failed: number;
    retrying: number;
  } {
    return {
      pending: this.queue.filter((i) => i.status === 'pending').length,
      sent: this.queue.filter((i) => i.status === 'sent').length,
      failed: this.queue.filter((i) => i.status === 'failed').length,
      retrying: this.queue.filter((i) => i.status === 'retrying').length,
    };
  }
}

export const emailQueue = new EmailQueue();

function getEmailTemplate(type: EmailType): EmailTemplate {
  const templates = require('./email-templates').emailTemplates;
  const template = templates[type];
  if (!template) {
    throw new Error(`Email template not found: ${type}`);
  }
  return template;
}
