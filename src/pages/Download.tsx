import React from "react";
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
    Clock
} from "lucide-react";

export default function Download() {
    return (
        <div className="container max-w-6xl py-10">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-cybergold-400 mb-4">Last ned Snakkaz</h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Få tilgang til Snakkaz på alle dine enheter med våre native apper for optimal sikkerhet og ytelse
                </p>
            </div>

            <Tabs defaultValue="mobile" className="mx-auto">
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
                            version="2.2.1"
                            releaseDate="10. april 2025"
                        />

                        <DownloadCard
                            title="macOS"
                            description="For macOS 12 eller nyere"
                            image="/thumbnails/snakkaz-business-analyser.png"
                            badges={["Apple Silicon", "Touch ID"]}
                            buttonText="Last ned for macOS"
                            version="2.2.5"
                            releaseDate="12. april 2025"
                        />

                        <DownloadCard
                            title="Linux"
                            description="For Ubuntu, Fedora, Debian"
                            image="/thumbnails/ai-dash-hub.png"
                            badges={[".deb/.rpm", "Flatpak"]}
                            buttonText="Last ned for Linux"
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
        </div>
    );
}

interface DownloadCardProps {
    title: string;
    description: string;
    image: string;
    badges: string[];
    buttonText: string;
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
            ></Badge>
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
          <Button className="w-full">{buttonText}</Button>
          
          {qrEnabled && (
            <div className="flex justify-between">
              <Button variant="outline" size="sm" className="flex-1 mr-2">
                <QrCode className="h-4 w-4 mr-2" />
                <span>QR-kode</span>
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                <Share2 className="h-4 w-4 mr-2" />
                <span>Del lenke</span>
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card >
  );
}