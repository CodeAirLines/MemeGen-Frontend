# State Management Architecture (Zustand)

## Overview
This platform uses **Zustand** for lightweight, performant, and type-safe client-side state management. We strictly adhere to the principle of storing only truly shared or cross-cutting state in global stores, keeping transient component state local with React `useState`.

## Stores Implemented for Day 1

### 1. `useTemplateStore` (`src/stores/useTemplateStore.ts`)
- **Purpose**: Manages the user's template selection, active category filters, search query, and template preview modal state.
- **Why Global?**:
  - Allows Hero CTAs and search inputs to seamlessly drive the Template Gallery filtering.
  - Holds `selectedTemplate` to enable immediate handoff to the meme editor without prop drilling across layout hierarchies.
  - Powers the template quick-preview modal without re-rendering parent components unnecessarily.

---

## Planned Stores for Day 2 (Meme Editor Implementation)

### 2. `useEditorStore` (Planned Specification)
To be created on Day 2 for real-time canvas manipulations:

```typescript
interface EditorStore {
  // Current Canvas & Background
  template: MemeTemplate | null;
  canvasWidth: number;
  canvasHeight: number;
  zoom: number;
  
  // Layer Management
  textLayers: Array<{
    id: string;
    text: string;
    xPercent: number;
    yPercent: number;
    fontSize: number;
    fontFamily: string;
    color: string;
    strokeColor: string;
    strokeWidth: number;
    isBold: boolean;
    isUppercase: boolean;
    alignment: 'left' | 'center' | 'right';
  }>;
  selectedLayerId: string | null;
  
  // History & Undo/Redo
  history: {
    past: TextLayer[][];
    future: TextLayer[][];
  };
  
  // Actions
  setTemplate: (template: MemeTemplate) => void;
  addTextLayer: (initialText?: string) => void;
  updateTextLayer: (id: string, updates: Partial<TextLayer>) => void;
  removeTextLayer: (id: string) => void;
  selectLayer: (id: string | null) => void;
  undo: () => void;
  redo: () => void;
  resetEditor: () => void;
}
```

### 3. Guidelines
- Avoid putting large binary image blobs directly in Zustand state. Store URLs or object URLs.
- Debounce high-frequency canvas drag operations if updating state on every micro-pixel.
- Local form validation inside modals remains in component state.
