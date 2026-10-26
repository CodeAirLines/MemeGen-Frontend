import type { TextLayer, CanvasSettings } from './editor';
import type { MemeTemplate } from './template';

export interface MemeDraft {
  id: string;
  title: string;
  template: MemeTemplate;
  textLayers: TextLayer[];
  canvasSettings?: CanvasSettings;
  previewUrl?: string;
  createdAt: string; // ISO 8601 string
  updatedAt: string; // ISO 8601 string
}

export type DraftSortOption = 'recently-edited' | 'oldest' | 'name-asc' | 'name-desc';

export interface DraftFilterState {
  searchQuery: string;
  sortBy: DraftSortOption;
}
