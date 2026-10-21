import type { MemeTemplate } from './template';

/**
 * Standard API envelope format expected from Nithish's backend.
 */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiPagination {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: ApiPagination;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, string[]>;
  };
}

export interface TemplateQueryParams {
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: 'popular' | 'latest' | 'name';
}

export type TemplateListResponse = ApiResponse<PaginatedResponse<MemeTemplate>>;
export type TemplateDetailResponse = ApiResponse<MemeTemplate>;

export interface MemeGenerateRequest {
  templateId: string;
  texts: {
    text: string;
    x: number;
    y: number;
    fontSize: number;
    color: string;
    strokeColor?: string;
    isBold?: boolean;
    isUppercase?: boolean;
  }[];
  format?: 'png' | 'jpeg' | 'webp';
  quality?: number;
}

export type MemeGenerateResponse = ApiResponse<{
  memeId: string;
  imageUrl: string;
  downloadUrl: string;
  width: number;
  height: number;
  createdAt: string;
}>;
