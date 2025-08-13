
import { useState, useEffect } from "react";

export const useSystemLoad = () => {
  const [systemLoad, setSystemLoad] = useState(Math.floor(Math.random() * 60) + 20);

  useEffect(() => {
    const interval = setInterval(() => {
      setSystemLoad(prev => {
        const change = Math.floor(Math.random() * 20) - 10;
        const newValue = prev + change;
        return Math.max(10, Math.min(95, newValue));
      });
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return systemLoad;
};
