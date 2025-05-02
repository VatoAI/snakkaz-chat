
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
import { Settings, Shield, LogOut, User, Crown } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export function UserNav() {
    const navigate = useNavigate();
    const { user, signOut } = useAuth();
    const [isPremium, setIsPremium] = useState(false);

    // Get first letter of user's name or email
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
    
    useEffect(() => {
        if (user?.id) {
            const checkPremiumStatus = async () => {
                try {
                    const { data, error } = await supabase
                        .from('profiles')
                        .select('is_premium')
                        .eq('id', user.id)
                        .single();
                    
                    if (error) {
                        console.error('Error checking premium status:', error);
                        return;
                    }
                    
                    setIsPremium(data?.is_premium || false);
                } catch (err) {
                    console.error('Failed to check premium status:', err);
                }
            };
            
            checkPremiumStatus();
        }
    }, [user]);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8 border border-cyberdark-700">
                        <AvatarImage src={user?.user_metadata?.avatar_url} alt={user?.email || "Bruker"} />
                        <AvatarFallback className={`${isPremium ? 'bg-cybergold-600/20' : 'bg-cyberdark-700'} text-cybergold-400`}>
                            {getInitials()}
                        </AvatarFallback>
                    </Avatar>
                    {isPremium && (
                        <span className="absolute -top-1 -right-1 bg-cybergold-500 rounded-full w-3 h-3 flex items-center justify-center">
                            <Crown className="h-2 w-2 text-black" />
                        </span>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <div className="flex items-center">
                            <p className="text-sm font-medium leading-none">{user?.user_metadata?.full_name || "Bruker"}</p>
                            {isPremium && (
                                <Crown className="h-3 w-3 ml-1 text-cybergold-400" />
                            )}
                        </div>
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
                    {isPremium && (
                        <DropdownMenuItem onClick={() => window.open('https://electrum.org/', '_blank')}>
                            <img 
                                src="/lovable-uploads/4402f982-40f7-49ac-8d9a-bb8bb64fc2bf.png" 
                                alt="Electrum" 
                                className="mr-2 h-4 w-4"
                            />
                            <span>Electrum-lommebok</span>
                        </DropdownMenuItem>
                    )}
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
