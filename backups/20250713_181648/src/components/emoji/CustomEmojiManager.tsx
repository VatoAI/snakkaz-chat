import React, { useState, useRef, useCallback, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Upload,
  Download,
  Trash2,
  Edit,
  Copy,
  Star,
  Smile,
  Image as ImageIcon,
  Gift,
  Sparkles,
  Wand2,
  Palette,
  MoreVertical,
  Plus,
  Search,
  Grid3X3,
  List,
  Filter,
  Tag,
  Heart,
  Zap,
  Camera,
  FileImage,
  Play,
  Pause,
  RotateCcw,
  Clock,
  User,
  Laugh,
  X
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CustomEmojiUploader } from './CustomEmojiUploader';
import { useCustomEmojis, type CustomEmoji } from '@/hooks/useCustomEmojis';

interface CustomEmojiManagerProps {
  isOpen?: boolean;
  onClose?: () => void;
  onEmojiSelect?: (emoji: CustomEmoji) => void;
  onEmojiAdd?: (emoji: CustomEmoji) => void;
  onEmojiDelete?: (emojiId: string) => void;
  className?: string;
}

// Categories for custom emojis
const EMOJI_CATEGORIES = [
  { id: 'all', name: 'All', icon: Grid3X3 },
  { id: 'recent', name: 'Recent', icon: Clock },
  { id: 'favorites', name: 'Favorites', icon: Heart },
  { id: 'animated', name: 'Animated', icon: Zap },
  { id: 'personal', name: 'Personal', icon: User },
  { id: 'reactions', name: 'Reactions', icon: Smile },
  { id: 'memes', name: 'Memes', icon: Laugh },
  { id: 'logos', name: 'Logos', icon: Tag },
];

// Auto-processing options for image to emoji conversion
interface ProcessingOptions {
  maxSize: number;
  quality: number;
  format: string;
  transparent?: boolean;
  roundCorners?: boolean;
  optimizeFrames?: boolean;
  maxFrames?: number;
  fps?: number;
  addBorder?: boolean;
}

const PROCESSING_OPTIONS: Record<'emoji' | 'gif' | 'sticker', ProcessingOptions> = {
  emoji: {
    maxSize: 128,
    quality: 0.9,
    format: 'png',
    transparent: true,
    roundCorners: true
  },
  gif: {
    maxSize: 256,
    quality: 0.8,
    format: 'gif',
    optimizeFrames: true,
    maxFrames: 60,
    fps: 15
  },
  sticker: {
    maxSize: 512,
    quality: 0.95,
    format: 'webp',
    transparent: true,
    addBorder: false
  }
};

