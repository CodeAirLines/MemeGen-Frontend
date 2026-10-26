import type { UserProfile, ProfileUpdatePayload } from '../types/profile';
import type { AuthUser } from '../types/auth';

const BASE_PROFILE_STORAGE_KEY = 'memegen_user_profile_v2';
export const DEFAULT_AVATAR_URL = '/Profille/no-dp_16.webp';

let memoryProfile: UserProfile | null = null;

function isLocalStorageAvailable(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const testKey = '__profile_test__';
    window.localStorage.setItem(testKey, testKey);
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

export const profileStorage = {
  /**
   * Retrieves user profile from storage scoped to the active user.
   */
  async getProfile(user?: AuthUser | null): Promise<UserProfile | null> {
    if (!user) {
      return null;
    }

    const storageKey = `${BASE_PROFILE_STORAGE_KEY}_${user.id}`;
    const defaultProfile: UserProfile = {
      id: user.id,
      displayName: user.fullName || 'Creator',
      username: user.email ? user.email.split('@')[0].toLowerCase() : 'creator',
      email: user.email,
      bio: 'Meme creator, humor architect & visual remixer on MemeGen.',
      avatarUrl:
        user.avatarUrl &&
        !user.avatarUrl.includes('unsplash.com') &&
        !user.avatarUrl.includes('google')
          ? user.avatarUrl
          : DEFAULT_AVATAR_URL,
      role: user.role || 'creator',
      joinedDate: user.createdAt
        ? new Date(user.createdAt).toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric',
          })
        : 'Recent',
      location: 'Global',
      website: `https://memegen.io/@${user.email ? user.email.split('@')[0].toLowerCase() : 'creator'}`,
    };

    if (!isLocalStorageAvailable()) {
      if (!memoryProfile || memoryProfile.id !== user.id) {
        memoryProfile = { ...defaultProfile };
      }
      return { ...memoryProfile };
    }

    try {
      const raw = window.localStorage.getItem(storageKey);
      if (!raw) {
        window.localStorage.setItem(storageKey, JSON.stringify(defaultProfile));
        memoryProfile = { ...defaultProfile };
        return { ...defaultProfile };
      }

      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object' || !parsed.displayName) {
        return { ...defaultProfile };
      }

      const merged: UserProfile = {
        ...defaultProfile,
        ...parsed,
        id: user.id,
        email: user.email, // Always enforce authenticated email
      };

      // Normalize if previous saved profile had external/unsplash/google avatar
      if (
        !merged.avatarUrl ||
        merged.avatarUrl.includes('unsplash.com') ||
        merged.avatarUrl.includes('google')
      ) {
        merged.avatarUrl = DEFAULT_AVATAR_URL;
      }

      memoryProfile = { ...merged };
      return merged;
    } catch {
      return { ...defaultProfile };
    }
  },

  /**
   * Updates profile information in persistent storage scoped to user ID.
   */
  async updateProfile(payload: ProfileUpdatePayload, user: AuthUser): Promise<UserProfile> {
    const current = (await this.getProfile(user)) || {
      id: user.id,
      displayName: user.fullName,
      username: user.email.split('@')[0],
      email: user.email,
      bio: '',
      avatarUrl: user.avatarUrl || DEFAULT_AVATAR_URL,
      role: user.role || 'creator',
      joinedDate: 'Recent',
    };

    const updated: UserProfile = {
      ...current,
      displayName: payload.displayName.trim(),
      username: payload.username.trim().toLowerCase(),
      bio: payload.bio.trim(),
      avatarUrl: payload.avatarUrl || current.avatarUrl || DEFAULT_AVATAR_URL,
      location: payload.location ? payload.location.trim() : current.location,
      website: payload.website ? payload.website.trim() : current.website,
    };

    const storageKey = `${BASE_PROFILE_STORAGE_KEY}_${user.id}`;
    if (isLocalStorageAvailable()) {
      try {
        window.localStorage.setItem(storageKey, JSON.stringify(updated));
      } catch (err) {
        console.warn('Unable to persist profile update to localStorage:', err);
      }
    }

    memoryProfile = { ...updated };
    return updated;
  },

  /**
   * Clears memory cache on logout.
   */
  clearMemoryProfile(): void {
    memoryProfile = null;
  },
};
