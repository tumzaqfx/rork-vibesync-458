import { Region } from '@/utils/region-detection';

export interface LegalContent {
  privacyPolicy: string;
  termsOfService: string;
}

export function getLegalContent(region: Region): LegalContent {
  switch (region) {
    case 'EU':
      return getEUContent();
    case 'US_CA':
      return getUSContent();
    case 'ZA':
      return getZAContent();
    default:
      return getDefaultContent();
  }
}

function getEUContent(): LegalContent {
  return {
    privacyPolicy: `# Privacy Policy (GDPR - European Union)

**Last Updated: January 13, 2025**

## Introduction

VibeSync ("we," "our," or "us") is committed to protecting your privacy in accordance with the General Data Protection Regulation (GDPR). This Privacy Policy explains how we collect, use, disclose, and safeguard your information.

## Legal Basis for Processing

We process your personal data based on:
- **Consent**: You have given clear consent for specific purposes
- **Contract**: Processing is necessary to fulfill our service agreement
- **Legal Obligation**: Required by EU or member state law
- **Legitimate Interests**: For our business operations, balanced against your rights

## Information We Collect

### Personal Information
- Account Information: Username, email address, encrypted password, profile picture, bio
- Profile Data: Display name, location, date of birth
- Contact Information: Phone number (optional)

### Content You Create
- Posts, comments, messages, stories, and status updates
- Photos, videos, and voice recordings you upload
- Live streaming content

### Usage Information
- Device information (model, OS version, unique identifiers)
- Log data (IP address, access times, pages viewed)
- Location data (with your explicit consent)
- Interaction data (likes, follows, shares, views)

### Permissions We Request
- **Camera**: To take photos and videos for posts and stories
- **Microphone**: To record voice notes and live audio
- **Photo Library**: To upload existing photos and videos
- **Location**: To tag posts and find nearby users (optional)
- **Contacts**: To find friends on VibeSync (optional)
- **Notifications**: To send you updates and messages

## How We Use Your Information

We use your information to:
- Provide, maintain, and improve our services
- Create and manage your account
- Enable communication between users
- Personalize your experience and content recommendations
- Send notifications about activity on your account
- Detect and prevent fraud, spam, and abuse
- Comply with legal obligations
- Analyze usage patterns to improve our app

## Your GDPR Rights

You have the right to:
- **Access**: Request a copy of your personal data
- **Rectification**: Correct inaccurate or incomplete data
- **Erasure**: Request deletion of your data ("right to be forgotten")
- **Restrict Processing**: Limit how we use your data
- **Data Portability**: Receive your data in a machine-readable format
- **Object**: Object to processing based on legitimate interests
- **Withdraw Consent**: Withdraw consent at any time
- **Lodge a Complaint**: File a complaint with your supervisory authority

To exercise these rights, contact us at privacy@vibesync.app or our Data Protection Officer at dpo@vibesync.app.

## Data Sharing

We do NOT sell your personal information. We may share information:

### With Other Users
- Your public profile information (username, bio, profile picture)
- Content you post publicly (posts, comments, stories)
- Your follower/following lists (if public)

### With Service Providers (Data Processors)
- Cloud hosting providers (AWS, Google Cloud)
- Analytics services (Firebase, Mixpanel)
- Email service providers (SendGrid)
- Payment processors (for future features)

All processors are bound by GDPR-compliant data processing agreements.

### For Legal Reasons
- To comply with EU laws, regulations, or legal requests
- To protect our rights, privacy, safety, or property
- In connection with a merger, acquisition, or sale of assets

## International Data Transfers

Your data may be transferred outside the EU. We ensure adequate protection through:
- EU Standard Contractual Clauses
- Adequacy decisions by the European Commission
- Other approved safeguards under GDPR

## Data Security

We implement industry-standard security measures:
- Encryption of data in transit (HTTPS/TLS)
- Encrypted password storage (bcrypt)
- Secure token-based authentication (JWT)
- Regular security audits
- Access controls and monitoring
- Pseudonymization and anonymization where possible

## Data Retention

We retain your information:
- **Active Accounts**: As long as your account is active
- **Deleted Accounts**: 30 days after deletion (for recovery)
- **Legal Requirements**: Longer if required by law
- **Stories/Status**: Automatically deleted after 24 hours
- **Messages**: Until you delete them

## Children's Privacy

VibeSync is not intended for users under 16 years old in the EU. We do not knowingly collect information from children under 16. If we discover we have collected such information, we will delete it immediately.

## Automated Decision-Making

We may use automated systems for:
- Content recommendations
- Spam and abuse detection
- Ad targeting (if applicable)

You have the right to object to automated decision-making that has legal or significant effects.

## Contact Information

**Data Protection Officer**: dpo@vibesync.app  
**Privacy Inquiries**: privacy@vibesync.app  
**Address**: [Your EU Representative Address]

## Supervisory Authority

You have the right to lodge a complaint with your local data protection authority.

## Changes to This Policy

We will notify you of material changes via:
- In-app notification
- Email notification
- Update to "Last Updated" date

---

**By using VibeSync, you agree to this Privacy Policy.**`,

    termsOfService: `# Terms of Service (European Union)

**Last Updated: January 13, 2025**

## 1. Acceptance of Terms

By accessing or using VibeSync ("the App"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, do not use the App.

## 2. Eligibility

- You must be at least 16 years old to use VibeSync in the EU
- If you are under 18, you must have parental consent
- You must provide accurate and complete registration information
- You are responsible for maintaining the security of your account

## 3. User Accounts

### Account Creation
- You must create an account to use most features
- One person may not maintain more than one account
- You may not impersonate others or create fake accounts
- You are responsible for all activity on your account

### Account Security
- Keep your password confidential
- Notify us immediately of unauthorized access
- We are not liable for losses from unauthorized account use

### Account Termination
- You may delete your account at any time
- We may suspend or terminate accounts that violate these Terms
- We reserve the right to refuse service to anyone

## 4. User Content

### Your Content
- You retain ownership of content you post
- You grant us a worldwide, non-exclusive, royalty-free license to use, display, and distribute your content
- You are responsible for your content and its legality
- You represent that you have rights to post your content

### Prohibited Content
You may NOT post content that:
- Is illegal, harmful, or violates others' rights
- Contains hate speech, harassment, or bullying
- Is sexually explicit or pornographic
- Promotes violence or dangerous activities
- Contains spam, scams, or malware
- Infringes intellectual property rights
- Impersonates others or is misleading
- Violates privacy or shares personal information without consent

### Content Moderation
- We may remove content that violates these Terms
- We may use automated systems to detect violations
- We are not obligated to monitor all content
- Removal decisions are at our discretion

## 5. Acceptable Use

You agree NOT to:
- Violate any laws or regulations
- Harass, abuse, or harm others
- Spam or send unsolicited messages
- Scrape, crawl, or use bots on the App
- Reverse engineer or decompile the App
- Interfere with the App's operation
- Access others' accounts without permission
- Collect user data without consent
- Use the App for commercial purposes without authorization

## 6. Intellectual Property

### Our Rights
- VibeSync and its content are protected by copyright, trademark, and other laws
- Our logo, design, and features are our property
- You may not use our intellectual property without permission

### Copyright Infringement
- We respect intellectual property rights
- Report copyright violations to dmca@vibesync.app
- We will remove infringing content and may terminate repeat offenders

## 7. Privacy

Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your information. By using VibeSync, you agree to our Privacy Policy.

## 8. Disclaimers

### "AS IS" Service
- VibeSync is provided "as is" without warranties
- We do not guarantee uninterrupted or error-free service
- We do not guarantee accuracy or reliability of content

### User Interactions
- We are not responsible for user conduct or content
- You interact with other users at your own risk
- We do not endorse user content or opinions

## 9. Limitation of Liability

To the extent permitted by EU law:
- We are not liable for indirect, incidental, or consequential damages
- We are not liable for user content or conduct
- We are not liable for service interruptions or data loss

Nothing in these Terms excludes or limits our liability for:
- Death or personal injury caused by negligence
- Fraud or fraudulent misrepresentation
- Any liability that cannot be excluded under EU law

## 10. Dispute Resolution

### Governing Law
- These Terms are governed by EU law and the laws of [Your EU Country]
- Disputes will be resolved in [Your EU Country] courts

### Informal Resolution
- Contact us first to resolve disputes informally
- Email: legal@vibesync.app

### EU Online Dispute Resolution
- EU consumers can access the ODR platform at: https://ec.europa.eu/consumers/odr

## 11. Changes to Terms

- We may modify these Terms at any time
- We will notify you of material changes
- Continued use after changes constitutes acceptance
- If you don't agree to changes, stop using the App

## 12. Contact Information

**Legal Inquiries**: legal@vibesync.app  
**Support**: support@vibesync.app  
**Data Protection Officer**: dpo@vibesync.app

---

**By using VibeSync, you agree to these Terms of Service.**`
  };
}

