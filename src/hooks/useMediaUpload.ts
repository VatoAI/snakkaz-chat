import { useState } from "react";
import { uploadMedia } from "@/utils/upload/media-upload";
import { useToast } from "@/components/ui/use-toast";

/**
 * Hook for å håndtere opplasting av mediafiler med forbedret feilhåndtering
 * og tilbakemeldinger til brukeren
 */
export const useMediaUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();

  const upload = async (file: File) => {
    // Valider fil før opplasting
    if (!file) {
      toast({
        title: "Feil",
        description: "Ingen fil er valgt",
        variant: "destructive",
      });
      throw new Error("No file provided");
    }
    
    // Sjekk filstørrelse (10MB max)
    const MAX_SIZE = 10 * 1024 * 1024; // 10MB
    if (file.size > MAX_SIZE) {
      toast({
        title: "Feil",
        description: "Filen er for stor (maks 10MB)",
        variant: "destructive",
      });
      throw new Error("File too large (max 10MB)");
    }
    
    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Opprett toast som viser fremdrift
      const { id, update, dismiss } = toast({
        title: "Laster opp fil...",
        description: "Starter opplasting",
        duration: 5000,
      });

      const result = await uploadMedia(file, (progress) => {
        setUploadProgress(progress);
        // Oppdater toast med fremdrift
        update({
          id,
          title: "Laster opp fil...",
          description: `${Math.round(progress)}% fullført`,
          duration: 5000,
        });
      });

      // Oppdater toast til suksess
      update({
        id,
        title: "Opplasting fullført",
        description: "Filen ble lastet opp",
        duration: 3000,
      });

      return result;
    } catch (error) {
      console.error("Opplastingsfeil:", error);
      toast({
        title: "Opplasting feilet",
        description: error instanceof Error ? error.message : "Kunne ikke laste opp fil",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return {
    upload,
    isUploading,
    uploadProgress
  };
};
