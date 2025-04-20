
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface TabIndicatorProps {
  unreadCount?: number;
  isActive: boolean;
}

export const TabIndicator = ({ unreadCount = 0, isActive }: TabIndicatorProps) => {
  const [showBadge, setShowBadge] = useState(false);

  useEffect(() => {
    if (unreadCount > 0) {
      setShowBadge(true);
    }
  }, [unreadCount]);

  return (
    <motion.div
      className={`absolute -bottom-px left-0 right-0 h-0.5 ${
        isActive ? 'bg-gradient-to-r from-cyberblue-500 to-cyberblue-400' : 'bg-transparent'
      }`}
      initial={false}
      animate={{ 
        scaleX: isActive ? 1 : 0,
        opacity: isActive ? 1 : 0
      }}
      transition={{ duration: 0.2 }}
    >
      {showBadge && unreadCount > 0 && (
        <div className="absolute -top-4 -right-1">
          <span className="px-1.5 py-0.5 text-xs font-medium bg-cyberred-500 text-white rounded-full">
            {unreadCount}
          </span>
        </div>
      )}
    </motion.div>
  );
};
