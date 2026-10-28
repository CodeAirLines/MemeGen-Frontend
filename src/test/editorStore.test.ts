import { describe, it, expect, beforeEach } from 'vitest';
import { useEditorStore } from '../stores/useEditorStore';
import { POPULAR_TEMPLATES } from '../constants/templates';

describe('useEditorStore State Transitions', () => {
  beforeEach(() => {
    const template = POPULAR_TEMPLATES[0];
    useEditorStore.getState().loadTemplate(template, false);
  });

  it('initializes with active template and default text layers', () => {
    const state = useEditorStore.getState();
    expect(state.activeTemplate).not.toBeNull();
    expect(state.textLayers.length).toBeGreaterThan(0);
    expect(state.memeTitle).toContain('Meme');
  });

  it('adds a new text layer and updates selection', () => {
    const initialCount = useEditorStore.getState().textLayers.length;
    const newLayerId = useEditorStore.getState().addTextLayer({
      text: 'BRAND NEW CAPTION',
      fontSize: 28,
    });

    const state = useEditorStore.getState();
    expect(state.textLayers).toHaveLength(initialCount + 1);
    expect(state.selectedLayerId).toBe(newLayerId);

    const added = state.textLayers.find((l) => l.id === newLayerId);
    expect(added?.text).toBe('BRAND NEW CAPTION');
    expect(added?.fontSize).toBe(28);
  });

  it('updates text layer properties', () => {
    const layerId = useEditorStore.getState().textLayers[0].id;
    useEditorStore.getState().updateTextLayer(layerId, {
      text: 'UPDATED CAPTION CONTENT',
      color: '#FF0000',
    });

    const updated = useEditorStore.getState().textLayers.find((l) => l.id === layerId);
    expect(updated?.text).toBe('UPDATED CAPTION CONTENT');
    expect(updated?.color).toBe('#FF0000');
  });

  it('deletes a text layer', () => {
    const state = useEditorStore.getState();
    const countBefore = state.textLayers.length;
    const layerToDelete = state.textLayers[0].id;

    state.deleteTextLayer(layerToDelete);

    const countAfter = useEditorStore.getState().textLayers.length;
    expect(countAfter).toBe(countBefore - 1);
    expect(useEditorStore.getState().textLayers.some((l) => l.id === layerToDelete)).toBe(false);
  });

  it('supports undo and redo for text layer modifications', () => {
    // Add layer with history
    const layerId = useEditorStore.getState().addTextLayer({ text: 'INITIAL' });

    // Update with history record
    useEditorStore.getState().updateTextLayer(layerId, { text: 'CHANGED' }, true);
    expect(useEditorStore.getState().textLayers.find((l) => l.id === layerId)?.text).toBe('CHANGED');

    // Undo
    useEditorStore.getState().undo();
    expect(useEditorStore.getState().textLayers.find((l) => l.id === layerId)?.text).toBe('INITIAL');

    // Redo
    useEditorStore.getState().redo();
    expect(useEditorStore.getState().textLayers.find((l) => l.id === layerId)?.text).toBe('CHANGED');
  });

  it('clamps zoom within bounds [0.3, 2.5]', () => {
    useEditorStore.getState().setZoom(5.0);
    expect(useEditorStore.getState().canvasSettings.zoom).toBe(2.5);

    useEditorStore.getState().setZoom(0.05);
    expect(useEditorStore.getState().canvasSettings.zoom).toBe(0.3);

    useEditorStore.getState().resetZoom();
    expect(useEditorStore.getState().canvasSettings.zoom).toBe(1);
  });
});