function getUSContent(): LegalContent {
  return {
    privacyPolicy: `# Privacy Policy (CCPA - United States)

**Last Updated: January 13, 2025**

## Introduction

VibeSync ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application.

## Information We Collect

### Personal Information
- **Account Information**: Username, email address, password (encrypted), profile picture, bio
- **Profile Data**: Display name, location, date of birth
- **Contact Information**: Phone number (optional)

### Content You Create
- Posts, comments, messages, stories, and status updates
- Photos, videos, and voice recordings you upload
- Live streaming content

### Usage Information
- Device information (model, OS version, unique identifiers)
- Log data (IP address, access times, pages viewed)
- Location data (with your permission)
- Interaction data (likes, follows, shares, views)

### Permissions We Request
- **Camera**: To take photos and videos for posts and stories
- **Microphone**: To record voice notes and live audio
- **Photo Library**: To upload existing photos and videos
- **Location**: To tag posts and find nearby users (optional)
- **Contacts**: To find friends on VibeSync (optional)
- **Notifications**: To send you updates and messages

## How We Use Your Information

We use your information to:
- Provide, maintain, and improve our services
- Create and manage your account
- Enable communication between users
- Personalize your experience and content recommendations
- Send notifications about activity on your account
- Detect and prevent fraud, spam, and abuse
- Comply with legal obligations
- Analyze usage patterns to improve our app

## Information Sharing

We do NOT sell your personal information. We may share information:

### With Other Users
- Your public profile information (username, bio, profile picture)
- Content you post publicly (posts, comments, stories)
- Your follower/following lists (if public)

### With Service Providers
- Cloud hosting providers (AWS, Google Cloud)
- Analytics services (Firebase, Mixpanel)
- Email service providers (SendGrid)
- Payment processors (for future features)

### For Legal Reasons
- To comply with laws, regulations, or legal requests
- To protect our rights, privacy, safety, or property
- In connection with a merger, acquisition, or sale of assets

## Your California Privacy Rights (CCPA)

If you are a California resident, you have the right to:

### Right to Know
- Request disclosure of personal information we collect, use, and share
- Request specific pieces of personal information we hold about you

### Right to Delete
- Request deletion of your personal information
- Exceptions apply for legal compliance and service provision

### Right to Opt-Out
- We do NOT sell your personal information
- If we ever do, you can opt-out at any time

### Right to Non-Discrimination
- We will not discriminate against you for exercising your CCPA rights
- Same service quality and pricing for all users

### How to Exercise Your Rights
- Email: privacy@vibesync.app
- In-app: Settings > Privacy > Data Rights
- We will respond within 45 days

### Verification
- We may request information to verify your identity
- This protects your personal information from unauthorized access

## Data Security

We implement industry-standard security measures:
- Encryption of data in transit (HTTPS/TLS)
- Encrypted password storage (bcrypt)
- Secure token-based authentication (JWT)
- Regular security audits
- Access controls and monitoring

However, no method of transmission over the internet is 100% secure.

## Data Retention

We retain your information:
- **Active Accounts**: As long as your account is active
- **Deleted Accounts**: 30 days after deletion (for recovery)
- **Legal Requirements**: Longer if required by law
- **Stories/Status**: Automatically deleted after 24 hours
- **Messages**: Until you delete them

## Children's Privacy

VibeSync is not intended for users under 13 years old. We do not knowingly collect information from children under 13. If we discover we have collected such information, we will delete it immediately.

## Do Not Track Signals

We do not currently respond to "Do Not Track" browser signals.

## Changes to This Policy

We may update this Privacy Policy from time to time. We will notify you of significant changes via:
- In-app notification
- Email notification
- Update to "Last Updated" date

Continued use of VibeSync after changes constitutes acceptance.

## Contact Us

**Email**: privacy@vibesync.app  
**Address**: [Your Company Address]  
**Support**: In-app Help & Support section

---

**By using VibeSync, you agree to this Privacy Policy.**`,

    termsOfService: `# Terms of Service (United States)

**Last Updated: January 13, 2025**

## 1. Acceptance of Terms

By accessing or using VibeSync ("the App"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, do not use the App.

## 2. Eligibility

- You must be at least 13 years old to use VibeSync
- If you are under 18, you must have parental consent
- You must provide accurate and complete registration information
- You are responsible for maintaining the security of your account

## 3. User Accounts

### Account Creation
- You must create an account to use most features
- One person may not maintain more than one account
- You may not impersonate others or create fake accounts
- You are responsible for all activity on your account

### Account Security
- Keep your password confidential
- Notify us immediately of unauthorized access
- We are not liable for losses from unauthorized account use

### Account Termination
- You may delete your account at any time
- We may suspend or terminate accounts that violate these Terms
- We reserve the right to refuse service to anyone

## 4. User Content

### Your Content
- You retain ownership of content you post
- You grant us a worldwide, non-exclusive, royalty-free license to use, display, and distribute your content
- You are responsible for your content and its legality
- You represent that you have rights to post your content

### Prohibited Content
You may NOT post content that:
- Is illegal, harmful, or violates others' rights
- Contains hate speech, harassment, or bullying
- Is sexually explicit or pornographic
- Promotes violence or dangerous activities
- Contains spam, scams, or malware
- Infringes intellectual property rights
- Impersonates others or is misleading
- Violates privacy or shares personal information without consent

### Content Moderation
- We may remove content that violates these Terms
- We may use automated systems to detect violations
- We are not obligated to monitor all content
- Removal decisions are at our discretion

## 5. Acceptable Use

You agree NOT to:
- Violate any laws or regulations
- Harass, abuse, or harm others
- Spam or send unsolicited messages
- Scrape, crawl, or use bots on the App
- Reverse engineer or decompile the App
- Interfere with the App's operation
- Access others' accounts without permission
- Collect user data without consent
- Use the App for commercial purposes without authorization

## 6. Intellectual Property

### Our Rights
- VibeSync and its content are protected by copyright, trademark, and other laws
- Our logo, design, and features are our property
- You may not use our intellectual property without permission

### Copyright Infringement (DMCA)
- We respect intellectual property rights
- Report copyright violations to dmca@vibesync.app
- We will remove infringing content and may terminate repeat offenders
- Counter-notification process available per DMCA

## 7. Privacy

Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your information. By using VibeSync, you agree to our Privacy Policy.

## 8. Disclaimers

### "AS IS" Service
- VibeSync is provided "as is" without warranties
- We do not guarantee uninterrupted or error-free service
- We do not guarantee accuracy or reliability of content

### User Interactions
- We are not responsible for user conduct or content
- You interact with other users at your own risk
- We do not endorse user content or opinions

### No Professional Advice
- Content on VibeSync is not professional advice
- Do not rely on user content for medical, legal, or financial decisions

## 9. Limitation of Liability

To the maximum extent permitted by law:
- We are not liable for indirect, incidental, or consequential damages
- Our total liability is limited to $100 or the amount you paid us (if any)
- We are not liable for user content or conduct
- We are not liable for service interruptions or data loss

## 10. Indemnification

You agree to indemnify and hold us harmless from claims, damages, and expenses arising from:
- Your use of VibeSync
- Your content
- Your violation of these Terms
- Your violation of others' rights

## 11. Dispute Resolution

### Governing Law
- These Terms are governed by the laws of the State of [Your State]
- Disputes will be resolved in [Your State] courts

### Arbitration Agreement
- Disputes will be resolved through binding arbitration
- You waive the right to class action lawsuits
- Arbitration is conducted under AAA rules
- Small claims court option available

### Informal Resolution
- Contact us first to resolve disputes informally
- Email: legal@vibesync.app

## 12. Changes to Terms

- We may modify these Terms at any time
- We will notify you of material changes
- Continued use after changes constitutes acceptance
- If you don't agree to changes, stop using the App

## 13. Contact Information

**Legal Inquiries**: legal@vibesync.app  
**Support**: support@vibesync.app  
**DMCA Agent**: dmca@vibesync.app

---

**By using VibeSync, you agree to these Terms of Service.**`
  };
}

