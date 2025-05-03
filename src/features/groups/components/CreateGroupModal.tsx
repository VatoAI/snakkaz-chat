
import React, { useState } from 'react';
import { CreateGroupComponent } from './CreateGroupComponent';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (groupId: string) => void;
}

export const CreateGroupModal: React.FC<CreateGroupModalProps> = ({ isOpen, onClose, onSuccess }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md dark:bg-cyberdark-900 light:bg-white">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Opprett en ny gruppe</DialogTitle>
          <DialogDescription>
            Lag en gruppe der du kan invitere venner og familie til samtaler
          </DialogDescription>
        </DialogHeader>
        
        <CreateGroupComponent
          isModal={true}
          onSuccess={onSuccess}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};
