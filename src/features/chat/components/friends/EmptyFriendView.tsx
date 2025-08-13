
import React from 'react';
import { UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyFriendViewProps {
  onAddFriend: () => void;
}

export const EmptyFriendView: React.FC<EmptyFriendViewProps> = ({ onAddFriend }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-6 text-center">
      <div className="w-16 h-16 mb-4 rounded-full bg-cyberdark-800 flex items-center justify-center">
        <UserPlus className="w-8 h-8 text-cybergold-500" />
      </div>
      <h3 className="text-xl font-semibold text-cybergold-400 mb-2">Ingen venner enda</h3>
      <p className="text-cybergold-600 mb-6 max-w-md">
        Du har ingen venner i din venneliste. Legg til venner for å starte private samtaler.
      </p>
      <Button 
        onClick={onAddFriend}
        className="bg-gradient-to-r from-cyberblue-600 to-cyberblue-500 hover:from-cyberblue-700 hover:to-cyberblue-600"
      >
        <UserPlus className="w-4 h-4 mr-2" />
        Legg til venn
      </Button>
    </div>
  );
};

export default EmptyFriendView;
