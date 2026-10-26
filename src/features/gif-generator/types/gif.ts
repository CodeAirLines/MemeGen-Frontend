export type SourceMediaType = 'video' | 'images' | 'sample';

export interface VideoMetadata {
  duration: number;
  width: number;
  height: number;
  fps?: number;
  filename: string;
  filesize: number;
}

export interface ImageSequenceFrame {
  id: string;
  dataUrl: string;
  delayMs: number;
  filename: string;
  width: number;
  height: number;
}

export type GifResolutionPreset = '320' | '480' | '640';

export interface GifSettings {
  fps: number; // 5, 10, 15, 20
  resolution: GifResolutionPreset; // 320px, 480px, 640px width
  speed: number; // 0.5, 1.0, 1.5, 2.0
  loopCount: number; // 0 = infinite, >0 = specific count
  quality: number; // 1 to 30 (NeuQuant sample step: lower is higher quality)
  dither: boolean;
}

export interface GifCaption {
  topText: string;
  bottomText: string;
  fontFamily: string;
  fontSize: number;
  color: string;
  strokeColor: string;
  strokeWidth: number;
  isUppercase: boolean;
}

export interface VideoTrimSettings {
  startTime: number;
  endTime: number;
  currentTime: number;
  isPlaying: boolean;
}

export type GenerationPhase =
  | 'idle'
  | 'extracting'
  | 'quantizing'
  | 'encoding'
  | 'complete'
  | 'error';

export interface GenerationProgress {
  phase: GenerationPhase;
  percent: number;
  currentFrame: number;
  totalFrames: number;
  statusText: string;
}

export interface GeneratedGifResult {
  blob: Blob;
  url: string;
  sizeBytes: number;
  width: number;
  height: number;
  durationSeconds: number;
  frameCount: number;
  fps: number;
  filename: string;
  createdAt: string;
}

export interface SampleClip {
  id: string;
  title: string;
  description: string;
  videoUrl?: string;
  thumbnailUrl: string;
  duration: number;
  defaultTopText?: string;
  defaultBottomText?: string;
}
