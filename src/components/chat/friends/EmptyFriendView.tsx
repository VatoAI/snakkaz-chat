
import React from 'react';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';

interface EmptyFriendViewProps {
  onAddFriend: () => void;
}

export const EmptyFriendView = ({ onAddFriend }: EmptyFriendViewProps) => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-4 text-center">
      <div className="rounded-full bg-cyberdark-800 p-4 mb-4">
        <UserPlus size={32} className="text-cybergold-400" />
      </div>
      <h3 className="text-lg font-medium text-cybergold-300 mb-2">Ingen venner enda</h3>
      <p className="text-cybergold-500 mb-4 max-w-md">
        Du har ikke lagt til noen venner enda. Legg til venner for å starte private samtaler.
      </p>
      <Button
        onClick={onAddFriend}
        className="bg-cybergold-600 hover:bg-cybergold-500 text-black"
      >
        <UserPlus className="h-4 w-4 mr-2" />
        Legg til venn
      </Button>
    </div>
  );
};
