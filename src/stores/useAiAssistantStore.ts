import { create } from 'zustand';
import type {
  AiCategory,
  AiCaptionSuggestion,
  AiLanguage,
  AiPromptIdea,
  AiTone,
} from '../types/ai';
import { generateAiCaptions, isAiBackendAvailable } from '../services/aiService';

interface AiAssistantState {
  prompt: string;
  tone: AiTone;
  language: AiLanguage;
  selectedCategory: AiCategory | 'all';
  captions: AiCaptionSuggestion[];
  isLoading: boolean;
  error: string | null;
  isDemoMode: boolean;
  copiedCaptionId: string | null;
  hasGeneratedOnce: boolean;

  // Actions
  setPrompt: (prompt: string) => void;
  setTone: (tone: AiTone) => void;
  setLanguage: (language: AiLanguage) => void;
  setSelectedCategory: (category: AiCategory | 'all') => void;
  generateCaptions: () => Promise<void>;
  regenerateCaptions: () => Promise<void>;
  clearAll: () => void;
  selectIdea: (idea: AiPromptIdea) => void;
  copyCaption: (caption: AiCaptionSuggestion) => Promise<boolean>;
}

export const useAiAssistantStore = create<AiAssistantState>((set, get) => ({
  prompt: 'When the code works on localhost but crashes in production',
  tone: 'funny',
  language: 'en',
  selectedCategory: 'all',
  captions: [],
  isLoading: false,
  error: null,
  isDemoMode: !isAiBackendAvailable(),
  copiedCaptionId: null,
  hasGeneratedOnce: false,

  setPrompt: (prompt: string) => {
    set({ prompt, error: null });
  },

  setTone: (tone: AiTone) => {
    set({ tone });
  },

  setLanguage: (language: AiLanguage) => {
    set({ language });
  },

  setSelectedCategory: (selectedCategory: AiCategory | 'all') => {
    set({ selectedCategory });
  },

  generateCaptions: async () => {
    const { prompt, tone, language, selectedCategory, isLoading } = get();
    if (isLoading) return;

    const trimmedPrompt = prompt.trim();
    if (!trimmedPrompt) {
      set({ error: 'Please enter a meme topic, situation, or prompt to generate captions.' });
      return;
    }

    set({ isLoading: true, error: null });

    try {
      const response = await generateAiCaptions({
        prompt: trimmedPrompt,
        tone,
        language,
        category: selectedCategory === 'all' ? undefined : selectedCategory,
      });

      set({
        captions: response.captions,
        isDemoMode: response.isDemo,
        isLoading: false,
        hasGeneratedOnce: true,
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to generate captions. Please try again.';
      set({
        error: message,
        isLoading: false,
      });
    }
  },

  regenerateCaptions: async () => {
    await get().generateCaptions();
  },

  clearAll: () => {
    set({
      prompt: '',
      captions: [],
      error: null,
      hasGeneratedOnce: false,
    });
  },

  selectIdea: (idea: AiPromptIdea) => {
    set({
      prompt: idea.prompt,
      tone: idea.tone,
      language: idea.language,
      selectedCategory: idea.category,
      error: null,
    });
  },

  copyCaption: async (caption: AiCaptionSuggestion) => {
    try {
      const textToCopy = caption.topText && caption.bottomText
        ? `${caption.topText} | ${caption.bottomText}`
        : caption.singleText;

      await navigator.clipboard.writeText(textToCopy);
      set({ copiedCaptionId: caption.id });

      setTimeout(() => {
        if (get().copiedCaptionId === caption.id) {
          set({ copiedCaptionId: null });
        }
      }, 2000);

      return true;
    } catch (e) {
      console.warn('Failed to copy caption to clipboard:', e);
      return false;
    }
  },
}));
