
import React from 'react';
import { Link } from "react-router-dom";

// Fix import paths by removing the '@/' prefix as it's causing errors
// We'll use relative imports instead
import { useAuth } from "../hooks/useAuth.tsx";
import { 
  User, 
  Settings, 
  Shield, 
  LogOut, 
  LogIn,
  UserPlus
} from "lucide-react";

// Temporarily mock UI components until we can resolve the import paths
const Avatar = ({ className, children }) => <div className={className}>{children}</div>;
const AvatarImage = ({ src, alt }) => <img src={src} alt={alt} className="w-full h-full rounded-full" />;
const AvatarFallback = ({ className, children }) => <div className={className}>{children}</div>;
const DropdownMenu = ({ children }) => <div>{children}</div>;
const DropdownMenuTrigger = ({ asChild, children }) => <div>{children}</div>;
const DropdownMenuContent = ({ className, align, children }) => <div className={className}>{children}</div>;
const DropdownMenuLabel = ({ children }) => <div className="p-2 font-medium">{children}</div>;
const DropdownMenuSeparator = () => <div className="my-1 h-px bg-gray-200"></div>;
const DropdownMenuGroup = ({ children }) => <div>{children}</div>;
// Fix the DropdownMenuItem component to include onClick prop
const DropdownMenuItem = ({ asChild, className, onClick = () => {}, children }) => {
  if (asChild) return <div className={className || ""} onClick={onClick}>{children}</div>;
  return <div className={className || ""} onClick={onClick}>{children}</div>;
};
// Fix the Button component to make all props optional
const Button = ({ variant, size, className, children }) => <button className={className}>{children}</button>;

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
        <Button variant="ghost" size="sm" className="relative h-10 w-10 rounded-full">
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
          <DropdownMenuItem 
            asChild 
            className="flex w-full cursor-pointer items-center" 
            onClick={() => {}}
          >
            <Link to="/profile" className="flex w-full cursor-pointer items-center">
              <User className="mr-2 h-4 w-4" />
              <span>Profil</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem 
            asChild 
            className="flex w-full cursor-pointer items-center" 
            onClick={() => {}}
          >
            <Link to="/settings" className="flex w-full cursor-pointer items-center">
              <Settings className="mr-2 h-4 w-4" />
              <span>Innstillinger</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem 
            asChild 
            className="flex w-full cursor-pointer items-center" 
            onClick={() => {}}
          >
            <Link to="/security" className="flex w-full cursor-pointer items-center">
              <Shield className="mr-2 h-4 w-4" />
              <span>Sikkerhet</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          asChild 
          className="cursor-pointer" 
          onClick={logout}
        >
          <div className="flex w-full cursor-pointer items-center">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Logg ut</span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
