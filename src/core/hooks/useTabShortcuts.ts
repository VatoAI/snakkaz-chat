
import { useEffect } from 'react';

export const useTabShortcuts = (
  setActiveTab: (tab: string) => void,
  activeTab: string,
  hasDirectChat: boolean
) => {
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Only trigger if Ctrl/Cmd is pressed
      if (e.ctrlKey || e.metaKey) {
        switch(e.key) {
          case '1':
            setActiveTab('global');
            break;
          case '2':
            setActiveTab('private');
            break;
          case '3':
            if (hasDirectChat) {
              setActiveTab('direct');
            }
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [setActiveTab, hasDirectChat]);
};
