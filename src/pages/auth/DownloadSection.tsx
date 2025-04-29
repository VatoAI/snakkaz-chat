import { useEffect, useState } from 'react';
import { Apple, Android, Windows, Globe, Download } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export const DownloadSection = () => {
  const { isIOS, isAndroid, isWindows, isMacOS, isMobile, deviceType } = useDeviceDetection();
  const [downloadUrl, setDownloadUrl] = useState<string>('');
  const [qrValue, setQrValue] = useState<string>('https://snakkaz.com/download');
  
  // QR-kode størrelse basert på enhet
  const qrSize = isMobile ? 160 : 200;

  // Bestem riktig nedlastingslenke basert på brukerens enhet
  useEffect(() => {
    if (isIOS) {
      setDownloadUrl('https://apps.apple.com/no/app/snakkaz-chat/');
      setQrValue('https://apps.apple.com/no/app/snakkaz-chat/');
    } else if (isAndroid) {
      setDownloadUrl('https://play.google.com/store/apps/details?id=com.snakkaz.chat');
      setQrValue('https://play.google.com/store/apps/details?id=com.snakkaz.chat');
    } else if (isWindows) {
      setDownloadUrl('https://snakkaz.com/download/windows');
      setQrValue('https://snakkaz.com/download/windows');
    } else if (isMacOS) {
      setDownloadUrl('https://snakkaz.com/download/mac');
      setQrValue('https://snakkaz.com/download/mac');
    } else {
      setDownloadUrl('https://snakkaz.com/download');
      setQrValue('https://snakkaz.com/download');
    }
  }, [isIOS, isAndroid, isWindows, isMacOS]);

  // Funksjon for å håndtere nedlasting
  const handleDownload = () => {
    window.open(downloadUrl, '_blank');
  };

  return (
    <div className="space-y-6 py-2">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-cybergold-300 mb-2">Last ned Snakkaz</h2>
        <p className="text-cybergold-400 mb-4">
          Få tilgang til Snakkaz Chat på alle dine enheter med våre dedikerte apper
        </p>
      </div>

      {/* QR-kode for enkel nedlasting på mobil */}
      {!isMobile && (
        <div className="flex justify-center mb-6">
          <div className="bg-white p-3 rounded-lg">
            <QRCodeSVG 
              value={qrValue} 
              size={qrSize}
              level="H"
              imageSettings={{
                src: '/snakkaz-logo.png',
                height: 40,
                width: 40,
                excavate: true,
              }}
            />
          </div>
          <div className="ml-4 flex flex-col justify-center">
            <p className="text-sm text-cybergold-400 mb-2">
              Skann QR-koden med mobilkameraet ditt for å laste ned appen
            </p>
            <p className="text-xs text-cybergold-500">
              Eller besøk: snakkaz.com/download
            </p>
          </div>
        </div>
      )}

      {/* App nedlastingsalternativer */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
        {/* iOS nedlasting */}
        <Card className={`p-4 ${isIOS ? 'ring-2 ring-blue-500' : ''} transition-all`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center">
              <Apple className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-medium">iOS App</h3>
              <p className="text-sm text-cybergold-500">For iPhone og iPad</p>
            </div>
          </div>
          <Button 
            onClick={handleDownload}
            className="mt-4 w-full"
            variant={isIOS ? "default" : "outline"}
          >
            <Download className="h-4 w-4 mr-2" />
            {isIOS ? 'Last ned nå' : 'Last ned for iOS'}
          </Button>
        </Card>

        {/* Android nedlasting */}
        <Card className={`p-4 ${isAndroid ? 'ring-2 ring-green-500' : ''} transition-all`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-700 flex items-center justify-center">
              <Android className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-medium">Android App</h3>
              <p className="text-sm text-cybergold-500">For Android-enheter</p>
            </div>
          </div>
          <Button 
            onClick={handleDownload}
            className="mt-4 w-full"
            variant={isAndroid ? "default" : "outline"}
          >
            <Download className="h-4 w-4 mr-2" />
            {isAndroid ? 'Last ned nå' : 'Last ned for Android'}
          </Button>
        </Card>

        {/* Desktop nedlasting */}
        {!isMobile && (
          <>
            <Card className={`p-4 ${isWindows ? 'ring-2 ring-blue-500' : ''} transition-all`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-700 flex items-center justify-center">
                  <Windows className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-medium">Windows</h3>
                  <p className="text-sm text-cybergold-500">For Windows 10 og nyere</p>
                </div>
              </div>
              <Button 
                onClick={handleDownload}
                className="mt-4 w-full"
                variant={isWindows ? "default" : "outline"}
              >
                <Download className="h-4 w-4 mr-2" />
                {isWindows ? 'Last ned nå' : 'Last ned for Windows'}
              </Button>
            </Card>

            <Card className={`p-4 ${isMacOS ? 'ring-2 ring-gray-300' : ''} transition-all`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
                  <Apple className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-medium">macOS</h3>
                  <p className="text-sm text-cybergold-500">For macOS 11 og nyere</p>
                </div>
              </div>
              <Button 
                onClick={handleDownload}
                className="mt-4 w-full"
                variant={isMacOS ? "default" : "outline"}
              >
                <Download className="h-4 w-4 mr-2" />
                {isMacOS ? 'Last ned nå' : 'Last ned for macOS'}
              </Button>
            </Card>
          </>
        )}
      </div>
      
      {/* Web-app */}
      <div className="mt-6 text-center">
        <h3 className="text-lg font-medium text-cybergold-300 mb-2">Fortsett på web</h3>
        <p className="text-sm text-cybergold-500 mb-4">
          Foretrekker du å bruke nettleseren? Du kan fortsette å bruke Snakkaz Chat direkte i nettleseren din.
        </p>
        <Button 
          variant="ghost" 
          onClick={() => window.location.href = '/chat'}
          className="mx-auto"
        >
          <Globe className="h-4 w-4 mr-2" />
          Åpne web-app
        </Button>
      </div>

      {/* Sikkerhetsinformasjon */}
      <div className="mt-6 text-center bg-black bg-opacity-20 p-4 rounded-lg">
        <p className="text-xs text-cybergold-500">
          Alle våre apps bruker den samme høye sikkerhetsstandarden med ende-til-ende kryptering 
          og Perfect Forward Secrecy. Dine meldinger er sikre uansett hvilken plattform du bruker.
        </p>
      </div>
    </div>
  );
};