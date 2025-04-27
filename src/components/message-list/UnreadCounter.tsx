
import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";

export interface UnreadCounterProps {
  count: number;
  show: boolean;
  onClick: () => void;
}

export const UnreadCounter = ({ count, show, onClick }: UnreadCounterProps) => {
  if (!show) return null;
  
  return (
    <Button
      onClick={onClick}
      className="absolute bottom-14 left-1/2 -translate-x-1/2 py-1 px-3 bg-cybergold-600 hover:bg-cybergold-500 text-black rounded-full shadow-lg z-10 transition-all"
      size="sm"
    >
      <ArrowDown className="h-4 w-4 mr-1" />
      <span>{count} nye meldinger</span>
    </Button>
  );
};
