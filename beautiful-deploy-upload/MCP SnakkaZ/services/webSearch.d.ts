/**
 * Web Search Service for SnakkaZ MCP Server
 * Multiple search provider implementations as alternatives to Tavily
 */
export interface SearchResult {
    title: string;
    url: string;
    snippet: string;
    source: string;
    timestamp?: string;
}
export interface SearchOptions {
    maxResults?: number;
    language?: string;
    region?: string;
    safeSearch?: boolean;
}
/**
 * DuckDuckGo Search (No API key required)
 */
export declare class DuckDuckGoSearch {
    search(query: string, options?: SearchOptions): Promise<SearchResult[]>;
}
/**
 * Wikipedia Search (No API key required)
 */
export declare class WikipediaSearch {
    search(query: string, options?: SearchOptions): Promise<SearchResult[]>;
}
/**
 * GitHub Search (No API key required for basic search)
 */
export declare class GitHubSearch {
    search(query: string, options?: SearchOptions): Promise<SearchResult[]>;
}
/**
 * Norwegian Tech News Search
 */
export declare class NorwegianTechSearch {
    private techSites;
    search(query: string, options?: SearchOptions): Promise<SearchResult[]>;
}
/**
 * Bing Search (DEPRECATED - Microsoft retiring Bing Search API in 2025)
 * Note: This provider is optional and the system works perfectly without it
 */
export declare class BingSearch {
    private apiKey?;
    constructor(apiKey?: string | undefined);
    search(query: string, options?: SearchOptions): Promise<SearchResult[]>;
}
/**
 * Combined Search Service
 */
export declare class WebSearchService {
    private duckduckgo;
    private wikipedia;
    private github;
    private norwegianTech;
    private bing?;
    constructor(bingApiKey?: string);
    search(query: string, options?: SearchOptions & {
        providers?: string[];
    }): Promise<SearchResult[]>;
    /**
     * Search specifically for Norwegian tech content
     */
    searchNorwegianTech(query: string, options?: SearchOptions): Promise<SearchResult[]>;
    /**
     * Search for development resources
     */
    searchDevelopment(query: string, options?: SearchOptions): Promise<SearchResult[]>;
}
//# sourceMappingURL=webSearch.d.ts.map