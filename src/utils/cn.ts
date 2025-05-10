/**
 * Class name utility for conditionally joining class names
 */

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility for conditionally joining class names together using clsx and tailwind-merge.
 * This helps avoid class conflicts when using utility-first CSS like Tailwind.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
