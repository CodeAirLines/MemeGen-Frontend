import type { MemeTemplate } from './template';

export interface TextLayer {
  id: string;
  text: string;
  xPercent: number; // 0 to 100% relative to canvas
  yPercent: number; // 0 to 100% relative to canvas
  fontSize: number; // in pixels (base display scale)
  color: string;
  strokeColor: string;
  strokeWidth: number;
  isBold: boolean;
  isItalic: boolean;
  isUppercase: boolean;
  alignment: 'left' | 'center' | 'right';
  fontFamily: string;
  rotation: number; // degrees -180 to 180
  opacity: number; // 0.0 to 1.0
  shadowColor?: string;
  shadowBlur?: number;
}

export interface CanvasSettings {
  aspectRatio: 'original' | '1:1' | '16:9' | '9:16' | '4:3';
  backgroundColor: string;
  padding: number;
  zoom: number; // 0.5 to 2.5
  fitToScreen: boolean;
  showGrid: boolean;
}

export interface EditorHistoryEntry {
  textLayers: TextLayer[];
  memeTitle: string;
}

export interface EditorState {
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
}
