
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GroupVisibility, SecurityLevel } from "@/types/group";

interface GroupCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateGroup: (name: string, visibility: GroupVisibility, securityLevel: SecurityLevel) => Promise<void>;
}

export const GroupCreateModal: React.FC<GroupCreateModalProps> = ({
  isOpen,
  onClose,
  onCreateGroup
}) => {
  const [name, setName] = React.useState('');
  const [visibility, setVisibility] = React.useState<GroupVisibility>('public');
  const [securityLevel, setSecurityLevel] = React.useState<SecurityLevel>('standard');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    setIsSubmitting(true);
    try {
      await onCreateGroup(name, visibility, securityLevel);
      setName('');
      onClose();
    } catch (error) {
      console.error('Failed to create group:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Group</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="group-name">Group Name</Label>
            <Input 
              id="group-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter group name"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label>Visibility</Label>
            <div className="flex gap-2">
              <Button 
                type="button"
                variant={visibility === 'public' ? 'default' : 'outline'}
                onClick={() => setVisibility('public')}
              >
                Public
              </Button>
              <Button 
                type="button"
                variant={visibility === 'private' ? 'default' : 'outline'}
                onClick={() => setVisibility('private')}
              >
                Private
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Security Level</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button 
                type="button"
                variant={securityLevel === 'standard' ? 'default' : 'outline'}
                onClick={() => setSecurityLevel('standard')}
              >
                Standard
              </Button>
              <Button 
                type="button"
                variant={securityLevel === 'high' ? 'default' : 'outline'}
                onClick={() => setSecurityLevel('high')}
              >
                High
              </Button>
            </div>
          </div>
          
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting || !name.trim()}>
              {isSubmitting ? 'Creating...' : 'Create Group'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
