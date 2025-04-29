import React from 'react';
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.tsx";
import { 
  User, 
  Settings, 
  Shield, 
  LogOut, 
  LogIn,
  UserPlus,
  Bell
} from "lucide-react";

// UI components - we'll create proper component implementations rather than mocks
const Avatar = ({ className, children }) => (
  <div className={`relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full ${className || ''}`}>
    {children}
  </div>
);

const AvatarImage = ({ src, alt }) => (
  <img 
    src={src || '/placeholder-avatar.png'} 
    alt={alt} 
    className="aspect-square h-full w-full object-cover" 
    onError={(e) => { 
      const target = e.target as HTMLImageElement;
      target.style.display = 'none';
    }}
  />
);

const AvatarFallback = ({ className, children }) => (
  <div className={`flex h-full w-full items-center justify-center rounded-full ${className || ''}`}>
    {children}
  </div>
);

const DropdownMenu = ({ children }) => (
  <div className="relative">{children}</div>
);

const DropdownMenuTrigger = ({ asChild, children }) => (
  <button className="focus:outline-none">{children}</button>
);

const DropdownMenuContent = ({ className, align = "right", children }) => (
  <div className={`absolute ${align === "end" || align === "right" ? 'right-0' : 'left-0'} mt-2 w-56 origin-top-right rounded-md border border-cyberdark-700 bg-cyberdark-900 shadow-lg ring-1 ring-cyberdark-700 focus:outline-none z-50 ${className || ''}`}>
    {children}
  </div>
);

const DropdownMenuLabel = ({ children }) => (
  <div className="px-4 py-3 text-sm font-medium text-cybergold-400 border-b border-cyberdark-700">{children}</div>
);

const DropdownMenuSeparator = () => (
  <div className="my-1 h-px bg-cyberdark-700"></div>
);

const DropdownMenuGroup = ({ children }) => (
  <div className="p-2">{children}</div>
);

// Updated to make onClick optional
const DropdownMenuItem = ({ asChild, className, onClick = () => {}, children }) => {
  if (asChild) return (
    <div className={`rounded-sm px-2 py-1.5 text-sm hover:bg-cyberdark-800 cursor-pointer ${className || ''}`} onClick={onClick}>
      {children}
    </div>
  );
  
  return (
    <div 
      className={`rounded-sm px-2 py-1.5 text-sm hover:bg-cyberdark-800 cursor-pointer ${className || ''}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

const Button = ({ variant = "default", size = "md", className = "", children, ...props }) => {
  const variantClasses = {
    default: "bg-cybergold-600 text-black hover:bg-cybergold-500",
    destructive: "bg-red-600 text-white hover:bg-red-700",
    outline: "border border-cyberdark-700 bg-transparent hover:bg-cyberdark-800",
    subtle: "bg-cyberdark-800 text-cybergold-400 hover:bg-cyberdark-700",
    ghost: "bg-transparent hover:bg-cyberdark-800",
    link: "text-cybergold-400 underline-offset-4 hover:underline bg-transparent"
  };

  const sizeClasses = {
    sm: "h-8 px-2 rounded-md text-xs",
    md: "h-10 px-4 py-2 rounded-md",
    lg: "h-12 px-8 rounded-md text-lg"
  };

  const classes = `inline-flex items-center justify-center font-medium transition-colors 
                  focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cybergold-400
                  disabled:pointer-events-none disabled:opacity-50 
                  ${variantClasses[variant] || variantClasses.default} 
                  ${sizeClasses[size] || sizeClasses.md} 
                  ${className}`;

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
};

export function UserNav() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = React.useState(false);

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

  const toggleDropdown = () => setIsOpen(!isOpen);
  const closeDropdown = () => setIsOpen(false);

  return (
    <div className="flex items-center gap-2">
      {/* Notification icon */}
      <Button variant="ghost" size="sm" className="h-9 w-9 rounded-full">
        <Bell className="h-5 w-5 text-cybergold-500" />
      </Button>
      
      {/* User menu dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="relative h-10 w-10 rounded-full" onClick={toggleDropdown}>
            <Avatar className="h-9 w-9 border border-cyberdark-700">
              <AvatarImage src={user.photoURL || ''} alt={user.displayName || 'User'} />
              <AvatarFallback className="bg-cybergold-950/40 text-cybergold-300">{initials}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        
        {isOpen && (
          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuLabel>Min konto</DropdownMenuLabel>
            <div className="px-4 py-2">
              <p className="text-sm font-medium text-cybergold-300">{user.displayName || 'User'}</p>
              <p className="text-xs text-cybergold-500 truncate">{user.email}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild className="flex w-full cursor-pointer items-center">
                <Link to="/profile" className="flex w-full cursor-pointer items-center" onClick={closeDropdown}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profil</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="flex w-full cursor-pointer items-center">
                <Link to="/settings" className="flex w-full cursor-pointer items-center" onClick={closeDropdown}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Innstillinger</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="flex w-full cursor-pointer items-center">
                <Link to="/security" className="flex w-full cursor-pointer items-center" onClick={closeDropdown}>
                  <Shield className="mr-2 h-4 w-4" />
                  <span>Sikkerhet</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <div className="p-2">
              <Button 
                variant="subtle" 
                size="sm" 
                className="w-full flex items-center justify-center"
                onClick={() => {
                  logout();
                  closeDropdown();
                }}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logg ut</span>
              </Button>
            </div>
          </DropdownMenuContent>
        )}
      </DropdownMenu>
    </div>
  );
}