export const CustomEmojiManager: React.FC<CustomEmojiManagerProps> = ({
  isOpen: controlledIsOpen,
  onClose,
  onEmojiSelect,
  onEmojiAdd,
  onEmojiDelete,
  className
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { customEmojis, isLoading, deleteCustomEmoji, fetchCustomEmojis, toggleFavorite } = useCustomEmojis();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Use controlled state if provided, otherwise use internal state
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
  const handleClose = onClose || (() => setInternalIsOpen(false));
  const handleOpen = () => {
    if (controlledIsOpen === undefined) {
      setInternalIsOpen(true);
    }
  };
  
  const [activeTab, setActiveTab] = useState('browse');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Upload state (kept for compatibility)
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [processingStep, setProcessingStep] = useState('');

  // Filter emojis based on category and search
  const filteredEmojis = customEmojis.filter(emoji => {
    const matchesCategory = selectedCategory === 'all' || 
      (selectedCategory === 'recent' && new Date(emoji.createdAt || '') > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) ||
      (selectedCategory === 'favorites' && emoji.isFavorite) ||
      (selectedCategory === 'animated' && emoji.isAnimated) ||
      (selectedCategory === 'personal' && emoji.createdBy === user?.id) ||
      emoji.category === selectedCategory;

    const matchesSearch = !searchQuery || 
      emoji.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emoji.shortcode.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  // Handle emoji selection
  const handleEmojiClick = (emoji: CustomEmoji) => {
    onEmojiSelect?.(emoji);
    handleClose();
  };

  // Delete emoji
  const handleDeleteEmoji = async (emojiId: string) => {
    try {
      await deleteCustomEmoji(emojiId);
      onEmojiDelete?.(emojiId);
      toast({
        title: "Emoji deleted",
        description: "Custom emoji has been removed."
      });
    } catch (error) {
      toast({
        title: "Delete failed",
        description: "Failed to delete custom emoji",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => open ? handleOpen() : handleClose()}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            'h-8 w-8 p-0 rounded-full transition-all hover:scale-110',
            'bg-gradient-to-r from-cybergold-600/20 to-cybergold-400/20',
            'hover:from-cybergold-500/30 hover:to-cybergold-300/30',
            'border border-cybergold-500/30 text-cybergold-300',
            className
          )}
        >
          <Sparkles className="h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-6xl w-full h-[80vh] bg-cyberdark-900 border-cyberdark-700 text-cybergold-100">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-cybergold-300 flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Custom Emoji Manager
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 flex flex-col overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <TabsList className="grid w-full grid-cols-3 bg-cyberdark-800">
              <TabsTrigger value="browse" className="data-[state=active]:bg-cybergold-500/20">
                Browse
              </TabsTrigger>
              <TabsTrigger value="create" className="data-[state=active]:bg-cybergold-500/20">
                Create
              </TabsTrigger>
              <TabsTrigger value="import" className="data-[state=active]:bg-cybergold-500/20">
                Import
              </TabsTrigger>
            </TabsList>

            {/* Browse Tab */}
            <TabsContent value="browse" className="flex-1 flex flex-col mt-4">
              <div className="flex items-center gap-4 mb-4">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-cybergold-400" />
                  <Input
                    placeholder="Search emojis..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-cyberdark-800 border-cyberdark-600"
                  />
                </div>

                {/* View mode toggle */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                  className="bg-cyberdark-800"
                >
                  {viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid3X3 className="h-4 w-4" />}
                </Button>
              </div>

              <div className="flex gap-4 flex-1 overflow-hidden">
                {/* Categories sidebar */}
                <div className="w-48 flex-shrink-0">
                  <ScrollArea className="h-full">
                    <div className="space-y-1">
                      {EMOJI_CATEGORIES.map((category) => {
                        const Icon = category.icon;
                        return (
                          <Button
                            key={category.id}
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedCategory(category.id)}
                            className={cn(
                              'w-full justify-start',
                              selectedCategory === category.id 
                                ? 'bg-cybergold-500/20 text-cybergold-300' 
                                : 'text-cybergold-400 hover:text-cybergold-300'
                            )}
                          >
                            <Icon className="h-4 w-4 mr-2" />
                            {category.name}
                          </Button>
                        );
                      })}
                    </div>
                  </ScrollArea>
                </div>

                {/* Emoji grid/list */}
                <div className="flex-1 overflow-hidden">
                  <ScrollArea className="h-full">
                    {viewMode === 'grid' ? (
                      <div className="grid grid-cols-6 gap-3">
                        {filteredEmojis.map((emoji) => (
                          <Card 
                            key={emoji.id}
                            className="bg-cyberdark-800 border-cyberdark-600 hover:border-cybergold-500/50 transition-colors cursor-pointer group"
                            onClick={() => handleEmojiClick(emoji)}
                          >
                            <CardContent className="p-3">
                              <div className="relative">
                                <img
                                  src={emoji.url}
                                  alt={emoji.name}
                                  className="w-full h-16 object-contain rounded"
                                />
                                {emoji.isAnimated && (
                                  <Badge className="absolute top-1 right-1 text-xs bg-cybergold-500/20">
                                    GIF
                                  </Badge>
                                )}
                                
                                {/* Hover actions */}
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded flex items-center justify-center gap-1">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleFavorite(emoji.id);
                                    }}
                                    className="h-6 w-6 p-0"
                                  >
                                    <Heart className={cn("h-3 w-3", emoji.isFavorite ? "fill-cybergold-400 text-cybergold-400" : "")} />
                                  </Button>
                                  
                                  {emoji.createdBy === user?.id && (
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="h-6 w-6 p-0"
                                          onClick={(e) => e.stopPropagation()}
                                        >
                                          <MoreVertical className="h-3 w-3" />
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent>
                                        <DropdownMenuItem onClick={() => {}}>
                                          <Edit className="h-4 w-4 mr-2" />
                                          Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => {}}>
                                          <Copy className="h-4 w-4 mr-2" />
                                          Copy URL
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem 
                                          onClick={() => handleDeleteEmoji(emoji.id)}
                                          className="text-red-400"
                                        >
                                          <Trash2 className="h-4 w-4 mr-2" />
                                          Delete
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  )}
                                </div>
                              </div>
                              
                              <div className="mt-2 text-center">
                                <div className="text-xs font-medium text-cybergold-300 truncate">
                                  {emoji.name}
                                </div>
                                <div className="text-xs text-cybergold-500 truncate">
                                  {emoji.shortcode}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {filteredEmojis.map((emoji) => (
                          <Card 
                            key={emoji.id}
                            className="bg-cyberdark-800 border-cyberdark-600 hover:border-cybergold-500/50 transition-colors cursor-pointer"
                            onClick={() => handleEmojiClick(emoji)}
                          >
                            <CardContent className="p-3 flex items-center gap-3">
                              <img
                                src={emoji.url}
                                alt={emoji.name}
                                className="w-10 h-10 object-contain rounded"
                              />
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-cybergold-300">
                                  {emoji.name}
                                </div>
                                <div className="text-sm text-cybergold-500">
                                  {emoji.shortcode}
                                </div>
                                <div className="text-xs text-cybergold-600">
                                  {emoji.category}
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {emoji.isAnimated && (
                                  <Badge className="text-xs bg-cybergold-500/20">
                                    GIF
                                  </Badge>
                                )}
                                <div className="text-xs text-cybergold-500">
                                  {emoji.usage} uses
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </div>
              </div>
            </TabsContent>

            {/* Create Tab */}
            <TabsContent value="create" className="flex-1 mt-4 flex items-center justify-center">
              <CustomEmojiUploader
                onEmojiCreated={(emoji) => {
                  fetchCustomEmojis(); // Refresh the emoji list
                  onEmojiAdd?.(emoji); // Notify parent component
                  toast({
                    title: "Emoji created!",
                    description: `Custom emoji :${emoji.shortcode}: has been added to your collection`,
                  });
                }}
                onCancel={() => setActiveTab('browse')}
                categories={['custom', 'reactions', 'animals', 'food', 'activities', 'objects', 'symbols', 'flags']}
              />
            </TabsContent>

            {/* Import Tab */}
            <TabsContent value="import" className="flex-1 mt-4">
              <Card className="bg-cyberdark-800 border-cyberdark-600">
                <CardHeader>
                  <CardTitle className="text-cybergold-300 flex items-center gap-2">
                    <Download className="h-5 w-5" />
                    Import Emoji Pack
                  </CardTitle>
                  <CardDescription>
                    Import emoji packs from Slack, Discord, or other sources
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center py-8 text-cybergold-400">
                    <FileImage className="h-16 w-16 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Import Coming Soon</h3>
                    <p className="text-sm">
                      Support for importing emoji packs from Slack, Discord, and ZIP files will be available in a future update.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CustomEmojiManager;
