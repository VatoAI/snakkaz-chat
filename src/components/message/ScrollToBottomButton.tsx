
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";

interface ScrollToBottomButtonProps {
  show: boolean;
  onClick: () => void;
  unreadCount?: number;
}

export const ScrollToBottomButton = ({ 
  show, 
  onClick,
  unreadCount = 0
}: ScrollToBottomButtonProps) => {
  const isMobile = useIsMobile();
  
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className={`absolute bottom-4 ${isMobile ? 'right-2' : 'right-6'} z-10`}
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 10 }}
          transition={{ duration: 0.2 }}
        >
          <Button
            variant="outline"
            size={isMobile ? "icon" : "default"}
            onClick={onClick}
            className={`
              rounded-full shadow-lg border border-cyberblue-500/30 bg-cyberdark-800/90 backdrop-blur-sm
              hover:bg-cyberdark-700 hover:border-cyberblue-500/50 hover:shadow-neon-blue
              ${unreadCount > 0 ? 'animate-pulse' : ''}
              ${isMobile ? 'h-12 w-12' : ''}
            `}
          >
            <ChevronDown className={`${isMobile ? 'h-6 w-6' : 'h-4 w-4 mr-2'} text-cyberblue-400`} />
            {!isMobile && <span>Scroll to bottom</span>}
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-cyberred-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
