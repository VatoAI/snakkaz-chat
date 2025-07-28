import React, { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Upload, 
  Image, 
  Video, 
  File, 
  X, 
  Play, 
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Download,
  Share2,
  Heart,
  MessageCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface MediaFile {
  id: string;
  name: string;
  type: 'image' | 'video' | 'audio' | 'document';
  url: string;
  size: number;
  uploadProgress?: number;
  isUploading?: boolean;
  metadata?: {
    duration?: number;
    dimensions?: { width: number; height: number };
    format?: string;
  };
}

interface EnhancedMediaSystemProps {
  onMediaUpload?: (files: MediaFile[]) => void;
  onMediaSelect?: (file: MediaFile) => void;
  maxFiles?: number;
  maxFileSize?: number; // in bytes
  acceptedTypes?: string[];
  className?: string;
}

export const EnhancedMediaSystem: React.FC<EnhancedMediaSystemProps> = ({
  onMediaUpload,
  onMediaSelect,
  maxFiles = 10,
  maxFileSize = 50 * 1024 * 1024, // 50MB default
  acceptedTypes = ['image/*', 'video/*', 'audio/*', '.pdf', '.doc', '.docx'],
  className
}) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [uploadedFiles, setUploadedFiles] = useState<MediaFile[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<MediaFile | null>(null);

  // Handle file upload
  const handleFileUpload = useCallback(async (files: FileList) => {
    const fileArray = Array.from(files);
    
    // Validate files
    for (const file of fileArray) {
      if (file.size > maxFileSize) {
        toast({
          title: "Fil for stor",
          description: `${file.name} er større enn ${Math.round(maxFileSize / 1024 / 1024)}MB`,
          variant: "destructive"
        });
        return;
      }
    }

    if (uploadedFiles.length + fileArray.length > maxFiles) {
      toast({
        title: "For mange filer",
        description: `Maksimalt ${maxFiles} filer tillatt`,
        variant: "destructive"
      });
      return;
    }

    // Process files
    const newFiles: MediaFile[] = [];
    
    for (const file of fileArray) {
      const fileType = getFileType(file.type);
      const fileUrl = URL.createObjectURL(file);
      
      const mediaFile: MediaFile = {
        id: `${Date.now()}-${Math.random().toString(36).substring(7)}`,
        name: file.name,
        type: fileType,
        url: fileUrl,
        size: file.size,
        isUploading: true,
        uploadProgress: 0,
        metadata: await extractMetadata(file, fileType)
      };
      
      newFiles.push(mediaFile);
    }

    setUploadedFiles(prev => [...prev, ...newFiles]);

    // Simulate upload progress
    for (const file of newFiles) {
      simulateUpload(file.id);
    }

    onMediaUpload?.(newFiles);
  }, [uploadedFiles, maxFiles, maxFileSize, onMediaUpload, toast]);

  // Get file type from mime type
  const getFileType = (mimeType: string): MediaFile['type'] => {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'video';
    if (mimeType.startsWith('audio/')) return 'audio';
    return 'document';
  };

  // Extract metadata from file
  const extractMetadata = async (file: File, type: MediaFile['type']) => {
    const metadata: MediaFile['metadata'] = {
      format: file.type
    };

    if (type === 'image') {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      await new Promise(resolve => {
        img.onload = () => {
          metadata.dimensions = { width: img.width, height: img.height };
          resolve(null);
        };
      });
    }

    if (type === 'video' || type === 'audio') {
      const media = document.createElement(type === 'video' ? 'video' : 'audio');
      media.src = URL.createObjectURL(file);
      await new Promise(resolve => {
        media.onloadedmetadata = () => {
          metadata.duration = media.duration;
          if (type === 'video') {
            metadata.dimensions = { width: media.videoWidth, height: media.videoHeight };
          }
          resolve(null);
        };
      });
    }

    return metadata;
  };

  // Simulate upload progress
  const simulateUpload = (fileId: string) => {
    const interval = setInterval(() => {
      setUploadedFiles(prev => prev.map(file => {
        if (file.id === fileId && file.isUploading) {
          const newProgress = (file.uploadProgress || 0) + Math.random() * 15 + 5;
          if (newProgress >= 100) {
            clearInterval(interval);
            return {
              ...file,
              uploadProgress: 100,
              isUploading: false
            };
          }
          return {
            ...file,
            uploadProgress: newProgress
          };
        }
        return file;
      }));
    }, 200);
  };

  // Drag and drop handlers
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files);
    }
  }, [handleFileUpload]);

  // Remove file
  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
  };

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Get file icon
  const getFileIcon = (type: MediaFile['type']) => {
    switch (type) {
      case 'image': return <Image className="w-5 h-5" />;
      case 'video': return <Video className="w-5 h-5" />;
      case 'audio': return <Volume2 className="w-5 h-5" />;
      default: return <File className="w-5 h-5" />;
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Upload Area */}
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-6 text-center transition-colors",
          dragActive 
            ? "border-cybergold-500 bg-cybergold-500/10" 
            : "border-gray-600 hover:border-cybergold-500/50"
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <h3 className="text-lg font-medium text-white mb-2">
          Dra og slipp filer her, eller klikk for å velge
        </h3>
        <p className="text-gray-400 mb-4">
          Støtter bilder, videoer, lyd og dokumenter opptil {Math.round(maxFileSize / 1024 / 1024)}MB
        </p>
        
        <Button
          onClick={() => fileInputRef.current?.click()}
          className="liquid-glass-moderate border-cybergold-500/30"
        >
          <Upload className="w-4 h-4 mr-2" />
          Velg filer
        </Button>
        
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedTypes.join(',')}
          className="hidden"
          onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
        />
      </div>

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-white font-medium">Opplastede filer ({uploadedFiles.length})</h4>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {uploadedFiles.map((file) => (
              <div
                key={file.id}
                className="liquid-glass-subtle border border-gray-700/50 rounded-lg p-3 hover:border-cybergold-500/30 transition-colors cursor-pointer"
                onClick={() => {
                  setSelectedFile(file);
                  onMediaSelect?.(file);
                }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2 flex-1 min-w-0">
                    {getFileIcon(file.type)}
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-white truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-400">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>
                  
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(file.id);
                    }}
                    className="h-6 w-6 p-0 text-gray-400 hover:text-red-400"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>

                {/* Upload Progress */}
                {file.isUploading && (
                  <div className="mb-2">
                    <Progress 
                      value={file.uploadProgress || 0} 
                      className="h-1"
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      Laster opp... {Math.round(file.uploadProgress || 0)}%
                    </p>
                  </div>
                )}

                {/* File Type Badge */}
                <Badge 
                  variant="outline" 
                  className="text-xs border-cybergold-500/30 text-cybergold-400"
                >
                  {file.type}
                </Badge>

                {/* Metadata */}
                {file.metadata && (
                  <div className="mt-2 text-xs text-gray-400">
                    {file.metadata.dimensions && (
                      <div>{file.metadata.dimensions.width} × {file.metadata.dimensions.height}</div>
                    )}
                    {file.metadata.duration && (
                      <div>{Math.round(file.metadata.duration)}s</div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Selected File Preview */}
      {selectedFile && (
        <div className="liquid-glass-moderate border border-cybergold-500/30 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-white font-medium">Forhåndsvisning</h4>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setSelectedFile(null)}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {selectedFile.type === 'image' && (
            <img
              src={selectedFile.url}
              alt={selectedFile.name}
              className="max-w-full h-auto rounded-lg"
            />
          )}

          {selectedFile.type === 'video' && (
            <video
              src={selectedFile.url}
              controls
              className="max-w-full h-auto rounded-lg"
            />
          )}

          {selectedFile.type === 'audio' && (
            <audio
              src={selectedFile.url}
              controls
              className="w-full"
            />
          )}

          <div className="flex items-center space-x-2 mt-3">
            <Button size="sm" variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Last ned
            </Button>
            <Button size="sm" variant="outline">
              <Share2 className="w-4 h-4 mr-2" />
              Del
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};