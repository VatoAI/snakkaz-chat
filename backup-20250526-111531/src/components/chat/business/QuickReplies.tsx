import React, { useState, useRef, useEffect } from 'react';
import { Slash } from 'lucide-react';
import { QuickReply } from '@/config/business-config';
import { useBusiness } from '@/hooks/useBusiness';
import { Button } from '@/components/ui/button';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface QuickRepliesProps {
  userId: string;
  onSelectReply: (content: string) => void;
}

/**
 * Komponent for å vise og velge hurtigsvar (Quick Replies)
 * Inspirert av Telegram Business sin Quick Replies-funksjonalitet
 */
export const QuickReplies: React.FC<QuickRepliesProps> = ({ 
  userId,
  onSelectReply 
}) => {
  const { businessConfig, addQuickReply, removeQuickReply } = useBusiness(userId);
  const [open, setOpen] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newReply, setNewReply] = useState<Partial<QuickReply>>({
    id: '',
    name: '',
    content: ''
  });
  
  const inputRef = useRef<HTMLInputElement>(null);

  // Generer en ID for nytt hurtigsvar
  const generateId = () => `qr_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

  // Håndter valg av hurtigsvar
  const handleSelectReply = (reply: QuickReply) => {
    onSelectReply(reply.content);
    setOpen(false);
  };

  // Legg til nytt hurtigsvar
  const handleAddReply = () => {
    if (!newReply.name || !newReply.content) return;
    
    const quickReply: QuickReply = {
      id: generateId(),
      name: newReply.name,
      content: newReply.content,
      mediaUrl: newReply.mediaUrl,
      mediaType: newReply.mediaType,
      stickerId: newReply.stickerId
    };
    
    addQuickReply(quickReply);
    setNewReply({ id: '', name: '', content: '' });
    setShowAddDialog(false);
  };

  // Håndter tastetrykk i meldingsfeltet
  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === '/' && e.currentTarget.textContent === '') {
      setOpen(true);
      e.preventDefault();
    }
  };

  // Fokuser på input ved åpning av dialogen
  useEffect(() => {
    if (showAddDialog) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [showAddDialog]);

  // Hvis ikke business-modus, eller ingen hurtigsvar, vis ingenting
  if (!businessConfig.enabled || !businessConfig.quickReplies?.length) {
    return null;
  }

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 rounded-full" 
            aria-label="Hurtigsvar"
            onClick={() => setOpen(true)}
          >
            <Slash className="h-5 w-5" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-1" side="top" align="start">
          <div className="max-h-[300px] overflow-y-auto">
            <div className="p-2 text-xs text-muted-foreground font-medium">
              Hurtigsvar
            </div>
            {businessConfig.quickReplies?.map((reply) => (
              <button
                key={reply.id}
                className="w-full text-left px-3 py-2 text-sm hover:bg-muted flex items-center justify-between rounded-md"
                onClick={() => handleSelectReply(reply)}
              >
                <div className="flex-grow truncate pr-2">
                  <div className="font-medium">{reply.name}</div>
                  <div className="text-xs text-muted-foreground truncate">
                    {reply.content.substring(0, 40)}
                    {reply.content.length > 40 ? '...' : ''}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 opacity-0 group-hover:opacity-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeQuickReply(reply.id);
                  }}
                >
                  <span className="sr-only">Slett</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 6h18" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                </Button>
              </button>
            ))}
            <Button
              variant="ghost"
              className="w-full text-left px-3 py-2 text-sm text-blue-500 hover:bg-muted flex items-center"
              onClick={() => {
                setShowAddDialog(true);
                setOpen(false);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2"
              >
                <path d="M12 5v14" />
                <path d="M5 12h14" />
              </svg>
              Legg til nytt hurtigsvar
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Nytt hurtigsvar</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Navn</Label>
              <Input
                id="name"
                placeholder="F.eks. 'Hilsen' eller 'Kontaktinformasjon'"
                ref={inputRef}
                value={newReply.name}
                onChange={(e) => setNewReply({ ...newReply, name: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="content">Innhold</Label>
              <Textarea
                id="content"
                placeholder="Skriv hurtigsvaret ditt her..."
                value={newReply.content}
                onChange={(e) => setNewReply({ ...newReply, content: e.target.value })}
                className="min-h-[100px]"
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Avbryt</Button>
            </DialogClose>
            <Button 
              onClick={handleAddReply} 
              disabled={!newReply.name || !newReply.content}
            >
              Lagre
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

/**
 * Hook for å lytte etter '/' i meldingsfeltet for å åpne hurtigsvar
 */
export const useQuickReplyTrigger = (
  messageInputRef: React.RefObject<HTMLDivElement | HTMLTextAreaElement>, 
  setIsQuickReplyOpen: (open: boolean) => void
) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement === messageInputRef.current) {
        if (messageInputRef.current instanceof HTMLTextAreaElement) {
          if (messageInputRef.current.value === '') {
            setIsQuickReplyOpen(true);
            e.preventDefault();
          }
        } else if (messageInputRef.current instanceof HTMLDivElement) {
          if (messageInputRef.current.textContent === '') {
            setIsQuickReplyOpen(true);
            e.preventDefault();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [messageInputRef, setIsQuickReplyOpen]);
};