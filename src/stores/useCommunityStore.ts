import { create } from 'zustand';
import type {
  CommunityPost,
  CommunityFilterState,
  CommunitySortOption,
  PublishMemePayload,
  PostAuthor,
} from '../types/community';
import { communityService } from '../services/communityService';

export interface CommunityStoreState {
  posts: CommunityPost[];
  filters: CommunityFilterState;
  isLoading: boolean;
  error: string | null;
  selectedPostForComments: CommunityPost | null;
  isPublishModalOpen: boolean;
  isPublishing: boolean;
  isSubmittingComment: boolean;
  isDemoMode: boolean;

  // Actions
  fetchPosts: () => Promise<void>;
  setCategory: (category: string) => void;
  setSearchQuery: (query: string) => void;
  setSortBy: (sortBy: CommunitySortOption) => void;
  toggleLikePost: (postId: string, userId?: string) => Promise<boolean>;
  submitComment: (postId: string, content: string, author: PostAuthor) => Promise<void>;
  publishPost: (payload: PublishMemePayload, author: PostAuthor) => Promise<CommunityPost>;
  openCommentsModal: (post: CommunityPost) => void;
  closeCommentsModal: () => void;
  openPublishModal: () => void;
  closePublishModal: () => void;
}

export const useCommunityStore = create<CommunityStoreState>((set, get) => ({
  posts: [],
  filters: {
    category: 'All',
    searchQuery: '',
    sortBy: 'trending',
  },
  isLoading: false,
  error: null,
  selectedPostForComments: null,
  isPublishModalOpen: false,
  isPublishing: false,
  isSubmittingComment: false,
  isDemoMode: true,

  fetchPosts: async () => {
    set({ isLoading: true, error: null });
    try {
      const { filters } = get();
      const res = await communityService.getPosts(filters);
      set({
        posts: res.posts,
        isLoading: false,
        isDemoMode: res.isDemo,
      });

      // Synchronize currently opened comments post if it was updated
      const currentCommentsPost = get().selectedPostForComments;
      if (currentCommentsPost) {
        const updated = res.posts.find((p) => p.id === currentCommentsPost.id);
        if (updated) {
          set({ selectedPostForComments: updated });
        }
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch community posts';
      set({ isLoading: false, error: msg });
    }
  },

  setCategory: (category: string) => {
    set((state) => ({
      filters: { ...state.filters, category },
    }));
    get().fetchPosts();
  },

  setSearchQuery: (searchQuery: string) => {
    set((state) => ({
      filters: { ...state.filters, searchQuery },
    }));
    get().fetchPosts();
  },

  setSortBy: (sortBy: CommunitySortOption) => {
    set((state) => ({
      filters: { ...state.filters, sortBy },
    }));
    get().fetchPosts();
  },

  toggleLikePost: async (postId: string, userId?: string) => {
    const effectiveUserId = userId || 'current-local-user';
    try {
      const { post: updatedPost, isLiked } = await communityService.toggleLike(postId, effectiveUserId);

      // Optimistically update list
      set((state) => ({
        posts: state.posts.map((p) => (p.id === postId ? updatedPost : p)),
        selectedPostForComments:
          state.selectedPostForComments?.id === postId ? updatedPost : state.selectedPostForComments,
      }));

      return isLiked;
    } catch (err) {
      console.error('[useCommunityStore] toggleLike failed', err);
      return false;
    }
  },

  submitComment: async (postId: string, content: string, author: PostAuthor) => {
    set({ isSubmittingComment: true });
    try {
      await communityService.addComment(postId, content, author);
      set({ isSubmittingComment: false });
      // Refresh list to update counts and comment threads
      await get().fetchPosts();
    } catch (err) {
      set({ isSubmittingComment: false });
      throw err;
    }
  },

  publishPost: async (payload: PublishMemePayload, author: PostAuthor) => {
    set({ isPublishing: true });
    try {
      const newPost = await communityService.publishPost(payload, author);
      set({ isPublishing: false, isPublishModalOpen: false });
      // Refresh posts list
      await get().fetchPosts();
      return newPost;
    } catch (err) {
      set({ isPublishing: false });
      throw err;
    }
  },

  openCommentsModal: (post: CommunityPost) => {
    set({ selectedPostForComments: post });
  },

  closeCommentsModal: () => {
    set({ selectedPostForComments: null });
  },

  openPublishModal: () => {
    set({ isPublishModalOpen: true });
  },

  closePublishModal: () => {
    set({ isPublishModalOpen: false });
  },
}));
