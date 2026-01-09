import { Home, Search, Gavel, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export const BottomNav = () => {
  const { pathname } = useLocation();

  const navItems = [
    { label: 'Início', icon: Home, path: '/' },
    { label: 'Partidas', icon: Search, path: '/find-matches' },
    { label: 'Leilões', icon: Gavel, path: '/auctions' },
    { label: 'Perfil', icon: User, path: '/profile' },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50"
      style={{
        paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))'
      }}
    >
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center justify-center gap-1 py-2 px-3 touch-manipulation ${
              pathname === item.path ? 'text-blue-600' : 'text-gray-500'
            }`}
          >
            <item.icon size={24} />
            <span className="text-xs font-medium">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};