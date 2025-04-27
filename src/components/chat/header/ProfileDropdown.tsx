import { useAuth } from "@/contexts/AuthContext";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Copy, Link, Check, LogOut, User, Airplay } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import { AdminBadge } from "./AdminBadge";

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
  const { user, logout } = useAuth();
  const { isAdmin } = useIsAdmin(user?.id);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const avatarUrl = userProfiles[currentUserId]?.avatar_url || null;
  const username = userProfiles[currentUserId]?.username || null;
  // Don't show initials if avatar is set!
  const initials = avatarUrl ? null : (username?.slice(0, 2).toUpperCase() ?? "SZ");
  // Log isAdmin for debug
  console.log("[ProfileDropdown] isAdmin:", isAdmin, "user id:", user?.id);

  const statusOptions = useMemo(() => [
    { key: 'online', label: 'Online', isActive: isOnline },
    { key: 'busy', label: 'Busy', isActive: isBusy },
    { key: 'brb', label: 'BRB', isActive: isBrb },
    { key: 'offline', label: 'Offline', isActive: isOffline }
  ], [isOnline, isBusy, isBrb, isOffline]);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      const { error } = await import("@/integrations/supabase/client").then(m => m.supabase.auth.signOut());
      if (error) {
        console.error("Logout error:", error);
        toast({
          title: "Kunne ikke logge ut",
          description: "Prøv igjen senere",
          variant: "destructive",
          duration: 3000
        });
      } else {
        // Vis en visuell toast som bekrefter utlogging
        toast({
          title: "Logger ut...",
          description: "Du blir nå logget ut av systemet",
          duration: 1500
        });

        // Kort forsinkelse for å la brukeren se toast-meldingen før navigering
        setTimeout(() => {
          if (logout) logout(); // Bruk AuthContext sin logout-funksjon hvis tilgjengelig
          navigate('/login', { replace: true });
        }, 800);
      }
    } catch (e) {
      console.error("Unexpected error during logout:", e);
      toast({
        title: "En feil oppstod",
        description: "Kunne ikke fullføre utlogging",
        variant: "destructive"
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="rounded-full focus:outline-none transition-all border-2 border-cybergold-400/40 hover:scale-105 bg-cyberdark-900/70 p-0.5 hover:border-cybergold-400/70"
          title="Åpne brukerprofil"
        >
          <Avatar className="h-8 w-8">
            {avatarUrl ? (
              <AvatarImage src={avatarUrl} alt={username || "SZ"} />
            ) : (
              <AvatarFallback className="bg-cyberdark-700 text-cybergold-200">
                {initials}
              </AvatarFallback>
            )}
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" align="end"
        className="z-[100] w-64 bg-gradient-to-br from-cyberdark-950 via-cyberdark-900 to-cyberblue-950/95 backdrop-blur-xl border border-cybergold-400/30 p-4 rounded-lg shadow-neon-gold"
        style={{ minWidth: 240, color: "#ffd54d" }}
      >
        <div className="flex flex-col items-center gap-2 py-1">
          <Avatar className="h-16 w-16 border-2 border-cybergold-400/75 shadow-neon-gold">
            {avatarUrl ? (
              <AvatarImage src={avatarUrl} alt={username || "SZ"} />
            ) : (
              <AvatarFallback className="bg-cyberdark-700 text-cybergold-200 text-2xl">{initials}</AvatarFallback>
            )}
          </Avatar>
          <div className="flex flex-col items-center gap-0">
            {username ? (
              <span className="font-extrabold text-cybergold-100 text-lg leading-tight drop-shadow-glow-cyber">{username}</span>
            ) : (
              <span className="font-mono text-sm text-cyberblue-300">Bruker-ID: {currentUserId.slice(0, 10)}...</span>
            )}
            {isAdmin ? (
              <span className="flex items-center gap-1 mt-2 px-2 py-0.5 bg-cyberblue-900 border border-cyberblue-400 rounded-full font-bold text-xs text-cyberblue-300 animate-glow">
                <AdminBadge />
                Administrator
              </span>
            ) : (
              <span className="flex items-center gap-1 mt-2 px-2 py-0.5 bg-cybergold-900 border border-cybergold-400/60 rounded-full text-xs text-cybergold-200">
                Bruker
              </span>
            )}
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="font-semibold text-cybergold-100 tracking-wide">Konto</DropdownMenuLabel>
        <DropdownMenuItem onSelect={() => navigate('/profil')}>
          <User className="mr-2 h-4 w-4" />
          Profil
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleCopyUserId}>
          <Copy className="mr-2 h-4 w-4" />
          Kopier Bruker-ID
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleCopyInviteLink}>
          <Link className="mr-2 h-4 w-4" />
          Inviter venn
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="text-cybergold-100">Status</DropdownMenuLabel>
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
        <DropdownMenuItem
          onSelect={(e) => {
            e.preventDefault(); // Forhindre automatisk lukking av dropdown
            handleLogout();
          }}
          disabled={isLoggingOut}
          className="relative group"
        >
          {isLoggingOut ? (
            <>
              <div className="h-4 w-4 border-2 border-t-transparent border-cyberred-400 rounded-full animate-spin mr-2"></div>
              Logger ut...
            </>
          ) : (
            <>
              <LogOut className="mr-2 h-4 w-4 group-hover:text-cyberred-400 transition-colors" />
              <span className="group-hover:text-cyberred-400 transition-colors">Logg ut</span>
            </>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
