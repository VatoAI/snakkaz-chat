/**
 * SnakkaZ Utility Functions
 * Common utility functions for the SnakkaZ MCP Server
 */
/**
 * Format timestamp to Norwegian locale
 */
export function formatNorwegianTimestamp(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleString('nb-NO', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Europe/Oslo'
    });
}
/**
 * Generate unique ID for SnakkaZ entities
 */
export function generateSnakkaZId(prefix = 'snakkaz') {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 9);
    return `${prefix}_${timestamp}_${random}`;
}
/**
 * Check if a string contains Norwegian characters
 */
export function isNorwegianText(text) {
    const norwegianChars = /[æøåÆØÅ]/;
    return norwegianChars.test(text);
}
/**
 * Translate common tech terms to Norwegian
 */
export function translateTechTerm(term) {
    const translations = {
        'deployment': 'utrulling',
        'server': 'tjener',
        'database': 'database',
        'security': 'sikkerhet',
        'encryption': 'kryptering',
        'chat': 'chat',
        'message': 'melding',
        'user': 'bruker',
        'group': 'gruppe',
        'community': 'fellesskap',
        'developer': 'utvikler',
        'programming': 'programmering',
        'code': 'kode',
        'application': 'applikasjon',
        'system': 'system',
        'monitoring': 'overvåking',
        'performance': 'ytelse',
        'error': 'feil',
        'success': 'suksess',
        'failed': 'feilet'
    };
    return translations[term.toLowerCase()] || term;
}
/**
 * Calculate system health score
 */
export function calculateHealthScore(components) {
    const weights = {
        'healthy': 100,
        'degraded': 60,
        'unhealthy': 0
    };
    const totalScore = components.reduce((sum, component) => {
        return sum + weights[component.status];
    }, 0);
    return Math.round(totalScore / components.length);
}
/**
 * Get Norwegian region name
 */
export function getNorwegianRegionName(region) {
    const regions = {
        'oslo': 'Oslo',
        'bergen': 'Bergen',
        'trondheim': 'Trondheim',
        'stavanger': 'Stavanger',
        'tromso': 'Tromsø',
        'kristiansand': 'Kristiansand',
        'drammen': 'Drammen',
        'fredrikstad': 'Fredrikstad',
        'other': 'Annet'
    };
    return regions[region.toLowerCase()] || region;
}
/**
 * Validate SnakkaZ message content
 */
export function validateMessageContent(content) {
    const errors = [];
    if (!content || content.trim().length === 0) {
        errors.push('Meldingsinnhold kan ikke være tomt');
    }
    if (content.length > 2000) {
        errors.push('Melding kan ikke være lengre enn 2000 tegn');
    }
    // Check for potentially harmful content
    const suspiciousPatterns = [
        /<script/i,
        /javascript:/i,
        /on\w+\s*=/i,
        /eval\s*\(/i
    ];
    for (const pattern of suspiciousPatterns) {
        if (pattern.test(content)) {
            errors.push('Melding inneholder potensielt skadelig innhold');
            break;
        }
    }
    return {
        isValid: errors.length === 0,
        errors
    };
}
/**
 * Format deployment status for display
 */
export function formatDeploymentStatus(deployment) {
    const statusEmojis = {
        'pending': '⏳',
        'running': '🔄',
        'success': '✅',
        'failed': '❌'
    };
    const typeEmojis = {
        'normal': '📦',
        'emergency': '🚨',
        'hotfix': '🔧'
    };
    const statusEmoji = statusEmojis[deployment.status] || '❓';
    const typeEmoji = typeEmojis[deployment.type] || '📦';
    return `${statusEmoji} ${typeEmoji} ${deployment.type.toUpperCase()} - ${deployment.status.toUpperCase()}`;
}
/**
 * Get current Norwegian time
 */
export function getCurrentNorwegianTime() {
    return new Date().toLocaleString('nb-NO', {
        timeZone: 'Europe/Oslo',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
}
/**
 * Check if current time is within Norwegian business hours
 */
export function isNorwegianBusinessHours() {
    const now = new Date();
    const norwayTime = new Date(now.toLocaleString('en-US', { timeZone: 'Europe/Oslo' }));
    const hour = norwayTime.getHours();
    const day = norwayTime.getDay();
    // Monday to Friday, 8 AM to 5 PM Norwegian time
    return day >= 1 && day <= 5 && hour >= 8 && hour < 17;
}
//# sourceMappingURL=index.js.map