
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserPlus, Loader2 } from 'lucide-react';

interface AddFriendDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAddFriend: (username: string) => Promise<void>;
}

export const AddFriendDialog: React.FC<AddFriendDialogProps> = ({
  isOpen,
  onClose,
  onAddFriend
}) => {
  const [username, setUsername] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim()) {
      setError('Vennligst skriv inn et brukernavn');
      return;
    }
    
    setError(null);
    setIsSubmitting(true);
    
    try {
      await onAddFriend(username);
      setUsername('');
      onClose();
    } catch (err) {
      setError('Kunne ikke legge til venn. Prøv igjen senere.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-cyberdark-900 border-cybergold-800/50 text-cybergold-100 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-cybergold-300 flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-cybergold-500" />
            <span>Legg til venn</span>
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label htmlFor="username" className="text-cybergold-400">
              Brukernavn
            </Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Skriv inn brukernavn"
              className="bg-cyberdark-800 border-cybergold-700/50 focus:border-cybergold-500/50"
              disabled={isSubmitting}
            />
            {error && (
              <p className="text-red-500 text-sm mt-1">{error}</p>
            )}
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="border-cybergold-700/50 text-cybergold-400 hover:bg-cyberdark-800"
              disabled={isSubmitting}
            >
              Avbryt
            </Button>
            <Button 
              type="submit"
              className="bg-gradient-to-r from-cyberblue-600 to-cyberblue-500 hover:from-cyberblue-700 hover:to-cyberblue-600"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Legger til...
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Legg til
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddFriendDialog;
