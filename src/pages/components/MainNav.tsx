import React from 'react';
import { NavLink } from 'react-router-dom';

export function MainNav() {
  const navItems = [
    { title: 'Home', href: '/' },
    { title: 'Chat', href: '/chat' },
    { title: 'Groups', href: '/groups' },
    { title: 'Profile', href: '/profile' },
  ];

  return (
    <div className="flex items-center gap-6 md:gap-10">
      <NavLink to="/" className="flex items-center space-x-2">
        <span className="text-2xl font-bold">Snakkaz</span>
      </NavLink>
      <nav className="hidden md:flex gap-6">
        {navItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            className={({ isActive }) => 
              `text-sm font-medium transition-colors hover:text-primary ${
                isActive ? 'text-foreground' : 'text-foreground/60'
              }`
            }
          >
            {item.title}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}