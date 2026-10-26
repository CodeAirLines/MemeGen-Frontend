import type { MemeDraft } from '../types/draft';
import { POPULAR_TEMPLATES } from '../constants/templates';

const DRAFTS_STORAGE_KEY = 'memegen_saved_drafts_v1';

// In-memory fallback if localStorage is disabled or throws quota/security exceptions
let memoryStorage: MemeDraft[] | null = null;

function isLocalStorageAvailable(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const testKey = '__storage_test__';
    window.localStorage.setItem(testKey, testKey);
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

/**
 * Creates initial demo drafts so the creator has sample drafts
 * when first accessing the Drafts page.
 */
function createInitialSeedDrafts(): MemeDraft[] {
  const shinchan = POPULAR_TEMPLATES[0] || {
    id: 'shinchan-not-that-special',
    name: 'Shinchan / Not That Special',
    imageUrl: '/shinchan-meme.jpg',
    width: 3554,
    height: 1999,
    boxCount: 2,
    category: 'trending',
    tags: ['shinchan'],
    description: '',
    usageCount: 1000,
  };

  const drake = POPULAR_TEMPLATES[1] || shinchan;

  const now = Date.now();
  const twoHoursAgo = new Date(now - 2 * 60 * 60 * 1000).toISOString();
  const yesterday = new Date(now - 24 * 60 * 60 * 1000).toISOString();
  const threeDaysAgo = new Date(now - 3 * 24 * 60 * 60 * 1000).toISOString();

  return [
    {
      id: 'draft-demo-1',
      title: 'Senior Dev vs Junior Dev Code Review',
      template: shinchan,
      textLayers: [
        {
          id: 'layer-1',
          text: 'WHEN MY PULL REQUEST GETS APPROVED WITH NO COMMENTS',
          xPercent: 50,
          yPercent: 12,
          fontSize: 34,
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
        {
          id: 'layer-2',
          text: 'I AM NOT REALLY THAT SPECIAL',
          xPercent: 50,
          yPercent: 88,
          fontSize: 36,
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
      createdAt: threeDaysAgo,
      updatedAt: twoHoursAgo,
    },
    {
      id: 'draft-demo-2',
      title: 'Console Log vs Debugger',
      template: drake,
      textLayers: [
        {
          id: 'layer-d1',
          text: 'USING MODERN BREAKPOINT DEBUGGER',
          xPercent: 50,
          yPercent: 22,
          fontSize: 30,
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
        {
          id: 'layer-d2',
          text: 'CONSOLE.LOG("HERE 123")',
          xPercent: 50,
          yPercent: 74,
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
      createdAt: yesterday,
      updatedAt: yesterday,
    },
  ];
}

/**
 * Draft Storage Adapter
 * Decoupled from React UI so an API client can be swapped seamlessly in the future.
 */
export const draftStorage = {
  /**
   * Retrieves all saved drafts from persistent storage.
   */
  async getAll(): Promise<MemeDraft[]> {
    if (!isLocalStorageAvailable()) {
      if (!memoryStorage) {
        memoryStorage = createInitialSeedDrafts();
      }
      return [...memoryStorage];
    }

    try {
      const raw = window.localStorage.getItem(DRAFTS_STORAGE_KEY);
      if (!raw) {
        const initial = createInitialSeedDrafts();
        window.localStorage.setItem(DRAFTS_STORAGE_KEY, JSON.stringify(initial));
        return initial;
      }

      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) {
        const initial = createInitialSeedDrafts();
        window.localStorage.setItem(DRAFTS_STORAGE_KEY, JSON.stringify(initial));
        return initial;
      }

      // Validate shape of each item to protect against malformed data
      return parsed.filter(
        (item): item is MemeDraft =>
          Boolean(
            item &&
              typeof item.id === 'string' &&
              typeof item.title === 'string' &&
              item.template &&
              Array.isArray(item.textLayers)
          )
      );
    } catch {
      // JSON parse error or storage read issue - return seed fallback
      return createInitialSeedDrafts();
    }
  },

  /**
   * Retrieves a single draft by ID.
   */
  async getById(id: string): Promise<MemeDraft | null> {
    const drafts = await this.getAll();
    return drafts.find((d) => d.id === id) || null;
  },

  /**
   * Saves or updates a draft. If draft.id exists in the collection, updates it;
   * otherwise creates a new entry.
   */
  async save(
    payload: Omit<MemeDraft, 'id' | 'createdAt' | 'updatedAt'> & {
      id?: string;
      createdAt?: string;
      updatedAt?: string;
    }
  ): Promise<MemeDraft> {
    const drafts = await this.getAll();
    const nowIso = new Date().toISOString();

    const existingIndex = payload.id ? drafts.findIndex((d) => d.id === payload.id) : -1;

    let savedDraft: MemeDraft;

    if (existingIndex >= 0) {
      // Update existing draft
      savedDraft = {
        ...drafts[existingIndex],
        ...payload,
        id: drafts[existingIndex].id,
        createdAt: drafts[existingIndex].createdAt || nowIso,
        updatedAt: nowIso,
      };
      drafts[existingIndex] = savedDraft;
    } else {
      // Create new draft with unique ID
      const newId = payload.id || `draft-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      savedDraft = {
        ...payload,
        id: newId,
        createdAt: payload.createdAt || nowIso,
        updatedAt: nowIso,
      };
      drafts.unshift(savedDraft);
    }

    this.persist(drafts);
    return savedDraft;
  },

  /**
   * Renames an existing draft.
   */
  async rename(id: string, newTitle: string): Promise<MemeDraft> {
    const drafts = await this.getAll();
    const index = drafts.findIndex((d) => d.id === id);
    if (index === -1) {
      throw new Error(`Draft with ID "${id}" was not found.`);
    }

    const updated: MemeDraft = {
      ...drafts[index],
      title: newTitle.trim(),
      updatedAt: new Date().toISOString(),
    };

    drafts[index] = updated;
    this.persist(drafts);
    return updated;
  },

  /**
   * Duplicates an existing draft.
   */
  async duplicate(id: string): Promise<MemeDraft> {
    const drafts = await this.getAll();
    const original = drafts.find((d) => d.id === id);
    if (!original) {
      throw new Error(`Draft with ID "${id}" not found.`);
    }

    const nowIso = new Date().toISOString();
    const duplicated: MemeDraft = {
      ...JSON.parse(JSON.stringify(original)),
      id: `draft-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      title: `${original.title} (Copy)`,
      createdAt: nowIso,
      updatedAt: nowIso,
    };

    drafts.unshift(duplicated);
    this.persist(drafts);
    return duplicated;
  },

  /**
   * Deletes a draft by ID.
   */
  async delete(id: string): Promise<boolean> {
    const drafts = await this.getAll();
    const filtered = drafts.filter((d) => d.id !== id);
    this.persist(filtered);
    return true;
  },

  /**
   * Synchronously or asynchronously writes to persistent storage.
   */
  persist(drafts: MemeDraft[]) {
    if (isLocalStorageAvailable()) {
      try {
        window.localStorage.setItem(DRAFTS_STORAGE_KEY, JSON.stringify(drafts));
      } catch (err) {
        console.warn('Unable to persist drafts to localStorage (quota or disabled):', err);
      }
    }
    memoryStorage = [...drafts];
  },
};
