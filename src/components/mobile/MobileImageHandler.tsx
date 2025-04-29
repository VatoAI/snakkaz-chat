import React, { useState, useRef } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { Image, X, Camera, Download } from 'lucide-react';
import { useEnhancedMediaUpload } from '@/hooks/useEnhancedMediaUpload';
import { Spinner } from '@/components/ui/spinner';

interface MobileImageHandlerProps {
  onImageSelect: (imageUrl: string) => void;
  onCancel: () => void;
  conversationId: string;
  maxSize?: number; // i MB
  acceptedTypes?: string[];
}

export const MobileImageHandler: React.FC<MobileImageHandlerProps> = ({
  onImageSelect,
  onCancel,
  conversationId,
  maxSize = 10, // Standard 10MB
  acceptedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
}) => {
  const isMobile = useIsMobile();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const { uploadMedia, uploading } = useEnhancedMediaUpload();

  // Hvis ikke mobil, ikke vis denne komponenten
  if (!isMobile) return null;

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Sjekk filtype
    if (!acceptedTypes.includes(file.type)) {
      setError(`Ugyldig filtype. Aksepterte formater: ${acceptedTypes.map(t => t.replace('image/', '')).join(', ')}`);
      return;
    }

    // Sjekk filstørrelse
    if (file.size > maxSize * 1024 * 1024) {
      setError(`Bildet er for stort. Maksimal størrelse er ${maxSize}MB.`);
      return;
    }

    setError(null);
    setSelectedImage(file);

    // Lag forhåndsvisning
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleCompressAndUpload = async () => {
    if (!selectedImage) return;

    try {
      setIsCompressing(true);
      
      // Komprimer bildet før opplasting hvis det er et foto
      if (selectedImage.type === 'image/jpeg' || selectedImage.type === 'image/png') {
        const compressedImage = await compressImage(selectedImage, {
          maxWidth: 1200,
          maxHeight: 1200,
          quality: 0.8
        });
        
        // Erstatt originalbilde med komprimert versjon
        setSelectedImage(compressedImage);
      }
      
      setIsCompressing(false);
      
      // Last opp bilde
      const url = await uploadMedia({
        file: selectedImage,
        conversationId,
        fileType: 'image'
      });
      
      onImageSelect(url);
    } catch (err: any) {
      console.error('Feil ved komprimering/opplasting:', err);
      setError(`Feil ved behandling av bilde: ${err.message || 'Ukjent feil'}`);
    } finally {
      setIsCompressing(false);
    }
  };

  const compressImage = (file: File, options: { maxWidth: number, maxHeight: number, quality: number }): Promise<File> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        // Beregn nye dimensjoner
        if (width > options.maxWidth) {
          height = Math.floor(height * (options.maxWidth / width));
          width = options.maxWidth;
        }
        
        if (height > options.maxHeight) {
          width = Math.floor(width * (options.maxHeight / height));
          height = options.maxHeight;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Kunne ikke opprette canvas-kontekst'));
          return;
        }
        
        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Kunne ikke komprimere bilde'));
              return;
            }
            
            const compressedFile = new File(
              [blob], 
              file.name, 
              { 
                type: file.type,
                lastModified: Date.now() 
              }
            );
            
            resolve(compressedFile);
          }, 
          file.type, 
          options.quality
        );
      };
      
      img.onerror = () => {
        reject(new Error('Kunne ikke laste bildet for komprimering'));
      };
    });
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-lg font-medium">Del bilde</h2>
        <Button variant="ghost" size="icon" onClick={onCancel}>
          <X size={24} />
          <span className="sr-only">Lukk</span>
        </Button>
      </div>

      {/* Hovedinnhold */}
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        {previewUrl ? (
          <div className="w-full max-w-md aspect-square relative">
            <img 
              src={previewUrl} 
              alt="Forhåndsvisning" 
              className="w-full h-full object-contain rounded-lg"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 bg-black/30 text-white hover:bg-black/50 rounded-full"
              onClick={() => {
                setSelectedImage(null);
                setPreviewUrl(null);
              }}
            >
              <X size={20} />
            </Button>
          </div>
        ) : (
          <div 
            className="w-full max-w-md aspect-square border-2 border-dashed rounded-lg flex flex-col items-center justify-center p-6 cursor-pointer"
            onClick={triggerFileInput}
          >
            <Camera size={64} className="text-muted-foreground mb-4" />
            <p className="text-center text-muted-foreground">
              Trykk for å velge et bilde fra enheten din
            </p>
          </div>
        )}

        {error && (
          <div className="mt-4 p-3 rounded bg-destructive/10 text-destructive text-sm">
            {error}
          </div>
        )}

        <input
          type="file"
          ref={fileInputRef}
          accept={acceptedTypes.join(',')}
          className="hidden"
          onChange={handleImageSelect}
        />
      </div>

      {/* Footer */}
      <div className="p-4 border-t">
        {previewUrl ? (
          <Button 
            className="w-full" 
            disabled={isCompressing || uploading}
            onClick={handleCompressAndUpload}
          >
            {isCompressing || uploading ? (
              <>
                <Spinner className="mr-2 h-4 w-4" />
                {isCompressing ? 'Optimaliserer...' : 'Laster opp...'}
              </>
            ) : (
              <>
                <Image className="mr-2 h-5 w-5" />
                Send bilde
              </>
            )}
          </Button>
        ) : (
          <div className="flex gap-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={onCancel}
            >
              Avbryt
            </Button>
            <Button
              className="flex-1"
              onClick={triggerFileInput}
            >
              <Camera className="mr-2 h-5 w-5" />
              Velg bilde
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileImageHandler;