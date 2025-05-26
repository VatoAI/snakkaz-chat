import React from 'react';
import { NavLink } from 'react-router-dom';
import { MessageCircle, Users, Info } from 'lucide-react';

export function MainNav() {
  const navItems = [
    { title: 'Chat', href: '/chat', icon: <MessageCircle className="h-4 w-4 mr-1" /> },
    { title: 'Grupper', href: '/groups', icon: <Users className="h-4 w-4 mr-1" /> },
    { title: 'Info', href: '/info', icon: <Info className="h-4 w-4 mr-1" /> },
  ];

  return (
    <nav className="flex items-center space-x-4 lg:space-x-6">
      {navItems.map((item) => (
        <NavLink
          key={item.href}
          to={item.href}
          className={({ isActive }) => 
            `flex items-center text-sm font-medium transition-colors hover:text-cybergold-300 ${
              isActive 
                ? 'text-cybergold-400 border-b-2 border-cybergold-500' 
                : 'text-cybergold-600'
            }`
          }
        >
          {item.icon}
          <span>{item.title}</span>
        </NavLink>
      ))}
    </nav>
  );
}