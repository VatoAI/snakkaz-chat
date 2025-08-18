import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Settings, 
  LogOut, 
  Bell, 
  Search,
  Menu,
  MessageSquare,
  Users,
  Bot,
  Shield,
  ChevronDown,
  Home
} from 'lucide-react';
import { useAuth } from '@/core/hooks/useAuth';
import { useIsMobile } from '@/core/hooks/use-mobile';
import { cn } from '@/core/utils/cn';

interface UnifiedHeaderProps {
  title?: string;
  showSearch?: boolean;
  showNotifications?: boolean;
  onMobileMenuToggle?: () => void;
}

export const UnifiedHeader: React.FC<UnifiedHeaderProps> = ({
  title = "SnakkaZ",
  showSearch = true,
  showNotifications = true,
  onMobileMenuToggle
}) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNavigationDropdown, setShowNavigationDropdown] = useState(false);
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const navDropdownRef = useRef<HTMLDivElement>(null);
  const notificationDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setShowProfileDropdown(false);
      }
      if (navDropdownRef.current && !navDropdownRef.current.contains(event.target as Node)) {
        setShowNavigationDropdown(false);
      }
      if (notificationDropdownRef.current && !notificationDropdownRef.current.contains(event.target as Node)) {
        setShowNotificationDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Navigation items for dropdown
  const navigationItems = [
    { icon: Home, label: 'Dashboard', path: '/app/dashboard' },
    { icon: MessageSquare, label: 'Chat', path: '/app/chat' },
    { icon: Users, label: 'Venner', path: '/app/friends' },
    { icon: Bot, label: 'AI Assistent', path: '/app/ai-chat' },
    { icon: Shield, label: 'Admin', path: '/app/admin', adminOnly: true }
  ];

  // Mock notifications
  const notifications = [
    { id: 1, type: 'message', title: 'Ny melding fra Alex', time: '2 min siden' },
    { id: 2, type: 'friend', title: 'Venneforespørsel fra Maria', time: '5 min siden' },
    { id: 3, type: 'system', title: 'SnakkaZ oppdatering tilgjengelig', time: '1 time siden' }
  ];

  // Profile dropdown items
  const profileItems = [
    { icon: User, label: 'Min Profil', path: '/app/profile' },
    { icon: Settings, label: 'Innstillinger', path: '/app/settings' },
    { icon: Bell, label: 'Notifikasjoner', path: '/app/notifications' },
    { icon: LogOut, label: 'Logg ut', action: signOut }
  ];

  return (
    <header className="sticky top-0 z-40 bg-cyberdark-900/95 backdrop-blur-xl border-b border-cyberdark-700/50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Logo and Navigation */}
          <div className="flex items-center space-x-8">
            {/* Logo */}
            <Link to="/app" className="flex items-center space-x-2 group">
              <div className="w-8 h-8 bg-gradient-to-br from-cybergold-400 to-cybergold-600 rounded-lg flex items-center justify-center">
                <span className="text-cyberdark-900 font-bold text-lg">S</span>
              </div>
              <span className="text-xl font-bold text-cybergold-400 group-hover:text-cybergold-300 transition-colors">
                {title}
              </span>
            </Link>

            {/* Desktop Navigation */}
            {!isMobile && (
              <nav className="hidden md:flex items-center space-x-1">
                <div className="relative" ref={navDropdownRef}>
                  <button
                    onClick={() => setShowNavigationDropdown(!showNavigationDropdown)}
                    className="flex items-center space-x-1 px-3 py-2 rounded-md text-cyberdark-300 hover:text-cybergold-400 hover:bg-cyberdark-800/50 transition-all duration-200"
                  >
                    <Menu size={18} />
                    <span>Navigasjon</span>
                    <ChevronDown 
                      size={16} 
                      className={cn(
                        "transition-transform duration-200",
                        showNavigationDropdown && "rotate-180"
                      )} 
                    />
                  </button>

                  {/* Navigation Dropdown */}
                  <AnimatePresence>
                    {showNavigationDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full left-0 mt-2 w-64 bg-cyberdark-850 rounded-xl border border-cyberdark-700 shadow-2xl overflow-hidden"
                      >
                        {navigationItems.map((item) => {
                          if (item.adminOnly && !user?.app_metadata?.role === 'admin') return null;
                          const Icon = item.icon;
                          return (
                            <Link
                              key={item.path}
                              to={item.path}
                              className="flex items-center space-x-3 px-4 py-3 text-cyberdark-300 hover:text-cybergold-400 hover:bg-cyberdark-800/50 transition-all duration-200"
                              onClick={() => setShowNavigationDropdown(false)}
                            >
                              <Icon size={18} />
                              <span>{item.label}</span>
                            </Link>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </nav>
            )}
          </div>

          {/* Center - Search (Desktop only) */}
          {!isMobile && showSearch && (
            <div className="hidden md:block flex-1 max-w-md mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyberdark-400" size={18} />
                <input
                  type="text"
                  placeholder="Søk i samtaler..."
                  className="w-full pl-10 pr-4 py-2 bg-cyberdark-800 border border-cyberdark-600 rounded-lg text-white placeholder-cyberdark-400 focus:border-cybergold-500 focus:ring-1 focus:ring-cybergold-500 transition-colors"
                />
              </div>
            </div>
          )}

          {/* Right side - Actions and Profile */}
          <div className="flex items-center space-x-4">
            {/* Mobile Menu Button */}
            {isMobile && (
              <button
                onClick={onMobileMenuToggle}
                className="p-2 text-cyberdark-300 hover:text-cybergold-400 hover:bg-cyberdark-800/50 rounded-lg transition-all duration-200"
              >
                <Menu size={20} />
              </button>
            )}

            {/* Notifications */}
            {user && showNotifications && (
              <div className="relative" ref={notificationDropdownRef}>
                <button
                  onClick={() => setShowNotificationDropdown(!showNotificationDropdown)}
                  className="relative p-2 text-cyberdark-300 hover:text-cybergold-400 hover:bg-cyberdark-800/50 rounded-lg transition-all duration-200"
                >
                  <Bell size={20} />
                  {notifications.length > 0 && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
                  )}
                </button>

                {/* Notifications Dropdown */}
                <AnimatePresence>
                  {showNotificationDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full right-0 mt-2 w-80 bg-cyberdark-850 rounded-xl border border-cyberdark-700 shadow-2xl overflow-hidden"
                    >
                      <div className="p-4 border-b border-cyberdark-700">
                        <h3 className="text-lg font-semibold text-cybergold-400">Notifikasjoner</h3>
                      </div>
                      <div className="max-h-80 overflow-y-auto">
                        {notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className="p-4 border-b border-cyberdark-700/50 hover:bg-cyberdark-800/50 transition-colors cursor-pointer"
                          >
                            <div className="flex items-start space-x-3">
                              <div className="w-2 h-2 bg-cybergold-400 rounded-full mt-2"></div>
                              <div>
                                <p className="text-white text-sm">{notification.title}</p>
                                <p className="text-cyberdark-400 text-xs mt-1">{notification.time}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="p-4 border-t border-cyberdark-700">
                        <Link
                          to="/app/notifications"
                          className="text-cybergold-400 text-sm hover:text-cybergold-300 transition-colors"
                          onClick={() => setShowNotificationDropdown(false)}
                        >
                          Se alle notifikasjoner →
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Profile Dropdown */}
            {user ? (
              <div className="relative" ref={profileDropdownRef}>
                <button
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg text-cyberdark-300 hover:text-cybergold-400 hover:bg-cyberdark-800/50 transition-all duration-200"
                >
                  {/* Avatar */}
                  <div className="w-8 h-8 bg-gradient-to-br from-cybergold-400 to-cybergold-600 rounded-full flex items-center justify-center">
                    <User size={16} className="text-cyberdark-900" />
                  </div>
                  {!isMobile && (
                    <>
                      <span className="text-sm font-medium">
                        {user.user_metadata?.username || user.email?.split('@')[0] || 'Bruker'}
                      </span>
                      <ChevronDown 
                        size={16} 
                        className={cn(
                          "transition-transform duration-200",
                          showProfileDropdown && "rotate-180"
                        )} 
                      />
                    </>
                  )}
                </button>

                {/* Profile Dropdown */}
                <AnimatePresence>
                  {showProfileDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full right-0 mt-2 w-64 bg-cyberdark-850 rounded-xl border border-cyberdark-700 shadow-2xl overflow-hidden"
                    >
                      {/* Profile Header */}
                      <div className="p-4 border-b border-cyberdark-700">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-cybergold-400 to-cybergold-600 rounded-full flex items-center justify-center">
                            <User size={20} className="text-cyberdark-900" />
                          </div>
                          <div>
                            <p className="text-white font-medium">
                              {user.user_metadata?.username || 'Bruker'}
                            </p>
                            <p className="text-cyberdark-400 text-sm truncate">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Profile Menu Items */}
                      <div className="py-2">
                        {profileItems.map((item) => {
                          const Icon = item.icon;
                          if (item.action) {
                            return (
                              <button
                                key={item.label}
                                onClick={() => {
                                  item.action();
                                  setShowProfileDropdown(false);
                                }}
                                className="w-full flex items-center space-x-3 px-4 py-3 text-cyberdark-300 hover:text-cybergold-400 hover:bg-cyberdark-800/50 transition-all duration-200"
                              >
                                <Icon size={18} />
                                <span>{item.label}</span>
                              </button>
                            );
                          }
                          return (
                            <Link
                              key={item.path}
                              to={item.path}
                              className="flex items-center space-x-3 px-4 py-3 text-cyberdark-300 hover:text-cybergold-400 hover:bg-cyberdark-800/50 transition-all duration-200"
                              onClick={() => setShowProfileDropdown(false)}
                            >
                              <Icon size={18} />
                              <span>{item.label}</span>
                            </Link>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              /* Login/Register buttons for unauthenticated users */
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-cyberdark-300 hover:text-cybergold-400 transition-colors"
                >
                  Logg inn
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-cybergold-600 hover:bg-cybergold-500 text-cyberdark-900 rounded-lg font-medium transition-colors"
                >
                  Registrer
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default UnifiedHeader;