import { create } from 'zustand';
import type {
  SourceMediaType,
  VideoMetadata,
  ImageSequenceFrame,
  GifSettings,
  GifCaption,
  VideoTrimSettings,
  GenerationProgress,
  GeneratedGifResult,
  SampleClip,
} from '../types/gif';
import {
  extractVideoFrames,
  extractImageSequenceFrames,
} from '../utils/frameExtractor';
import { encodeGifAsync } from '../utils/gifEncoder';

interface GifStoreState {
  sourceType: SourceMediaType | null;
  videoFile: File | null;
  videoUrl: string | null;
  videoMetadata: VideoMetadata | null;
  trimSettings: VideoTrimSettings;
  imageFrames: ImageSequenceFrame[];
  settings: GifSettings;
  caption: GifCaption;
  progress: GenerationProgress;
  generatedResult: GeneratedGifResult | null;
  error: string | null;

  // Actions
  setSourceVideo: (file: File, url: string, metadata: VideoMetadata) => void;
  setTrimSettings: (updates: Partial<VideoTrimSettings>) => void;
  addImageFrames: (frames: ImageSequenceFrame[]) => void;
  removeImageFrame: (id: string) => void;
  reorderImageFrames: (fromIndex: number, toIndex: number) => void;
  updateImageFrameDelay: (id: string, delayMs: number) => void;
  setSettings: (updates: Partial<GifSettings>) => void;
  setCaption: (updates: Partial<GifCaption>) => void;
  loadSampleClip: (sample: SampleClip) => void;
  startGenerating: (videoEl?: HTMLVideoElement | null) => Promise<GeneratedGifResult | null>;
  cancelGeneration: () => void;
  resetAll: () => void;
  clearError: () => void;
}

const DEFAULT_SETTINGS: GifSettings = {
  fps: 10,
  resolution: '480',
  speed: 1.0,
  loopCount: 0,
  quality: 10,
  dither: false,
};

const DEFAULT_CAPTION: GifCaption = {
  topText: '',
  bottomText: '',
  fontFamily: 'Impact',
  fontSize: 34,
  color: '#FFFFFF',
  strokeColor: '#000000',
  strokeWidth: 3,
  isUppercase: true,
};

const DEFAULT_TRIM: VideoTrimSettings = {
  startTime: 0,
  endTime: 3,
  currentTime: 0,
  isPlaying: false,
};

const DEFAULT_PROGRESS: GenerationProgress = {
  phase: 'idle',
  percent: 0,
  currentFrame: 0,
  totalFrames: 0,
  statusText: '',
};

let abortController: AbortController | null = null;

