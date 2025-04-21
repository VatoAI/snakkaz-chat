
import { UserQrCodeDisplay } from "@/components/chat/friends/UserQrCode";
import { Airplay } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ProfileShareSectionProps {
  username: string;
}

export const ProfileShareSection = ({ username }: ProfileShareSectionProps) => {
  const { toast } = useToast();

  const handleShareQrCode = useCallback(async () => {
    try {
      const QRCode = await import('qrcode');
      if (!username) throw new Error("Du må ha brukernavn for å dele QR-kode");
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Ingen brukersesjon");
      const payload = JSON.stringify({
        type: 'friend-request',
        userId: session.user.id,
        username: username
      });
      const svg = await QRCode.toString(payload, {
        type: 'svg',
        color: {
          dark: '#000',
          light: '#fff'
        },
        width: 256,
        margin: 1
      });
      const svgBlob = new Blob([svg], { type: 'image/svg+xml' });
      const file = new File([svgBlob], `${username}-snakkaz-qr.svg`, { type: 'image/svg+xml' });
      if ((navigator as any).share && (navigator as any).canShare && (navigator as any).canShare({ files: [file] })) {
        await (navigator as any).share({
          title: `Del min QR`,
          text: `Skann QR for å legge til ${username} som venn på SnakkaZ`,
          files: [file]
        });
      } else {
        toast({
          title: "Deling ikke støttet",
          description: "Denne funksjonen er kun tilgjengelig på enheter som støtter deling av filer (AirDrop, Android Nearby osv).",
          variant: "destructive"
        });
      }
    } catch (err) {
      toast({
        title: "Feil ved deling",
        description: (err as Error)?.message ?? "Ukjent feil ved deling av QR",
        variant: "destructive"
      });
    }
  }, [username, toast]);

  return (
    <div className="flex flex-col gap-3">
      <UserQrCodeDisplay />
      <button
        className="flex items-center justify-center gap-2 bg-cyberblue-700 hover:bg-cyberblue-500 text-white rounded-lg px-4 py-2 font-semibold shadow-neon-blue transition-all"
        onClick={handleShareQrCode}
        type="button"
      >
        <Airplay className="w-5 h-5" />
        Del QR-kode (AirDrop/Nearby)
      </button>
    </div>
  );
};
