import React, { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Camera, User, X, Check, Loader2, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import { compressImage } from '@/utils/upload/imageCompression';
import { createThumbnail } from '@/utils/upload/thumbnailGenerator';
import { uploadChunkedFile } from '@/utils/upload/chunkedUpload';

interface EnhancedAvatarUploadProps {
  currentAvatar?: string;
  onAvatarChange: (avatarUrl: string) => void;
  onUploadProgress?: (progress: number) => void;
  maxSize?: number; // in MB
  allowedTypes?: string[];
  className?: string;
}

export const EnhancedAvatarUpload: React.FC<EnhancedAvatarUploadProps> = ({
  currentAvatar,
  onAvatarChange,
  onUploadProgress,
  maxSize = 5,
  allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  className
}) => {
  const [preview, setPreview] = useState<string | null>(currentAvatar || null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const validateFile = (file: File): string | null => {
    if (!allowedTypes.includes(file.type)) {
      return `Ugyldig filtype. Tillatt: ${allowedTypes.map(type => type.split('/')[1]).join(', ')}`;
    }
    
    if (file.size > maxSize * 1024 * 1024) {
      return `Filen er for stor. Maksimal størrelse: ${maxSize}MB`;
    }
    
    return null;
  };

  const processAndUploadFile = async (file: File) => {
    setError(null);
    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Validate file
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }

      // Create preview immediately
      const fileReader = new FileReader();
      fileReader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      fileReader.readAsDataURL(file);

      // Compress image if needed
      let processedFile = file;
      if (file.size > 500 * 1024) { // Compress if larger than 500KB
        setUploadProgress(20);
        processedFile = await compressImage(file, {
          maxWidth: 400,
          maxHeight: 400,
          quality: 0.8
        });
      }

      // Create thumbnail
      setUploadProgress(40);
      const thumbnail = await createThumbnail(processedFile, {
        width: 150,
        height: 150,
        quality: 0.7
      });

      // Upload with progress tracking
      setUploadProgress(60);
      const uploadResult = await uploadChunkedFile(processedFile, {
        bucket: 'avatars',
        folder: 'profile-pictures',
        onProgress: (progress) => {
          const totalProgress = 60 + (progress * 0.4);
          setUploadProgress(totalProgress);
          onUploadProgress?.(totalProgress);
        }
      });

      if (uploadResult.success && uploadResult.url) {
        setUploadProgress(100);
        onAvatarChange(uploadResult.url);
        
        toast({
          title: "🎉 Profilbilde opplastet!",
          description: "Ditt nye profilbilde er nå aktivt.",
        });
      } else {
        throw new Error(uploadResult.error || 'Upload failed');
      }

    } catch (error) {
      console.error('Avatar upload error:', error);
      setError(error instanceof Error ? error.message : 'Opplasting feilet');
      setPreview(currentAvatar || null);
      
      toast({
        title: "Opplasting feilet",
        description: "Kunne ikke laste opp profilbildet. Prøv igjen.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    const file = files[0];
    processAndUploadFile(file);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    handleFileSelect(files);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const removeAvatar = () => {
    setPreview(null);
    setError(null);
    onAvatarChange('');
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card className={cn("w-full max-w-md bg-cyberdark-900 border-cybergold-500/30", className)}>
      <CardHeader className="text-center">
        <CardTitle className="text-lg text-cybergold-400 flex items-center justify-center gap-2">
          <Camera className="h-5 w-5" />
          Profilbilde
        </CardTitle>
        <CardDescription className="text-cybergold-300">
          Last opp et bilde som representerer deg
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Preview Area */}
        <div className="flex justify-center">
          <div className="relative">
            <div 
              className={cn(
                "w-32 h-32 rounded-full border-2 border-dashed border-cybergold-500/50 flex items-center justify-center bg-cyberdark-800 transition-all duration-200",
                preview && "border-solid border-cybergold-500",
                isDragging && "border-cybergold-400 bg-cybergold-500/10 scale-105"
              )}
            >
              {preview ? (
                <img
                  src={preview}
                  alt="Profilbilde forhåndsvisning"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <User className="h-12 w-12 text-cybergold-500/50" />
              )}
              
              {isUploading && (
                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                  <div className="text-center">
                    <Loader2 className="h-6 w-6 animate-spin text-cybergold-400 mx-auto mb-1" />
                    <span className="text-xs text-cybergold-300">{Math.round(uploadProgress)}%</span>
                  </div>
                </div>
              )}
            </div>

            {preview && !isUploading && (
              <button
                onClick={removeAvatar}
                className="absolute -top-1 -right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            )}

            {preview && !isUploading && (
              <div className="absolute -bottom-1 -right-1 bg-green-500 text-white rounded-full p-1">
                <Check className="h-3 w-3" />
              </div>
            )}
          </div>
        </div>

        {/* Upload Area */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={openFileDialog}
          className={cn(
            "border-2 border-dashed border-cybergold-500/30 rounded-lg p-6 text-center cursor-pointer transition-all duration-200 hover:border-cybergold-500/50 hover:bg-cybergold-500/5",
            isDragging && "border-cybergold-400 bg-cybergold-500/10",
            isUploading && "pointer-events-none opacity-50"
          )}
        >
          <div className="space-y-2">
            {isDragging ? (
              <ImageIcon className="h-8 w-8 text-cybergold-400 mx-auto" />
            ) : (
              <Upload className="h-8 w-8 text-cybergold-500 mx-auto" />
            )}
            
            <div>
              <p className="text-cybergold-300 font-medium">
                {isDragging ? "Slipp bildet her!" : "Dra og slipp eller klikk for å velge"}
              </p>
              <p className="text-xs text-cybergold-500 mt-1">
                JPG, PNG, WebP eller GIF • Maks {maxSize}MB
              </p>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
            <AlertCircle className="h-4 w-4 text-red-400 flex-shrink-0" />
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {/* Progress Bar */}
        {isUploading && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-cybergold-400">
              <span>Laster opp...</span>
              <span>{Math.round(uploadProgress)}%</span>
            </div>
            <div className="w-full bg-cyberdark-700 rounded-full h-2">
              <div 
                className="bg-cybergold-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={openFileDialog}
            disabled={isUploading}
            className="flex-1 border-cybergold-500/30 text-cybergold-300 hover:bg-cybergold-500/10"
          >
            <Upload className="h-4 w-4 mr-2" />
            Velg fil
          </Button>
          
          {preview && (
            <Button
              type="button"
              variant="outline"
              onClick={removeAvatar}
              disabled={isUploading}
              className="border-red-500/30 text-red-400 hover:bg-red-500/10"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept={allowedTypes.join(',')}
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
        />

        {/* Upload Tips */}
        <div className="text-xs text-cybergold-500 space-y-1">
          <p>💡 Tips for best resultat:</p>
          <ul className="ml-4 space-y-1">
            <li>• Bruk kvadratiske bilder (1:1 ratio)</li>
            <li>• Minimum 200x200 piksler anbefales</li>
            <li>• Ansiktet bør være godt synlig og sentrert</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