export const useGifStore = create<GifStoreState>((set, get) => ({
  sourceType: null,
  videoFile: null,
  videoUrl: null,
  videoMetadata: null,
  trimSettings: DEFAULT_TRIM,
  imageFrames: [],
  settings: DEFAULT_SETTINGS,
  caption: DEFAULT_CAPTION,
  progress: DEFAULT_PROGRESS,
  generatedResult: null,
  error: null,

  setSourceVideo: (file, url, metadata) => {
    // Revoke previous video URL if any
    const oldUrl = get().videoUrl;
    if (oldUrl && oldUrl.startsWith('blob:')) {
      URL.revokeObjectURL(oldUrl);
    }

    const duration = Math.max(0.5, metadata.duration);
    const initialEndTime = Math.min(3.5, duration);

    set({
      sourceType: 'video',
      videoFile: file,
      videoUrl: url,
      videoMetadata: metadata,
      trimSettings: {
        startTime: 0,
        endTime: initialEndTime,
        currentTime: 0,
        isPlaying: false,
      },
      imageFrames: [],
      error: null,
    });
  },

  setTrimSettings: (updates) =>
    set((state) => ({
      trimSettings: { ...state.trimSettings, ...updates },
    })),

  addImageFrames: (newFrames) =>
    set((state) => ({
      sourceType: 'images',
      videoFile: null,
      videoUrl: null,
      videoMetadata: null,
      imageFrames: [...state.imageFrames, ...newFrames],
      error: null,
    })),

  removeImageFrame: (id) =>
    set((state) => {
      const filtered = state.imageFrames.filter((f) => f.id !== id);
      return {
        imageFrames: filtered,
        sourceType: filtered.length > 0 ? 'images' : null,
      };
    }),

  reorderImageFrames: (fromIndex, toIndex) =>
    set((state) => {
      const copy = [...state.imageFrames];
      const [moved] = copy.splice(fromIndex, 1);
      copy.splice(toIndex, 0, moved);
      return { imageFrames: copy };
    }),

  updateImageFrameDelay: (id, delayMs) =>
    set((state) => ({
      imageFrames: state.imageFrames.map((f) => (f.id === id ? { ...f, delayMs } : f)),
    })),

  setSettings: (updates) =>
    set((state) => ({
      settings: { ...state.settings, ...updates },
    })),

  setCaption: (updates) =>
    set((state) => ({
      caption: { ...state.caption, ...updates },
    })),

  loadSampleClip: (sample) => {
    // Load built-in sample clip
    set({
      sourceType: 'sample',
      videoFile: null,
      videoUrl: null,
      videoMetadata: {
        filename: `${sample.title}.sample`,
        duration: sample.duration,
        width: 480,
        height: 360,
        filesize: 1024 * 512,
      },
      trimSettings: {
        startTime: 0,
        endTime: sample.duration,
        currentTime: 0,
        isPlaying: false,
      },
      caption: {
        ...DEFAULT_CAPTION,
        topText: sample.defaultTopText || '',
        bottomText: sample.defaultBottomText || '',
      },
      // Create synthetic sample frames using the sample thumbnail
      imageFrames: [
        {
          id: `sample-frame-${Date.now()}`,
          dataUrl: sample.thumbnailUrl,
          delayMs: 120,
          filename: sample.title,
          width: 480,
          height: 360,
        },
      ],
      error: null,
    });
  },

  startGenerating: async (videoEl) => {
    const state = get();
    if (abortController) abortController.abort();
    abortController = new AbortController();

    set({
      progress: {
        phase: 'extracting',
        percent: 5,
        currentFrame: 0,
        totalFrames: 0,
        statusText: 'Preparing media frames...',
      },
      error: null,
    });

    try {
      let extracted: {
        width: number;
        height: number;
        frames: { imageData: ImageData; delayMs: number }[];
      };

      if (state.sourceType === 'video' && videoEl) {
        // Extract from video element
        extracted = await extractVideoFrames(
          videoEl,
          state.trimSettings.startTime,
          state.trimSettings.endTime,
          state.settings,
          state.caption,
          (curr, tot, msg) => {
            const percent = Math.round((curr / tot) * 45); // First 45% for extraction
            set({
              progress: {
                phase: 'extracting',
                percent,
                currentFrame: curr,
                totalFrames: tot,
                statusText: msg,
              },
            });
          },
          abortController.signal
        );
      } else if (state.imageFrames.length > 0) {
        // Extract from image sequence
        extracted = await extractImageSequenceFrames(
          state.imageFrames,
          state.settings,
          state.caption,
          (curr, tot, msg) => {
            const percent = Math.round((curr / tot) * 45);
            set({
              progress: {
                phase: 'extracting',
                percent,
                currentFrame: curr,
                totalFrames: tot,
                statusText: msg,
              },
            });
          },
          abortController.signal
        );
      } else {
        throw new Error('Please select a video file or upload images before generating a GIF.');
      }

      if (extracted.frames.length === 0) {
        throw new Error('No frames could be extracted from the media source.');
      }

      set({
        progress: {
          phase: 'encoding',
          percent: 50,
          currentFrame: 0,
          totalFrames: extracted.frames.length,
          statusText: 'Quantizing colors & compressing GIF (LZW)...',
        },
      });

      const totalFrames = extracted.frames.length;
      const gifBlob = await encodeGifAsync({
        width: extracted.width,
        height: extracted.height,
        frames: extracted.frames,
        loopCount: state.settings.loopCount,
        quality: state.settings.quality,
        dither: state.settings.dither,
        onProgress: (curr, tot) => {
          const percent = 50 + Math.round((curr / tot) * 48); // 50% to 98%
          set({
            progress: {
              phase: 'encoding',
              percent,
              currentFrame: curr,
              totalFrames: tot,
              statusText: `Encoding frame ${curr} of ${tot}...`,
            },
          });
        },
        signal: abortController.signal,
      });

      // Cleanup old generated result if any
      const oldRes = state.generatedResult;
      if (oldRes && oldRes.url) {
        URL.revokeObjectURL(oldRes.url);
      }

      const generatedUrl = URL.createObjectURL(gifBlob);
      const totalDurationSec =
        extracted.frames.reduce((acc, f) => acc + f.delayMs, 0) / 1000;

      const titleSlug = (
        state.caption.topText ||
        state.caption.bottomText ||
        state.videoMetadata?.filename ||
        'meme'
      )
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/-+/g, '-')
        .slice(0, 24);

      const result: GeneratedGifResult = {
        blob: gifBlob,
        url: generatedUrl,
        sizeBytes: gifBlob.size,
        width: extracted.width,
        height: extracted.height,
        durationSeconds: Math.round(totalDurationSec * 10) / 10,
        frameCount: totalFrames,
        fps: state.settings.fps,
        filename: `memegen-${titleSlug || 'clip'}.gif`,
        createdAt: new Date().toISOString(),
      };

      set({
        generatedResult: result,
        progress: {
          phase: 'complete',
          percent: 100,
          currentFrame: totalFrames,
          totalFrames,
          statusText: 'GIF generated successfully!',
        },
      });

      return result;
    } catch (err: unknown) {
      if (err instanceof Error && err.message.includes('cancelled')) {
        set({
          progress: DEFAULT_PROGRESS,
          error: null,
        });
        return null;
      }
      const msg = err instanceof Error ? err.message : 'An error occurred during GIF generation.';
      set({
        progress: {
          phase: 'error',
          percent: 0,
          currentFrame: 0,
          totalFrames: 0,
          statusText: msg,
        },
        error: msg,
      });
      return null;
    }
  },

  cancelGeneration: () => {
    if (abortController) {
      abortController.abort();
      abortController = null;
    }
    set({
      progress: DEFAULT_PROGRESS,
    });
  },

  resetAll: () => {
    if (abortController) {
      abortController.abort();
      abortController = null;
    }
    const { videoUrl, generatedResult } = get();
    if (videoUrl && videoUrl.startsWith('blob:')) {
      URL.revokeObjectURL(videoUrl);
    }
    if (generatedResult && generatedResult.url) {
      URL.revokeObjectURL(generatedResult.url);
    }

    set({
      sourceType: null,
      videoFile: null,
      videoUrl: null,
      videoMetadata: null,
      trimSettings: DEFAULT_TRIM,
      imageFrames: [],
      settings: DEFAULT_SETTINGS,
      caption: DEFAULT_CAPTION,
      progress: DEFAULT_PROGRESS,
      generatedResult: null,
      error: null,
    });
  },

  clearError: () => set({ error: null }),
}));
