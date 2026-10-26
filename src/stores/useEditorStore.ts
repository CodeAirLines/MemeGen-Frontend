import { create } from 'zustand';
import type { TextLayer, CanvasSettings, EditorHistoryEntry } from '../types/editor';
import type { MemeTemplate } from '../types/template';
import type { MemeDraft } from '../types/draft';
import { POPULAR_TEMPLATES } from '../constants/templates';

const MAX_HISTORY = 30;

function createDefaultLayers(template: MemeTemplate): TextLayer[] {
  if (template.defaultTextSlots && template.defaultTextSlots.length > 0) {
    return template.defaultTextSlots.map((slot, index) => ({
      id: `layer-${index + 1}-${Math.random().toString(36).slice(2, 7)}`,
      text: slot.placeholder,
      xPercent: 50,
      yPercent: slot.defaultYPercent,
      fontSize: 36,
      color: '#FFFFFF',
      strokeColor: '#000000',
      strokeWidth: 3,
      isBold: true,
      isItalic: false,
      isUppercase: true,
      alignment: 'center',
      fontFamily: 'Impact',
      rotation: 0,
      opacity: 1,
    }));
  }

  // Fallback top & bottom
  return [
    {
      id: `layer-top-${Math.random().toString(36).slice(2, 7)}`,
      text: 'TOP CAPTION',
      xPercent: 50,
      yPercent: 12,
      fontSize: 36,
      color: '#FFFFFF',
      strokeColor: '#000000',
      strokeWidth: 3,
      isBold: true,
      isItalic: false,
      isUppercase: true,
      alignment: 'center',
      fontFamily: 'Impact',
      rotation: 0,
      opacity: 1,
    },
    {
      id: `layer-bottom-${Math.random().toString(36).slice(2, 7)}`,
      text: 'BOTTOM CAPTION',
      xPercent: 50,
      yPercent: 88,
      fontSize: 36,
      color: '#FFFFFF',
      strokeColor: '#000000',
      strokeWidth: 3,
      isBold: true,
      isItalic: false,
      isUppercase: true,
      alignment: 'center',
      fontFamily: 'Impact',
      rotation: 0,
      opacity: 1,
    },
  ];
}

interface EditorStoreState {
  activeTemplate: MemeTemplate | null;
  memeTitle: string;
  textLayers: TextLayer[];
  selectedLayerId: string | null;
  canvasSettings: CanvasSettings;
  history: {
    past: EditorHistoryEntry[];
    future: EditorHistoryEntry[];
  };
  isExporting: boolean;
  exportFormat: 'png' | 'jpeg' | 'webp';
  isResetModalOpen: boolean;
  isTemplatePickerOpen: boolean;
  currentDraftId: string | null;

  // Actions
  loadTemplate: (template: MemeTemplate, preserveCustomText?: boolean) => void;
  loadDraft: (draft: MemeDraft) => void;
  setCurrentDraftId: (id: string | null) => void;
  setMemeTitle: (title: string) => void;
  addTextLayer: (preset?: Partial<TextLayer>) => string;
  updateTextLayer: (id: string, updates: Partial<TextLayer>, recordHistory?: boolean) => void;
  commitHistory: () => void;
  pushHistorySnapshot: (preSnapshot: EditorHistoryEntry) => void;
  selectLayer: (id: string | null) => void;
  deleteTextLayer: (id: string) => void;
  duplicateTextLayer: (id: string) => void;
  moveLayerOrder: (id: string, direction: 'up' | 'down') => void;
  undo: () => void;
  redo: () => void;
  resetToTemplate: () => void;
  setZoom: (zoom: number) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
  toggleFitToScreen: () => void;
  toggleGrid: () => void;
  setIsResetModalOpen: (open: boolean) => void;
  setIsTemplatePickerOpen: (open: boolean) => void;
  setIsExporting: (exporting: boolean) => void;
}

