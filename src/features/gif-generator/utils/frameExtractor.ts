import type {
  GifCaption,
  GifSettings,
  ImageSequenceFrame,
  SampleClip,
} from '../types/gif';
import type { GifFrameInput } from './gifEncoder';

/**
 * Calculates proportional dimensions based on resolution preset
 */
export function calculateTargetDimensions(
  naturalWidth: number,
  naturalHeight: number,
  presetWidth: number
): { width: number; height: number } {
  const safeW = naturalWidth > 0 ? naturalWidth : 480;
  const safeH = naturalHeight > 0 ? naturalHeight : 360;

  const targetWidth = Math.min(presetWidth, safeW);
  const aspectRatio = safeH / safeW;
  let adjustedW = targetWidth;
  let adjustedH = Math.round(targetWidth * aspectRatio);

  // Even dimensions preferred for codec alignment
  if (adjustedW % 2 !== 0) adjustedW -= 1;
  if (adjustedH % 2 !== 0) adjustedH -= 1;

  return {
    width: Math.max(120, adjustedW),
    height: Math.max(90, adjustedH),
  };
}

/**
 * Renders meme captions (Top Text & Bottom Text) directly onto a frame canvas
 */
export function renderMemeCaptions(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  caption?: GifCaption,
  animationOffset = 0 // Used for animated static image effects
): void {
  if (!caption) return;
  const { topText, bottomText, fontFamily, fontSize, color, strokeColor, strokeWidth, isUppercase } =
    caption;

  if (!topText.trim() && !bottomText.trim()) return;

  // Scale font size proportionally to canvas width
  const scaledSize = Math.max(14, Math.round((fontSize * width) / 500));
  const scaledStroke = Math.max(1, Math.round((strokeWidth * width) / 500));

  ctx.save();
  ctx.font = `bold ${scaledSize}px ${fontFamily || 'Impact'}, Impact, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = color || '#FFFFFF';
  ctx.strokeStyle = strokeColor || '#000000';
  ctx.lineWidth = scaledStroke;
  ctx.lineJoin = 'round';
  ctx.miterLimit = 2;

  // Top Text
  if (topText.trim()) {
    const text = isUppercase ? topText.toUpperCase() : topText;
    const posY = height * 0.12 + animationOffset;
    if (scaledStroke > 0) {
      ctx.strokeText(text, width / 2, posY, width * 0.94);
    }
    ctx.fillText(text, width / 2, posY, width * 0.94);
  }

  // Bottom Text
  if (bottomText.trim()) {
    const text = isUppercase ? bottomText.toUpperCase() : bottomText;
    const posY = height * 0.88 - animationOffset;
    if (scaledStroke > 0) {
      ctx.strokeText(text, width / 2, posY, width * 0.94);
    }
    ctx.fillText(text, width / 2, posY, width * 0.94);
  }

  ctx.restore();
}

/**
 * Extracts frames from an HTML5 Video element across a specified time range
 */
export async function extractVideoFrames(
  video: HTMLVideoElement,
  startTime: number,
  endTime: number,
  settings: GifSettings,
  caption?: GifCaption,
  onProgress?: (current: number, total: number, message: string) => void,
  signal?: AbortSignal
): Promise<{ width: number; height: number; frames: GifFrameInput[] }> {
  const duration = Math.max(0.1, endTime - startTime);
  const fps = Math.max(1, Math.min(30, settings.fps));
  const speed = Math.max(0.25, Math.min(4, settings.speed));
  const presetWidth = parseInt(settings.resolution, 10) || 480;

  const { width, height } = calculateTargetDimensions(
    video.videoWidth || 640,
    video.videoHeight || 360,
    presetWidth
  );

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });

  if (!ctx) {
    throw new Error('Unable to initialize canvas 2D rendering context.');
  }

  const frameIntervalSec = 1 / fps;
  const totalFrames = Math.max(1, Math.min(200, Math.floor((duration / frameIntervalSec) * speed)));
  const delayMs = Math.round(1000 / fps);

  const frames: GifFrameInput[] = [];

  // Temporarily pause video during manual seeking
  const wasPlaying = !video.paused;
  video.pause();

  try {
    for (let i = 0; i < totalFrames; i++) {
      if (signal?.aborted) {
        throw new Error('GIF frame extraction was cancelled.');
      }

      // Calculate timestamp in seconds
      const targetTime = startTime + (i / totalFrames) * duration;
      const clampedTime = Math.max(0, Math.min(video.duration || 9999, targetTime));

      await seekVideo(video, clampedTime);

      // Draw current video frame to canvas
      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(video, 0, 0, width, height);

      // Overlay captions
      renderMemeCaptions(ctx, width, height, caption);

      const imageData = ctx.getImageData(0, 0, width, height);
      frames.push({ imageData, delayMs });

      if (onProgress) {
        onProgress(i + 1, totalFrames, `Extracted frame ${i + 1} of ${totalFrames}`);
      }

      // Yield thread
      await new Promise((resolve) => setTimeout(resolve, 0));
    }
  } finally {
    if (wasPlaying) {
      video.play().catch(() => {});
    }
  }

  return { width, height, frames };
}

/**
 * Helper to seek a video element to a specific timestamp reliably
 */
function seekVideo(video: HTMLVideoElement, time: number): Promise<void> {
  return new Promise((resolve) => {
    if (Math.abs(video.currentTime - time) < 0.03) {
      resolve();
      return;
    }

    let resolved = false;
    const onSeeked = () => {
      if (!resolved) {
        resolved = true;
        video.removeEventListener('seeked', onSeeked);
        resolve();
      }
    };

    video.addEventListener('seeked', onSeeked, { once: true });
    video.currentTime = time;

    // Timeout safety fallback in case seeked event hangs
    setTimeout(() => {
      if (!resolved) {
        resolved = true;
        video.removeEventListener('seeked', onSeeked);
        resolve();
      }
    }, 400);
  });
}

/**
 * Extracts frames from an array of uploaded images
 */
export async function extractImageSequenceFrames(
  imageFrames: ImageSequenceFrame[],
  settings: GifSettings,
  caption?: GifCaption,
  onProgress?: (current: number, total: number, message: string) => void,
  signal?: AbortSignal
): Promise<{ width: number; height: number; frames: GifFrameInput[] }> {
  if (imageFrames.length === 0) {
    throw new Error('No images provided for GIF sequence.');
  }

  const presetWidth = parseInt(settings.resolution, 10) || 480;
  const firstFrame = imageFrames[0];

  const { width, height } = calculateTargetDimensions(
    firstFrame.width || 500,
    firstFrame.height || 500,
    presetWidth
  );

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });

  if (!ctx) {
    throw new Error('Unable to create canvas context for image sequence.');
  }

  const frames: GifFrameInput[] = [];

  // Special case: Single image with animated meme effect (pulse/bounce)
  if (imageFrames.length === 1) {
    const singleImg = await loadImage(imageFrames[0].dataUrl);
    const animationSteps = 8;
    const delayMs = 120;

    for (let step = 0; step < animationSteps; step++) {
      if (signal?.aborted) throw new Error('Cancelled');

      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(singleImg, 0, 0, width, height);

      // Subtle dynamic bounce for text animation on still image
      const wave = Math.sin((step / animationSteps) * Math.PI * 2) * 4;
      renderMemeCaptions(ctx, width, height, caption, wave);

      frames.push({
        imageData: ctx.getImageData(0, 0, width, height),
        delayMs,
      });

      if (onProgress) {
        onProgress(step + 1, animationSteps, `Generating animated frame ${step + 1}/${animationSteps}`);
      }
      await new Promise((resolve) => setTimeout(resolve, 0));
    }

    return { width, height, frames };
  }

  // Standard multi-image sequence
  for (let i = 0; i < imageFrames.length; i++) {
    if (signal?.aborted) throw new Error('Cancelled');

    const item = imageFrames[i];
    const img = await loadImage(item.dataUrl);

    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(img, 0, 0, width, height);
    renderMemeCaptions(ctx, width, height, caption);

    frames.push({
      imageData: ctx.getImageData(0, 0, width, height),
      delayMs: Math.max(30, item.delayMs || 300),
    });

    if (onProgress) {
      onProgress(i + 1, imageFrames.length, `Processed image frame ${i + 1}/${imageFrames.length}`);
    }
    await new Promise((resolve) => setTimeout(resolve, 0));
  }

  return { width, height, frames };
}

/**
 * Loads an image from URL or Data URL safely
 */
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load image for frame processing.'));
    img.src = src;
  });
}

/**
 * Built-in Sample Clips for instant one-click testing
 */
export const SAMPLE_GIF_CLIPS: SampleClip[] = [
  {
    id: 'sample-shinchan',
    title: 'Shinchan Victory Dance',
    description: 'High-energy celebration dance meme clip.',
    thumbnailUrl: '/shinchan-meme.jpg',
    duration: 3.2,
    defaultTopText: 'WHEN THE BUG IS FIXED',
    defaultBottomText: 'AND NO TEST FAILS',
  },
  {
    id: 'sample-kazama',
    title: 'Kazama Rage Shake',
    description: 'Frustrated rage reaction meme clip.',
    thumbnailUrl: '/kazama.jpg',
    duration: 2.5,
    defaultTopText: 'WHO MERGED TO MAIN',
    defaultBottomText: 'ON A FRIDAY EVENING',
  },
];
