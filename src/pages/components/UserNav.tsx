import { Link } from "react-router-dom";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { 
  User, 
  Settings, 
  Shield, 
  LogOut, 
  LogIn,
  UserPlus
} from "lucide-react";

export function UserNav() {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Link to="/login">
          <Button variant="ghost" size="sm" className="h-9 w-9 md:h-10 md:w-auto md:px-4">
            <LogIn className="h-4 w-4 md:mr-2" />
            <span className="hidden md:inline">Logg inn</span>
          </Button>
        </Link>
        <Link to="/register">
          <Button variant="default" size="sm" className="h-9 w-9 md:h-10 md:w-auto md:px-4">
            <UserPlus className="h-4 w-4 md:mr-2" />
            <span className="hidden md:inline">Registrer</span>
          </Button>
        </Link>
      </div>
    );
  }

  const initials = user.displayName 
    ? `${user.displayName.split(' ')[0][0]}${user.displayName.split(' ')[1]?.[0] || ''}` 
    : user.email?.[0] || 'U';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-9 w-9 border border-cyberdark-700">
            <AvatarImage src={user.photoURL || ''} alt={user.displayName || 'User'} />
            <AvatarFallback className="bg-cybergold-950/40 text-cybergold-300">{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel>Min konto</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link to="/profile" className="flex w-full cursor-pointer items-center">
              <User className="mr-2 h-4 w-4" />
              <span>Profil</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/settings" className="flex w-full cursor-pointer items-center">
              <Settings className="mr-2 h-4 w-4" />
              <span>Innstillinger</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/security" className="flex w-full cursor-pointer items-center">
              <Shield className="mr-2 h-4 w-4" />
              <span>Sikkerhet</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout} className="cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Logg ut</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}