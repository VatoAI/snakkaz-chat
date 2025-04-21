
import { useAuth } from "@/contexts/AuthContext";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Copy, Link, Check, LogOut, User, Shield } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { useMemo } from "react";

interface ProfileDropdownProps {
  currentUserId: string;
  userProfiles: Record<string, { username: string | null; avatar_url: string | null }>;
  currentStatus: string;
  onStatusChange: (s: string) => void;
  isOnline: boolean;
  isBusy: boolean;
  isBrb: boolean;
  isOffline: boolean;
  handleCopyUserId: () => void;
  handleCopyInviteLink: () => void;
}

export function ProfileDropdown({
  currentUserId,
  userProfiles,
  currentStatus,
  onStatusChange,
  isOnline,
  isBusy,
  isBrb,
  isOffline,
  handleCopyUserId,
  handleCopyInviteLink
}: ProfileDropdownProps) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isAdmin } = useIsAdmin(user?.id);

  const avatarUrl = userProfiles[currentUserId]?.avatar_url || null;
  const username = userProfiles[currentUserId]?.username || null;
  const initials = username?.slice(0,2).toUpperCase() ?? "SZ";

  const statusOptions = useMemo(() => [
    { key: 'online', label: 'Online', isActive: isOnline },
    { key: 'busy', label: 'Busy', isActive: isBusy },
    { key: 'brb', label: 'BRB', isActive: isBrb },
    { key: 'offline', label: 'Offline', isActive: isOffline }
  ], [isOnline, isBusy, isBrb, isOffline]);

  const handleLogout = async () => {
    const { error } = await import("@/integrations/supabase/client").then(m => m.supabase.auth.signOut());
    if (error) {
      toast({ title: "Kunne ikke logge ut", description: "Prøv igjen senere", variant: "destructive" });
    } else {
      toast({ title: "Logget ut", description: "Du er nå logget ut" });
      navigate('/login', { replace: true });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="rounded-full focus:outline-none transition-all border-2 border-cybergold-400/20 hover:scale-105 bg-cyberdark-900/70 p-0.5"
          title="Åpne brukerprofil"
        >
          <Avatar className="h-8 w-8">
            {avatarUrl ? (
              <AvatarImage src={avatarUrl} alt={username || "SZ"} />
            ) : (
              <AvatarFallback className="bg-cyberdark-700 text-cybergold-300">
                {initials}
              </AvatarFallback>
            )}
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" align="end" className="z-50 w-56 bg-cyberdark-900/95 backdrop-blur-lg border border-cybergold-400/25 p-2">
        <div className="flex flex-col items-center gap-2 py-2">
          <Avatar className="h-14 w-14 mb-1 border-2 border-cybergold-400/60 shadow-neon-gold">
            {avatarUrl ? (
              <AvatarImage src={avatarUrl} alt={username || "SZ"} />
            ) : (
              <AvatarFallback className="bg-cyberdark-700 text-cybergold-200 text-xl">{initials}</AvatarFallback>
            )}
          </Avatar>
          <span className="font-bold text-cybergold-200 text-lg truncate">{username || <span className="text-cyberblue-300">{currentUserId}</span>}</span>
          {isAdmin && (
            <span className="flex items-center text-xs text-cyberblue-400 p-1 px-2 rounded bg-cyberblue-950/60 border border-cyberblue-400/30 font-mono gap-1">
              <Shield className="w-4 h-4" /> Admin
            </span>
          )}
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="font-medium text-cybergold-100">Konto handlinger</DropdownMenuLabel>
        <DropdownMenuItem onSelect={() => navigate('/profil')}>
          <User className="mr-2 h-4 w-4" />
          Profil
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleCopyUserId}>
          <Copy className="mr-2 h-4 w-4" />
          Kopier Bruker ID
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleCopyInviteLink}>
          <Link className="mr-2 h-4 w-4" />
          Inviter venn
        </DropdownMenuItem>
        {isAdmin && (
          <DropdownMenuItem onSelect={() => navigate('/admin')}>
            <Shield className="mr-2 h-4 w-4" />
            Admin Panel
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Status</DropdownMenuLabel>
        {statusOptions.map(opt => (
          <DropdownMenuItem
            key={opt.key}
            onClick={() => onStatusChange(opt.key)}
            className={opt.isActive ? "font-bold text-cybergold-400" : ""}
          >
            <Check className={`mr-2 h-4 w-4 ${opt.isActive ? "" : "opacity-0"}`} />
            {opt.label}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Logg ut
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
