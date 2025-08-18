import React, { useState, useCallback } from 'react';
import { useCustomEmojis } from '@/hooks/useCustomEmojis';
import { useEnhancedMediaUpload } from '@/hooks/useEnhancedMediaUpload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Upload, X, Star, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CustomEmojiUploaderProps {
  onEmojiCreated?: (emoji: any) => void;
  onCancel?: () => void;
  categories?: string[];
}

const DEFAULT_CATEGORIES = [
  'custom',
  'reactions',
  'animals',
  'food',
  'activities',
  'objects',
  'symbols',
  'flags'
];

export const CustomEmojiUploader: React.FC<CustomEmojiUploaderProps> = ({
  onEmojiCreated,
  onCancel,
  categories = DEFAULT_CATEGORIES
}) => {
  const { addCustomEmoji } = useCustomEmojis();
  const { uploadFile, uploadState } = useEnhancedMediaUpload();
  const { toast } = useToast();

  // Form state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [shortcode, setShortcode] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('custom');
  const [isPublic, setIsPublic] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  
  // Preview state
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Handle file selection
  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/gif', 'image/png', 'image/jpeg', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a GIF, PNG, JPEG, or WebP image",
        variant: "destructive"
      });
      return;
    }

    // Check file size (max 5MB for emojis)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: "Emoji files must be smaller than 5MB",
        variant: "destructive"
      });
      return;
    }

    setSelectedFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Auto-generate shortcode from filename if not set
    if (!shortcode) {
      const baseName = file.name.replace(/\.[^/.]+$/, '').toLowerCase();
      const cleanShortcode = baseName.replace(/[^a-z0-9_-]/g, '_').substring(0, 32);
      setShortcode(cleanShortcode);
    }

    // Auto-generate name from filename if not set
    if (!name) {
      const baseName = file.name.replace(/\.[^/.]+$/, '');
      setName(baseName.charAt(0).toUpperCase() + baseName.slice(1));
    }
  }, [shortcode, name, toast]);

  // Handle emoji creation
  const handleCreateEmoji = async () => {
    if (!selectedFile || !shortcode.trim() || !name.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide a file, shortcode, and name for the emoji",
        variant: "destructive"
      });
      return;
    }

    // Validate shortcode format
    const shortcodePattern = /^[a-z0-9_-]+$/;
    if (!shortcodePattern.test(shortcode)) {
      toast({
        title: "Invalid shortcode",
        description: "Shortcode can only contain lowercase letters, numbers, hyphens, and underscores",
        variant: "destructive"
      });
      return;
    }

    setIsCreating(true);

    try {
      // Upload the file
      const uploadResult = await uploadFile(selectedFile, {
        compress: true,
        resize: {
          maxWidth: 128,
          maxHeight: 128,
          mode: 'contain',
          quality: 0.9
        },
        generateThumbnail: true
      });

      // Create the custom emoji
      const newEmoji = await addCustomEmoji({
        shortcode: shortcode.toLowerCase(),
        name: name.trim(),
        url: uploadResult.publicUrl,
        category,
        isAnimated: selectedFile.type === 'image/gif',
        isPublic,
        description: description.trim() || undefined,
        thumbnailUrl: uploadResult.thumbnailUrl
      });

      if (isFavorite && newEmoji.id) {
        // TODO: Add to favorites
        console.log('TODO: Add emoji to favorites');
      }

      toast({
        title: "Emoji created!",
        description: `Custom emoji :${shortcode}: has been created successfully`,
      });

      // Reset form
      setSelectedFile(null);
      setPreviewUrl(null);
      setShortcode('');
      setName('');
      setDescription('');
      setCategory('custom');
      setIsPublic(false);
      setIsFavorite(false);

      // Clear file input
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

      onEmojiCreated?.(newEmoji);

    } catch (error) {
      console.error('Failed to create emoji:', error);
      toast({
        title: "Creation failed",
        description: error instanceof Error ? error.message : "Failed to create custom emoji",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleCancel = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setShortcode('');
    setName('');
    setDescription('');
    setCategory('custom');
    setIsPublic(false);
    setIsFavorite(false);

    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) fileInput.value = '';

    onCancel?.();
  };

  const isUploading = uploadState.isUploading;
  const uploadProgress = uploadState.progress;

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="w-5 h-5" />
          Create Custom Emoji
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* File Upload */}
        <div className="space-y-2">
          <Label htmlFor="emoji-file">Upload Image</Label>
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="emoji-file"
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:border-gray-500 transition-colors"
            >
              {previewUrl ? (
                <div className="relative">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="max-w-20 max-h-20 object-contain"
                  />
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setSelectedFile(null);
                      setPreviewUrl(null);
                    }}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-400">Click to upload emoji</p>
                  <p className="text-xs text-gray-500">GIF, PNG, JPEG, WebP (max 5MB)</p>
                </div>
              )}
            </label>
          </div>
          <input
            id="emoji-file"
            type="file"
            accept="image/gif,image/png,image/jpeg,image/webp"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        {/* Upload Progress */}
        {isUploading && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Uploading...</span>
              <span>{uploadProgress}%</span>
            </div>
            <Progress value={uploadProgress} className="w-full" />
          </div>
        )}

        {/* Shortcode */}
        <div className="space-y-2">
          <Label htmlFor="shortcode">Shortcode *</Label>
          <div className="flex items-center gap-2">
            <span className="text-gray-400">:</span>
            <Input
              id="shortcode"
              value={shortcode}
              onChange={(e) => setShortcode(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
              placeholder="my_emoji"
              maxLength={32}
              className="flex-1"
            />
            <span className="text-gray-400">:</span>
          </div>
          <p className="text-xs text-gray-500">
            Used to insert the emoji (e.g., :my_emoji:)
          </p>
        </div>

        {/* Name */}
        <div className="space-y-2">
          <Label htmlFor="name">Name *</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="My Awesome Emoji"
            maxLength={50}
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="A brief description of this emoji..."
            maxLength={200}
            rows={2}
          />
        </div>

        {/* Category */}
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Options */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isPublic ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              <Label htmlFor="public">Public</Label>
            </div>
            <Switch
              id="public"
              checked={isPublic}
              onCheckedChange={setIsPublic}
            />
          </div>
          <p className="text-xs text-gray-500">
            {isPublic ? 'Other users can discover and use this emoji' : 'Only you can use this emoji'}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4" />
              <Label htmlFor="favorite">Add to Favorites</Label>
            </div>
            <Switch
              id="favorite"
              checked={isFavorite}
              onCheckedChange={setIsFavorite}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isUploading || isCreating}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreateEmoji}
            disabled={!selectedFile || !shortcode.trim() || !name.trim() || isUploading || isCreating}
            className="flex-1"
          >
            {isCreating ? 'Creating...' : 'Create Emoji'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
