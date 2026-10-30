export type TemplateCategory =
  | 'All'
  | 'Trending'
  | 'Classic'
  | 'Animals'
  | 'Movies & TV'
  | 'Reactions'
  | 'Gaming'
  | 'Business'
  | string;

export interface MemeTemplate {
  id: string;
  name: string;
  imageUrl: string;
  width: number;
  height: number;
  boxCount: number;
  category: string;
  tags: string[];
  description: string;
  usageCount: number;
  isTrending?: boolean;
  createdAt?: string;
  defaultTextSlots?: {
    id: string;
    placeholder: string;
    defaultYPercent: number;
  }[];
}
