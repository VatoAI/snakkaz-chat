import React from 'react';
import { Menu, Search, User, Users } from 'lucide-react';
import { HeaderActionButton } from './HeaderActionButton';

// Oppdater headerType for å akseptere 'main' som en gyldig verdi
interface MainHeaderProps {
  onOpenMenu: () => void;
  onOpenSearch: () => void;
  onOpenFriends: () => void;
  onOpenProfile: () => void;
  headerType?: 'default' | 'chat' | 'main';
}

export const MainHeader: React.FC<MainHeaderProps> = ({
  onOpenMenu,
  onOpenSearch,
  onOpenFriends,
  onOpenProfile,
  headerType = 'default'
}) => {
  return (
    <div className="flex items-center justify-between p-4 border-b border-cyberdark-700">
      {/* Menu button */}
      <HeaderActionButton
        icon={<Menu className="h-5 w-5 text-cybergold-400" />}
        label="Open menu"
        onClick={onOpenMenu}
      />
      
      {/* Title - only show on main header */}
      {headerType === 'main' && (
        <h1 className="text-lg font-semibold text-cybergold-300">CyberChat</h1>
      )}
      
      {/* Action buttons */}
      <div className="flex items-center space-x-2">
        <HeaderActionButton
          icon={<Search className="h-5 w-5 text-cybergold-400" />}
          label="Open search"
          onClick={onOpenSearch}
        />
        <HeaderActionButton
          icon={<Users className="h-5 w-5 text-cybergold-400" />}
          label="Open friends"
          onClick={onOpenFriends}
        />
        <HeaderActionButton
          icon={<User className="h-5 w-5 text-cybergold-400" />}
          label="Open profile"
          onClick={onOpenProfile}
        />
      </div>
    </div>
  );
};
