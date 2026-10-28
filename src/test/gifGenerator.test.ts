import { describe, it, expect, beforeEach } from 'vitest';
import { calculateTargetDimensions } from '../features/gif-generator/utils/frameExtractor';
import { useGifStore } from '../features/gif-generator/stores/useGifStore';

describe('GIF Maker Frame Utilities', () => {
  it('calculates proportional dimensions and preserves even pixel bounds', () => {
    // 1920x1080 scaled down to 480 preset
    const dims480 = calculateTargetDimensions(1920, 1080, 480);
    expect(dims480.width).toBe(480);
    expect(dims480.height).toBe(270);
    expect(dims480.width % 2).toBe(0);
    expect(dims480.height % 2).toBe(0);

    // 1000x1000 square scaled down to 320
    const dims320 = calculateTargetDimensions(1000, 1000, 320);
    expect(dims320.width).toBe(320);
    expect(dims320.height).toBe(320);

    // Smaller image than preset should not be blown up
    const dimsSmall = calculateTargetDimensions(200, 150, 480);
    expect(dimsSmall.width).toBe(200);
    expect(dimsSmall.height).toBe(150);
  });
});

describe('useGifStore State Management', () => {
  beforeEach(() => {
    useGifStore.getState().resetAll();
  });

  it('updates encoding settings correctly', () => {
    const store = useGifStore.getState();
    expect(store.settings.fps).toBe(10);
    expect(store.settings.resolution).toBe('480');

    store.setSettings({ fps: 15, resolution: '640', dither: true });
    expect(useGifStore.getState().settings.fps).toBe(15);
    expect(useGifStore.getState().settings.resolution).toBe('640');
    expect(useGifStore.getState().settings.dither).toBe(true);
  });

  it('updates caption text and styling', () => {
    const store = useGifStore.getState();
    store.setCaption({
      topText: 'WHEN TESTS PASS ON FIRST RUN',
      bottomText: 'IMPOSSIBLE',
      fontSize: 40,
    });

    const caption = useGifStore.getState().caption;
    expect(caption.topText).toBe('WHEN TESTS PASS ON FIRST RUN');
    expect(caption.bottomText).toBe('IMPOSSIBLE');
    expect(caption.fontSize).toBe(40);
  });

  it('manages image sequence frames and reordering', () => {
    const store = useGifStore.getState();

    const frame1 = {
      id: 'f1',
      dataUrl: 'data:image/png;base64,123',
      delayMs: 200,
      filename: 'frame1.png',
      width: 400,
      height: 300,
    };
    const frame2 = {
      id: 'f2',
      dataUrl: 'data:image/png;base64,456',
      delayMs: 200,
      filename: 'frame2.png',
      width: 400,
      height: 300,
    };

    store.addImageFrames([frame1, frame2]);
    expect(useGifStore.getState().imageFrames).toHaveLength(2);
    expect(useGifStore.getState().sourceType).toBe('images');

    // Reorder
    store.reorderImageFrames(0, 1);
    expect(useGifStore.getState().imageFrames[0].id).toBe('f2');
    expect(useGifStore.getState().imageFrames[1].id).toBe('f1');

    // Remove frame
    store.removeImageFrame('f1');
    expect(useGifStore.getState().imageFrames).toHaveLength(1);
    expect(useGifStore.getState().imageFrames[0].id).toBe('f2');
  });

  it('resets state cleanly when resetAll is triggered', () => {
    const store = useGifStore.getState();
    store.setCaption({ topText: 'Temporary text' });
    store.setSettings({ fps: 20 });

    store.resetAll();

    expect(useGifStore.getState().caption.topText).toBe('');
    expect(useGifStore.getState().settings.fps).toBe(10);
    expect(useGifStore.getState().sourceType).toBeNull();
    expect(useGifStore.getState().generatedResult).toBeNull();
  });

  it('rejects startGenerating when no media source is selected', async () => {
    const store = useGifStore.getState();
    store.resetAll();

    const result = await store.startGenerating(null);
    expect(result).toBeNull();
    expect(useGifStore.getState().error).toBe(
      'Please select a video file or upload images before generating a GIF.'
    );
    expect(useGifStore.getState().progress.phase).toBe('error');
  });

  it('cancels ongoing generation cleanly', () => {
    const store = useGifStore.getState();
    store.cancelGeneration();
    expect(useGifStore.getState().progress.phase).toBe('idle');
  });
});
