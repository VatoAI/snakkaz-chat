
import { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { QrCode, Loader2, Share2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface UserQrCodeDisplayProps {
  fullScreen?: boolean;
}

export const UserQrCodeDisplay = ({ fullScreen = false }: UserQrCodeDisplayProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [qrCodeSvg, setQrCodeSvg] = useState<string>("");
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      getUserData();
    }
  }, [isOpen]);

  const getUserData = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error("Du må være logget inn for å vise QR-kode");
      }
      
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', session.user.id)
        .single();
      
      if (error) throw error;
      
      setUserId(session.user.id);
      setUsername(profile.username);
      
      generateQrCode(session.user.id, profile.username);
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast({
        title: "Feil",
        description: (error as Error).message || "Kunne ikke hente brukerdata",
        variant: "destructive",
      });
      setIsOpen(false);
    }
  };

  const generateQrCode = async (id: string, name: string) => {
    try {
      // Import QRCode library dynamically
      const QRCode = await import('qrcode');
      
      // Create payload with user information
      const payload = JSON.stringify({
        type: 'friend-request',
        userId: id,
        username: name
      });
      
      // Generate QR code as SVG
      QRCode.toString(payload, {
        type: 'svg',
        color: {
          dark: '#000',
          light: '#fff'
        },
        width: fullScreen ? 300 : 200,
        margin: 1
      }, (err, svg) => {
        if (err) throw err;
        setQrCodeSvg(svg);
        setLoading(false);
      });
    } catch (error) {
      console.error("Error generating QR code:", error);
      toast({
        title: "Feil",
        description: "Kunne ikke generere QR-kode",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const shareQrCode = async () => {
    if (!username) return;
    
    if (navigator.share) {
      try {
        // Convert SVG to blob for sharing
        const svgBlob = new Blob([qrCodeSvg], { type: 'image/svg+xml' });
        const svgFile = new File([svgBlob], `${username}-qrcode.svg`, { type: 'image/svg+xml' });
        
        await navigator.share({
          title: `Legg til ${username} som venn`,
          text: `Skann QR-koden for å legge til ${username} som venn`,
          files: [svgFile]
        });
      } catch (error) {
        console.error("Error sharing QR code:", error);
        toast({
          title: "Deling mislyktes",
          description: "Kunne ikke dele QR-kode",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Deling ikke støttet",
        description: "Beklager, denne enheten støtter ikke deling av filer",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        className="flex items-center gap-2"
      >
        <QrCode size={16} />
        Min QR-kode
      </Button>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="bg-cyberdark-900 border-gray-700 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-cyberblue-300">Min QR-kode</DialogTitle>
            <DialogDescription>
              Del denne QR-koden med andre for å la dem legge deg til som venn.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col items-center justify-center py-4">
            {loading ? (
              <div className="h-64 w-64 flex items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-cyberblue-400" />
              </div>
            ) : (
              <>
                <div className="bg-white p-4 rounded-lg shadow-lg mb-6">
                  <div dangerouslySetInnerHTML={{ __html: qrCodeSvg }} />
                </div>
                <p className="text-sm text-gray-400 text-center mb-4">
                  Be venner skanne denne koden med kameraet for å legge deg til.
                </p>
                {navigator.share && (
                  <Button 
                    variant="outline" 
                    className="flex items-center gap-2"
                    onClick={shareQrCode}
                  >
                    <Share2 size={16} />
                    Del min QR-kode
                  </Button>
                )}
              </>
            )}
          </div>
          
          <DialogFooter>
            <Button onClick={() => setIsOpen(false)}>
              Lukk
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
