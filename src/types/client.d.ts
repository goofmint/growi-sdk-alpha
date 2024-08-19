import { PagePamams } from "./page";
import { UserParams } from "./user";
import { AttachmentParams } from "./attachment";

export interface GrowiInitParams {
	apiToken: string;
	url?: string;
	path?: string;
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export interface SearchParams {
	q?: string;
	nq?: string;
	limit?: number;
	offset?: number;
	sort?: string;
	order?: string;
}

export interface SearchResult {
	total: number;
	took: number;
	hitsCount: number;
	pages: Page[];
}

export interface SearchResultResponse {
  meta: Meta
  data: Daum[]
  ok: boolean
}

export interface Meta {
  total: number
  took: number
  hitsCount: number
}

export interface Daum {
  data: PagePamams
  meta: Meta2
}

export interface Meta2 {
  bookmarkCount: number
  elasticSearchResult: ElasticSearchResult
}

export interface ElasticSearchResult {
  snippet: any
  highlightedPath: any
}
