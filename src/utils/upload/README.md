# Enhanced Media Upload with Image Resizing

This module provides enhanced media upload capabilities for the Snakkaz Chat application, including intelligent image resizing, compression, and chunked uploads.

## Features

- **Image resizing and compression**: Automatically resize and compress images before upload to reduce bandwidth usage and improve loading times
- **Chunked uploads**: Large files are automatically split into smaller chunks, enabling resumable uploads and better progress tracking
- **Thumbnail generation**: Automatically generate thumbnails for images and videos
- **Upload progress tracking**: Real-time tracking of upload progress with speed calculation
- **Multiple resize modes**: Choose between different resize modes (fit, cover, contain, auto)
- **Quality settings**: Configure the quality of resized images
- **Resumable uploads**: Resume interrupted uploads when connection is restored

## Usage

### Basic Example

```jsx
import { useEnhancedMediaUpload } from '@/hooks/useEnhancedMediaUpload';

const MyComponent = () => {
  const { uploadFile, uploadState } = useEnhancedMediaUpload();
  
  const handleUpload = async (file) => {
    await uploadFile(file, {
      compress: true,
      resize: {
        maxWidth: 1280,
        maxHeight: 1280,
        mode: 'auto',
        quality: 0.85
      }
    });
  };
  
  return (
    <div>
      <input type="file" onChange={(e) => handleUpload(e.target.files[0])} />
      {uploadState.isUploading && (
        <div>Progress: {uploadState.progress}%</div>
      )}
      {uploadState.url && (
        <img src={uploadState.url} alt="Uploaded image" />
      )}
    </div>
  );
};
```

### Using the EnhancedMediaUploader Component

The `EnhancedMediaUploader` component provides a complete UI for uploading files with image resizing options:

```jsx
import { EnhancedMediaUploader } from '@/components/EnhancedMediaUploader';

const MyComponent = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  
  const handleFileSelect = (file) => {
    setSelectedFile(file);
  };
  
  const handleUploadComplete = (result) => {
    console.log('Upload complete:', result);
    console.log('URL:', result.url);
    console.log('Thumbnail URL:', result.thumbnailUrl);
  };
  
  const handleCancel = () => {
    setSelectedFile(null);
  };
  
  return (
    <EnhancedMediaUploader
      selectedFile={selectedFile}
      onFileSelect={handleFileSelect}
      onCancel={handleCancel}
      onUploadComplete={handleUploadComplete}
      showResizeOptions={true}
      uploadOptions={{
        generateThumbnail: true
      }}
    />
  );
};
```

## API Reference

### useEnhancedMediaUpload Hook

```typescript
const { 
  uploadFile, 
  cancelUpload, 
  uploadState,
  getResumableUploads,
  clearResumableUploads
} = useEnhancedMediaUpload();
```

#### Methods

- `uploadFile(file: File, options?: UploadOptions): Promise<UploadResult | null>`
  - Uploads a file with the specified options
  - Returns a Promise that resolves to the upload result, or null on error

- `cancelUpload(): void`
  - Cancels an ongoing upload

- `getResumableUploads(): UploadMetadata[]`
  - Returns an array of uploads that can be resumed

- `clearResumableUploads(): void`
  - Clears all resumable uploads from local storage

#### State

The `uploadState` object contains:

- `isUploading: boolean`: Whether an upload is in progress
- `progress: number`: Upload progress as a percentage (0-100)
- `speed?: number`: Upload speed in bytes per second
- `error: Error | null`: Any error that occurred during the upload
- `url: string | null`: The URL of the uploaded file
- `thumbnailUrl?: string | null`: The URL of the generated thumbnail
- `isEncrypted?: boolean`: Whether the file was encrypted before upload

### EnhancedMediaUploader Component

```typescript
<EnhancedMediaUploader
  onFileSelect?: (file: File) => void;
  onUploadComplete?: (result: any) => void;
  onCancel: () => void;
  selectedFile: File | null;
  maxSizeMB?: number;
  allowedTypes?: string[];
  className?: string;
  buttonText?: string;
  uploadOptions?: Partial<UploadOptions>;
  showResizeOptions?: boolean;
/>
```

#### Props

- `onFileSelect`: Called when a file is selected
- `onUploadComplete`: Called when the upload completes successfully
- `onCancel`: Called when the upload is canceled
- `selectedFile`: The file to upload
- `maxSizeMB`: Maximum allowed file size in MB (default: 30)
- `allowedTypes`: Array of allowed MIME types (default: image types)
- `className`: Additional CSS class names
- `buttonText`: Text for the upload button
- `uploadOptions`: Options for the upload process
- `showResizeOptions`: Whether to show resize options for images (default: true)

### UploadOptions Interface

```typescript
interface UploadOptions {
  bucket?: string;
  folder?: string;
  compress?: boolean;
  resize?: {
    maxWidth?: number;
    maxHeight?: number;
    mode?: ResizeMode; // 'fit' | 'cover' | 'contain' | 'none' | 'auto'
    quality?: number; // 0-1, where 1 is highest quality
  };
  encrypt?: boolean;
  encryptionKey?: string;
  generateThumbnail?: boolean;
}
```

## Resize Modes

- **fit**: Resize the image to fit within the specified dimensions while maintaining aspect ratio
- **cover**: Resize and crop the image to fill the specified dimensions while maintaining aspect ratio
- **contain**: Resize the image to fit within the specified dimensions while maintaining aspect ratio (same as 'fit')
- **none**: Do not resize the image
- **auto**: Automatically choose the best resize mode based on the image and target dimensions

## Demo

A demo page is available at `/demo/image-uploader` that showcases the enhanced media upload functionality.