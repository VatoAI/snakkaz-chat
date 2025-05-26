
import { Mail, Search, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function PrivateChatActions({
  groupInvites,
  setIsInviteDialogOpen,
  setIsGroupCreatorOpen,
  searchQuery,
  setSearchQuery,
}: {
  groupInvites: any[];
  setIsInviteDialogOpen: (open: boolean) => void;
  setIsGroupCreatorOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
}) {
  return (
    <div className="p-4 border-b border-cybergold-500/30">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-medium text-cybergold-300">Private samtaler</h2>
        <div className="flex space-x-2">
          {groupInvites.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              className="border-cybergold-500/30 text-cybergold-300 hover:bg-cyberdark-800 flex items-center gap-1 relative"
              onClick={() => setIsInviteDialogOpen(true)}
            >
              <Mail className="h-4 w-4" />
              <span>Invitasjoner</span>
              <Badge
                className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-cybergold-500 text-black"
              >
                {groupInvites.length}
              </Badge>
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            className="border-cybergold-500/30 text-cybergold-300 hover:bg-cyberdark-800 flex items-center gap-1"
            onClick={() => setIsGroupCreatorOpen(true)}
          >
            <Users className="h-4 w-4" />
            <span>Ny gruppe</span>
          </Button>
        </div>
      </div>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cyberdark-400" />
        <input
          type="text"
          placeholder="Søk i samtaler..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-cyberdark-800 border border-cybergold-500/30 rounded-md text-cybergold-200 placeholder:text-cybergold-400"
        />
      </div>
    </div>
  );
}