function getZAContent(): LegalContent {
  return {
    privacyPolicy: `# Privacy Policy (POPIA - South Africa)

**Last Updated: January 13, 2025**

## Introduction

VibeSync ("we," "our," or "us") is committed to protecting your privacy in accordance with the Protection of Personal Information Act (POPIA). This Privacy Policy explains how we collect, use, disclose, and safeguard your information.

## POPIA Compliance

We comply with POPIA's eight conditions for lawful processing:
1. Accountability
2. Processing limitation
3. Purpose specification
4. Further processing limitation
5. Information quality
6. Openness
7. Security safeguards
8. Data subject participation

## Information We Collect

### Personal Information
- **Account Information**: Username, email address, password (encrypted), profile picture, bio
- **Profile Data**: Display name, location, date of birth
- **Contact Information**: Phone number (optional)
- **South African ID Number**: Not collected

### Content You Create
- Posts, comments, messages, stories, and status updates
- Photos, videos, and voice recordings you upload
- Live streaming content

### Usage Information
- Device information (model, OS version, unique identifiers)
- Log data (IP address, access times, pages viewed)
- Location data (with your explicit consent)
- Interaction data (likes, follows, shares, views)

### Permissions We Request
- **Camera**: To take photos and videos for posts and stories
- **Microphone**: To record voice notes and live audio
- **Photo Library**: To upload existing photos and videos
- **Location**: To tag posts and find nearby users (optional)
- **Contacts**: To find friends on VibeSync (optional)
- **Notifications**: To send you updates and messages

## Purpose of Processing

We process your personal information for the following purposes:
- Provide, maintain, and improve our services
- Create and manage your account
- Enable communication between users
- Personalize your experience and content recommendations
- Send notifications about activity on your account
- Detect and prevent fraud, spam, and abuse
- Comply with legal obligations
- Analyze usage patterns to improve our app

## Legal Basis for Processing

We process your information based on:
- **Consent**: You have given explicit consent
- **Contract**: Necessary to provide our services
- **Legal Obligation**: Required by South African law
- **Legitimate Interest**: For our business operations

## Your POPIA Rights

You have the right to:
- **Access**: Request a copy of your personal information
- **Correction**: Update or correct your information
- **Deletion**: Request deletion of your information
- **Objection**: Object to processing of your information
- **Restriction**: Request restriction of processing
- **Data Portability**: Receive your data in a portable format
- **Withdraw Consent**: Withdraw consent at any time

To exercise these rights, contact our Information Officer at info@vibesync.app.

## Information Sharing

We do NOT sell your personal information. We may share information:

### With Other Users
- Your public profile information (username, bio, profile picture)
- Content you post publicly (posts, comments, stories)
- Your follower/following lists (if public)

### With Service Providers (Operators)
- Cloud hosting providers (AWS, Google Cloud)
- Analytics services (Firebase, Mixpanel)
- Email service providers (SendGrid)
- Payment processors (for future features)

All operators are bound by POPIA-compliant agreements.

### For Legal Reasons
- To comply with South African laws and regulations
- To protect our rights, privacy, safety, or property
- In connection with a merger, acquisition, or sale of assets

## Cross-Border Data Transfers

Your data may be transferred outside South Africa. We ensure adequate protection through:
- Ensuring recipient countries have adequate data protection laws
- Contractual agreements with data processors
- Your explicit consent where required

## Data Security

We implement industry-standard security measures:
- Encryption of data in transit (HTTPS/TLS)
- Encrypted password storage (bcrypt)
- Secure token-based authentication (JWT)
- Regular security audits
- Access controls and monitoring
- Integrity and confidentiality safeguards

## Data Retention

We retain your information:
- **Active Accounts**: As long as your account is active
- **Deleted Accounts**: 30 days after deletion (for recovery)
- **Legal Requirements**: Longer if required by law
- **Stories/Status**: Automatically deleted after 24 hours
- **Messages**: Until you delete them

We do not retain information longer than necessary for the purpose.

## Children's Privacy

VibeSync is not intended for users under 18 years old without parental consent. We do not knowingly collect information from children under 13. If we discover we have collected such information, we will delete it immediately.

## Direct Marketing

We may send you marketing communications with your consent. You can opt-out at any time by:
- Clicking unsubscribe in emails
- Adjusting notification settings in the app
- Contacting us at privacy@vibesync.app

## Information Officer

Our Information Officer is responsible for POPIA compliance:

**Name**: [Information Officer Name]  
**Email**: info@vibesync.app  
**Phone**: [Phone Number]  
**Address**: [Physical Address]

## Complaints

If you believe we have violated POPIA, you can:
1. Contact our Information Officer
2. Lodge a complaint with the Information Regulator:
   - Website: https://www.justice.gov.za/inforeg/
   - Email: inforeg@justice.gov.za
   - Phone: 012 406 4818

## Changes to This Policy

We will notify you of material changes via:
- In-app notification
- Email notification
- Update to "Last Updated" date

## Contact Us

**Information Officer**: info@vibesync.app  
**Privacy Inquiries**: privacy@vibesync.app  
**Address**: [Your South African Address]

---

**By using VibeSync, you agree to this Privacy Policy.**`,

    termsOfService: `# Terms of Service (South Africa)

**Last Updated: January 13, 2025**

## 1. Acceptance of Terms

By accessing or using VibeSync ("the App"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, do not use the App.

## 2. Eligibility

- You must be at least 13 years old to use VibeSync
- If you are under 18, you must have parental consent
- You must provide accurate and complete registration information
- You are responsible for maintaining the security of your account

## 3. User Accounts

### Account Creation
- You must create an account to use most features
- One person may not maintain more than one account
- You may not impersonate others or create fake accounts
- You are responsible for all activity on your account

### Account Security
- Keep your password confidential
- Notify us immediately of unauthorized access
- We are not liable for losses from unauthorized account use

### Account Termination
- You may delete your account at any time
- We may suspend or terminate accounts that violate these Terms
- We reserve the right to refuse service to anyone

## 4. User Content

### Your Content
- You retain ownership of content you post
- You grant us a worldwide, non-exclusive, royalty-free license to use, display, and distribute your content
- You are responsible for your content and its legality
- You represent that you have rights to post your content

### Prohibited Content
You may NOT post content that:
- Is illegal, harmful, or violates others' rights
- Contains hate speech, harassment, or bullying
- Is sexually explicit or pornographic
- Promotes violence or dangerous activities
- Contains spam, scams, or malware
- Infringes intellectual property rights
- Impersonates others or is misleading
- Violates privacy or shares personal information without consent

### Content Moderation
- We may remove content that violates these Terms
- We may use automated systems to detect violations
- We are not obligated to monitor all content
- Removal decisions are at our discretion

## 5. Acceptable Use

You agree NOT to:
- Violate any South African laws or regulations
- Harass, abuse, or harm others
- Spam or send unsolicited messages
- Scrape, crawl, or use bots on the App
- Reverse engineer or decompile the App
- Interfere with the App's operation
- Access others' accounts without permission
- Collect user data without consent
- Use the App for commercial purposes without authorization

## 6. Intellectual Property

### Our Rights
- VibeSync and its content are protected by South African copyright and trademark laws
- Our logo, design, and features are our property
- You may not use our intellectual property without permission

### Copyright Infringement
- We respect intellectual property rights
- Report copyright violations to dmca@vibesync.app
- We will remove infringing content and may terminate repeat offenders

## 7. Privacy and POPIA Compliance

Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your information in accordance with POPIA. By using VibeSync, you agree to our Privacy Policy.

## 8. Consumer Protection

We comply with the Consumer Protection Act (CPA). You have rights under the CPA including:
- Right to fair and honest dealing
- Right to information in plain language
- Right to fair value and good quality
- Right to safe products

## 9. Disclaimers

### "AS IS" Service
- VibeSync is provided "as is" without warranties
- We do not guarantee uninterrupted or error-free service
- We do not guarantee accuracy or reliability of content

### User Interactions
- We are not responsible for user conduct or content
- You interact with other users at your own risk
- We do not endorse user content or opinions

## 10. Limitation of Liability

To the extent permitted by South African law:
- We are not liable for indirect, incidental, or consequential damages
- We are not liable for user content or conduct
- We are not liable for service interruptions or data loss

Nothing in these Terms excludes or limits our liability for:
- Death or personal injury caused by negligence
- Fraud or fraudulent misrepresentation
- Any liability that cannot be excluded under South African law

## 11. Dispute Resolution

### Governing Law
- These Terms are governed by the laws of South Africa
- Disputes will be resolved in South African courts

### Informal Resolution
- Contact us first to resolve disputes informally
- Email: legal@vibesync.app

### Alternative Dispute Resolution
- Disputes may be referred to mediation or arbitration
- AFSA (Arbitration Foundation of Southern Africa) rules apply

## 12. Electronic Communications Act

We comply with the Electronic Communications and Transactions Act (ECTA). Electronic communications and signatures are valid and enforceable.

## 13. Changes to Terms

- We may modify these Terms at any time
- We will notify you of material changes
- Continued use after changes constitutes acceptance
- If you don't agree to changes, stop using the App

## 14. Contact Information

**Legal Inquiries**: legal@vibesync.app  
**Support**: support@vibesync.app  
**Information Officer**: info@vibesync.app  
**Address**: [Your South African Address]

---

**By using VibeSync, you agree to these Terms of Service.**`
  };
}

