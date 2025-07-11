import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { 
  Share2, 
  Copy, 
  QrCode, 
  Mail, 
  MessageSquare, 
  Send,
  Smartphone,
  Facebook,
  Twitter,
  Linkedin,
  Gift,
  Users,
  Star,
  Zap,
  Check,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuth';
import QRCode from 'qrcode';
import { cn } from '@/lib/utils';

interface SnakkaZInviteSystemProps {
  className?: string;
  variant?: 'button' | 'card' | 'floating';
  showStats?: boolean;
}

export const SnakkaZInviteSystem: React.FC<SnakkaZInviteSystemProps> = ({
  className,
  variant = 'button',
  showStats = true
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inviteLink, setInviteLink] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [inviteStats, setInviteStats] = useState({
    sent: 0,
    joined: 0,
    bonus: 0
  });
  
  const { user } = useAuth();
  const { toast } = useToast();

  // Generate referral code from user
  useEffect(() => {
    if (user?.id) {
      const code = user.id.slice(-8).toUpperCase();
      setReferralCode(code);
    }
  }, [user]);

  // Generate invite link and QR code
  useEffect(() => {
    const baseUrl = window.location.origin;
    const linkParams = new URLSearchParams({
      ref: referralCode,
      source: 'app-invite'
    });
    
    const link = `${baseUrl}/beta-chat?${linkParams.toString()}`;
    setInviteLink(link);
    
    // Generate QR code
    QRCode.toDataURL(link, {
      width: 200,
      margin: 2,
      color: {
        dark: '#D4AF37',
        light: '#1A1B23'
      }
    }).then(setQrCodeUrl);
  }, [referralCode]);

  // Default message
  useEffect(() => {
    if (!customMessage) {
      setCustomMessage(
        `🚀 Bli med meg på SnakkaZ Beta - den nye generasjonen chat!\n\n` +
        `✨ End-to-end kryptering\n` +
        `💎 AI-assistert chat\n` +
        `🎮 Interaktive funksjoner\n` +
        `🔒 100% privat og sikkert\n\n` +
        `Vi får begge bonuser når du registrerer deg! 🎁`
      );
    }
  }, [customMessage]);

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      
      toast({
        title: `${label} kopiert! 🎉`,
        description: "Invitasjonslenken er kopiert til utklippstavlen.",
      });
    } catch (error) {
      toast({
        title: "Kunne ikke kopiere",
        description: "Prøv å kopiere manuelt.",
        variant: "destructive"
      });
    }
  };

  const shareVia = (platform: string) => {
    const fullMessage = `${customMessage}\n\n${inviteLink}`;
    
    let shareUrl = '';
    
    switch (platform) {
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(fullMessage)}`;
        break;
      case 'telegram':
        shareUrl = `https://t.me/share/url?url=${encodeURIComponent(inviteLink)}&text=${encodeURIComponent(customMessage)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(inviteLink)}&quote=${encodeURIComponent(customMessage)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(customMessage)}&url=${encodeURIComponent(inviteLink)}&hashtags=SnakkaZBeta,SecureChat`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(inviteLink)}`;
        break;
      case 'email':
        shareUrl = `mailto:?subject=${encodeURIComponent('Bli med på SnakkaZ Beta!')}&body=${encodeURIComponent(fullMessage)}`;
        break;
      case 'sms':
        shareUrl = `sms:?body=${encodeURIComponent(fullMessage)}`;
        break;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank');
      
      // Track share attempt
      setInviteStats(prev => ({ ...prev, sent: prev.sent + 1 }));
    }
  };

  const InviteContent = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2 text-2xl">
          <Sparkles className="h-6 w-6 text-cybergold-400" />
          <span className="font-bold bg-gradient-to-r from-cybergold-400 to-cyberblue-400 bg-clip-text text-transparent">
            Del SnakkaZ Beta
          </span>
          <Sparkles className="h-6 w-6 text-cybergold-400" />
        </div>
        <p className="text-cybergold-300">
          Inviter venner og få bonuser når de blir med!
        </p>
      </div>

      {/* Stats Cards */}
      {showStats && (
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-cyberdark-800 p-4 rounded-lg text-center border border-cybergold-500/20">
            <div className="text-2xl font-bold text-cybergold-400">{inviteStats.sent}</div>
            <div className="text-xs text-cybergold-500">Invitasjoner sendt</div>
          </div>
          <div className="bg-cyberdark-800 p-4 rounded-lg text-center border border-green-500/20">
            <div className="text-2xl font-bold text-green-400">{inviteStats.joined}</div>
            <div className="text-xs text-cybergold-500">Venner registrert</div>
          </div>
          <div className="bg-cyberdark-800 p-4 rounded-lg text-center border border-purple-500/20">
            <div className="text-2xl font-bold text-purple-400">{inviteStats.bonus}</div>
            <div className="text-xs text-cybergold-500">Bonus poeng</div>
          </div>
        </div>
      )}

      {/* Personal Message */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-cybergold-300">
          Din invitasjonsmelding
        </label>
        <Textarea
          value={customMessage}
          onChange={(e) => setCustomMessage(e.target.value)}
          className="bg-cyberdark-800 border-cybergold-500/30 text-cybergold-200 min-h-[120px] text-sm"
          placeholder="Skriv en personlig melding..."
        />
      </div>

      {/* Referral Info */}
      <div className="bg-gradient-to-r from-cybergold-500/10 to-cyberblue-500/10 p-4 rounded-lg border border-cybergold-500/30">
        <div className="flex items-center gap-2 mb-2">
          <Gift className="h-5 w-5 text-cybergold-400" />
          <span className="font-medium text-cybergold-300">Din referansekode</span>
        </div>
        <div className="flex gap-2">
          <Input
            value={referralCode}
            readOnly
            className="bg-cyberdark-800 border-cybergold-500/30 text-cybergold-200 font-mono text-lg text-center font-bold"
          />
          <Button
            onClick={() => copyToClipboard(referralCode, "Referansekode")}
            variant="outline"
            size="sm"
            className="border-cybergold-500/30 text-cybergold-300 hover:bg-cybergold-500/10"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>
        <p className="text-xs text-cybergold-500 mt-2">
          Både du og dine venner får bonuser når de registrerer seg med din kode! 🎁
        </p>
      </div>

      {/* Invite Link */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-cybergold-300">
          Invitasjonslenke
        </label>
        <div className="flex gap-2">
          <Input
            value={inviteLink}
            readOnly
            className="bg-cyberdark-800 border-cybergold-500/30 text-cybergold-200 font-mono text-sm"
          />
          <Button
            onClick={() => copyToClipboard(inviteLink, "Lenke")}
            variant="outline"
            size="sm"
            className="border-cybergold-500/30 text-cybergold-300 hover:bg-cybergold-500/10"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* QR Code */}
      <div className="text-center space-y-3">
        <label className="text-sm font-medium text-cybergold-300">
          QR-kode for rask deling
        </label>
        {qrCodeUrl && (
          <div className="inline-block p-4 bg-white rounded-lg">
            <img
              src={qrCodeUrl}
              alt="SnakkaZ Beta QR-kode"
              className="mx-auto"
            />
          </div>
        )}
        <Button
          onClick={() => copyToClipboard(qrCodeUrl, "QR-kode")}
          variant="outline"
          size="sm"
          className="border-cybergold-500/30 text-cybergold-300 hover:bg-cybergold-500/10"
        >
          <Copy className="h-4 w-4 mr-2" />
          Kopier QR-kode
        </Button>
      </div>

      {/* Quick Share Buttons */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-cybergold-300">
          Del direkte til:
        </label>
        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={() => shareVia('whatsapp')}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            WhatsApp
          </Button>

          <Button
            onClick={() => shareVia('telegram')}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            <Send className="h-4 w-4 mr-2" />
            Telegram
          </Button>

          <Button
            onClick={() => shareVia('facebook')}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Facebook className="h-4 w-4 mr-2" />
            Facebook
          </Button>

          <Button
            onClick={() => shareVia('twitter')}
            className="bg-sky-500 hover:bg-sky-600 text-white"
          >
            <Twitter className="h-4 w-4 mr-2" />
            Twitter
          </Button>

          <Button
            onClick={() => shareVia('email')}
            variant="outline"
            className="border-cybergold-500/30 text-cybergold-300 hover:bg-cybergold-500/10"
          >
            <Mail className="h-4 w-4 mr-2" />
            E-post
          </Button>

          <Button
            onClick={() => shareVia('sms')}
            variant="outline"
            className="border-cybergold-500/30 text-cybergold-300 hover:bg-cybergold-500/10"
          >
            <Smartphone className="h-4 w-4 mr-2" />
            SMS
          </Button>
        </div>

        {/* Native Share */}
        {navigator.share && (
          <Button
            onClick={() => {
              navigator.share({
                title: 'SnakkaZ Beta - Sikker Chat',
                text: customMessage,
                url: inviteLink
              });
            }}
            className="w-full bg-gradient-to-r from-cybergold-600 to-cyberblue-600 hover:from-cybergold-500 hover:to-cyberblue-500 text-white"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Del med andre apper
          </Button>
        )}
      </div>

      {/* Benefits */}
      <div className="bg-gradient-to-br from-cybergold-500/5 to-cyberblue-500/5 p-4 rounded-lg border border-cybergold-500/20">
        <h4 className="font-medium text-cybergold-300 mb-2 flex items-center gap-2">
          <Star className="h-4 w-4" />
          Hvorfor SnakkaZ Beta?
        </h4>
        <ul className="text-sm text-cybergold-400 space-y-1">
          <li className="flex items-center gap-2">
            <Zap className="h-3 w-3" />
            Raskeste og sikreste chat-app
          </li>
          <li className="flex items-center gap-2">
            <Zap className="h-3 w-3" />
            AI-assistert kommunikasjon
          </li>
          <li className="flex items-center gap-2">
            <Zap className="h-3 w-3" />
            End-to-end kryptering
          </li>
          <li className="flex items-center gap-2">
            <Zap className="h-3 w-3" />
            Beta-tilgang til nye funksjoner
          </li>
        </ul>
      </div>
    </div>
  );

  if (variant === 'card') {
    return (
      <Card className={cn("bg-cyberdark-900 border-cybergold-500/30", className)}>
        <CardHeader>
          <CardTitle className="text-cybergold-400 flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Inviter venner til SnakkaZ Beta
          </CardTitle>
          <CardDescription className="text-cybergold-300">
            Del appen og få bonuser sammen!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <InviteContent />
        </CardContent>
      </Card>
    );
  }

  if (variant === 'floating') {
    return (
      <div className={cn("fixed bottom-6 right-6 z-50", className)}>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button
              size="lg"
              className="rounded-full h-14 w-14 bg-gradient-to-r from-cybergold-600 to-cyberblue-600 hover:from-cybergold-500 hover:to-cyberblue-500 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Share2 className="h-6 w-6" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg bg-cyberdark-900 border-cybergold-500/30 max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-cybergold-400">
                Del SnakkaZ Beta
              </DialogTitle>
              <DialogDescription className="text-cybergold-300">
                Inviter venner og familie til den sikreste chat-appen!
              </DialogDescription>
            </DialogHeader>
            <InviteContent />
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // Default button variant
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          className={cn(
            "bg-gradient-to-r from-cybergold-600 to-cyberblue-600 hover:from-cybergold-500 hover:to-cyberblue-500 text-white",
            className
          )}
        >
          <Share2 className="h-4 w-4 mr-2" />
          Inviter venner
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg bg-cyberdark-900 border-cybergold-500/30 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-cybergold-400">
            Del SnakkaZ Beta
          </DialogTitle>
          <DialogDescription className="text-cybergold-300">
            Inviter venner og familie til den sikreste chat-appen!
          </DialogDescription>
        </DialogHeader>
        <InviteContent />
      </DialogContent>
    </Dialog>
  );
};
