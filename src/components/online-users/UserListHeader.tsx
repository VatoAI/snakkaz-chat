
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface UserListHeaderProps {
  showAllUsers: boolean;
  isLoading: boolean;
  onlineCount: number;
  toggleShowAllUsers: () => void;
}

export const UserListHeader = ({ 
  showAllUsers, 
  isLoading, 
  onlineCount,
  toggleShowAllUsers 
}: UserListHeaderProps) => {
  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={toggleShowAllUsers}
        className="w-full bg-cyberdark-800 border-cybergold-500/30 text-cybergold-400 hover:bg-cyberdark-700 mb-2"
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Laster brukere...
          </div>
        ) : (
          showAllUsers ? "Vis bare påloggede" : "Vis alle brukere"
        )}
      </Button>
      
      <div className="text-xs text-cybergold-500 mb-2">
        {onlineCount === 1 ? '1 bruker pålogget' : `${onlineCount} brukere pålogget`}
      </div>
    </>
  );
};
