import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import {
    Users,
    Share,
    Copy,
    Check,
    QrCode,
    Mail,
    MessageCircle,
    Phone,
    Smartphone,
    Gift,
    Star,
    Zap,
    Crown,
    Heart
} from 'lucide-react';

interface MobileInviteProps {
    onClose?: () => void;
}

const MobileInvite: React.FC<MobileInviteProps> = ({ onClose }) => {
    const { user } = useAuth();
    const { toast } = useToast();
    const [inviteCode, setInviteCode] = useState('');
    const [copied, setCopied] = useState(false);
    const [showQR, setShowQR] = useState(false);

    // Generate unique invite code based on user
    useEffect(() => {
        if (user) {
            const code = `SNAKKAZ-${user.id.slice(0, 8).toUpperCase()}`;
            setInviteCode(code);
        }
    }, [user]);

    const inviteUrl = `https://snakkaz.com/invite/${inviteCode}`;
    const inviteMessage = `🚀 Jeg inviterer deg til SnakkaZ - Norges nye chat platform!\n\n✨ Bedre enn Telegram\n🛍️ Innebygd marketplace\n🤖 AI-assistert chat\n🔒 100% sikker og norsk\n\nBli med gratis: ${inviteUrl}`;

    const handleCopy = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);

            toast({
                title: "Kopiert! 📋",
                description: "Invitasjonen er kopiert til utklippstavlen",
            });

            // Haptic feedback
            if (navigator.vibrate) {
                navigator.vibrate(50);
            }
        } catch (error) {
            toast({
                title: "Feil",
                description: "Kunne ikke kopiere teksten",
                variant: "destructive"
            });
        }
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Bli med på SnakkaZ!',
                    text: inviteMessage,
                    url: inviteUrl
                });
            } catch (error) {
                console.log('Share cancelled');
            }
        } else {
            // Fallback to copy
            handleCopy(inviteMessage);
        }
    };

    const handleWhatsAppShare = () => {
        const encodedMessage = encodeURIComponent(inviteMessage);
        window.open(`https://wa.me/?text=${encodedMessage}`, '_blank');
    };

    const handleSMSShare = () => {
        const encodedMessage = encodeURIComponent(inviteMessage);
        window.open(`sms:?body=${encodedMessage}`, '_blank');
    };

    const handleEmailShare = () => {
        const subject = encodeURIComponent('Bli med på SnakkaZ!');
        const body = encodeURIComponent(inviteMessage);
        window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
    };

    return (
        <div className="mobile-card w-full max-w-sm mx-auto">
            {/* Header */}
            <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
                    style={{
                        background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                        boxShadow: '0 8px 32px rgba(79, 172, 254, 0.3)'
                    }}>
                    <Users size={24} className="text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'Orbitron, monospace' }}>
                    Inviter venner
                </h2>
                <p className="text-white/70 text-sm">
                    Del SnakkaZ med dine venner og få belønninger
                </p>
            </div>

            {/* Invite Code */}
            <div className="mobile-card bg-white/5 mb-6">
                <div className="text-center">
                    <label className="block text-sm font-medium text-white/90 mb-2">
                        Din invitasjonskode
                    </label>
                    <div className="flex items-center space-x-2">
                        <div className="flex-1 bg-white/10 rounded-lg p-3 font-mono text-center text-white font-bold">
                            {inviteCode}
                        </div>
                        <button
                            onClick={() => handleCopy(inviteCode)}
                            className="mobile-button bg-aurora-blue/20 p-3 rounded-lg"
                        >
                            {copied ? <Check size={16} className="text-aurora-green" /> : <Copy size={16} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Quick Share */}
            <div className="mb-6">
                <h3 className="text-white font-semibold mb-3 flex items-center">
                    <Share size={16} className="mr-2" />
                    Del med venner
                </h3>

                <div className="grid grid-cols-2 gap-3 mb-4">
                    <button
                        onClick={handleShare}
                        className="mobile-button bg-aurora-blue/20 hover:bg-aurora-blue/30 border border-aurora-blue/30 flex flex-col items-center py-4"
                    >
                        <Smartphone size={20} className="mb-2" />
                        <span className="text-sm">Del direkte</span>
                    </button>

                    <button
                        onClick={() => setShowQR(!showQR)}
                        className="mobile-button bg-aurora-cyan/20 hover:bg-aurora-cyan/30 border border-aurora-cyan/30 flex flex-col items-center py-4"
                    >
                        <QrCode size={20} className="mb-2" />
                        <span className="text-sm">QR-kode</span>
                    </button>

                    <button
                        onClick={handleWhatsAppShare}
                        className="mobile-button bg-green-600/20 hover:bg-green-600/30 border border-green-600/30 flex flex-col items-center py-4"
                    >
                        <MessageCircle size={20} className="mb-2" />
                        <span className="text-sm">WhatsApp</span>
                    </button>

                    <button
                        onClick={handleSMSShare}
                        className="mobile-button bg-blue-600/20 hover:bg-blue-600/30 border border-blue-600/30 flex flex-col items-center py-4"
                    >
                        <Phone size={20} className="mb-2" />
                        <span className="text-sm">SMS</span>
                    </button>
                </div>

                <button
                    onClick={handleEmailShare}
                    className="mobile-button w-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center py-3"
                >
                    <Mail size={16} className="mr-2" />
                    Send via e-post
                </button>
            </div>

            {/* QR Code placeholder */}
            {showQR && (
                <div className="mobile-card bg-white/5 mb-6">
                    <div className="text-center">
                        <div className="w-32 h-32 mx-auto bg-white rounded-lg mb-3 flex items-center justify-center">
                            <QrCode size={64} className="text-gray-600" />
                        </div>
                        <p className="text-white/70 text-sm">
                            QR-kode for rask invitasjon
                        </p>
                        <p className="text-xs text-white/50 mt-1">
                            La venner skanne for å bli med
                        </p>
                    </div>
                </div>
            )}

            {/* Rewards */}
            <div className="mobile-card bg-gradient-to-r from-aurora-blue/10 to-aurora-cyan/10 border border-aurora-blue/20">
                <h3 className="text-white font-semibold mb-3 flex items-center">
                    <Gift size={16} className="mr-2" />
                    Invitasjonsbelønninger
                </h3>

                <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-aurora-green/20 flex items-center justify-center">
                            <Star size={14} className="text-aurora-green" />
                        </div>
                        <div className="flex-1">
                            <div className="text-white text-sm font-medium">1 venn = Premium badge</div>
                            <div className="text-white/60 text-xs">Spesial status i profilen din</div>
                        </div>
                    </div>

                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-aurora-blue/20 flex items-center justify-center">
                            <Zap size={14} className="text-aurora-blue" />
                        </div>
                        <div className="flex-1">
                            <div className="text-white text-sm font-medium">5 venner = Extra funksjoner</div>
                            <div className="text-white/60 text-xs">Tilgang til beta funksjoner</div>
                        </div>
                    </div>

                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-aurora-pink/20 flex items-center justify-center">
                            <Crown size={14} className="text-aurora-pink" />
                        </div>
                        <div className="flex-1">
                            <div className="text-white text-sm font-medium">10 venner = VIP status</div>
                            <div className="text-white/60 text-xs">Livstid premium medlemskap</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Why SnakkaZ */}
            <div className="mt-6 bg-white/5 rounded-lg p-4">
                <h3 className="text-white font-semibold mb-3 flex items-center">
                    <Heart size={16} className="mr-2 text-red-400" />
                    Hvorfor SnakkaZ?
                </h3>

                <div className="space-y-2 text-sm text-white/70">
                    <div className="flex items-center">
                        <span className="mr-2">🚀</span>
                        <span>Raskere og mer stabil enn Telegram</span>
                    </div>
                    <div className="flex items-center">
                        <span className="mr-2">🛍️</span>
                        <span>Innebygd marketplace for handel</span>
                    </div>
                    <div className="flex items-center">
                        <span className="mr-2">🤖</span>
                        <span>AI-assistert chat og automatisering</span>
                    </div>
                    <div className="flex items-center">
                        <span className="mr-2">🔒</span>
                        <span>100% sikker og privat, norsk teknologi</span>
                    </div>
                    <div className="flex items-center">
                        <span className="mr-2">📱</span>
                        <span>Perfekt optimalisert for mobil</span>
                    </div>
                    <div className="flex items-center">
                        <span className="mr-2">🆓</span>
                        <span>Helt gratis, ingen skjulte kostnader</span>
                    </div>
                </div>
            </div>

            {/* Close button */}
            {onClose && (
                <div className="mt-6 text-center">
                    <button
                        onClick={onClose}
                        className="mobile-button bg-white/10 hover:bg-white/20 px-6 py-2 rounded-lg text-white/70"
                    >
                        Lukk
                    </button>
                </div>
            )}
        </div>
    );
};

export default MobileInvite;
