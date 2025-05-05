
import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface CommandConfirmationDialogProps {
  isOpen: boolean;
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const CommandConfirmationDialog: React.FC<CommandConfirmationDialogProps> = ({
  isOpen,
  title,
  description,
  onConfirm,
  onCancel
}) => {
  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent className="bg-cyberdark-900 border-cybergold-500/40">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-cybergold-400">{title}</AlertDialogTitle>
          <AlertDialogDescription className="text-cybergold-600">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel 
            onClick={onCancel}
            className="bg-cyberdark-800 text-cybergold-400 hover:bg-cyberdark-700"
          >
            Avbryt
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm}
            className="bg-cybergold-600 text-black hover:bg-cybergold-500"
          >
            Bekreft
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
