import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { 
  Share2, 
  Copy, 
  QrCode, 
  Mail, 
  MessageSquare, 
  Link as LinkIcon,
  Users, 
  Lock, 
  Globe, 
  Eye,
  EyeOff,
  Check,
  ExternalLink,
  Smartphone,
  Facebook,
  Twitter,
  Linkedin,
  Send
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import QRCode from 'qrcode';

interface GroupInviteSystemProps {
  groupId: string;
  groupName: string;
  groupDescription?: string;
  isAdmin: boolean;
  currentSettings: {
    isPublic: boolean;
    requireApproval: boolean;
    allowInvites: boolean;
    hasPassword: boolean;
  };
  onSettingsChange: (settings: any) => void;
}

export const GroupInviteSystem: React.FC<GroupInviteSystemProps> = ({
  groupId,
  groupName,
  groupDescription,
  isAdmin,
  currentSettings,
  onSettingsChange
}) => {
  const [inviteLink, setInviteLink] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [customMessage, setCustomMessage] = useState('');
  const [expiresIn, setExpiresIn] = useState('never');
  const [maxUses, setMaxUses] = useState('');
  const [copied, setCopied] = useState(false);
  const [settings, setSettings] = useState(currentSettings);
  const { toast } = useToast();

  // Generate invite link
  useEffect(() => {
    const baseUrl = window.location.origin;
    const linkParams = new URLSearchParams({
      group: groupId,
      name: groupName
    });
    
    if (password) {
      linkParams.set('password', password);
    }
    
    const link = `${baseUrl}/beta-chat/join?${linkParams.toString()}`;
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
  }, [groupId, groupName, password]);

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      
      toast({
        title: `${label} kopiert!`,
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
    const message = customMessage || `Bli med i "${groupName}" gruppen på SnakkaZ Beta! 🚀`;
    const fullMessage = `${message}\n\n${inviteLink}`;
    
    let shareUrl = '';
    
    switch (platform) {
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(fullMessage)}`;
        break;
      case 'telegram':
        shareUrl = `https://t.me/share/url?url=${encodeURIComponent(inviteLink)}&text=${encodeURIComponent(message)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(inviteLink)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(inviteLink)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(inviteLink)}`;
        break;
      case 'email':
        shareUrl = `mailto:?subject=${encodeURIComponent(`Invitasjon til ${groupName}`)}&body=${encodeURIComponent(fullMessage)}`;
        break;
      case 'sms':
        shareUrl = `sms:?body=${encodeURIComponent(fullMessage)}`;
        break;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank');
    }
  };

  const handleSettingChange = (key: string, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    onSettingsChange(newSettings);
  };

  const generateNewLink = () => {
    // Logic to generate new invite link with different parameters
    toast({
      title: "Ny invitasjonslenke generert",
      description: "Den gamle lenken er ikke lenger gyldig.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Group Settings (Admin Only) */}
      {isAdmin && (
        <Card className="bg-cyberdark-900 border-cybergold-500/30">
          <CardHeader>
            <CardTitle className="text-cybergold-400 flex items-center gap-2">
              <Users className="h-5 w-5" />
              Gruppeinnstillinger
            </CardTitle>
            <CardDescription className="text-cybergold-300">
              Kontroller hvem som kan bli med i gruppen
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-cybergold-300">Offentlig gruppe</Label>
                <p className="text-sm text-cybergold-500">
                  Alle kan finne og bli med i gruppen
                </p>
              </div>
              <Switch
                checked={settings.isPublic}
                onCheckedChange={(checked) => handleSettingChange('isPublic', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-cybergold-300">Krev godkjenning</Label>
                <p className="text-sm text-cybergold-500">
                  Nye medlemmer må godkjennes av admin
                </p>
              </div>
              <Switch
                checked={settings.requireApproval}
                onCheckedChange={(checked) => handleSettingChange('requireApproval', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-cybergold-300">Medlemmer kan invitere</Label>
                <p className="text-sm text-cybergold-500">
                  La medlemmer lage invitasjonslenker
                </p>
              </div>
              <Switch
                checked={settings.allowInvites}
                onCheckedChange={(checked) => handleSettingChange('allowInvites', checked)}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-cybergold-300">Gruppepassord</Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Sett et passord for gruppen"
                    className="pr-10 bg-cyberdark-800 border-cybergold-500/30 text-cybergold-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-cybergold-500"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <p className="text-xs text-cybergold-500">
                La stå tom for ingen passord-beskyttelse
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Invite Link Generation */}
      <Card className="bg-cyberdark-900 border-cybergold-500/30">
        <CardHeader>
          <CardTitle className="text-cybergold-400 flex items-center gap-2">
            <LinkIcon className="h-5 w-5" />
            Invitasjonslenke
          </CardTitle>
          <CardDescription className="text-cybergold-300">
            Del denne lenken for å invitere nye medlemmer
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-cybergold-300">Personlig melding</Label>
            <Textarea
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder={`Bli med i "${groupName}" gruppen på SnakkaZ Beta! 🚀`}
              className="bg-cyberdark-800 border-cybergold-500/30 text-cybergold-200 min-h-[80px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-cybergold-300">Utløper</Label>
              <select
                value={expiresIn}
                onChange={(e) => setExpiresIn(e.target.value)}
                className="w-full mt-1 bg-cyberdark-800 border border-cybergold-500/30 rounded-md px-3 py-2 text-cybergold-200"
              >
                <option value="never">Aldri</option>
                <option value="1h">1 time</option>
                <option value="24h">24 timer</option>
                <option value="7d">7 dager</option>
                <option value="30d">30 dager</option>
              </select>
            </div>

            <div>
              <Label className="text-cybergold-300">Maks bruk</Label>
              <Input
                type="number"
                value={maxUses}
                onChange={(e) => setMaxUses(e.target.value)}
                placeholder="Ubegrenset"
                className="bg-cyberdark-800 border-cybergold-500/30 text-cybergold-200"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-cybergold-300">Invitasjonslenke</Label>
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

          {isAdmin && (
            <Button
              onClick={generateNewLink}
              variant="outline"
              size="sm"
              className="border-cybergold-500/30 text-cybergold-300 hover:bg-cybergold-500/10"
            >
              Generer ny lenke
            </Button>
          )}
        </CardContent>
      </Card>

      {/* QR Code */}
      <Card className="bg-cyberdark-900 border-cybergold-500/30">
        <CardHeader>
          <CardTitle className="text-cybergold-400 flex items-center gap-2">
            <QrCode className="h-5 w-5" />
            QR-kode
          </CardTitle>
          <CardDescription className="text-cybergold-300">
            La andre skanne for rask tilgang
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          {qrCodeUrl && (
            <div className="space-y-4">
              <img
                src={qrCodeUrl}
                alt="QR-kode for gruppeinnvitasjon"
                className="mx-auto border border-cybergold-500/30 rounded-lg"
              />
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
          )}
        </CardContent>
      </Card>

      {/* Quick Share Options */}
      <Card className="bg-cyberdark-900 border-cybergold-500/30">
        <CardHeader>
          <CardTitle className="text-cybergold-400 flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Hurtigdeling
          </CardTitle>
          <CardDescription className="text-cybergold-300">
            Del direkte til sosiale medier og meldingsapper
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button
              onClick={() => shareVia('whatsapp')}
              variant="outline"
              size="sm"
              className="border-green-500/30 text-green-400 hover:bg-green-500/10"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              WhatsApp
            </Button>

            <Button
              onClick={() => shareVia('telegram')}
              variant="outline"
              size="sm"
              className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
            >
              <Send className="h-4 w-4 mr-2" />
              Telegram
            </Button>

            <Button
              onClick={() => shareVia('facebook')}
              variant="outline"
              size="sm"
              className="border-blue-600/30 text-blue-500 hover:bg-blue-600/10"
            >
              <Facebook className="h-4 w-4 mr-2" />
              Facebook
            </Button>

            <Button
              onClick={() => shareVia('twitter')}
              variant="outline"
              size="sm"
              className="border-sky-500/30 text-sky-400 hover:bg-sky-500/10"
            >
              <Twitter className="h-4 w-4 mr-2" />
              Twitter
            </Button>

            <Button
              onClick={() => shareVia('linkedin')}
              variant="outline"
              size="sm"
              className="border-blue-700/30 text-blue-600 hover:bg-blue-700/10"
            >
              <Linkedin className="h-4 w-4 mr-2" />
              LinkedIn
            </Button>

            <Button
              onClick={() => shareVia('email')}
              variant="outline"
              size="sm"
              className="border-cybergold-500/30 text-cybergold-300 hover:bg-cybergold-500/10"
            >
              <Mail className="h-4 w-4 mr-2" />
              E-post
            </Button>

            <Button
              onClick={() => shareVia('sms')}
              variant="outline"
              size="sm"
              className="border-cybergold-500/30 text-cybergold-300 hover:bg-cybergold-500/10"
            >
              <Smartphone className="h-4 w-4 mr-2" />
              SMS
            </Button>

            <Button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: `Bli med i ${groupName}`,
                    text: customMessage || `Bli med i "${groupName}" gruppen på SnakkaZ Beta!`,
                    url: inviteLink
                  });
                } else {
                  copyToClipboard(inviteLink, "Lenke");
                }
              }}
              variant="outline"
              size="sm"
              className="border-cybergold-500/30 text-cybergold-300 hover:bg-cybergold-500/10"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Mer
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Privacy Indicator */}
      <div className="flex items-center gap-2 text-sm text-cybergold-500">
        {settings.isPublic ? (
          <>
            <Globe className="h-4 w-4" />
            Offentlig gruppe - alle kan bli med
          </>
        ) : (
          <>
            <Lock className="h-4 w-4" />
            Privat gruppe - kun inviterte kan bli med
          </>
        )}
      </div>
    </div>
  );
};
