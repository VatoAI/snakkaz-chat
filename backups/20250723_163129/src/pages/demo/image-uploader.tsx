import React, { useState } from 'react';
import { EnhancedMediaUploader } from '../../components/EnhancedMediaUploader';
import { MediaUploader } from '../../components/MediaUploader';

interface UploadResult {
  url?: string | null;
  thumbnailUrl?: string | null;
  isEncrypted?: boolean;
  fileSize?: number;
}

const ImageUploaderDemo: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const [showStandard, setShowStandard] = useState<boolean>(false);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setUploadResult(null);
  };

  const handleCancel = () => {
    setSelectedFile(null);
    setUploadResult(null);
  };

  const handleUploadComplete = (result: any) => {
    setUploadResult({
      url: result.url,
      thumbnailUrl: result.thumbnailUrl,
      isEncrypted: result.isEncrypted,
      fileSize: selectedFile?.size
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Image Uploader Demo</h1>
        <p className="text-gray-400 mb-4">
          This demo shows the enhanced image uploader component with resizing options.
        </p>

        <div className="mb-4">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={showStandard}
              onChange={() => setShowStandard(!showStandard)}
              className="rounded text-blue-500"
            />
            <span className="ml-2">Show standard uploader for comparison</span>
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="rounded-lg p-6 bg-cyberdark-950 border border-cyberdark-800">
          <h2 className="text-xl font-medium mb-4">Enhanced Uploader</h2>
          <p className="text-sm text-gray-400 mb-4">
            Features resizing options, chunked uploads, thumbnail generation, and more.
          </p>

          <EnhancedMediaUploader
            selectedFile={selectedFile}
            onFileSelect={handleFileSelect}
            onCancel={handleCancel}
            onUploadComplete={handleUploadComplete}
            showResizeOptions={true}
            buttonText="Select image to upload"
            className="mb-4"
          />

          {uploadResult && uploadResult.url && (
            <div className="mt-6 p-4 bg-cyberdark-900 rounded-md">
              <h3 className="text-lg font-medium mb-2">Upload Result</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Original Image:</p>
                  <div className="aspect-video bg-black rounded overflow-hidden">
                    <img 
                      src={uploadResult.url} 
                      alt="Uploaded image" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
                
                {uploadResult.thumbnailUrl && (
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Generated Thumbnail:</p>
                    <div className="aspect-video bg-black rounded overflow-hidden">
                      <img 
                        src={uploadResult.thumbnailUrl} 
                        alt="Thumbnail" 
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-1">Details:</h4>
                <ul className="text-xs text-gray-400">
                  <li>Original size: {formatFileSize(uploadResult.fileSize || 0)}</li>
                  {uploadResult.isEncrypted && <li>File is encrypted</li>}
                  <li>Full URL: <a href={uploadResult.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline truncate block">{uploadResult.url}</a></li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {showStandard && (
          <div className="rounded-lg p-6 bg-cyberdark-950 border border-cyberdark-800">
            <h2 className="text-xl font-medium mb-4">Standard Uploader</h2>
            <p className="text-sm text-gray-400 mb-4">
              Basic uploader without advanced features.
            </p>

            <MediaUploader
              selectedFile={selectedFile}
              onFileSelect={handleFileSelect}
              onCancel={handleCancel}
              isUploading={false}
              buttonText="Select image to upload"
              className="mb-4"
            />
            
            <div className="p-4 bg-cyberdark-900 rounded-md">
              <p className="text-sm text-gray-400">
                Standard uploader does not handle the upload process or image compression.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' bytes';
  else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  else if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  else return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
}

export default ImageUploaderDemo;