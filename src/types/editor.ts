import type { MemeTemplate } from './template';

export interface TextLayer {
  id: string;
  text: string;
  xPercent: number; // 0 to 100% relative to canvas
  yPercent: number; // 0 to 100% relative to canvas
  fontSize: number; // in pixels
  color: string;
  strokeColor: string;
  strokeWidth: number;
  isBold: boolean;
  isItalic: boolean;
  isUppercase: boolean;
  alignment: 'left' | 'center' | 'right';
  fontFamily: string;
  rotation: number;
}

export interface CanvasSettings {
  aspectRatio: 'original' | '1:1' | '16:9' | '9:16' | '4:3';
  backgroundColor: string;
  padding: number;
  zoom: number;
}

export interface EditorState {
  activeTemplate: MemeTemplate | null;
  textLayers: TextLayer[];
  selectedLayerId: string | null;
  canvasSettings: CanvasSettings;
  history: {
    past: TextLayer[][];
    future: TextLayer[][];
  };
  isExporting: boolean;
  exportFormat: 'png' | 'jpeg' | 'webp';
}
