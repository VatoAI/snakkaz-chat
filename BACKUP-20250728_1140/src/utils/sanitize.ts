/**
 * Sikkerhetsverktøy for å sanitere brukerinput og forhindre XSS-angrep
 */
import DOMPurify from 'dompurify';

/**
 * Saniterer HTML-streng for å forhindre XSS-angrep
 * @param content - Den opprinnelige HTML-strengen som skal saniteres
 * @returns Sanitert HTML-streng
 */
export const sanitizeHtml = (content: string): string => {
    if (!content) return '';

    // Bruk DOMPurify med sikre innstillinger
    return DOMPurify.sanitize(content, {
        ALLOWED_TAGS: [
            'b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li',
            'code', 'pre', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'span'
        ],
        ALLOWED_ATTR: ['href', 'target', 'class', 'id', 'style'],
        FORBID_TAGS: ['script', 'iframe', 'object', 'embed', 'form', 'input'],
        FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'style'],
        ALLOW_DATA_ATTR: false
    });
};

/**
 * Saniterer tekst fullstendig ved å fjerne all HTML
 * @param text - Den opprinnelige teksten som skal saniteres
 * @returns Ren tekst uten HTML-kode
 */
export const sanitizeText = (text: string): string => {
    if (!text) return '';

    // Fjern all HTML med DOMPurify
    return DOMPurify.sanitize(text, {
        ALLOWED_TAGS: [],
        ALLOWED_ATTR: []
    });
};

/**
 * Saniterer URL-er for å forhindre javascript: og data: URL-er
 * @param url - Den opprinnelige URL-en som skal saniteres
 * @returns Sanitert URL eller tom streng hvis den er skadelig
 */
export const sanitizeUrl = (url: string): string => {
    if (!url) return '';

    // Fjern farlige URL-protokoller
    const sanitized = url.trim().toLowerCase();

    if (
        sanitized.startsWith('javascript:') ||
        sanitized.startsWith('data:') ||
        sanitized.includes('script:')
    ) {
        return '';
    }

    return url;
};

/**
 * Saniterer JSON-input for å forhindre prototype pollution
 * @param json - JSON-objekt som skal saniteres
 * @returns Sanitert kopi av JSON-objektet
 */
export const sanitizeJson = <T extends object>(json: T): T => {
    if (!json) return {} as T;

    const sanitized = { ...json };

    // Fjern potensielt farlige egenskaper
    const dangerousProps = ['__proto__', 'constructor', 'prototype'];

    const recursiveSanitize = (obj: any): any => {
        if (typeof obj !== 'object' || obj === null) return obj;

        if (Array.isArray(obj)) {
            return obj.map(item => recursiveSanitize(item));
        }

        const clean: any = {};

        for (const key in obj) {
            if (dangerousProps.includes(key)) continue;
            clean[key] = recursiveSanitize(obj[key]);
        }

        return clean;
    };

    return recursiveSanitize(sanitized);
};