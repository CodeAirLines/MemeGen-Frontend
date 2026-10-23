import type { LoginCredentials, SignUpCredentials, AuthUser } from '../types/auth';
import type { ApiResponse } from '../types/api';
import { apiRequest, ApiError } from './apiClient';

/**
 * Authentication Service Contract
 *
 * This module isolates all authentication network requests for MemeHub.
 * Currently configured with strict frontend-only boundaries:
 * - Does NOT store passwords in localStorage, sessionStorage, or persistent stores.
 * - Does NOT pretend authentication succeeded when the backend is not yet connected.
 * - When Nithish deploys the authentication endpoints (/auth/login, /auth/register),
 *   this service will seamlessly communicate with the real backend.
 */

export interface AuthSuccessPayload {
  user: AuthUser;
  token: string;
}

export const authService = {
  /**
   * Submit login credentials to backend auth endpoint.
   * Expected backend contract: POST /auth/login
   * Body: { email, password, rememberMe }
   */
  async login(credentials: LoginCredentials): Promise<AuthSuccessPayload> {
    // If backend is configured, attempt real network request
    const isMockOrUnset =
      !import.meta.env.VITE_API_BASE_URL ||
      import.meta.env.VITE_API_BASE_URL.includes('example.com');

    if (isMockOrUnset) {
      // Emulate realistic network latency before returning service-pending status
      await new Promise((resolve) => setTimeout(resolve, 800));

      throw new ApiError(
        'Authentication backend service is currently pending integration. Real user login will be enabled once the auth API is connected.',
        503,
        'AUTH_BACKEND_PENDING'
      );
    }

    const response = await apiRequest<ApiResponse<AuthSuccessPayload>>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
        rememberMe: credentials.rememberMe,
      }),
    });

    return response.data;
  },

  /**
   * Submit registration payload to backend auth endpoint.
   * Expected backend contract: POST /auth/register
   * Body: { fullName, email, password }
   */
  async signUp(credentials: SignUpCredentials): Promise<AuthSuccessPayload> {
    const isMockOrUnset =
      !import.meta.env.VITE_API_BASE_URL ||
      import.meta.env.VITE_API_BASE_URL.includes('example.com');

    if (isMockOrUnset) {
      await new Promise((resolve) => setTimeout(resolve, 800));

      throw new ApiError(
        'Registration backend service is currently pending integration. Account creation will be enabled once the auth API is connected.',
        503,
        'AUTH_BACKEND_PENDING'
      );
    }

    const response = await apiRequest<ApiResponse<AuthSuccessPayload>>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        fullName: credentials.fullName,
        email: credentials.email,
        password: credentials.password,
      }),
    });

    return response.data;
  },
};
