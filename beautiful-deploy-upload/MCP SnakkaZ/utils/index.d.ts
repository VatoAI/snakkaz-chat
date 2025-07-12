/**
 * SnakkaZ Utility Functions
 * Common utility functions for the SnakkaZ MCP Server
 */
import { SystemHealth, DeploymentStatus } from '../types/index.js';
/**
 * Format timestamp to Norwegian locale
 */
export declare function formatNorwegianTimestamp(timestamp: string): string;
/**
 * Generate unique ID for SnakkaZ entities
 */
export declare function generateSnakkaZId(prefix?: string): string;
/**
 * Check if a string contains Norwegian characters
 */
export declare function isNorwegianText(text: string): boolean;
/**
 * Translate common tech terms to Norwegian
 */
export declare function translateTechTerm(term: string): string;
/**
 * Calculate system health score
 */
export declare function calculateHealthScore(components: SystemHealth[]): number;
/**
 * Get Norwegian region name
 */
export declare function getNorwegianRegionName(region: string): string;
/**
 * Validate SnakkaZ message content
 */
export declare function validateMessageContent(content: string): {
    isValid: boolean;
    errors: string[];
};
/**
 * Format deployment status for display
 */
export declare function formatDeploymentStatus(deployment: DeploymentStatus): string;
/**
 * Get current Norwegian time
 */
export declare function getCurrentNorwegianTime(): string;
/**
 * Check if current time is within Norwegian business hours
 */
export declare function isNorwegianBusinessHours(): boolean;
//# sourceMappingURL=index.d.ts.map