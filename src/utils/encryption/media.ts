
/**
 * Re-exports from media encryption module for backward compatibility
 */
export * from './media/index';

// Add the encryptBlob function as an alias of encryptMedia for backward compatibility
import { encryptMedia } from './media/index';
export const encryptBlob = encryptMedia;
