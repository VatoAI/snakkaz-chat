import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    MessageCircle,
    User,
    Settings,
    Users,
    LogOut,
    Menu,
    X,
    Bell,
    Search,
    MoreVertical,
    BarChart3
} from 'lucide-react';
import { SnakkaZLogo } from '../branding/SnakkaZLogo';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface NavigationProps {
    onLogout?: () => void;
    userAvatar?: string;
    userName?: string;
    notificationCount?: number;
}

export const SnakkaZNavigation: React.FC<NavigationProps> = ({
    onLogout,
    userAvatar,
    userName = "Erik Nordmann",
    notificationCount = 0
}) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const navigationItems = [
        {
            path: '/dashboard',
            label: 'Dashboard',
            icon: BarChart3,
            badge: 0
        },
        {
            path: '/chat',
            label: 'Chat',
            icon: MessageCircle,
            badge: 3
        },
        {
            path: '/contacts',
            label: 'Kontakter',
            icon: Users,
            badge: 0
        },
        {
            path: '/profile',
            label: 'Profil',
            icon: User,
            badge: 0
        },
        {
            path: '/settings',
            label: 'Innstillinger',
            icon: Settings,
            badge: 0
        }
    ];

    const isActive = (path: string) => location.pathname === path;

    const handleNavigation = (path: string) => {
        navigate(path);
        setMobileMenuOpen(false);
    };

    const handleLogout = () => {
        if (onLogout) {
            onLogout();
        } else {
            navigate('/login');
        }
    };

    return (
        <>
            {/* 📱 Mobile Navigation */}
            <div className="snakkaz-nav-mobile md:hidden">
                <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
                    <div
                        className="cursor-pointer"
                        onClick={() => navigate('/dashboard')}
                    >
                        <SnakkaZLogo variant="compact" />
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Notifications */}
                        <div className="relative">
                            <Button variant="ghost" size="icon">
                                <Bell className="w-5 h-5" />
                                {notificationCount > 0 && (
                                    <Badge className="absolute -top-1 -right-1 px-1 min-w-5 h-5 text-xs">
                                        {notificationCount}
                                    </Badge>
                                )}
                            </Button>
                        </div>

                        {/* Mobile Menu Toggle */}
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </Button>
                    </div>
                </div>

                {/* Mobile Menu Dropdown */}
                {mobileMenuOpen && (
                    <div className="absolute top-full left-0 right-0 bg-white border-b shadow-lg z-50">
                        <div className="p-4 space-y-2">
                            {navigationItems.map((item) => (
                                <button
                                    key={item.path}
                                    onClick={() => handleNavigation(item.path)}
                                    className={`flex items-center justify-between w-full p-3 rounded-lg text-left transition-colors ${isActive(item.path)
                                            ? 'bg-blue-50 text-blue-600 font-medium'
                                            : 'hover:bg-gray-50'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <item.icon className="w-5 h-5" />
                                        <span>{item.label}</span>
                                    </div>
                                    {item.badge > 0 && (
                                        <Badge variant="secondary">
                                            {item.badge}
                                        </Badge>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* 💻 Desktop Navigation */}
            <div className="snakkaz-nav-desktop hidden md:flex items-center justify-between p-4 bg-white border-b border-gray-200">
                {/* Left: Logo + Navigation */}
                <div className="flex items-center gap-8">
                    <div
                        className="cursor-pointer"
                        onClick={() => navigate('/dashboard')}
                    >
                        <SnakkaZLogo
                            variant="header"
                            animated={true}
                        />
                    </div>

                    <nav className="flex items-center gap-1">
                        {navigationItems.map((item) => (
                            <button
                                key={item.path}
                                onClick={() => handleNavigation(item.path)}
                                className={`relative flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${isActive(item.path)
                                        ? 'bg-blue-50 text-blue-600 font-medium'
                                        : 'hover:bg-gray-50'
                                    }`}
                            >
                                <item.icon className="w-4 h-4" />
                                <span>{item.label}</span>
                                {item.badge > 0 && (
                                    <Badge variant="secondary" className="ml-1">
                                        {item.badge}
                                    </Badge>
                                )}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Right: Search + User Menu */}
                <div className="flex items-center gap-3">
                    {/* Search */}
                    <Button variant="ghost" size="icon">
                        <Search className="w-5 h-5" />
                    </Button>

                    {/* Notifications */}
                    <div className="relative">
                        <Button variant="ghost" size="icon">
                            <Bell className="w-5 h-5" />
                            {notificationCount > 0 && (
                                <Badge className="absolute -top-1 -right-1 px-1 min-w-5 h-5 text-xs">
                                    {notificationCount}
                                </Badge>
                            )}
                        </Button>
                    </div>

                    {/* User Dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="flex items-center gap-2 px-2 py-1 h-auto">
                                <Avatar className="w-8 h-8">
                                    <AvatarImage src={userAvatar} alt={userName} />
                                    <AvatarFallback>{userName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                </Avatar>
                                <span className="hidden lg:block text-sm font-medium">{userName}</span>
                                <MoreVertical className="w-4 h-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <div className="px-2 py-1.5 text-sm font-medium">
                                {userName}
                            </div>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => navigate('/profile')}>
                                <User className="w-4 h-4 mr-2" />
                                Profil
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigate('/settings')}>
                                <Settings className="w-4 h-4 mr-2" />
                                Innstillinger
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                                <LogOut className="w-4 h-4 mr-2" />
                                Logg ut
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </>
    );
};

export default SnakkaZNavigation;
