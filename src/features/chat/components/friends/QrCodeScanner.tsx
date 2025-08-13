
import { useState, useEffect, useRef } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { QrCode, Loader2, Check, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface QrCodeScannerProps {
  onSuccess?: (userId: string, username: string) => void;
  onError?: (error: string) => void;
}

export const QrCodeScanner = ({ onSuccess, onError }: QrCodeScannerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [foundUser, setFoundUser] = useState<{userId: string, username: string} | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!isOpen) {
      stopScanning();
    }
  }, [isOpen]);

  const startScanning = async () => {
    setScanning(true);
    setError(null);
    setSuccess(false);
    setFoundUser(null);
    
    try {
      // Import libraries dynamically to reduce initial bundle size
      const [{ default: jsQR }] = await Promise.all([
        import('jsqr')
      ]);
      
      const constraints = {
        video: {
          facingMode: "environment"
        }
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        
        const scanQRCode = () => {
          if (!videoRef.current || !canvasRef.current || !scanning) return;
          
          const video = videoRef.current;
          const canvas = canvasRef.current;
          const ctx = canvas.getContext('2d');
          
          if (!ctx) return;
          
          // Match canvas dimensions to video
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          
          // Draw current video frame to canvas
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          
          // Get image data for QR code processing
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: "dontInvert",
          });
          
          if (code) {
            // Attempt to parse QR code data
            try {
              const data = JSON.parse(code.data);
              
              if (data.type === 'friend-request' && data.userId && data.username) {
                setFoundUser({
                  userId: data.userId,
                  username: data.username
                });
                stopScanning();
                setSuccess(true);
                
                if (onSuccess) {
                  onSuccess(data.userId, data.username);
                }
                return;
              }
            } catch (e) {
              console.error("Invalid QR code format:", e);
            }
          }
          
          // Continue scanning if no valid QR code found
          if (scanning) {
            requestAnimationFrame(scanQRCode);
          }
        };
        
        requestAnimationFrame(scanQRCode);
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError("Kunne ikke få tilgang til kamera. Sjekk at du har gitt tillatelse til kamerabruk.");
      setScanning(false);
      
      if (onError) {
        onError("Camera access error");
      }
    }
  };

  const stopScanning = () => {
    setScanning(false);
    
    // Stop video stream
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      
      tracks.forEach(track => {
        track.stop();
      });
      
      videoRef.current.srcObject = null;
    }
  };

  const handleAddFriend = async () => {
    if (!foundUser) return;
    
    setProcessing(true);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error("Du må være logget inn for å legge til venner");
      }
      
      // Check if already friends or request pending
      const { data: existingFriendship, error: checkError } = await supabase
        .from('friendships')
        .select('id, status')
        .or(`user_id.eq.${session.user.id},friend_id.eq.${session.user.id}`)
        .or(`user_id.eq.${foundUser.userId},friend_id.eq.${foundUser.userId}`)
        .maybeSingle();
      
      if (checkError) throw checkError;
      
      if (existingFriendship) {
        if (existingFriendship.status === 'accepted') {
          toast({
            title: "Allerede venner",
            description: `Du er allerede venn med ${foundUser.username}`,
          });
        } else {
          toast({
            title: "Venneforespørsel finnes",
            description: `En venneforespørsel med ${foundUser.username} finnes allerede`,
          });
        }
        
        setIsOpen(false);
        return;
      }
      
      // Send friend request
      const { error: insertError } = await supabase
        .from('friendships')
        .insert([
          {
            user_id: session.user.id,
            friend_id: foundUser.userId,
            status: 'pending'
          }
        ]);
      
      if (insertError) throw insertError;
      
      toast({
        title: "Venneforespørsel sendt",
        description: `Venneforespørsel sendt til ${foundUser.username}`,
      });
      
      setIsOpen(false);
    } catch (error) {
      console.error("Error adding friend:", error);
      toast({
        title: "Feil",
        description: (error as Error).message || "Kunne ikke sende venneforespørsel",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
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
        Skann QR-kode
      </Button>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="bg-cyberdark-900 border-gray-700 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-cyberblue-300">Skann venn QR-kode</DialogTitle>
            <DialogDescription>
              Skann en venns QR-kode for å legge dem til som venn.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col items-center">
            {error ? (
              <div className="bg-red-900/20 p-4 rounded-md border border-red-700 mb-4">
                <p className="text-red-400 text-center">{error}</p>
              </div>
            ) : success && foundUser ? (
              <div className="bg-green-900/20 p-6 rounded-md border border-green-700 mb-4 text-center">
                <div className="flex justify-center mb-4">
                  <div className="bg-green-700/20 h-16 w-16 rounded-full flex items-center justify-center">
                    <Check className="h-8 w-8 text-green-500" />
                  </div>
                </div>
                <h3 className="text-lg font-medium text-green-400 mb-1">Bruker funnet!</h3>
                <p className="text-gray-300 mb-4">Vil du sende en venneforespørsel til {foundUser.username}?</p>
                <div className="flex gap-4 justify-center">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsOpen(false)}
                    disabled={processing}
                  >
                    Avbryt
                  </Button>
                  <Button 
                    onClick={handleAddFriend}
                    disabled={processing}
                  >
                    {processing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sender...
                      </>
                    ) : (
                      'Legg til venn'
                    )}
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="relative w-full max-w-[300px] h-[300px] overflow-hidden rounded-lg border border-gray-700 bg-black mb-4">
                  <video
                    ref={videoRef}
                    className="absolute inset-0 w-full h-full object-cover"
                    playsInline
                    muted
                  />
                  <canvas
                    ref={canvasRef}
                    className="absolute inset-0 w-full h-full opacity-0"
                  />
                  {!scanning && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                      <Button 
                        variant="outline" 
                        className="bg-cyberdark-900/80 border-gray-600"
                        onClick={startScanning}
                      >
                        <QrCode className="mr-2 h-4 w-4" />
                        Start skanning
                      </Button>
                    </div>
                  )}
                </div>
                <p className="text-gray-400 text-sm text-center mb-2">
                  Plasser QR-koden i kameravisningen for å skanne
                </p>
              </>
            )}
          </div>
          
          <DialogFooter>
            <Button 
              variant={success ? "outline" : "default"}
              onClick={() => {
                if (scanning) {
                  stopScanning();
                }
                setIsOpen(false);
              }}
            >
              {success ? 'Lukk' : 'Avbryt'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
