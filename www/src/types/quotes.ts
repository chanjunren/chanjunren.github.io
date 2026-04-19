export interface QuoteContent {
  quote: string;
  meaning: string;
  background: string;
  source: string;
  sourceInfo: string;
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

export interface ModelAggregation {
  model: string;
  count: number;
  promptTokens: number;
  completionTokens: number;
}

export interface DailyAggregation {
  date: string;
  count: number;
  promptTokens: number;
  completionTokens: number;
}

export interface TokenTotals {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}

export interface QuoteSummary {
  totalQuotes: number;
  tokenTotals: TokenTotals;
  byModel: ModelAggregation[];
  byDate: DailyAggregation[];
  generatedAt: string;
}
