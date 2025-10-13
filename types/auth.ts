export interface AuthUser {
  user_id: string;
  email: string;
  password_hash?: string;
  google_id?: string;
  name: string;
  profile_picture?: string;
  created_at: string;
  updated_at: string;
  email_verified: boolean;
  last_login?: string;
}

export interface RegisterEmailPasswordInput {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  username: string;
}

export interface LoginEmailPasswordInput {
  email: string;
  password: string;
}

export interface GoogleAuthInput {
  idToken: string;
  accessToken: string;
}

export interface GoogleUserInfo {
  sub: string;
  email: string;
  name: string;
  picture?: string;
  email_verified: boolean;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  userId: string;
}

export interface PasswordValidation {
  valid: boolean;
  errors: string[];
  strength: 'weak' | 'medium' | 'strong';
}

export interface ForgotPasswordInput {
  email: string;
}

export interface ResetPasswordInput {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface VerifyEmailInput {
  token: string;
}
