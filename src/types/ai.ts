export type AiTone = 'funny' | 'sarcastic' | 'wholesome' | 'dark-humor' | 'relatable';

export type AiLanguage = 'en' | 'ta';

export type AiCategory =
  | 'everyday'
  | 'student'
  | 'work'
  | 'relationships'
  | 'tamil-humor';

export interface AiCaptionSuggestion {
  id: string;
  topText?: string;
  bottomText?: string;
  singleText: string;
  tone: AiTone;
  language: AiLanguage;
  category: AiCategory;
}

export interface AiPromptIdea {
  id: string;
  category: AiCategory;
  title: string;
  prompt: string;
  tone: AiTone;
  language: AiLanguage;
  previewTemplateHint?: string;
}

export interface AiGenerationRequest {
  prompt: string;
  tone: AiTone;
  language: AiLanguage;
  category?: AiCategory;
  templateId?: string;
  count?: number;
}

export interface AiGenerationResponse {
  isDemo: boolean;
  provider: string;
  captions: AiCaptionSuggestion[];
  disclaimer?: string;
}
