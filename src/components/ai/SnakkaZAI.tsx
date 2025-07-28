import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import snakkaZRemoteAI from '@/services/ai/SnakkaZRemoteAIService';
import {
    Brain,
    Eye,
    Zap,
    Heart,
    Activity,
    MessageCircle,
    Sparkles,
    Volume2,
    Wifi,
    WifiOff
} from 'lucide-react';

interface SnakkaZAIProps {
    isActive?: boolean;
    isListening?: boolean;
    isThinking?: boolean;
    mood?: 'happy' | 'neutral' | 'curious' | 'focused' | 'sleepy';
    onInteraction?: () => void;
    onMessage?: (message: string) => void;
    onResponse?: (response: string) => void;
}

const SnakkaZAI: React.FC<SnakkaZAIProps> = ({
    isActive = false,
    isListening = false,
    isThinking = false,
    mood = 'neutral',
    onInteraction,
    onMessage,
    onResponse
}) => {
    const [eyePosition, setEyePosition] = useState({ x: 0, y: 0 });
    const [blinkState, setBlinkState] = useState(false);
    const [thoughtBubbles, setThoughtBubbles] = useState<Array<{ id: string; text: string; x: number; y: number }>>([]);
    const [isSpeaking] = useState(false);
    const [isAIOnline, setIsAIOnline] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState('Kobler til AI...');

    // Eye tracking effect
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isActive) return;

            const rect = document.getElementById('snakkaz-ai-face')?.getBoundingClientRect();
            if (!rect) return;

            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            const deltaX = e.clientX - centerX;
            const deltaY = e.clientY - centerY;

            // Limit eye movement
            const maxMove = 8;
            const x = Math.max(-maxMove, Math.min(maxMove, deltaX / 10));
            const y = Math.max(-maxMove, Math.min(maxMove, deltaY / 10));

            setEyePosition({ x, y });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [isActive]);

    // Blinking animation
    useEffect(() => {
        if (!isActive) return;

        const blinkInterval = setInterval(() => {
            setBlinkState(true);
            setTimeout(() => setBlinkState(false), 150);
        }, Math.random() * 3000 + 2000);

        return () => clearInterval(blinkInterval);
    }, [isActive]);

    // Check AI connection status
    useEffect(() => {
        const checkAIConnection = async () => {
            try {
                const status = snakkaZRemoteAI.getConnectionStatus();
                setIsAIOnline(status.online);

                if (!status.online) {
                    setConnectionStatus('Kobler til AI server...');
                    const connected = await snakkaZRemoteAI.checkConnection();
                    setIsAIOnline(connected);
                    setConnectionStatus(connected ? 'AI tilkoblet' : 'AI offline');
                } else {
                    setConnectionStatus('AI tilkoblet');
                }
            } catch (error) {
                setIsAIOnline(false);
                setConnectionStatus('AI utilgjengelig');
            }
        };

        checkAIConnection();

        // Check connection every 30 seconds
        const interval = setInterval(checkAIConnection, 30000);
        return () => clearInterval(interval);
    }, []);

    // Chat with AI function
    const chatWithAI = async (message: string) => {
        if (!isAIOnline) {
            console.warn('AI is offline, cannot send message');
            return;
        }

        try {
            const response = await snakkaZRemoteAI.generateSmartResponse(message, 'casual');
            onResponse?.(response);
        } catch (error) {
            console.error('AI chat error:', error);
            onResponse?.('Beklager, jeg har tekniske problemer akkurat nå. 🤖');
        }
    };

    // Thought bubbles when thinking
    useEffect(() => {
        if (!isThinking) {
            setThoughtBubbles([]);
            return;
        }

        const thoughts = [
            '🤔', '💭', '✨', '🧠', '💡', '🔍', '⚡', '🌊'
        ];

        const interval = setInterval(() => {
            const newBubble = {
                id: Math.random().toString(36),
                text: thoughts[Math.floor(Math.random() * thoughts.length)],
                x: Math.random() * 100,
                y: Math.random() * 50
            };

            setThoughtBubbles(prev => [...prev.slice(-2), newBubble]);
        }, 800);

        return () => clearInterval(interval);
    }, [isThinking]);

    const getEyeStyle = (mood: string) => {
        switch (mood) {
            case 'happy':
                return 'bg-blue-500 shadow-lg shadow-blue-300';
            case 'curious':
                return 'bg-purple-500 shadow-lg shadow-purple-300';
            case 'focused':
                return 'bg-green-500 shadow-lg shadow-green-300';
            case 'sleepy':
                return 'bg-gray-400 shadow-lg shadow-gray-300';
            default:
                return 'bg-blue-400 shadow-lg shadow-blue-200';
        }
    };

    const getGlowIntensity = () => {
        if (isListening) return 'shadow-xl shadow-green-400/50';
        if (isThinking) return 'shadow-xl shadow-purple-400/50';
        if (isActive) return 'shadow-lg shadow-blue-400/30';
        return 'shadow-md shadow-gray-400/20';
    };

    return (
        <div className="relative">
            {/* Thought Bubbles */}
            <AnimatePresence>
                {thoughtBubbles.map((bubble) => (
                    <motion.div
                        key={bubble.id}
                        initial={{ opacity: 0, scale: 0, x: bubble.x, y: bubble.y }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0, y: bubble.y - 50 }}
                        transition={{ duration: 0.6 }}
                        className="absolute text-2xl pointer-events-none"
                        style={{ left: `${bubble.x}%`, top: `${bubble.y}%` }}
                    >
                        {bubble.text}
                    </motion.div>
                ))}
            </AnimatePresence>

            {/* Main AI Face Container */}
            <Card className={cn(
                "relative overflow-hidden transition-all duration-500",
                "bg-gradient-to-br from-blue-50 to-purple-50",
                "border-2 border-blue-200/50",
                getGlowIntensity(),
                isActive && "scale-105"
            )}>
                <CardContent className="p-8">
                    {/* AI Face */}
                    <div
                        id="snakkaz-ai-face"
                        className="relative w-32 h-32 mx-auto mb-6 cursor-pointer"
                        onClick={onInteraction}
                    >
                        {/* Face outline */}
                        <div className={cn(
                            "w-full h-full rounded-full border-4 transition-all duration-300",
                            isActive ? "border-blue-300 bg-gradient-to-br from-blue-100 to-purple-100" : "border-gray-300 bg-gray-100"
                        )}>

                            {/* Eyes */}
                            <div className="flex justify-center items-center h-full">
                                <div className="flex gap-4">
                                    {/* Left Eye */}
                                    <motion.div
                                        className="relative w-6 h-6"
                                        animate={{
                                            scaleY: blinkState ? 0.1 : 1,
                                        }}
                                        transition={{ duration: 0.1 }}
                                    >
                                        <div className={cn(
                                            "w-full h-full rounded-full transition-all duration-300",
                                            getEyeStyle(mood)
                                        )}>
                                            {/* Pupil */}
                                            <motion.div
                                                className="absolute top-1/2 left-1/2 w-2 h-2 bg-white rounded-full"
                                                animate={{
                                                    x: eyePosition.x - 4,
                                                    y: eyePosition.y - 4,
                                                }}
                                                transition={{ type: 'spring', stiffness: 200, damping: 10 }}
                                            />
                                        </div>
                                    </motion.div>

                                    {/* Right Eye */}
                                    <motion.div
                                        className="relative w-6 h-6"
                                        animate={{
                                            scaleY: blinkState ? 0.1 : 1,
                                        }}
                                        transition={{ duration: 0.1 }}
                                    >
                                        <div className={cn(
                                            "w-full h-full rounded-full transition-all duration-300",
                                            getEyeStyle(mood)
                                        )}>
                                            {/* Pupil */}
                                            <motion.div
                                                className="absolute top-1/2 left-1/2 w-2 h-2 bg-white rounded-full"
                                                animate={{
                                                    x: eyePosition.x - 4,
                                                    y: eyePosition.y - 4,
                                                }}
                                                transition={{ type: 'spring', stiffness: 200, damping: 10 }}
                                            />
                                        </div>
                                    </motion.div>
                                </div>
                            </div>

                            {/* Mouth - changes based on activity */}
                            <motion.div
                                className="absolute bottom-6 left-1/2 w-8 h-4"
                                animate={{
                                    x: -16,
                                    scaleY: isSpeaking ? [1, 1.5, 1] : 1,
                                }}
                                transition={{
                                    scaleY: { repeat: isSpeaking ? Infinity : 0, duration: 0.3 }
                                }}
                            >
                                <div className={cn(
                                    "w-full h-2 rounded-full transition-all duration-300",
                                    isListening ? "bg-green-400" : isThinking ? "bg-purple-400" : "bg-blue-300"
                                )} />
                            </motion.div>
                        </div>

                        {/* Activity indicator ring */}
                        <motion.div
                            className={cn(
                                "absolute inset-0 rounded-full border-2",
                                isActive ? "border-blue-400" : "border-transparent"
                            )}
                            animate={{
                                scale: isActive ? [1, 1.1, 1] : 1,
                                opacity: isActive ? [0.7, 1, 0.7] : 0,
                            }}
                            transition={{
                                repeat: isActive ? Infinity : 0,
                                duration: 2,
                            }}
                        />
                    </div>

                    {/* Status Display */}
                    <div className="text-center space-y-3">
                        <h3 className="text-xl font-bold text-gray-800">🌊 SnakkaZ AI</h3>

                        {/* Status Badges */}
                        <div className="flex justify-center gap-2 flex-wrap">
                            <Badge variant={isActive ? "default" : "secondary"}>
                                <Brain className="h-3 w-3 mr-1" />
                                {isActive ? 'Aktiv' : 'Standby'}
                            </Badge>

                            {/* AI Connection Status */}
                            <Badge variant={isAIOnline ? "default" : "destructive"} className={isAIOnline ? "bg-green-500" : "bg-red-500"}>
                                {isAIOnline ? <Wifi className="h-3 w-3 mr-1" /> : <WifiOff className="h-3 w-3 mr-1" />}
                                {connectionStatus}
                            </Badge>

                            {isListening && (
                                <Badge variant="default" className="bg-green-500">
                                    <Volume2 className="h-3 w-3 mr-1" />
                                    Lytter
                                </Badge>
                            )}

                            {isThinking && (
                                <Badge variant="default" className="bg-purple-500">
                                    <Sparkles className="h-3 w-3 mr-1" />
                                    Tenker
                                </Badge>
                            )}

                            <Badge variant="outline">
                                <Heart className="h-3 w-3 mr-1" />
                                {mood}
                            </Badge>
                        </div>

                        {/* AI Capabilities */}
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="flex items-center gap-2 text-gray-600">
                                <MessageCircle className="h-4 w-4" />
                                <span>Norsk Chat</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                                <Zap className="h-4 w-4" />
                                <span>MCP Tools</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                                <Eye className="h-4 w-4" />
                                <span>Kontekst</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                                <Activity className="h-4 w-4" />
                                <span>Realtime</span>
                            </div>
                        </div>

                        {/* Interaction Button */}
                        <Button
                            onClick={onInteraction}
                            className={cn(
                                "mt-4 transition-all duration-300",
                                isActive
                                    ? "bg-blue-500 hover:bg-blue-600 shadow-lg"
                                    : "bg-gray-400 hover:bg-gray-500"
                            )}
                        >
                            {isActive ? '💬 Start Samtale' : '⚡ Aktiver AI'}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Background ambient effect */}
            <div className={cn(
                "absolute inset-0 -z-10 rounded-lg transition-all duration-1000",
                isActive && "bg-gradient-to-r from-blue-100/20 to-purple-100/20 blur-xl"
            )} />
        </div>
    );
};

export default SnakkaZAI;
