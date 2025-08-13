import React, { useEffect, useRef } from 'react';

interface MatrixRainProps {
    className?: string;
}

// 🎯 EKTE MATRIX RAIN ANIMATION - som i videoen
export const MatrixRain: React.FC<MatrixRainProps> = ({ className }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas size
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Psychedelic Matrix karakterer - inspirert av Alex Grey kunstverket  
        const matrix = "◉●○◐◑◒◓◔◕◖◗◘◙◚◛◜◝◞◟◠◡◢◣◤◥◦◧◨◩◪◫◬◭◮◯◰◱◲◳◴◵◶◷◸◹◺◻◼◽◾◿☀☁☂☃☄★☆☇☈☉☊☋☌☍☎☏☐☑☒☓☔☕☖☗☘☙☚☛☜☝☞☟☠☡☢☣☤☥☦☧☨☩☪☫☬☭☮☯☰☱☲☳☴☵☶☷☸☹☺☻☼☽☾☿♀♁♂♃♄♅♆♇♈♉♊♋♌♍♎♏♐♑♒♓♔♕♖♗♘♙♚♛♜♝♞♟♠♡♢♣♤♥♦♧♨♩♪♫♬♭♮♯♰♱♲♳♴♵♶♷♸♹♺♻♼♽♾♿⚀⚁⚂⚃⚄⚅⚆⚇⚈⚉⚊⚋⚌⚍⚎⚏⚐⚑⚒⚓⚔⚕⚖⚗⚘⚙⚚⚛⚜⚝⚞⚟⚠⚡⚢⚣⚤⚥⚦⚧⚨⚩⚪⚫⚬⚭⚮⚯⚰⚱⚲⚳⚴⚵⚶⚷⚸⚹⚺⚻⚼⚽⚾⚿0123456789ABCDEF";
        const matrixArray = matrix.split("");

        const font_size = 14;
        const columns = canvas.width / font_size;

        // Array of drops - one per column
        const drops: number[] = [];
        for (let x = 0; x < columns; x++) {
            drops[x] = 1;
        }

        // Drawing function
        const draw = () => {
            // More transparent fade to let background image show through
            ctx.fillStyle = 'rgba(10, 15, 27, 0.02)'; // Much more transparent
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = '#64b5f6';  // SnakkaZ cyberblue
            ctx.font = `${font_size}px monospace`;

            // Looping over drops
            for (let i = 0; i < drops.length; i++) {
                // Random character
                const text = matrixArray[Math.floor(Math.random() * matrixArray.length)];

                // x = i * font_size, y = value of drops[i] * font_size
                ctx.fillStyle = '#64b5f6'; // SnakkaZ cyberblue  
                ctx.shadowColor = '#64b5f6';
                ctx.shadowBlur = 8;
                ctx.fillText(text, i * font_size, drops[i] * font_size);

                // Add glow effect for leading character
                if (drops[i] * font_size > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        };

        // Animation loop
        const interval = setInterval(draw, 35);

        return () => {
            clearInterval(interval);
            window.removeEventListener('resize', resizeCanvas);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className={`fixed inset-0 bg-black ${className}`}
            style={{ zIndex: -1 }}
        />
    );
};

// 🚀 PSYCHEDELIC MATRIX LOADING SCREEN med Alex Grey øye-kunst
export const MatrixLoadingScreen: React.FC<{ message?: string }> = ({
    message = "Krypterer forbindelse..."
}) => {
    return (
        <div className="fixed inset-0 bg-cyberdark-950 flex items-center justify-center z-50">
            {/* Matrix Rain Background */}
            <MatrixRain />

            {/* Alex Grey Psychedelic Background Image - Forenklet for bedre synlighet */}
            <div
                className="absolute inset-0 pointer-events-none z-0"
                style={{
                    backgroundImage: 'url(/81-ZGd6LFUL.jpg)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center center',
                    backgroundRepeat: 'no-repeat',
                    opacity: 0.7,
                    filter: 'brightness(0.8) contrast(1.1)'
                }}
            />

            {/* Gradient overlay for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyberdark-950/80 via-transparent to-cyberdark-950/60 pointer-events-none" />

            {/* Psychedelic Eye Center Piece - Now integrated with background */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="relative">
                    {/* Central Eye/Portal Effect - More subtle to blend with background */}
                    <div className="w-48 h-48 rounded-full bg-gradient-to-r from-cyberblue-500/30 via-purple-500/20 to-cyan-500/30 animate-pulse">
                        <div className="w-full h-full rounded-full bg-gradient-to-br from-transparent via-cyberblue-400/10 to-purple-600/20 flex items-center justify-center">
                            {/* Inner Eye - More subtle */}
                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyberblue-300/20 to-purple-400/20 flex items-center justify-center animate-pulse">
                                <div className="w-12 h-12 rounded-full bg-cyberdark-950/50 flex items-center justify-center backdrop-blur-sm">
                                    {/* Pupil with SnakkaZ reflection */}
                                    <div className="w-6 h-6 rounded-full bg-cyberblue-400 animate-ping"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Radiating patterns around eye - More subtle */}
                    <div className="absolute inset-0 animate-spin opacity-40" style={{ animationDuration: '30s' }}>
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div
                                key={i}
                                className="absolute w-0.5 h-6 bg-gradient-to-t from-cyberblue-500/30 to-transparent"
                                style={{
                                    top: '50%',
                                    left: '50%',
                                    transformOrigin: 'center',
                                    transform: `translate(-50%, -50%) rotate(${i * 45}deg) translateY(-100px)`
                                }}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Loading Content - positioned below, with better backdrop */}
            <div className="relative z-10 text-center mt-80">
                {/* Neon Loading Bar */}
                <div className="mb-8">
                    <div className="w-80 mx-auto bg-cyberdark-800/80 backdrop-blur-sm rounded-full h-3 overflow-hidden border border-cyberblue-400/40">
                        <div className="h-full bg-gradient-to-r from-cyberblue-400 to-cyan-400 rounded-full animate-pulse shadow-lg shadow-cyberblue-400/50"></div>
                    </div>

                    {/* Loading percentage simulation */}
                    <div className="text-cyberblue-400 font-mono text-sm mt-2 animate-pulse drop-shadow-lg">
                        {'[████████████████████████████] 100%'}
                    </div>
                </div>

                {/* SnakkaZ Logo */}
                <h1 className="text-5xl font-bold text-cyberblue-400 mb-4 font-mono tracking-wider drop-shadow-lg" style={{
                    textShadow: '0 0 20px rgba(100, 181, 246, 0.8), 0 0 40px rgba(100, 181, 246, 0.4)'
                }}>
                    SNAKKAZ
                </h1>

                {/* Status Message */}
                <p className="text-cyberblue-300 text-lg font-mono animate-pulse mb-4 drop-shadow-lg">
                    {message}
                </p>

                {/* Matrix-style status lines */}
                <div className="text-cyberblue-400/90 font-mono text-xs space-y-1 bg-cyberdark-950/40 backdrop-blur-sm p-4 rounded-lg border border-cyberblue-400/20">
                    <div className="animate-pulse">{'> Activating interdimensional protocols...'}</div>
                    <div className="animate-pulse" style={{ animationDelay: '0.5s' }}>
                        {'> Synchronizing with cosmic consciousness...'}</div>
                    <div className="animate-pulse" style={{ animationDelay: '1s' }}>
                        {'> Loading Alex Grey visual matrix...'}</div>
                    <div className="animate-pulse" style={{ animationDelay: '1.5s' }}>
                        {'> Third eye opened. Welcome to SnakkaZ dimension.'}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MatrixLoadingScreen;
