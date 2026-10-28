import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { draftStorage } from '../services/draftStorage';
import { useDraftStore } from '../stores/useDraftStore';
import { useEditorStore } from '../stores/useEditorStore';
import { DraftGrid } from '../features/drafts/DraftGrid';
import { POPULAR_TEMPLATES } from '../constants/templates';
import type { MemeDraft } from '../types/draft';

describe('Drafts Storage & Store', () => {
  beforeEach(() => {
    window.localStorage.clear();
    useDraftStore.setState({
      drafts: [],
      isLoading: false,
      error: null,
      searchQuery: '',
      sortBy: 'recently-edited',
      activeDraftForRename: null,
      activeDraftForDelete: null,
    });
  });

  const sampleTemplate = POPULAR_TEMPLATES[0];

  const sampleDraft1: MemeDraft = {
    id: 'draft-1',
    title: 'CSS Centering Meme',
    template: sampleTemplate,
    textLayers: [
      {
        id: 'l1',
        text: 'HOW DO I CENTER A DIV',
        xPercent: 50,
        yPercent: 20,
        fontSize: 32,
        color: '#FFFFFF',
        strokeColor: '#000000',
        strokeWidth: 3,
        isBold: true,
        isItalic: false,
        isUppercase: true,
        alignment: 'center',
        fontFamily: 'Impact',
        rotation: 0,
        opacity: 1,
      },
    ],
    createdAt: '2024-01-01T10:00:00.000Z',
    updatedAt: '2024-01-01T12:00:00.000Z',
  };

  const sampleDraft2: MemeDraft = {
    id: 'draft-2',
    title: 'Git Merge Conflict',
    template: sampleTemplate,
    textLayers: [],
    createdAt: '2024-01-02T10:00:00.000Z',
    updatedAt: '2024-01-02T15:00:00.000Z',
  };

  it('saves, updates, and retrieves drafts from persistent storage', async () => {
    draftStorage.persist([sampleDraft1]);
    const all = await draftStorage.getAll();
    expect(all).toHaveLength(1);
    expect(all[0].title).toBe('CSS Centering Meme');

    // Save an update
    const updated = await draftStorage.save({
      ...sampleDraft1,
      title: 'Flexbox vs Grid',
    });
    expect(updated.title).toBe('Flexbox vs Grid');

    const reloaded = await draftStorage.getAll();
    expect(reloaded[0].title).toBe('Flexbox vs Grid');
  });

  it('duplicates a draft with distinct ID and copy title', async () => {
    draftStorage.persist([sampleDraft1]);
    await useDraftStore.getState().fetchDrafts();

    const duplicate = await useDraftStore.getState().duplicateDraft(sampleDraft1.id);
    expect(duplicate.id).not.toBe(sampleDraft1.id);
    expect(duplicate.title).toBe('CSS Centering Meme (Copy)');

    expect(useDraftStore.getState().drafts).toHaveLength(2);
  });

  it('renames a draft correctly', async () => {
    draftStorage.persist([sampleDraft1]);
    await useDraftStore.getState().fetchDrafts();

    await useDraftStore.getState().renameDraft(sampleDraft1.id, 'New Viral Caption');
    const updated = useDraftStore.getState().drafts.find((d) => d.id === sampleDraft1.id);
    expect(updated?.title).toBe('New Viral Caption');
  });

  it('deletes a draft and removes it from state and storage', async () => {
    draftStorage.persist([sampleDraft1, sampleDraft2]);
    await useDraftStore.getState().fetchDrafts();
    expect(useDraftStore.getState().drafts).toHaveLength(2);

    await useDraftStore.getState().deleteDraft('draft-1');
    expect(useDraftStore.getState().drafts).toHaveLength(1);
    expect(useDraftStore.getState().drafts[0].id).toBe('draft-2');

    const persisted = await draftStorage.getAll();
    expect(persisted).toHaveLength(1);
    expect(persisted[0].id).toBe('draft-2');
  });

  it('loads draft into useEditorStore correctly', () => {
    useEditorStore.getState().loadDraft(sampleDraft1);

    expect(useEditorStore.getState().memeTitle).toBe('CSS Centering Meme');
    expect(useEditorStore.getState().currentDraftId).toBe('draft-1');
    expect(useEditorStore.getState().textLayers).toHaveLength(1);
    expect(useEditorStore.getState().textLayers[0].text).toBe('HOW DO I CENTER A DIV');
  });
});

describe('DraftGrid Component', () => {
  beforeEach(() => {
    window.localStorage.clear();
    draftStorage.persist([]);
    useDraftStore.setState({
      drafts: [],
      isLoading: false,
      error: null,
      searchQuery: '',
      sortBy: 'recently-edited',
      activeDraftForRename: null,
      activeDraftForDelete: null,
    });
  });

  const sampleTemplate = POPULAR_TEMPLATES[0];

  it('displays empty state when no drafts exist', async () => {
    render(<DraftGrid />);
    await waitFor(() => {
      expect(screen.getByText('No saved drafts yet')).toBeInTheDocument();
    });
    expect(screen.getByText('Create New Meme')).toBeInTheDocument();
  });

  it('filters drafts based on search query', async () => {
    const d1 = {
      id: 'd1',
      title: 'Typescript strict mode',
      template: sampleTemplate,
      textLayers: [],
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    };
    const d2 = {
      id: 'd2',
      title: 'Python indentation error',
      template: sampleTemplate,
      textLayers: [],
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    };
    draftStorage.persist([d1, d2]);
    useDraftStore.setState({
      drafts: [d1, d2],
      isLoading: false,
    });

    render(<DraftGrid />);
    expect(screen.getByText('Typescript strict mode')).toBeInTheDocument();
    expect(screen.getByText('Python indentation error')).toBeInTheDocument();

    const searchInput = screen.getByPlaceholderText(/Search drafts/i);
    fireEvent.change(searchInput, { target: { value: 'Typescript' } });

    await waitFor(() => {
      expect(screen.getByText('Typescript strict mode')).toBeInTheDocument();
      expect(screen.queryByText('Python indentation error')).not.toBeInTheDocument();
    });
  });

  it('navigates to editor when Open button on card is clicked', async () => {
    const onNavigate = vi.fn();
    const testDraft = {
      id: 'd1',
      title: 'React 19 Hooks',
      template: sampleTemplate,
      textLayers: [],
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    };
    draftStorage.persist([testDraft]);

    render(<DraftGrid onNavigate={onNavigate} />);
    const openBtn = await screen.findByRole('button', { name: /Open/i });
    fireEvent.click(openBtn);

    expect(onNavigate).toHaveBeenCalledWith('/editor');
  });
});
