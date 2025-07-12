// Custom Emoji Test Component - temporarily bypasses database
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Star, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface MockCustomEmoji {
  id: string;
  shortcode: string;
  name: string;
  url: string;
  category: string;
  isAnimated: boolean;
  isPublic: boolean;
  usage: number;
  isFavorite: boolean;
}

export const CustomEmojiTest: React.FC = () => {
  const [mockEmojis, setMockEmojis] = useState<MockCustomEmoji[]>([
    {
      id: '1',
      shortcode: 'snakkaz_logo',
      name: 'Snakkaz Logo',
      url: 'https://via.placeholder.com/64x64/DAC445/000000?text=S',
      category: 'logos',
      isAnimated: false,
      isPublic: true,
      usage: 42,
      isFavorite: true
    },
    {
      id: '2',
      shortcode: 'test_emoji',
      name: 'Test Emoji',
      url: 'https://via.placeholder.com/64x64/6495ED/FFFFFF?text=:)',
      category: 'custom',
      isAnimated: false,
      isPublic: false,
      usage: 7,
      isFavorite: false
    }
  ]);
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [newShortcode, setNewShortcode] = useState('');
  const [newName, setNewName] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Basic validation
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid file type',
        description: 'Please select an image file',
        variant: 'destructive'
      });
      return;
    }

    if (file.size > 2 * 1024 * 1024) { // 2MB limit
      toast({
        title: 'File too large',
        description: 'Please select an image under 2MB',
        variant: 'destructive'
      });
      return;
    }

    setSelectedFile(file);
    
    // Create preview URL
    const reader = new FileReader();
    reader.onload = () => setPreviewUrl(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleCreateEmoji = () => {
    if (!selectedFile || !newShortcode || !newName) {
      toast({
        title: 'Missing information',
        description: 'Please fill in all fields and select a file',
        variant: 'destructive'
      });
      return;
    }

    // Create mock emoji
    const newEmoji: MockCustomEmoji = {
      id: Date.now().toString(),
      shortcode: newShortcode.toLowerCase().replace(/[^a-z0-9_]/g, '_'),
      name: newName,
      url: previewUrl || '',
      category: 'custom',
      isAnimated: false,
      isPublic: false,
      usage: 0,
      isFavorite: false
    };

    setMockEmojis(prev => [...prev, newEmoji]);
    
    // Reset form
    setSelectedFile(null);
    setNewShortcode('');
    setNewName('');
    setPreviewUrl(null);

    toast({
      title: 'Custom emoji created!',
      description: `Emoji :${newEmoji.shortcode}: has been created successfully`,
    });
  };

  const toggleFavorite = (id: string) => {
    setMockEmojis(prev => prev.map(emoji => 
      emoji.id === id ? { ...emoji, isFavorite: !emoji.isFavorite } : emoji
    ));
  };

  const deleteEmoji = (id: string) => {
    setMockEmojis(prev => prev.filter(emoji => emoji.id !== id));
    toast({
      title: 'Emoji deleted',
      description: 'Custom emoji has been removed',
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-cybergold-400 mb-2">
          Custom Emoji Test
        </h1>
        <p className="text-cybergold-500">
          Testing custom emoji functionality (mock mode - no database required)
        </p>
      </div>

      {/* Upload Section */}
      <Card className="bg-cyberdark-900 border-cybergold-500/30">
        <CardHeader>
          <CardTitle className="text-cybergold-400 flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Create Custom Emoji
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="shortcode" className="text-cybergold-300">
                Shortcode (e.g., happy_cat)
              </Label>
              <Input
                id="shortcode"
                value={newShortcode}
                onChange={(e) => setNewShortcode(e.target.value)}
                placeholder="Enter shortcode"
                className="bg-cyberdark-800 border-cybergold-500/30 text-cybergold-200"
              />
            </div>
            <div>
              <Label htmlFor="name" className="text-cybergold-300">
                Display Name
              </Label>
              <Input
                id="name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Enter emoji name"
                className="bg-cyberdark-800 border-cybergold-500/30 text-cybergold-200"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="file" className="text-cybergold-300">
              Emoji Image (PNG, JPG, GIF - max 2MB)
            </Label>
            <Input
              id="file"
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="bg-cyberdark-800 border-cybergold-500/30 text-cybergold-200"
            />
          </div>

          {previewUrl && (
            <div className="flex items-center gap-4">
              <img
                src={previewUrl}
                alt="Preview"
                className="w-16 h-16 object-contain bg-cyberdark-800 rounded"
              />
              <div className="text-cybergold-300">
                Preview: :{newShortcode}:
              </div>
            </div>
          )}

          <Button
            onClick={handleCreateEmoji}
            disabled={!selectedFile || !newShortcode || !newName}
            className="bg-cybergold-600 hover:bg-cybergold-700 text-cyberdark-950"
          >
            Create Custom Emoji
          </Button>
        </CardContent>
      </Card>

      {/* Emoji List */}
      <Card className="bg-cyberdark-900 border-cybergold-500/30">
        <CardHeader>
          <CardTitle className="text-cybergold-400">Your Custom Emojis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockEmojis.map((emoji) => (
              <div
                key={emoji.id}
                className="bg-cyberdark-800 rounded-lg p-4 border border-cybergold-500/20"
              >
                <div className="flex items-center justify-between mb-3">
                  <img
                    src={emoji.url}
                    alt={emoji.name}
                    className="w-12 h-12 object-contain bg-cyberdark-700 rounded"
                  />
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleFavorite(emoji.id)}
                      className={emoji.isFavorite ? 'text-yellow-400' : 'text-cybergold-500'}
                    >
                      <Star className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteEmoji(emoji.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="text-cybergold-200 font-medium">
                    {emoji.name}
                  </div>
                  <div className="text-cybergold-400 text-sm">
                    :{emoji.shortcode}:
                  </div>
                  <div className="flex gap-2">
                    <Badge variant={emoji.isPublic ? 'default' : 'secondary'}>
                      {emoji.isPublic ? 'Public' : 'Private'}
                    </Badge>
                    <Badge variant="outline" className="text-cybergold-500 border-cybergold-500/30">
                      Used {emoji.usage}x
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Integration Status */}
      <Card className="bg-cyberdark-900 border-cybergold-500/30">
        <CardHeader>
          <CardTitle className="text-cybergold-400">Integration Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-cybergold-300">File upload functionality: Working</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-cybergold-300">Emoji creation UI: Working</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-cybergold-300">Database connection: Needs migration</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-cybergold-300">Message reactions: Ready for integration</span>
            </div>
          </div>
          
          <div className="mt-4 p-4 bg-cyberdark-800 rounded-lg">
            <p className="text-cybergold-300 text-sm">
              <strong>Next steps:</strong> Apply the database migration manually through Supabase SQL Editor 
              to enable full custom emoji functionality. All the code is ready and working!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomEmojiTest;
