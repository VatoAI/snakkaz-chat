
import { Search, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserProfile } from "./types";

interface FriendSearchProps {
  searchUsername: string;
  setSearchUsername: (value: string) => void;
  onSearch: () => void;
  searchResults: UserProfile[];
  onSendFriendRequest: (userId: string) => void;
}

export const FriendSearch = ({
  searchUsername,
  setSearchUsername,
  onSearch,
  searchResults,
  onSendFriendRequest
}: FriendSearchProps) => {
  return (
    <div className="relative">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={searchUsername}
            onChange={(e) => setSearchUsername(e.target.value)}
            placeholder="Søk etter brukernavn"
            className="w-full px-3 py-2 bg-cyberdark-800 border border-cybergold-500/30 rounded-md text-cybergold-200 placeholder:text-cyberdark-400"
          />
          <Search className="absolute right-3 top-2.5 h-4 w-4 text-cyberdark-400" />
        </div>
        <Button 
          onClick={onSearch}
          variant="outline" 
          className="border-cybergold-500/30 text-cybergold-400 hover:bg-cybergold-500/10"
        >
          Søk
        </Button>
      </div>
      
      {searchResults.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-cyberdark-800 border border-cybergold-500/30 rounded-md shadow-lg">
          {searchResults.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between p-2 hover:bg-cyberdark-700"
            >
              <span className="text-cybergold-200">
                {user.username || user.full_name || 'Ukjent bruker'}
              </span>
              <Button
                onClick={() => onSendFriendRequest(user.id)}
                size="sm"
                variant="outline"
                className="border-cybergold-500/30 text-cybergold-400 hover:bg-cybergold-500/10"
              >
                <UserPlus className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
