import { create } from 'zustand';
import type { MemeTemplate, TemplateCategory } from '../types/template';

interface TemplateState {
  // Active template selected by creator to carry over to the Editor (Day 2 handoff)
  selectedTemplate: MemeTemplate | null;
  
  // Gallery search and filter state shared across components (e.g. Hero search -> Gallery grid)
  searchQuery: string;
  activeCategory: TemplateCategory;
  
  // Preview modal state
  previewTemplate: MemeTemplate | null;
  isPreviewOpen: boolean;

  // Feedback notifications (e.g., when a template is queued for editor)
  notification: { message: string; type: 'info' | 'success' } | null;

  // Actions
  setSelectedTemplate: (template: MemeTemplate | null) => void;
  setSearchQuery: (query: string) => void;
  setActiveCategory: (category: TemplateCategory) => void;
  openPreview: (template: MemeTemplate) => void;
  closePreview: () => void;
  setNotification: (notification: { message: string; type: 'info' | 'success' } | null) => void;
  resetFilters: () => void;
}

export const useTemplateStore = create<TemplateState>((set) => ({
  selectedTemplate: null,
  searchQuery: '',
  activeCategory: 'all',
  previewTemplate: null,
  isPreviewOpen: false,
  notification: null,

  setSelectedTemplate: (template) =>
    set({
      selectedTemplate: template,
      notification: template
        ? {
            message: `Selected "${template.name}". Ready for editor customization!`,
            type: 'success',
          }
        : null,
    }),

  setSearchQuery: (query) => set({ searchQuery: query }),

  setActiveCategory: (category) => set({ activeCategory: category }),

  openPreview: (template) =>
    set({
      previewTemplate: template,
      isPreviewOpen: true,
    }),

  closePreview: () =>
    set({
      previewTemplate: null,
      isPreviewOpen: false,
    }),

  setNotification: (notification) => set({ notification }),

  resetFilters: () =>
    set({
      searchQuery: '',
      activeCategory: 'all',
    }),
}));
