// filepath: /workspaces/snakkaz-chat/src/utils/textProcessor.tsx
import React from 'react';
import { SafeLink } from '@/components/ui/SafeLink';

/**
 * Regex-mønster for å gjenkjenne URL-er i tekst
 */
const URL_REGEX = /(https?:\/\/[^\s]+)/gi;

/**
 * Prosesserer tekst og konverterer URL-er til klikkbare SafeLink-komponenter
 * @param text - Den originale teksten som kan inneholde URL-er
 * @returns Array av React-noder der URL-er er konvertert til SafeLink-komponenter
 */
export const processTextWithLinks = (text: string): React.ReactNode[] => {
    if (!text) return [];

    // Del teksten ved URL-er
    const parts = text.split(URL_REGEX);
    // Finn alle URL-matcher
    const matches = text.match(URL_REGEX) || [];

    // Bygg opp resultatet ved å veksle mellom tekst og lenker
    const result: React.ReactNode[] = [];

    parts.forEach((part, i) => {
        // Legg til tekstdelen først
        if (part) {
            result.push(<React.Fragment key={`text-${i}`}>{part}</React.Fragment>);
        }

        // Legg til URL som SafeLink hvis det er en match for denne posisjonen
        if (matches[i]) {
            result.push(
                <SafeLink key={`link-${i}`} href={matches[i]}>
                    {matches[i]}
                </SafeLink>
            );
        }
    });

    return result;
};