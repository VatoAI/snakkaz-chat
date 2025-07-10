/**
 * Web Search Service for SnakkaZ MCP Server
 * Multiple search provider implementations as alternatives to Tavily
 */
import axios from 'axios';
import * as cheerio from 'cheerio';
/**
 * DuckDuckGo Search (No API key required)
 */
export class DuckDuckGoSearch {
    async search(query, options = {}) {
        try {
            const { maxResults = 10 } = options;
            // DuckDuckGo Instant Answer API
            const response = await axios.get('https://api.duckduckgo.com/', {
                params: {
                    q: query,
                    format: 'json',
                    no_html: '1',
                    skip_disambig: '1'
                },
                headers: {
                    'User-Agent': 'SnakkaZ MCP Server/1.0.0'
                }
            });
            const data = response.data;
            const results = [];
            // Add abstract if available
            if (data.Abstract) {
                results.push({
                    title: data.Heading || 'DuckDuckGo Result',
                    url: data.AbstractURL || '',
                    snippet: data.Abstract,
                    source: 'DuckDuckGo',
                    timestamp: new Date().toISOString()
                });
            }
            // Add related topics
            if (data.RelatedTopics) {
                for (const topic of data.RelatedTopics.slice(0, maxResults - results.length)) {
                    if (topic.Text && topic.FirstURL) {
                        results.push({
                            title: topic.Text.split(' - ')[0] || 'Related Topic',
                            url: topic.FirstURL,
                            snippet: topic.Text,
                            source: 'DuckDuckGo',
                            timestamp: new Date().toISOString()
                        });
                    }
                }
            }
            return results.slice(0, maxResults);
        }
        catch (error) {
            console.error('DuckDuckGo search error:', error);
            return [];
        }
    }
}
/**
 * Wikipedia Search (No API key required)
 */
export class WikipediaSearch {
    async search(query, options = {}) {
        try {
            const { maxResults = 5, language = 'en' } = options;
            // Use Norwegian Wikipedia for Norwegian queries
            const lang = query.match(/[æøåÆØÅ]/) ? 'no' : language;
            const searchResponse = await axios.get(`https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`, {
                headers: {
                    'User-Agent': 'SnakkaZ MCP Server/1.0.0'
                }
            });
            const page = searchResponse.data;
            const results = [];
            if (page.extract) {
                results.push({
                    title: page.title,
                    url: page.content_urls?.desktop?.page || '',
                    snippet: page.extract,
                    source: 'Wikipedia',
                    timestamp: new Date().toISOString()
                });
            }
            // Search for additional pages
            const listResponse = await axios.get(`https://${lang}.wikipedia.org/w/api.php`, {
                params: {
                    action: 'query',
                    format: 'json',
                    list: 'search',
                    srsearch: query,
                    srlimit: maxResults - 1
                },
                headers: {
                    'User-Agent': 'SnakkaZ MCP Server/1.0.0'
                }
            });
            if (listResponse.data.query?.search) {
                for (const item of listResponse.data.query.search) {
                    results.push({
                        title: item.title,
                        url: `https://${lang}.wikipedia.org/wiki/${encodeURIComponent(item.title)}`,
                        snippet: item.snippet.replace(/<[^>]*>/g, ''), // Remove HTML tags
                        source: 'Wikipedia',
                        timestamp: new Date().toISOString()
                    });
                }
            }
            return results.slice(0, maxResults);
        }
        catch (error) {
            console.error('Wikipedia search error:', error);
            return [];
        }
    }
}
/**
 * GitHub Search (No API key required for basic search)
 */
export class GitHubSearch {
    async search(query, options = {}) {
        try {
            const { maxResults = 10 } = options;
            const response = await axios.get('https://api.github.com/search/repositories', {
                params: {
                    q: query,
                    sort: 'stars',
                    order: 'desc',
                    per_page: maxResults
                },
                headers: {
                    'User-Agent': 'SnakkaZ MCP Server/1.0.0',
                    'Accept': 'application/vnd.github.v3+json'
                }
            });
            return response.data.items.map((repo) => ({
                title: `${repo.full_name} ⭐ ${repo.stargazers_count}`,
                url: repo.html_url,
                snippet: repo.description || 'No description available',
                source: 'GitHub',
                timestamp: new Date().toISOString()
            }));
        }
        catch (error) {
            console.error('GitHub search error:', error);
            return [];
        }
    }
}
/**
 * Norwegian Tech News Search
 */
