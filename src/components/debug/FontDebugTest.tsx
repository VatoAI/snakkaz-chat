/**
 * Font & Design Debug Component
 * For å finne ut hva som er galt med type/design
 */

import React, { useEffect, useState } from 'react';

export const FontDebugTest: React.FC = () => {
    const [fontStatus, setFontStatus] = useState({
        orbitronLoaded: false,
        spaceGroteskLoaded: false,
        designSystemLoaded: false,
        cssVariables: {}
    });

    useEffect(() => {
        // Test font loading
        const checkFonts = async () => {
            try {
                const orbitron = await document.fonts.check('16px Orbitron');
                const spaceGrotesk = await document.fonts.check('16px "Space Grotesk"');

                // Test CSS variables
                const root = getComputedStyle(document.documentElement);
                const fontDisplay = root.getPropertyValue('--font-display');
                const fontBody = root.getPropertyValue('--font-body');

                setFontStatus({
                    orbitronLoaded: orbitron,
                    spaceGroteskLoaded: spaceGrotesk,
                    designSystemLoaded: !!fontDisplay,
                    cssVariables: {
                        fontDisplay,
                        fontBody,
                        liquidPrimary: root.getPropertyValue('--liquid-primary'),
                        glassBg: root.getPropertyValue('--liquid-glass-bg')
                    }
                });
            } catch (err) {
                console.error('Font check error:', err);
            }
        };

        checkFonts();

        // Re-check every 2 seconds
        const interval = setInterval(checkFonts, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="fixed top-4 left-4 z-50 bg-black/80 text-white p-4 rounded-lg max-w-md">
            <h3 className="font-bold mb-3">🔍 Font & Design Debug</h3>

            {/* Font Status */}
            <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                    <span className={fontStatus.orbitronLoaded ? 'text-green-400' : 'text-red-400'}>
                        {fontStatus.orbitronLoaded ? '✅' : '❌'}
                    </span>
                    <span>Orbitron Font</span>
                </div>

                <div className="flex items-center space-x-2">
                    <span className={fontStatus.spaceGroteskLoaded ? 'text-green-400' : 'text-red-400'}>
                        {fontStatus.spaceGroteskLoaded ? '✅' : '❌'}
                    </span>
                    <span>Space Grotesk Font</span>
                </div>

                <div className="flex items-center space-x-2">
                    <span className={fontStatus.designSystemLoaded ? 'text-green-400' : 'text-red-400'}>
                        {fontStatus.designSystemLoaded ? '✅' : '❌'}
                    </span>
                    <span>Design System CSS</span>
                </div>
            </div>

            {/* Font Samples */}
            <div className="mt-4 space-y-3">
                <div>
                    <div className="text-xs text-gray-400">Orbitron Sample:</div>
                    <h1 style={{ fontFamily: 'Orbitron, monospace', fontSize: '18px', fontWeight: 'bold' }}>
                        SNAKKAZ LOGG INN
                    </h1>
                </div>

                <div>
                    <div className="text-xs text-gray-400">Space Grotesk Sample:</div>
                    <p style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: '14px' }}>
                        Dette er Space Grotesk font for body text.
                    </p>
                </div>

                <div>
                    <div className="text-xs text-gray-400">CSS Variable Sample:</div>
                    <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 'bold' }}>
                        VAR(--font-display)
                    </h2>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px' }}>
                        var(--font-body) text
                    </p>
                </div>
            </div>

            {/* CSS Variables Debug */}
            <div className="mt-4 text-xs">
                <div className="text-gray-400">CSS Variables:</div>
                <pre className="text-xs overflow-x-auto">
                    {JSON.stringify(fontStatus.cssVariables, null, 2)}
                </pre>
            </div>
        </div>
    );
};

export default FontDebugTest;
