import type { TextLayer } from '../../types/editor';
import type { MemeTemplate } from '../../types/template';

export interface ExportMemeOptions {
  template: MemeTemplate;
  textLayers: TextLayer[];
  title: string;
  previewWidth?: number;
  previewHeight?: number;
  format?: 'png' | 'jpeg';
  quality?: number; // 0.1 to 1.0 (for JPEG)
}

export interface ExportResult {
  success: boolean;
  error?: string;
}

/**
 * Splits text into wrapped lines if it exceeds maxWidth
 */
function wrapLines(
  ctx: CanvasRenderingContext2D,
  rawText: string,
  maxWidth: number
): string[] {
  const paragraphs = rawText.split('\n');
  const result: string[] = [];

  for (const paragraph of paragraphs) {
    if (!paragraph) {
      result.push('');
      continue;
    }

    const words = paragraph.split(' ');
    let currentLine = '';

    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const metrics = ctx.measureText(testLine);

      if (metrics.width > maxWidth && currentLine) {
        result.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }

    if (currentLine) {
      result.push(currentLine);
    }
  }

  return result.length > 0 ? result : [''];
}

/**
 * Loads an image with crossOrigin = 'anonymous', with fallback if CORS fails
 */
function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => resolve(img);
    img.onerror = () => {
      // Retry without anonymous if it was a same-origin or local path
      const fallbackImg = new Image();
      fallbackImg.onload = () => resolve(fallbackImg);
      fallbackImg.onerror = () => reject(new Error(`Failed to load image from: ${url}`));
      fallbackImg.src = url;
    };

    img.src = url;
  });
}

/**
 * Renders the meme onto an HTML5 Canvas and returns the canvas element
 */
export async function renderMemeCanvas(options: ExportMemeOptions): Promise<HTMLCanvasElement> {
  const { template, textLayers, previewWidth } = options;
  const img = await loadImage(template.imageUrl);

  const canvas = document.createElement('canvas');
  const width = img.naturalWidth || template.width || 1200;
  const height = img.naturalHeight || template.height || 1200;

  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Could not initialize 2D canvas context');
  }

  // 1. Draw base meme template
  ctx.drawImage(img, 0, 0, width, height);

  // 2. Scale factor from preview coordinate space to export canvas
  const referenceWidth = previewWidth && previewWidth > 0 ? previewWidth : 600;
  const scale = width / referenceWidth;

  // Ensure loaded web fonts are ready before drawing
  if (typeof document !== 'undefined' && document.fonts) {
    try {
      await document.fonts.ready;
    } catch {
      // Fallback gracefully if fonts.ready fails
    }
  }

  // 3. Render all visible text layers
  for (const layer of textLayers) {
    if (!layer.text.trim()) continue;

    const scaledFontSize = Math.max(12, Math.round(layer.fontSize * scale));
    const scaledStrokeWidth = Math.max(0, Math.round(layer.strokeWidth * scale));

    const fontStyle = layer.isItalic ? 'italic' : 'normal';
    const fontWeight = layer.isBold ? 'bold' : 'normal';
    ctx.font = `${fontStyle} ${fontWeight} ${scaledFontSize}px ${layer.fontFamily}, Impact, sans-serif`;

    const displayText = layer.isUppercase ? layer.text.toUpperCase() : layer.text;
    const maxLineWidth = width * 0.92;
    const lines = wrapLines(ctx, displayText, maxLineWidth);

    const lineHeight = scaledFontSize * 1.15;
    const totalTextHeight = lines.length * lineHeight;

    const posX = (layer.xPercent / 100) * width;
    const posY = (layer.yPercent / 100) * height;

    ctx.save();
    ctx.translate(posX, posY);

    if (layer.rotation) {
      ctx.rotate((layer.rotation * Math.PI) / 180);
    }

    ctx.globalAlpha = Math.max(0, Math.min(1, layer.opacity ?? 1));
    ctx.textBaseline = 'middle';
    ctx.lineWidth = scaledStrokeWidth;
    ctx.strokeStyle = layer.strokeColor;
    ctx.fillStyle = layer.color;
    ctx.lineJoin = 'round';
    ctx.miterLimit = 2;

    // Apply text shadow if configured
    if (layer.shadowBlur && layer.shadowBlur > 0) {
      ctx.shadowColor = layer.shadowColor || 'rgba(0, 0, 0, 0.85)';
      ctx.shadowBlur = layer.shadowBlur * scale;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 2 * scale;
    } else {
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
    }

    // Calculate widest line to anchor alignment consistently within the centered block
    let maxBlockWidth = 0;
    for (const line of lines) {
      const measured = ctx.measureText(line).width;
      if (measured > maxBlockWidth) {
        maxBlockWidth = measured;
      }
    }

    ctx.textAlign = layer.alignment;
    let lineAnchorX = 0;
    if (layer.alignment === 'left') {
      lineAnchorX = -maxBlockWidth / 2;
    } else if (layer.alignment === 'right') {
      lineAnchorX = maxBlockWidth / 2;
    }

    // Vertical offset so multiple lines center on posY
    const startOffsetY = -((totalTextHeight - lineHeight) / 2);

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const lineOffsetY = startOffsetY + i * lineHeight;

      if (scaledStrokeWidth > 0) {
        ctx.strokeText(line, lineAnchorX, lineOffsetY);
      }
      ctx.fillText(line, lineAnchorX, lineOffsetY);
    }

    ctx.restore();
  }

  return canvas;
}

