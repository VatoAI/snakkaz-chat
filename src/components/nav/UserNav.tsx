import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { useProfileLoader } from "@/hooks/useProfileLoader";
import { useNavigate } from "react-router-dom";
import { Shield, User, Settings, LogOut, CreditCard } from "lucide-react";
import { useGroups } from "@/hooks/useGroups";

export function UserNav() {
    const { user, signOut } = useAuth();
    const { profileData } = useProfileLoader(user?.id);
    const navigate = useNavigate();
    const { isPremium } = useGroups();

    const userInitials = profileData?.display_name
        ? profileData.display_name.substring(0, 2).toUpperCase()
        : user?.email?.substring(0, 2).toUpperCase() || "??";

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10 border border-cyberdark-700">
                        <AvatarImage src={profileData?.avatar_url || ""} alt={profileData?.display_name || "Bruker"} />
                        <AvatarFallback className="bg-cybergold-500/20 text-cybergold-400">
                            {userInitials}
                        </AvatarFallback>
                    </Avatar>
                    {isPremium && (
                        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-cybergold-500 text-[10px] font-bold text-black">
                            P
                        </span>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{profileData?.display_name || "Bruker"}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                            {user?.email}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => navigate("/profile")}>
                        <User className="mr-2 h-4 w-4" />
                        <span>Min profil</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/settings")}>
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Innstillinger</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/security")}>
                        <Shield className="mr-2 h-4 w-4" />
                        <span>Sikkerhet</span>
                    </DropdownMenuItem>
                    {!isPremium && (
                        <DropdownMenuItem onClick={() => navigate("/profile")}>
                            <CreditCard className="mr-2 h-4 w-4" />
                            <span>Oppgrader til Premium</span>
                        </DropdownMenuItem>
                    )}
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logg ut</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}