export const useEditorStore = create<EditorStoreState>((set, get) => {
  const initialTemplate = POPULAR_TEMPLATES[0];
  const initialLayers = createDefaultLayers(initialTemplate);

  return {
    activeTemplate: initialTemplate,
    memeTitle: `${initialTemplate.name} Meme`,
    textLayers: initialLayers,
    selectedLayerId: initialLayers[0]?.id || null,
    canvasSettings: {
      aspectRatio: 'original',
      backgroundColor: '#020617',
      padding: 0,
      zoom: 1,
      fitToScreen: true,
      showGrid: false,
    },
    history: {
      past: [],
      future: [],
    },
    isExporting: false,
    exportFormat: 'png',
    isResetModalOpen: false,
    isTemplatePickerOpen: false,
    currentDraftId: null,

    loadTemplate: (template, preserveCustomText = false) => {
      const state = get();
      const currentLayers = preserveCustomText && state.textLayers.length > 0
        ? state.textLayers
        : createDefaultLayers(template);

      set({
        activeTemplate: template,
        memeTitle: `${template.name} Meme`,
        textLayers: currentLayers,
        selectedLayerId: currentLayers[0]?.id || null,
        currentDraftId: null,
        history: {
          past: [],
          future: [],
        },
      });
    },

    loadDraft: (draft) => {
      set({
        activeTemplate: draft.template,
        memeTitle: draft.title,
        textLayers: JSON.parse(JSON.stringify(draft.textLayers)),
        selectedLayerId: draft.textLayers[0]?.id || null,
        currentDraftId: draft.id,
        canvasSettings: draft.canvasSettings
          ? { ...get().canvasSettings, ...draft.canvasSettings }
          : get().canvasSettings,
        history: {
          past: [],
          future: [],
        },
      });
    },

    setCurrentDraftId: (id) => {
      set({ currentDraftId: id });
    },


    setMemeTitle: (title) => {
      set({ memeTitle: title });
    },

    addTextLayer: (preset) => {
      const state = get();
      const newId = `layer-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      const newLayer: TextLayer = {
        id: newId,
        text: preset?.text || 'NEW CAPTION',
        xPercent: preset?.xPercent ?? 50,
        yPercent: preset?.yPercent ?? 50,
        fontSize: preset?.fontSize ?? 34,
        color: preset?.color || '#FFFFFF',
        strokeColor: preset?.strokeColor || '#000000',
        strokeWidth: preset?.strokeWidth ?? 3,
        isBold: preset?.isBold ?? true,
        isItalic: preset?.isItalic ?? false,
        isUppercase: preset?.isUppercase ?? true,
        alignment: preset?.alignment || 'center',
        fontFamily: preset?.fontFamily || 'Impact',
        rotation: preset?.rotation ?? 0,
        opacity: preset?.opacity ?? 1,
      };

      const snapshot: EditorHistoryEntry = {
        textLayers: JSON.parse(JSON.stringify(state.textLayers)),
        memeTitle: state.memeTitle,
      };

      set({
        textLayers: [...state.textLayers, newLayer],
        selectedLayerId: newId,
        history: {
          past: [...state.history.past.slice(-MAX_HISTORY + 1), snapshot],
          future: [],
        },
      });

      return newId;
    },

    updateTextLayer: (id, updates, recordHistory = false) => {
      const state = get();
      let newPast = state.history.past;

      if (recordHistory) {
        const snapshot: EditorHistoryEntry = {
          textLayers: JSON.parse(JSON.stringify(state.textLayers)),
          memeTitle: state.memeTitle,
        };
        newPast = [...state.history.past.slice(-MAX_HISTORY + 1), snapshot];
      }

      set({
        textLayers: state.textLayers.map((layer) =>
          layer.id === id ? { ...layer, ...updates } : layer
        ),
        history: recordHistory
          ? { past: newPast, future: [] }
          : state.history,
      });
    },

    commitHistory: () => {
      const state = get();
      const lastEntry = state.history.past[state.history.past.length - 1];
      if (
        lastEntry &&
        JSON.stringify(lastEntry.textLayers) === JSON.stringify(state.textLayers) &&
        lastEntry.memeTitle === state.memeTitle
      ) {
        return; // Prevent duplicate history snapshot
      }

      const snapshot: EditorHistoryEntry = {
        textLayers: JSON.parse(JSON.stringify(state.textLayers)),
        memeTitle: state.memeTitle,
      };
      set({
        history: {
          past: [...state.history.past.slice(-MAX_HISTORY + 1), snapshot],
          future: [],
        },
      });
    },

    pushHistorySnapshot: (preSnapshot) => {
      const state = get();
      // Only push if something actually changed between preSnapshot and current state
      if (
        JSON.stringify(preSnapshot.textLayers) === JSON.stringify(state.textLayers) &&
        preSnapshot.memeTitle === state.memeTitle
      ) {
        return; // No-op: prevents unnecessary duplicate snapshot
      }

      set({
        history: {
          past: [...state.history.past.slice(-MAX_HISTORY + 1), preSnapshot],
          future: [],
        },
      });
    },

    selectLayer: (id) => {
      set({ selectedLayerId: id });
    },

    deleteTextLayer: (id) => {
      const state = get();
      const snapshot: EditorHistoryEntry = {
        textLayers: JSON.parse(JSON.stringify(state.textLayers)),
        memeTitle: state.memeTitle,
      };

      const updatedLayers = state.textLayers.filter((l) => l.id !== id);
      const newSelectedId =
        state.selectedLayerId === id
          ? updatedLayers[0]?.id || null
          : state.selectedLayerId;

      set({
        textLayers: updatedLayers,
        selectedLayerId: newSelectedId,
        history: {
          past: [...state.history.past.slice(-MAX_HISTORY + 1), snapshot],
          future: [],
        },
      });
    },

    duplicateTextLayer: (id) => {
      const state = get();
      const target = state.textLayers.find((l) => l.id === id);
      if (!target) return;

      const newId = `layer-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      const duplicated: TextLayer = {
        ...target,
        id: newId,
        xPercent: Math.min(92, target.xPercent + 4),
        yPercent: Math.min(92, target.yPercent + 4),
      };

      const snapshot: EditorHistoryEntry = {
        textLayers: JSON.parse(JSON.stringify(state.textLayers)),
        memeTitle: state.memeTitle,
      };

      set({
        textLayers: [...state.textLayers, duplicated],
        selectedLayerId: newId,
        history: {
          past: [...state.history.past.slice(-MAX_HISTORY + 1), snapshot],
          future: [],
        },
      });
    },

    moveLayerOrder: (id, direction) => {
      const state = get();
      const index = state.textLayers.findIndex((l) => l.id === id);
      if (index === -1) return;

      const newIndex = direction === 'up' ? index + 1 : index - 1;
      if (newIndex < 0 || newIndex >= state.textLayers.length) return;

      const snapshot: EditorHistoryEntry = {
        textLayers: JSON.parse(JSON.stringify(state.textLayers)),
        memeTitle: state.memeTitle,
      };

      const reordered = [...state.textLayers];
      const [item] = reordered.splice(index, 1);
      reordered.splice(newIndex, 0, item);

      set({
        textLayers: reordered,
        history: {
          past: [...state.history.past.slice(-MAX_HISTORY + 1), snapshot],
          future: [],
        },
      });
    },

    undo: () => {
      const state = get();
      if (state.history.past.length === 0) return;

      const previous = state.history.past[state.history.past.length - 1];
      const newPast = state.history.past.slice(0, -1);

      const currentSnapshot: EditorHistoryEntry = {
        textLayers: JSON.parse(JSON.stringify(state.textLayers)),
        memeTitle: state.memeTitle,
      };

      const restoredLayers = JSON.parse(JSON.stringify(previous.textLayers));
      const validSelectedId = restoredLayers.some(
        (l: TextLayer) => l.id === state.selectedLayerId
      )
        ? state.selectedLayerId
        : restoredLayers[0]?.id || null;

      set({
        textLayers: restoredLayers,
        memeTitle: previous.memeTitle,
        selectedLayerId: validSelectedId,
        history: {
          past: newPast,
          future: [currentSnapshot, ...state.history.future.slice(0, MAX_HISTORY - 1)],
        },
      });
    },

    redo: () => {
      const state = get();
      if (state.history.future.length === 0) return;

      const next = state.history.future[0];
      const newFuture = state.history.future.slice(1);

      const currentSnapshot: EditorHistoryEntry = {
        textLayers: JSON.parse(JSON.stringify(state.textLayers)),
        memeTitle: state.memeTitle,
      };

      const restoredLayers = JSON.parse(JSON.stringify(next.textLayers));
      const validSelectedId = restoredLayers.some(
        (l: TextLayer) => l.id === state.selectedLayerId
      )
        ? state.selectedLayerId
        : restoredLayers[0]?.id || null;

      set({
        textLayers: restoredLayers,
        memeTitle: next.memeTitle,
        selectedLayerId: validSelectedId,
        history: {
          past: [...state.history.past.slice(-MAX_HISTORY + 1), currentSnapshot],
          future: newFuture,
        },
      });
    },

    resetToTemplate: () => {
      const state = get();
      if (!state.activeTemplate) return;

      const snapshot: EditorHistoryEntry = {
        textLayers: JSON.parse(JSON.stringify(state.textLayers)),
        memeTitle: state.memeTitle,
      };

      const resetLayers = createDefaultLayers(state.activeTemplate);
      set({
        textLayers: resetLayers,
        memeTitle: `${state.activeTemplate.name} Meme`,
        selectedLayerId: resetLayers[0]?.id || null,
        isResetModalOpen: false,
        history: {
          past: [...state.history.past.slice(-MAX_HISTORY + 1), snapshot],
          future: [],
        },
      });
    },

    setZoom: (zoom) => {
      const clamped = Math.max(0.3, Math.min(2.5, Number(zoom.toFixed(2))));
      set((state) => ({
        canvasSettings: { ...state.canvasSettings, zoom: clamped, fitToScreen: false },
      }));
    },

    zoomIn: () => {
      set((state) => ({
        canvasSettings: {
          ...state.canvasSettings,
          zoom: Math.min(2.5, Number((state.canvasSettings.zoom + 0.15).toFixed(2))),
          fitToScreen: false,
        },
      }));
    },

    zoomOut: () => {
      set((state) => ({
        canvasSettings: {
          ...state.canvasSettings,
          zoom: Math.max(0.3, Number((state.canvasSettings.zoom - 0.15).toFixed(2))),
          fitToScreen: false,
        },
      }));
    },

    resetZoom: () => {
      set((state) => ({
        canvasSettings: { ...state.canvasSettings, zoom: 1, fitToScreen: false },
      }));
    },

    toggleFitToScreen: () => {
      set((state) => ({
        canvasSettings: {
          ...state.canvasSettings,
          fitToScreen: !state.canvasSettings.fitToScreen,
          zoom: 1,
        },
      }));
    },

    toggleGrid: () => {
      set((state) => ({
        canvasSettings: { ...state.canvasSettings, showGrid: !state.canvasSettings.showGrid },
      }));
    },

    setIsResetModalOpen: (open) => {
      set({ isResetModalOpen: open });
    },

    setIsTemplatePickerOpen: (open) => {
      set({ isTemplatePickerOpen: open });
    },

    setIsExporting: (exporting) => {
      set({ isExporting: exporting });
    },
  };
});
