import React from 'react';
import { NavLink } from 'react-router-dom';

const items = [
  { label: 'Home', to: '/' },
  { label: 'Trades', to: '/trades' },
  { label: 'Calendar', to: '/calendar' },
  { label: 'Profile', to: '/profile' },
];

export const BottomNav: React.FC = () => {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-gray-800 bg-gray-950/95 backdrop-blur">
      <div className="mx-auto flex max-w-5xl justify-around px-2 py-3">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `rounded-lg px-3 py-2 text-sm transition-colors ${isActive ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            {item.label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};