export class NorwegianTechSearch {
    techSites = [
        'https://www.digi.no',
        'https://www.tek.no',
        'https://www.dn.no/teknologi',
        'https://www.kode24.no'
    ];
    async search(query, options = {}) {
        try {
            const { maxResults = 5 } = options;
            const results = [];
            // Search Norwegian tech sites
            for (const site of this.techSites) {
                try {
                    const searchUrl = `${site}/search?q=${encodeURIComponent(query)}`;
                    const response = await axios.get(searchUrl, {
                        headers: {
                            'User-Agent': 'SnakkaZ MCP Server/1.0.0'
                        },
                        timeout: 5000
                    });
                    const $ = cheerio.load(response.data);
                    // Generic selectors for article links
                    const articles = $('article, .article, .news-item, .post').slice(0, 3);
                    articles.each((_, element) => {
                        const $el = $(element);
                        const title = $el.find('h1, h2, h3, .title, .headline').first().text().trim();
                        const link = $el.find('a').first().attr('href');
                        const snippet = $el.find('p, .excerpt, .summary').first().text().trim();
                        if (title && link) {
                            const fullUrl = link.startsWith('http') ? link : `${site}${link}`;
                            results.push({
                                title,
                                url: fullUrl,
                                snippet: snippet.substring(0, 200),
                                source: new URL(site).hostname,
                                timestamp: new Date().toISOString()
                            });
                        }
                    });
                }
                catch (siteError) {
                    console.warn(`Search failed for ${site}:`, siteError);
                }
                if (results.length >= maxResults)
                    break;
            }
            return results.slice(0, maxResults);
        }
        catch (error) {
            console.error('Norwegian tech search error:', error);
            return [];
        }
    }
}
/**
 * Bing Search (DEPRECATED - Microsoft retiring Bing Search API in 2025)
 * Note: This provider is optional and the system works perfectly without it
 */
export class BingSearch {
    apiKey;
    constructor(apiKey) {
        this.apiKey = apiKey;
    }
    async search(query, options = {}) {
        if (!this.apiKey) {
            console.warn('Bing search requires API key');
            return [];
        }
        try {
            const { maxResults = 10, language = 'no-NO', region = 'NO' } = options;
            const response = await axios.get('https://api.bing.microsoft.com/v7.0/search', {
                params: {
                    q: query,
                    count: maxResults,
                    mkt: language,
                    cc: region,
                    safeSearch: options.safeSearch ? 'Strict' : 'Moderate'
                },
                headers: {
                    'Ocp-Apim-Subscription-Key': this.apiKey,
                    'User-Agent': 'SnakkaZ MCP Server/1.0.0'
                }
            });
            return response.data.webPages?.value?.map((result) => ({
                title: result.name,
                url: result.url,
                snippet: result.snippet,
                source: 'Bing',
                timestamp: new Date().toISOString()
            })) || [];
        }
        catch (error) {
            console.error('Bing search error:', error);
            return [];
        }
    }
}
/**
 * Combined Search Service
 */
export class WebSearchService {
    duckduckgo = new DuckDuckGoSearch();
    wikipedia = new WikipediaSearch();
    github = new GitHubSearch();
    norwegianTech = new NorwegianTechSearch();
    bing;
    constructor(bingApiKey) {
        // Bing Search API is being retired by Microsoft in 2025
        // The system works perfectly without it using other providers
        if (bingApiKey) {
            console.warn('Warning: Bing Search API is being retired by Microsoft in 2025. Consider using alternative providers.');
            this.bing = new BingSearch(bingApiKey);
        }
    }
    async search(query, options = {}) {
        const { providers = ['duckduckgo', 'wikipedia'], maxResults = 10 } = options;
        const allResults = [];
        // Determine if this is a Norwegian tech query
        const isNorwegianTech = query.match(/[æøåÆØÅ]/) ||
            query.toLowerCase().includes('norge') ||
            query.toLowerCase().includes('norway') ||
            query.toLowerCase().includes('oslo') ||
            query.toLowerCase().includes('bergen') ||
            query.toLowerCase().includes('trondheim');
        // Add Norwegian tech search for relevant queries
        if (isNorwegianTech && !providers.includes('norwegian-tech')) {
            providers.unshift('norwegian-tech');
        }
        // Search each provider
        for (const provider of providers) {
            try {
                let results = [];
                switch (provider) {
                    case 'duckduckgo':
                        results = await this.duckduckgo.search(query, options);
                        break;
                    case 'wikipedia':
                        results = await this.wikipedia.search(query, options);
                        break;
                    case 'github':
                        results = await this.github.search(query, options);
                        break;
                    case 'norwegian-tech':
                        results = await this.norwegianTech.search(query, options);
                        break;
                    case 'bing':
                        if (this.bing) {
                            results = await this.bing.search(query, options);
                        }
                        break;
                }
                allResults.push(...results);
            }
            catch (error) {
                console.error(`Search provider ${provider} failed:`, error);
            }
        }
        // Remove duplicates and limit results
        const uniqueResults = allResults.filter((result, index, array) => array.findIndex(r => r.url === result.url) === index);
        return uniqueResults.slice(0, maxResults);
    }
    /**
     * Search specifically for Norwegian tech content
     */
    async searchNorwegianTech(query, options = {}) {
        return this.search(query, {
            ...options,
            providers: ['norwegian-tech', 'wikipedia', 'github'],
            language: 'no',
            region: 'NO'
        });
    }
    /**
     * Search for development resources
     */
    async searchDevelopment(query, options = {}) {
        return this.search(query, {
            ...options,
            providers: ['github', 'duckduckgo', 'wikipedia']
        });
    }
}
//# sourceMappingURL=webSearch.js.map