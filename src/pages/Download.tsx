import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
    Smartphone,
    Laptop,
    TabletSmartphone,
    FileDown,
    QrCode,
    Share2,
    Check,
    Clock,
    InfoIcon
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useSearchParams } from "react-router-dom";

export default function Download() {
    const { toast } = useToast();
    const [activeTab, setActiveTab] = useState("mobile");
    const [searchParams] = useSearchParams();
    
    // Handle URL parameters for automatic platform selection
    useEffect(() => {
        const platform = searchParams.get('platform');
        if (platform) {
            switch (platform) {
                case 'android':
                case 'ios':
                    setActiveTab('mobile');
                    break;
                case 'windows':
                case 'macos':
                case 'linux':
                    setActiveTab('desktop');
                    break;
                case 'ipad':
                case 'tablet':
                    setActiveTab('tablet');
                    break;
                default:
                    // Detect device type if platform param doesn't match
                    detectDeviceType();
            }
        } else {
            // No platform specified, detect device type
            detectDeviceType();
        }
    }, [searchParams]);
    
    // Detect device type
    const detectDeviceType = () => {
        const userAgent = navigator.userAgent.toLowerCase();
        
        // Check for tablet
        const isTablet = /(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|silk)/.test(userAgent);
        
        if (isTablet) {
            setActiveTab("tablet");
            return;
        }
        
        // Check for mobile
        const isMobile = /android|webos|iphone|ipod|blackberry|iemobile|opera mini/.test(userAgent);
        
        if (isMobile) {
            setActiveTab("mobile");
            return;
        }
        
        // Default to desktop
        setActiveTab("desktop");
    };

    // Handle direct download
    const handleDirectDownload = (platform: string) => {
        // This would normally trigger the appropriate download for the platform
        toast({
            title: "Starter nedlasting",
            description: `Nedlasting for ${platform} starter straks...`,
            duration: 3000
        });
    };

    const handleCopyQRCode = () => {
        toast({
            title: "QR-kode åpnet",
            description: "QR-kode for nedlasting er klar for skanning",
            duration: 3000
        });
    };

    const handleShareLink = () => {
        // Share URL if supported by browser
        if (navigator.share) {
            navigator.share({
                title: 'Last ned Snakkaz',
                text: 'Sikker kommunikasjon med Snakkaz',
                url: window.location.href,
            })
            .catch((error) => console.log('Error sharing', error));
        } else {
            // Fallback for browsers that don't support the Share API
            const dummyInput = document.createElement('input');
            const downloadUrl = window.location.origin + '/download';
            
            document.body.appendChild(dummyInput);
            dummyInput.value = downloadUrl;
            dummyInput.select();
            document.execCommand('copy');
            document.body.removeChild(dummyInput);
            
            toast({
                title: "Link kopiert",
                description: "Nedlastingslenken er kopiert til utklippstavlen",
                duration: 3000
            });
        }
    };

    return (
        <div className="container max-w-6xl py-10">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-cybergold-400 mb-4">Last ned Snakkaz</h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Få tilgang til Snakkaz på alle dine enheter med våre native apper for optimal sikkerhet og ytelse
                </p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="mx-auto">
                <TabsList className="grid grid-cols-3 max-w-xl mx-auto mb-8">
                    <TabsTrigger value="mobile" className="flex items-center gap-2">
                        <Smartphone className="h-4 w-4" />
                        <span>Mobil</span>
                    </TabsTrigger>
                    <TabsTrigger value="desktop" className="flex items-center gap-2">
                        <Laptop className="h-4 w-4" />
                        <span>Desktop</span>
                    </TabsTrigger>
                    <TabsTrigger value="tablet" className="flex items-center gap-2">
                        <TabletSmartphone className="h-4 w-4" />
                        <span>Nettbrett</span>
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="mobile">
                    <div className="grid md:grid-cols-2 gap-6">
                        <DownloadCard
                            title="Android"
                            description="For Android 10.0 eller nyere"
                            image="/thumbnails/snakkaz-guardian-chat.png"
                            badges={["Kryptert", "Offline-støtte"]}
                            buttonText="Last ned fra Google Play"
                            onDownload={() => handleDirectDownload("Android")}
                            onQRCode={handleCopyQRCode}
                            onShareLink={handleShareLink}
                            qrEnabled
                            version="2.4.0"
                            releaseDate="15. april 2025"
                        />

                        <DownloadCard
                            title="iOS"
                            description="For iOS 15 eller nyere"
                            image="/thumbnails/snakkaz-secure-docs.png"
                            badges={["Face ID", "iCloud-støtte"]}
                            buttonText="Last ned fra App Store"
                            onDownload={() => handleDirectDownload("iOS")}
                            onQRCode={handleCopyQRCode}
                            onShareLink={handleShareLink}
                            qrEnabled
                            version="2.3.8"
                            releaseDate="20. april 2025"
                        />
                    </div>
                </TabsContent>

                <TabsContent value="desktop">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <DownloadCard
                            title="Windows"
                            description="For Windows 10/11"
                            image="/thumbnails/snakkaz-analytics-hub.png"
                            badges={["AutoStart", "Notification Center"]}
                            buttonText="Last ned for Windows"
                            onDownload={() => handleDirectDownload("Windows")}
                            version="2.2.1"
                            releaseDate="10. april 2025"
                        />

                        <DownloadCard
                            title="macOS"
                            description="For macOS 12 eller nyere"
                            image="/thumbnails/snakkaz-business-analyser.png"
                            badges={["Apple Silicon", "Touch ID"]}
                            buttonText="Last ned for macOS"
                            onDownload={() => handleDirectDownload("macOS")}
                            version="2.2.5"
                            releaseDate="12. april 2025"
                        />

                        <DownloadCard
                            title="Linux"
                            description="For Ubuntu, Fedora, Debian"
                            image="/thumbnails/ai-dash-hub.png"
                            badges={[".deb/.rpm", "Flatpak"]}
                            buttonText="Last ned for Linux"
                            onDownload={() => handleDirectDownload("Linux")}
                            version="2.1.9"
                            releaseDate="5. april 2025"
                        />
                    </div>
                </TabsContent>

                <TabsContent value="tablet">
                    <div className="grid md:grid-cols-2 gap-6">
                        <DownloadCard
                            title="iPad"
                            description="For iPadOS 15 eller nyere"
                            image="/thumbnails/snakkaz-secure-docs.png"
                            badges={["Split View", "Pencil-støtte"]}
                            buttonText="Last ned for iPad"
                            onDownload={() => handleDirectDownload("iPad")}
                            onQRCode={handleCopyQRCode}
                            onShareLink={handleShareLink}
                            qrEnabled
                            version="2.3.8"
                            releaseDate="20. april 2025"
                        />

                        <DownloadCard
                            title="Android Tablet"
                            description="For Android 10.0 eller nyere"
                            image="/thumbnails/snakkaz-guardian-chat.png"
                            badges={["Flermodus", "DeX-støtte"]}
                            buttonText="Last ned for Android"
                            onDownload={() => handleDirectDownload("Android Tablet")}
                            onQRCode={handleCopyQRCode}
                            onShareLink={handleShareLink}
                            qrEnabled
                            version="2.4.0"
                            releaseDate="15. april 2025"
                        />
                    </div>
                </TabsContent>
            </Tabs>

            <div className="mt-16 bg-cyberdark-900/50 border border-cyberdark-700 rounded-lg p-6 max-w-3xl mx-auto">
                <h2 className="text-xl font-semibold text-cybergold-400 mb-4">Web-versjon</h2>
                <p className="text-muted-foreground mb-6">
                    Du kan også bruke Snakkaz direkte i nettleseren din. Perfekt for når du er på farten eller bruker en offentlig enhet.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 items-center">
                    <Button variant="outline" size="lg" className="w-full sm:w-auto">
                        Åpne Web-app
                    </Button>
                    <p className="text-sm text-cyberdark-400">
                        <span className="inline-flex items-center mr-2">
                            <Check className="h-4 w-4 text-cybergold-500 mr-1" /> End-to-end kryptert
                        </span>
                        <span className="inline-flex items-center">
                            <Check className="h-4 w-4 text-cybergold-500 mr-1" /> Krever ingen installasjon
                        </span>
                    </p>
                </div>
            </div>
            
            {/* Mobile PIN note */}
            <div className="mt-8 bg-cyberdark-900/50 border border-cyberblue-700/30 rounded-lg p-6 max-w-3xl mx-auto">
                <div className="flex items-start gap-3">
                    <InfoIcon className="h-5 w-5 text-cyberblue-400 mt-1" />
                    <div>
                        <h3 className="text-lg font-medium text-cyberblue-400 mb-2">Sikkerhet på mobile enheter</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            Snakkaz-appen for mobile enheter bruker en PIN-kode for ekstra sikkerhet. 
                            Dette sikrer at dine samtaler forblir private selv om enheten din kommer på avveie.
                        </p>
                        <div className="flex items-center gap-2 text-xs text-cyberdark-400">
                            <Badge className="bg-cyberblue-900/30 text-cyberblue-400 border-cyberblue-600/30">4-siffer PIN</Badge>
                            <Badge className="bg-cyberblue-900/30 text-cyberblue-400 border-cyberblue-600/30">Biometrisk støtte</Badge>
                            <Badge className="bg-cyberblue-900/30 text-cyberblue-400 border-cyberblue-600/30">Auto-lås</Badge>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

interface DownloadCardProps {
    title: string;
    description: string;
    image: string;
    badges: string[];
    buttonText: string;
    onDownload: () => void;
    onQRCode?: () => void;
    onShareLink?: () => void;
    qrEnabled?: boolean;
    version: string;
    releaseDate: string;
}

function DownloadCard({
    title,
    description,
    image,
    badges,
    buttonText,
    onDownload,
    onQRCode,
    onShareLink,
    qrEnabled = false,
    version,
    releaseDate
}: DownloadCardProps) {
    return (
    <Card className="overflow-hidden border-cyberdark-700 bg-cyberdark-950/50">
      <div className="aspect-video relative overflow-hidden">
        <img 
          src={image} 
          alt={title} 
          className="object-cover w-full h-full transform hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-cyberdark-950 to-transparent opacity-70"></div>
        <div className="absolute bottom-3 left-3 flex gap-2">
          {badges.map((badge, i) => (
            <Badge 
              key={i} 
              variant="outline" 
              className="bg-cyberdark-900/80 text-cybergold-400 border-cybergold-700/30"
            >
              {badge}
            </Badge>
          ))}
        </div>
      </div>
      
      <CardContent className="p-6">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-cybergold-500 mb-1">{title}</h3>
          <p className="text-sm text-cyberdark-300">{description}</p>
        </div>
        
        <div className="flex text-xs text-cyberdark-400 mb-4">
          <div className="flex items-center mr-4">
            <FileDown className="h-3 w-3 mr-1" />
            <span>{version}</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            <span>{releaseDate}</span>
          </div>
        </div>
        
        <div className="flex flex-col gap-3">
          <Button className="w-full" onClick={onDownload}>{buttonText}</Button>
          
          {qrEnabled && (
            <div className="flex justify-between">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1 mr-2"
                onClick={onQRCode}
              >
                <QrCode className="h-4 w-4 mr-2" />
                <span>QR-kode</span>
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1"
                onClick={onShareLink}
              >
                <Share2 className="h-4 w-4 mr-2" />
                <span>Del lenke</span>
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
