import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Settings, Shield, LogOut, User } from "lucide-react";

export function UserNav() {
    const navigate = useNavigate();
    const { user, signOut } = useAuth();

    // Hent første bokstav i brukerens navn eller e-post
    const getInitials = () => {
        if (!user) return "?";
        if (user.user_metadata?.full_name) {
            return user.user_metadata.full_name.charAt(0);
        }
        if (user.email) {
            return user.email.charAt(0).toUpperCase();
        }
        return "U";
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8 border border-cyberdark-700">
                        <AvatarImage src={user?.user_metadata?.avatar_url} alt={user?.email || "Bruker"} />
                        <AvatarFallback className="bg-cybergold-600/20 text-cybergold-400">{getInitials()}</AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user?.user_metadata?.full_name || "Bruker"}</p>
                        <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => navigate("/profile")}>
                        <User className="mr-2 h-4 w-4" />
                        <span>Profil</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/settings")}>
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Innstillinger</span>
                        <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/security")}>
                        <Shield className="mr-2 h-4 w-4" />
                        <span>Sikkerhet</span>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={() => signOut()}
                    className="text-red-500 focus:text-red-500"
                >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logg ut</span>
                    <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}