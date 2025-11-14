export interface QuoteContent {
  quote: string;
  meaning: string;
  background: string;
  source: string;
  pinyin: string;
}

export interface MateriaPromptOutput {
  id: number;
  content: QuoteContent;
  contentHash: string;
  sourceId: number;
  model?: string;
  promptTokens?: number;
  completionTokens?: number;
  totalTokens?: number;
  createdAt: string;
}

export interface QuotesResponse {
  quotes: MateriaPromptOutput[];
  page: number;
  limit: number;
  totalCount: number;
  hasMore: boolean;
}
