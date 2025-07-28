import { useState, useEffect } from "react";
import { FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FileMediaProps {
  url: string;
  filename?: string;
  fileType?: string;
  type?: string;
  ttl?: number | null;
  onExpired?: () => void;
}

export const FileMedia = ({ url, filename, fileType, type, ttl, onExpired }: FileMediaProps) => {
  const actualFileType = type || fileType;
  const fileExtension = (filename || '').split('.').pop()?.toUpperCase() || 'FILE';
  const [isDownloading, setIsDownloading] = useState(false);

  // Add TTL expiration handling
  useEffect(() => {
    if (!ttl) return;

    const timer = setTimeout(() => {
      if (onExpired) onExpired();
    }, ttl * 1000);

    return () => clearTimeout(timer);
  }, [ttl, onExpired]);

  const handleDownload = async () => {
    try {
      setIsDownloading(true);

      // Create a temporary link and click it
      const response = await fetch(url);
      if (!response.ok) throw new Error('Download failed');

      const blob = await response.blob();
      const downloadUrl = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = filename || 'secured-file';
      document.body.appendChild(a);
      a.click();

      // Cleanup
      document.body.removeChild(a);
      URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Download error:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="mt-2 p-2 bg-cyberdark-800/60 rounded-md flex items-center gap-3">
      <div className="w-10 h-10 flex items-center justify-center bg-cyberdark-700 rounded-md">
        <FileText className="h-5 w-5 text-cyberblue-400" />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-cybergold-300 truncate">{filename || "Secured File"}</p>
        <p className="text-xs text-cybergold-500/70">{(actualFileType || '').split('/')[1] || fileExtension}</p>
      </div>

      <Button
        size="sm"
        variant="ghost"
        className="text-cyberblue-400 hover:text-cyberblue-300"
        onClick={handleDownload}
        disabled={isDownloading}
      >
        {isDownloading ? (
          <div className="h-4 w-4 border-2 border-t-transparent border-current rounded-full animate-spin"></div>
        ) : (
          <Download className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
};