/**
 * Exports the meme to a PNG or JPEG file and triggers browser download
 */
export async function exportMemeAsFormat(
  options: ExportMemeOptions,
  format: 'png' | 'jpeg' = 'png',
  quality: number = 0.95
): Promise<ExportResult> {
  const { template, title } = options;

  try {
    const canvas = await renderMemeCanvas(options);
    const mimeType = format === 'jpeg' ? 'image/jpeg' : 'image/png';
    const extension = format === 'jpeg' ? 'jpg' : 'png';

    return new Promise((resolve) => {
      try {
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve({
                success: false,
                error: 'Canvas export produced an empty image. Browser security may have blocked external image data.',
              });
              return;
            }

            const downloadUrl = URL.createObjectURL(blob);
            const link = document.createElement('a');
            const sanitizedTitle = (title || template.name || 'meme')
              .toLowerCase()
              .replace(/[^a-z0-9_-]/g, '-')
              .replace(/-+/g, '-');

            link.href = downloadUrl;
            link.download = `${sanitizedTitle}.${extension}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            setTimeout(() => URL.revokeObjectURL(downloadUrl), 2000);
            resolve({ success: true });
          },
          mimeType,
          quality
        );
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Unknown canvas export error';
        resolve({
          success: false,
          error: `Export failed due to browser canvas security (CORS): ${message}. Try using a local template.`,
        });
      }
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Image loading error';
    return {
      success: false,
      error: `Failed to export meme: ${message}`,
    };
  }
}

/**
 * Legacy wrapper: exports meme to PNG
 */
export async function exportMemeAsPng(options: ExportMemeOptions): Promise<ExportResult> {
  return exportMemeAsFormat(options, 'png', 1.0);
}

/**
 * Copies the meme canvas image directly to the system clipboard
 */
export async function copyMemeToClipboard(options: ExportMemeOptions): Promise<ExportResult> {
  try {
    if (!navigator.clipboard || typeof ClipboardItem === 'undefined') {
      return {
        success: false,
        error: 'Clipboard image copying is not supported on this browser or requires HTTPS.',
      };
    }

    const canvas = await renderMemeCanvas(options);

    return new Promise((resolve) => {
      canvas.toBlob(async (blob) => {
        if (!blob) {
          resolve({ success: false, error: 'Could not generate image for clipboard.' });
          return;
        }

        try {
          const item = new ClipboardItem({ 'image/png': blob });
          await navigator.clipboard.write([item]);
          resolve({ success: true });
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : 'Clipboard write permission denied';
          resolve({
            success: false,
            error: `Failed to copy to clipboard: ${msg}`,
          });
        }
      }, 'image/png');
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown clipboard error';
    return { success: false, error: msg };
  }
}

/**
 * Shares the meme image using the Web Share API if supported
 */
export async function shareMemeViaWebShare(options: ExportMemeOptions): Promise<ExportResult> {
  try {
    const canvas = await renderMemeCanvas(options);
    const sanitizedTitle = (options.title || options.template.name || 'Meme')
      .replace(/[^a-zA-Z0-9 ]/g, '')
      .trim();

    return new Promise((resolve) => {
      canvas.toBlob(async (blob) => {
        if (!blob) {
          resolve({ success: false, error: 'Could not generate meme image for sharing.' });
          return;
        }

        const file = new File([blob], `${sanitizedTitle || 'meme'}.png`, { type: 'image/png' });

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({
              title: sanitizedTitle,
              text: `Check out this meme made on MemeHub: ${sanitizedTitle}`,
              files: [file],
            });
            resolve({ success: true });
          } catch (shareErr: unknown) {
            if (shareErr instanceof Error && shareErr.name === 'AbortError') {
              resolve({ success: true }); // User dismissed share dialog
            } else {
              resolve({
                success: false,
                error: 'Native sharing was cancelled or unavailable.',
              });
            }
          }
        } else {
          resolve({
            success: false,
            error: 'Native image sharing is not supported by your current browser or device.',
          });
        }
      }, 'image/png');
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Share error';
    return { success: false, error: msg };
  }
}
