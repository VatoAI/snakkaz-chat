
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { QrCodeScanner } from "./QrCodeScanner";
import { UserQrCodeDisplay } from "./UserQrCode";
import { QrCode } from "lucide-react";

export const QrCodeSection = () => {
  return (
    <Card className="bg-cyberdark-900 border-gray-700">
      <CardHeader className="pb-3">
        <CardTitle className="text-cyberblue-300 flex items-center">
          <QrCode className="mr-2" size={20} />
          QR-kode vennskap
        </CardTitle>
        <CardDescription>
          Del din QR-kode eller skann andres for å koble til
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <p className="text-sm text-gray-400">
            QR-koder gjør det enkelt å legge til venner uten å søke eller taste inn brukernavn
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <UserQrCodeDisplay />
            <QrCodeScanner />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
