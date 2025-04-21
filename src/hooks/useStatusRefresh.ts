
import { useState } from "react";

export const useStatusRefresh = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const refresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setLastUpdated(new Date());
    }, 1000);
  };

  return {
    isRefreshing,
    lastUpdated,
    refresh
  };
};
