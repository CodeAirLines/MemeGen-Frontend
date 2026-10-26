import { create } from 'zustand';
import type { UserProfile, ProfileUpdatePayload } from '../types/profile';
import type { AuthUser } from '../types/auth';
import { profileStorage } from '../services/profileStorage';
import { useAuthStore } from './useAuthStore';

interface ProfileStoreState {
  profile: UserProfile | null;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  isEditModalOpen: boolean;

  // Actions
  initProfileForUser: (user: AuthUser) => Promise<void>;
  fetchProfile: () => Promise<void>;
  updateProfile: (payload: ProfileUpdatePayload) => Promise<UserProfile>;
  clearProfile: () => void;
  setIsEditModalOpen: (open: boolean) => void;
}

export const useProfileStore = create<ProfileStoreState>((set) => ({
  profile: null,
  isLoading: false,
  isSaving: false,
  error: null,
  isEditModalOpen: false,

  initProfileForUser: async (user: AuthUser) => {
    set({ isLoading: true, error: null });
    try {
      const data = await profileStorage.getProfile(user);
      set({ profile: data, isLoading: false });
    } catch (err) {
      set({
        isLoading: false,
        error: err instanceof Error ? err.message : 'Failed to retrieve profile.',
      });
    }
  },

  fetchProfile: async () => {
    const currentUser = useAuthStore.getState().user;
    if (!currentUser) {
      set({ profile: null, isLoading: false });
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const data = await profileStorage.getProfile(currentUser);
      set({ profile: data, isLoading: false });
    } catch (err) {
      set({
        isLoading: false,
        error: err instanceof Error ? err.message : 'Failed to retrieve profile.',
      });
    }
  },

  updateProfile: async (payload: ProfileUpdatePayload) => {
    const currentUser = useAuthStore.getState().user;
    if (!currentUser) {
      throw new Error('You must be logged in to update your profile.');
    }

    set({ isSaving: true, error: null });
    try {
      await new Promise((resolve) => setTimeout(resolve, 350));
      const updated = await profileStorage.updateProfile(payload, currentUser);

      set({ profile: updated, isSaving: false, isEditModalOpen: false });

      // Synchronously update auth store display name & avatar
      useAuthStore.getState().updateCurrentUser({
        fullName: updated.displayName,
        avatarUrl: updated.avatarUrl,
      });

      return updated;
    } catch (err) {
      set({
        isSaving: false,
        error: err instanceof Error ? err.message : 'Failed to update profile.',
      });
      throw err;
    }
  },

  clearProfile: () => {
    profileStorage.clearMemoryProfile();
    set({ profile: null, error: null, isEditModalOpen: false });
  },

  setIsEditModalOpen: (open: boolean) => set({ isEditModalOpen: open }),
}));
