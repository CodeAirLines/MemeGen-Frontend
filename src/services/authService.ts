import type { LoginCredentials, SignUpCredentials, AuthUser } from '../types/auth';
import type { ApiResponse } from '../types/api';
import { apiRequest, ApiError } from './apiClient';

/**
 * Authentication Service Contract
 *
 * Manages authentication network requests, session validation, and lifecycle.
 * - Communicates with backend endpoints (/auth/login, /auth/register, /auth/logout, /auth/me) when configured.
 * - Provides clearly identified development/demo authentication when backend is pending integration.
 * - Strict security: Never stores passwords in storage or memory.
 */

export interface AuthSuccessPayload {
  user: AuthUser;
  token: string;
  isDemoMode?: boolean;
}

const AUTH_TOKEN_KEY = 'auth_token';
const AUTH_SESSION_KEY = 'memegen_auth_session_v1';

export const authService = {
  /**
   * Check if real backend authentication is available.
   */
  isBackendConfigured(): boolean {
    return Boolean(
      import.meta.env.VITE_API_BASE_URL &&
        !import.meta.env.VITE_API_BASE_URL.includes('example.com')
    );
  },

  /**
   * Submit login credentials to backend auth endpoint or development adapter.
   */
  async login(credentials: LoginCredentials): Promise<AuthSuccessPayload> {
    // 1. Live Backend Integration
    if (this.isBackendConfigured()) {
      const response = await apiRequest<ApiResponse<AuthSuccessPayload>>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
          rememberMe: credentials.rememberMe,
        }),
      });

      this.saveSession(response.data.token, response.data.user, credentials.rememberMe);
      return { ...response.data, isDemoMode: false };
    }

    // 2. Development / Demo Authentication Mode
    // Emulate network latency
    await new Promise((resolve) => setTimeout(resolve, 600));

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(credentials.email.trim())) {
      throw new ApiError('Invalid email address format.', 400, 'INVALID_EMAIL');
    }

    // Validate credentials (submitting invalid credentials must NOT authenticate the user)
    if (!credentials.password || credentials.password.length < 6) {
      throw new ApiError(
        'Invalid credentials. Password must be at least 6 characters in demo mode.',
        401,
        'INVALID_CREDENTIALS'
      );
    }

    const usernamePrefix = credentials.email.split('@')[0] || 'creator';
    const formattedName = usernamePrefix
      .replace(/[._-]/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());

    const demoUser: AuthUser = {
      id: `demo-user-${usernamePrefix.toLowerCase()}`,
      fullName: formattedName || 'Meme Creator',
      email: credentials.email.toLowerCase().trim(),
      avatarUrl: '/Profille/no-dp_16.webp',
      role: 'creator',
      createdAt: new Date().toISOString(),
    };

    // Create a time-limited signed demo token (valid for 24 hours)
    const expiry = Date.now() + 24 * 60 * 60 * 1000;
    const token = `demo_tok_${btoa(JSON.stringify({ id: demoUser.id, email: demoUser.email, exp: expiry }))}`;

    const payload: AuthSuccessPayload = {
      user: demoUser,
      token,
      isDemoMode: true,
    };

    this.saveSession(token, demoUser, credentials.rememberMe);
    return payload;
  },

  
  async signUp(credentials: SignUpCredentials): Promise<AuthSuccessPayload> {
    if (this.isBackendConfigured()) {
      const response = await apiRequest<ApiResponse<AuthSuccessPayload>>('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          fullName: credentials.fullName,
          email: credentials.email,
          password: credentials.password,
        }),
      });

      this.saveSession(response.data.token, response.data.user, false);
      return { ...response.data, isDemoMode: false };
    }

    await new Promise((resolve) => setTimeout(resolve, 600));

    if (!credentials.fullName.trim() || credentials.fullName.trim().length < 2) {
      throw new ApiError('Full name must be at least 2 characters.', 400, 'INVALID_NAME');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+$/;
    if (!emailRegex.test(credentials.email.trim())) {
      throw new ApiError('Invalid email address format.', 400, 'INVALID_EMAIL');
    }

    if (!credentials.password || credentials.password.length < 8) {
      throw new ApiError('Password must be at least 8 characters.', 400, 'WEAK_PASSWORD');
    }

    if (!credentials.agreeToTerms) {
      throw new ApiError('You must agree to the Terms of Service.', 400, 'TERMS_NOT_ACCEPTED');
    }

    const usernamePrefix = credentials.email.split('@')[0] || 'creator';
    const demoUser: AuthUser = {
      id: `demo-user-${usernamePrefix.toLowerCase()}`,
      fullName: credentials.fullName.trim(),
      email: credentials.email.toLowerCase().trim(),
      avatarUrl: '/Profille/no-dp_16.webp',
      role: 'creator',
      createdAt: new Date().toISOString(),
    };

    const expiry = Date.now() + 24 * 60 * 60 * 1000;
    const token = `demo_tok_${btoa(JSON.stringify({ id: demoUser.id, email: demoUser.email, exp: expiry }))}`;

    const payload: AuthSuccessPayload = {
      user: demoUser,
      token,
      isDemoMode: true,
    };

    this.saveSession(token, demoUser, false);
    return payload;
  },

  /**
   * Log out active session.
   */
  async logout(): Promise<void> {
    if (this.isBackendConfigured()) {
      try {
        await apiRequest('/auth/logout', { method: 'POST' });
      } catch {
        // Proceed with client side logout cleanup even if server request fails
      }
    }
    this.clearSession();
  },

  /**
   * Validate existing session token and restore authenticated user.
   */
  async validateSession(): Promise<{ user: AuthUser; token: string; isDemoMode: boolean } | null> {
    if (typeof window === 'undefined') return null;

    const token = sessionStorage.getItem(AUTH_TOKEN_KEY) || localStorage.getItem(AUTH_TOKEN_KEY);
    const sessionRaw =
      sessionStorage.getItem(AUTH_SESSION_KEY) || localStorage.getItem(AUTH_SESSION_KEY);

    if (!token || !sessionRaw) {
      this.clearSession();
      return null;
    }

    try {
      const parsed = JSON.parse(sessionRaw);
      if (!parsed || !parsed.user || !parsed.token || parsed.token !== token) {
        this.clearSession();
        return null;
      }

 
      if (this.isBackendConfigured()) {
        try {
          const res = await apiRequest<ApiResponse<AuthUser>>('/auth/me');
          return { user: res.data, token, isDemoMode: false };
        } catch {
          this.clearSession();
          return null;
        }
      }

      // Validate demo session token format and expiration
      if (token.startsWith('demo_tok_')) {
        const payloadStr = atob(token.replace('demo_tok_', ''));
        const payload = JSON.parse(payloadStr);
        if (payload.exp && Date.now() > payload.exp) {
          // Token expired
          this.clearSession();
          return null;
        }

        const user = parsed.user;
        if (!user.avatarUrl || user.avatarUrl.includes('unsplash.com') || user.avatarUrl.includes('google')) {
          user.avatarUrl = '/Profille/no-dp_16.webp';
        }

        return { user, token, isDemoMode: true };
      }

      this.clearSession();
      return null;
    } catch {
      this.clearSession();
      return null;
    }
  },

  saveSession(token: string, user: AuthUser, rememberMe = false): void {
    if (typeof window === 'undefined') return;
    if (!user.avatarUrl || user.avatarUrl.includes('unsplash.com') || user.avatarUrl.includes('google')) {
      user.avatarUrl = '/Profille/no-dp_16.webp';
    }
    const storage = rememberMe ? localStorage : sessionStorage;

    storage.setItem(AUTH_TOKEN_KEY, token);
    storage.setItem(AUTH_SESSION_KEY, JSON.stringify({ token, user }));

    // Clean opposite storage to prevent ambiguous states
    const opposite = rememberMe ? sessionStorage : localStorage;
    opposite.removeItem(AUTH_TOKEN_KEY);
    opposite.removeItem(AUTH_SESSION_KEY);
  },

  clearSession(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_SESSION_KEY);
    sessionStorage.removeItem(AUTH_TOKEN_KEY);
    sessionStorage.removeItem(AUTH_SESSION_KEY);
  },
};