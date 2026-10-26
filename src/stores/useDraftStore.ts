import { create } from 'zustand';
import type { MemeDraft, DraftSortOption } from '../types/draft';
import type { TextLayer, CanvasSettings } from '../types/editor';
import type { MemeTemplate } from '../types/template';
import { draftStorage } from '../services/draftStorage';

interface DraftStoreState {
  drafts: MemeDraft[];
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  sortBy: DraftSortOption;
  activeDraftForRename: MemeDraft | null;
  activeDraftForDelete: MemeDraft | null;

  // Actions
  fetchDrafts: () => Promise<void>;
  saveDraft: (
    title: string,
    template: MemeTemplate,
    textLayers: TextLayer[],
    canvasSettings?: CanvasSettings,
    draftId?: string | null
  ) => Promise<MemeDraft>;
  duplicateDraft: (id: string) => Promise<MemeDraft>;
  renameDraft: (id: string, newTitle: string) => Promise<MemeDraft>;
  deleteDraft: (id: string) => Promise<void>;
  setSearchQuery: (query: string) => void;
  setSortBy: (sort: DraftSortOption) => void;
  setActiveDraftForRename: (draft: MemeDraft | null) => void;
  setActiveDraftForDelete: (draft: MemeDraft | null) => void;
}

export const useDraftStore = create<DraftStoreState>((set, get) => ({
  drafts: [],
  isLoading: false,
  error: null,
  searchQuery: '',
  sortBy: 'recently-edited',
  activeDraftForRename: null,
  activeDraftForDelete: null,

  fetchDrafts: async () => {
    set({ isLoading: true, error: null });
    try {
      const items = await draftStorage.getAll();
      set({ drafts: items, isLoading: false });
    } catch (err) {
      set({
        isLoading: false,
        error: err instanceof Error ? err.message : 'Failed to load drafts from storage.',
      });
    }
  },

  saveDraft: async (title, template, textLayers, canvasSettings, draftId) => {
    try {
      const saved = await draftStorage.save({
        id: draftId || undefined,
        title: title.trim() || `${template.name} Meme`,
        template,
        textLayers: JSON.parse(JSON.stringify(textLayers)),
        canvasSettings: canvasSettings ? JSON.parse(JSON.stringify(canvasSettings)) : undefined,
      });

      // Update state in place
      const current = get().drafts;
      const index = current.findIndex((d) => d.id === saved.id);
      if (index >= 0) {
        const updated = [...current];
        updated[index] = saved;
        set({ drafts: updated });
      } else {
        set({ drafts: [saved, ...current] });
      }

      return saved;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Unable to save draft.');
    }
  },

  duplicateDraft: async (id: string) => {
    try {
      const copy = await draftStorage.duplicate(id);
      set((state) => ({ drafts: [copy, ...state.drafts] }));
      return copy;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Unable to duplicate draft.');
    }
  },

  renameDraft: async (id: string, newTitle: string) => {
    try {
      const updated = await draftStorage.rename(id, newTitle);
      set((state) => ({
        drafts: state.drafts.map((d) => (d.id === id ? updated : d)),
        activeDraftForRename: null,
      }));
      return updated;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Unable to rename draft.');
    }
  },

  deleteDraft: async (id: string) => {
    try {
      await draftStorage.delete(id);
      set((state) => ({
        drafts: state.drafts.filter((d) => d.id !== id),
        activeDraftForDelete: null,
      }));
    } catch (err) {
      throw err instanceof Error ? err : new Error('Unable to delete draft.');
    }
  },

  setSearchQuery: (query) => set({ searchQuery: query }),

  setSortBy: (sort) => set({ sortBy: sort }),

  setActiveDraftForRename: (draft) => set({ activeDraftForRename: draft }),

  setActiveDraftForDelete: (draft) => set({ activeDraftForDelete: draft }),
}));
