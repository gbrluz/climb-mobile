// src/components/ui/UpperNav.tsx
import { Bell, Menu } from 'lucide-react';

export const UpperNav = () => {
  return (
    <div className="bg-blue-600 px-4 py-4 flex items-center justify-between sticky top-0 z-50 safe-area-top">
      {/* Logo */}
      <div className="flex items-center">
        <h1 className="text-white text-xl font-black tracking-wider">CLIMB</h1>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button
          className="p-2 active:bg-white/10 rounded-full transition-colors touch-manipulation"
          aria-label="Notificações"
        >
          <Bell size={22} className="text-white" />
        </button>
        <button
          className="p-2 active:bg-white/10 rounded-full transition-colors touch-manipulation"
          aria-label="Menu"
        >
          <Menu size={22} className="text-white" />
        </button>
      </div>
    </div>
  );
};
