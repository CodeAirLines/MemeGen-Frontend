/**
 * Authentication type definitions for MemeHub frontend.
 * Designed to align with future backend integration with Nithish's auth endpoints.
 */

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface SignUpCredentials {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  avatarUrl?: string;
  role?: 'creator' | 'pro' | 'admin';
  createdAt?: string;
}

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface FormValidationErrors {
  fullName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  agreeToTerms?: string;
  general?: string;
}

export type PasswordStrengthLevel = 'weak' | 'fair' | 'good' | 'strong';

export interface PasswordStrengthResult {
  score: number; // 0 to 4
  level: PasswordStrengthLevel;
  label: string;
  hasMinLength: boolean;
  hasNumberOrSymbol: boolean;
  hasMixedCase: boolean;
}
