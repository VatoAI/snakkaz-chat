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
import { Settings, Shield, LogOut, User, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";

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

    // Sjekk om brukeren har Premium-status
    const isPremium = user?.user_metadata?.subscription_status === 'active';

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button 
                    variant="ghost" 
                    className={cn(
                        "relative h-10 w-10 rounded-full transition-all duration-200 overflow-hidden",
                        "border-2 hover:border-cybergold-500 group",
                        isPremium ? "border-cybergold-500" : "border-cyberdark-600"
                    )}
                >
                    <Avatar className={cn(
                        "h-full w-full overflow-hidden",
                        "group-hover:scale-105 transition-transform duration-300"
                    )}>
                        <AvatarImage 
                            src={user?.user_metadata?.avatar_url} 
                            alt={user?.email || "Bruker"} 
                        />
                        <AvatarFallback 
                            className={cn(
                                "bg-gradient-to-br text-black font-medium",
                                isPremium ? "from-cybergold-400 to-cybergold-600" : "from-cyberdark-600 to-cyberdark-800 text-cybergold-400"
                            )}
                        >
                            {getInitials()}
                        </AvatarFallback>
                    </Avatar>
                    
                    {/* Premium indikator */}
                    {isPremium && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-cybergold-500 rounded-full 
                                     shadow-[0_0_6px_rgba(218,188,69,0.8)] border border-black z-10"
                        />
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
                className="w-64 bg-gradient-to-b from-cyberdark-900 to-cyberdark-950 border border-cyberdark-700 shadow-xl" 
                align="end" 
                forceMount
            >
                <DropdownMenuLabel className="font-normal px-4 py-3">
                    <div className="flex flex-col space-y-1.5">
                        <div className="flex items-center justify-between">
                            <p className="text-base font-medium text-cybergold-400">
                                {user?.user_metadata?.full_name || "Bruker"}
                            </p>
                            {isPremium && (
                                <span className="bg-gradient-to-r from-cybergold-500 to-cybergold-600 text-black text-xs px-2 py-0.5 rounded-full font-semibold shadow-[0_0_6px_rgba(218,188,69,0.3)]">
                                    Premium
                                </span>
                            )}
                        </div>
                        <p className="text-xs text-cybergold-700">{user?.email}</p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-cyberdark-800" />
                <DropdownMenuGroup>
                    <DropdownMenuItem 
                        onClick={() => navigate("/profile")}
                        className="hover:bg-cyberdark-800 focus:bg-cyberdark-800 px-4 py-2.5 focus:text-cybergold-400 cursor-pointer"
                    >
                        <div className="bg-cyberdark-800/50 p-1.5 rounded-full mr-3">
                            <User className="h-4 w-4 text-cybergold-500" />
                        </div>
                        <span className="text-cybergold-300 group-hover:text-cybergold-400">Min profil</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                        onClick={() => navigate("/settings")}
                        className="hover:bg-cyberdark-800 focus:bg-cyberdark-800 px-4 py-2.5 focus:text-cybergold-400 cursor-pointer"
                    >
                        <div className="bg-cyberdark-800/50 p-1.5 rounded-full mr-3">
                            <Settings className="h-4 w-4 text-cybergold-500" />
                        </div>
                        <span className="text-cybergold-300 group-hover:text-cybergold-400">Innstillinger</span>
                        <DropdownMenuShortcut className="text-cybergold-700">⌘S</DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                        onClick={() => navigate("/security")}
                        className="hover:bg-cyberdark-800 focus:bg-cyberdark-800 px-4 py-2.5 focus:text-cybergold-400 cursor-pointer"
                    >
                        <div className="bg-cyberdark-800/50 p-1.5 rounded-full mr-3">
                            <Shield className="h-4 w-4 text-cybergold-500" />
                        </div>
                        <span className="text-cybergold-300 group-hover:text-cybergold-400">Sikkerhet</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                        onClick={() => navigate("/payment")}
                        className="hover:bg-cyberdark-800 focus:bg-cyberdark-800 px-4 py-2.5 focus:text-cybergold-400 cursor-pointer"
                    >
                        <div className="bg-cyberdark-800/50 p-1.5 rounded-full mr-3">
                            <CreditCard className="h-4 w-4 text-cybergold-500" />
                        </div>
                        <span className="text-cybergold-300 group-hover:text-cybergold-400">Abonnement</span>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator className="bg-cyberdark-800" />
                <DropdownMenuItem
                    onClick={() => signOut()}
                    className="hover:bg-red-950/20 focus:bg-red-950/20 px-4 py-2.5 cursor-pointer"
                >
                    <div className="bg-red-950/50 p-1.5 rounded-full mr-3">
                        <LogOut className="h-4 w-4 text-red-500" />
                    </div>
                    <span className="text-red-400">Logg ut</span>
                    <DropdownMenuShortcut className="text-red-700">⇧⌘Q</DropdownMenuShortcut>
                </DropdownMenuItem>

                {/* Footer med versjonsnummer og copyright */}
                <div className="mt-3 px-4 py-2 text-center border-t border-cyberdark-800 text-xs text-cybergold-800">
                    Snakkaz v1.2.4 © 2025
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}