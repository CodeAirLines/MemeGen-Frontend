import { apiRequest } from './apiClient';
import { SAMPLE_TEMPLATES } from '../constants/templates';
import type {
  MemeTemplate,
  TemplateCategory,
  TemplateListResponse,
  TemplateDetailResponse,
  TemplateQueryParams,
} from '../types';

/**
 * Service contract for Template endpoints.
 * When Nithish deploys the backend, apiRequest will hit the live endpoints.
 * During Day 1 frontend foundation development, it falls back to sample data.
 */
export const templateService = {
  /**
   * Fetch all templates with optional filtering and pagination.
   * Future Backend Route: GET /templates?category=...&search=...&page=...&limit=...
   */
  async getTemplates(params?: TemplateQueryParams): Promise<MemeTemplate[]> {
    // If running in development and API is not yet provisioned, use curated sample data
    const isMockFallback = import.meta.env.VITE_MOCK_API_FALLBACK !== 'false';

    if (isMockFallback) {
      let filtered = [...SAMPLE_TEMPLATES];

      if (params?.category && params.category !== 'all') {
        filtered = filtered.filter(
          (t) => t.category.toLowerCase() === (params.category as TemplateCategory)?.toLowerCase()
        );
      }

      if (params?.search && params.search.trim() !== '') {
        const query = params.search.toLowerCase().trim();
        filtered = filtered.filter(
          (t) =>
            t.name.toLowerCase().includes(query) ||
            t.tags.some((tag) => tag.toLowerCase().includes(query))
        );
      }

      return filtered;
    }

    const query = new URLSearchParams();
    if (params?.category) query.set('category', params.category);
    if (params?.search) query.set('search', params.search);
    if (params?.page) query.set('page', String(params.page));
    if (params?.limit) query.set('limit', String(params.limit));

    const queryString = query.toString() ? `?${query.toString()}` : '';
    const response = await apiRequest<TemplateListResponse>(`/templates${queryString}`);
    return response.data.items;
  },

  /**
   * Fetch single template details by ID.
   * Future Backend Route: GET /templates/:id
   */
  async getTemplateById(id: string): Promise<MemeTemplate | null> {
    const isMockFallback = import.meta.env.VITE_MOCK_API_FALLBACK !== 'false';

    if (isMockFallback) {
      const found = SAMPLE_TEMPLATES.find((t) => t.id === id);
      return found || null;
    }

    const response = await apiRequest<TemplateDetailResponse>(`/templates/${id}`);
    return response.data;
  },
};
