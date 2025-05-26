
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useTabShortcuts } from '@/hooks/useTabShortcuts';
import { motion, AnimatePresence } from 'framer-motion';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Friend } from '../friends/types';

interface TabsContainerProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedFriend: Friend | null;
  children: React.ReactNode;
}

export const TabsContainer = ({
  activeTab,
  setActiveTab,
  selectedFriend,
  children
}: TabsContainerProps) => {
  useTabShortcuts(setActiveTab, activeTab, !!selectedFriend);

  const handleTabChange = (newTab: string) => {
    if (newTab === 'direct' && !selectedFriend) {
      return;
    }
    setActiveTab(newTab);
  };

  return (
    <TooltipProvider>
      <Tabs 
        value={activeTab} 
        onValueChange={handleTabChange} 
        className="w-full h-full flex flex-col"
      >
        <AnimatePresence mode="wait">
          <motion.div 
            className="flex-1 overflow-hidden"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </Tabs>
    </TooltipProvider>
  );
};
