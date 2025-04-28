// filepath: /workspaces/snakkaz-chat/src/components/ui/SafeLink.tsx
import React from "react";
import { ExternalLink } from "lucide-react";
import { sanitizeUrl } from "@/utils/sanitize";

interface SafeLinkProps {
    href: string;
    children: React.ReactNode;
    className?: string;
}

/**
 * SafeLink-komponenten viser eksterne lenker på en sikker måte.
 * - Saniterer URL-er for å forhindre javascript: og data: URL-er
 * - Legger til rel="noopener noreferrer" for sikkerhetsformål
 * - Åpner lenker i nye faner med target="_blank"
 * - Viser et ikon for å indikere eksterne lenker
 */
export const SafeLink: React.FC<SafeLinkProps> = ({
    href,
    children,
    className = "",
}) => {
    // Saniterer URL-en før den brukes
    const sanitizedUrl = sanitizeUrl(href);

    // Ikke vis lenken hvis den er blokkert av sanitering
    if (!sanitizedUrl) {
        return <span className={className}>{children}</span>;
    }

    return (
        <a
            href={sanitizedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-1 text-cyberblue-400 hover:text-cyberblue-300 hover:underline ${className}`}
        >
            {children}
            <ExternalLink size={14} className="inline-flex" />
        </a>
    );
};