function getDefaultContent(): LegalContent {
  return {
    privacyPolicy: `# Privacy Policy

**Last Updated: January 13, 2025**

## Introduction

VibeSync ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application.

## Information We Collect

### Personal Information
- **Account Information**: Username, email address, password (encrypted), profile picture, bio
- **Profile Data**: Display name, location, date of birth
- **Contact Information**: Phone number (optional)

### Content You Create
- Posts, comments, messages, stories, and status updates
- Photos, videos, and voice recordings you upload
- Live streaming content

### Usage Information
- Device information (model, OS version, unique identifiers)
- Log data (IP address, access times, pages viewed)
- Location data (with your permission)
- Interaction data (likes, follows, shares, views)

### Permissions We Request
- **Camera**: To take photos and videos for posts and stories
- **Microphone**: To record voice notes and live audio
- **Photo Library**: To upload existing photos and videos
- **Location**: To tag posts and find nearby users (optional)
- **Contacts**: To find friends on VibeSync (optional)
- **Notifications**: To send you updates and messages

## How We Use Your Information

We use your information to:
- Provide, maintain, and improve our services
- Create and manage your account
- Enable communication between users
- Personalize your experience and content recommendations
- Send notifications about activity on your account
- Detect and prevent fraud, spam, and abuse
- Comply with legal obligations
- Analyze usage patterns to improve our app

## Information Sharing

We do NOT sell your personal information. We may share information:

### With Other Users
- Your public profile information (username, bio, profile picture)
- Content you post publicly (posts, comments, stories)
- Your follower/following lists (if public)

### With Service Providers
- Cloud hosting providers (AWS, Google Cloud)
- Analytics services (Firebase, Mixpanel)
- Email service providers (SendGrid)
- Payment processors (for future features)

### For Legal Reasons
- To comply with laws, regulations, or legal requests
- To protect our rights, privacy, safety, or property
- In connection with a merger, acquisition, or sale of assets

## Data Security

We implement industry-standard security measures:
- Encryption of data in transit (HTTPS/TLS)
- Encrypted password storage (bcrypt)
- Secure token-based authentication (JWT)
- Regular security audits
- Access controls and monitoring

However, no method of transmission over the internet is 100% secure.

## Your Rights and Choices

You have the right to:
- **Access**: Request a copy of your personal data
- **Correction**: Update or correct your information
- **Deletion**: Request deletion of your account and data
- **Portability**: Export your data in a machine-readable format
- **Opt-Out**: Disable notifications, location tracking, or contact syncing
- **Restrict Processing**: Limit how we use your data

To exercise these rights, contact us at privacy@vibesync.app

## Data Retention

We retain your information:
- **Active Accounts**: As long as your account is active
- **Deleted Accounts**: 30 days after deletion (for recovery)
- **Legal Requirements**: Longer if required by law
- **Stories/Status**: Automatically deleted after 24 hours
- **Messages**: Until you delete them

## Children's Privacy

VibeSync is not intended for users under 13 years old. We do not knowingly collect information from children under 13. If we discover we have collected such information, we will delete it immediately.

## International Data Transfers

Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place for such transfers.

## Changes to This Policy

We may update this Privacy Policy from time to time. We will notify you of significant changes via:
- In-app notification
- Email notification
- Update to "Last Updated" date

Continued use of VibeSync after changes constitutes acceptance.

## Contact Us

**Email**: privacy@vibesync.app  
**Support**: In-app Help & Support section

---

**By using VibeSync, you agree to this Privacy Policy.**`,

    termsOfService: `# Terms of Service

**Last Updated: January 13, 2025**

## 1. Acceptance of Terms

By accessing or using VibeSync ("the App"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, do not use the App.

## 2. Eligibility

- You must be at least 13 years old to use VibeSync
- If you are under 18, you must have parental consent
- You must provide accurate and complete registration information
- You are responsible for maintaining the security of your account

## 3. User Accounts

### Account Creation
- You must create an account to use most features
- One person may not maintain more than one account
- You may not impersonate others or create fake accounts
- You are responsible for all activity on your account

### Account Security
- Keep your password confidential
- Notify us immediately of unauthorized access
- We are not liable for losses from unauthorized account use

### Account Termination
- You may delete your account at any time
- We may suspend or terminate accounts that violate these Terms
- We reserve the right to refuse service to anyone

## 4. User Content

### Your Content
- You retain ownership of content you post
- You grant us a worldwide, non-exclusive, royalty-free license to use, display, and distribute your content
- You are responsible for your content and its legality
- You represent that you have rights to post your content

### Prohibited Content
You may NOT post content that:
- Is illegal, harmful, or violates others' rights
- Contains hate speech, harassment, or bullying
- Is sexually explicit or pornographic
- Promotes violence or dangerous activities
- Contains spam, scams, or malware
- Infringes intellectual property rights
- Impersonates others or is misleading
- Violates privacy or shares personal information without consent

### Content Moderation
- We may remove content that violates these Terms
- We may use automated systems to detect violations
- We are not obligated to monitor all content
- Removal decisions are at our discretion

## 5. Acceptable Use

You agree NOT to:
- Violate any laws or regulations
- Harass, abuse, or harm others
- Spam or send unsolicited messages
- Scrape, crawl, or use bots on the App
- Reverse engineer or decompile the App
- Interfere with the App's operation
- Access others' accounts without permission
- Collect user data without consent
- Use the App for commercial purposes without authorization

## 6. Intellectual Property

### Our Rights
- VibeSync and its content are protected by copyright, trademark, and other laws
- Our logo, design, and features are our property
- You may not use our intellectual property without permission

### Copyright Infringement
- We respect intellectual property rights
- Report copyright violations to dmca@vibesync.app
- We will remove infringing content and may terminate repeat offenders

## 7. Privacy

Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your information. By using VibeSync, you agree to our Privacy Policy.

## 8. Disclaimers

### "AS IS" Service
- VibeSync is provided "as is" without warranties
- We do not guarantee uninterrupted or error-free service
- We do not guarantee accuracy or reliability of content

### User Interactions
- We are not responsible for user conduct or content
- You interact with other users at your own risk
- We do not endorse user content or opinions

## 9. Limitation of Liability

To the maximum extent permitted by law:
- We are not liable for indirect, incidental, or consequential damages
- Our total liability is limited to $100 or the amount you paid us (if any)
- We are not liable for user content or conduct
- We are not liable for service interruptions or data loss

## 10. Dispute Resolution

### Governing Law
- These Terms are governed by applicable law
- Disputes will be resolved in appropriate courts

### Informal Resolution
- Contact us first to resolve disputes informally
- Email: legal@vibesync.app

## 11. Changes to Terms

- We may modify these Terms at any time
- We will notify you of material changes
- Continued use after changes constitutes acceptance
- If you don't agree to changes, stop using the App

## 12. Contact Information

**Legal Inquiries**: legal@vibesync.app  
**Support**: support@vibesync.app

---

**By using VibeSync, you agree to these Terms of Service.**`
  };
}
