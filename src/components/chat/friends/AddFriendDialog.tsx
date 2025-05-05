
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogTitle, 
  DialogDescription,
  DialogHeader,
  DialogFooter
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { UserPlus } from 'lucide-react';

interface AddFriendDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAddFriend: (username: string) => Promise<void>;
}

export const AddFriendDialog = ({ isOpen, onClose, onAddFriend }: AddFriendDialogProps) => {
  const [username, setUsername] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim()) return;
    
    try {
      setIsSubmitting(true);
      await onAddFriend(username);
      setUsername('');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogContent className="bg-cyberdark-900 border-cybergold-500/30 text-cybergold-200">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-cybergold-400" />
            Legg til venn
          </DialogTitle>
          <DialogDescription className="text-cybergold-500/70">
            Skriv inn brukernavnet til personen du vil legge til
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="username">Brukernavn</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Skriv brukernavn..."
                className="bg-cyberdark-800 border-cyberdark-700 text-cybergold-200"
              />
            </div>
          </div>
          
          <DialogFooter className="mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-cybergold-700 text-cybergold-400"
            >
              Avbryt
            </Button>
            <Button
              type="submit"
              disabled={!username.trim() || isSubmitting}
              className="bg-cybergold-600 hover:bg-cybergold-500 text-black"
            >
              {isSubmitting ? 'Legger til...' : 'Legg til'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
