'use client';

import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { LogOut, Zap, User } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    toast.success('Signed out.');
    router.push('/login');
  };

  const initials = user?.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) ?? '??';

  return (
    <header className="sticky top-0 z-40 glass border-b border-white/8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center shadow-glow-sm">
            <Zap size={15} className="text-white" />
          </div>
          <span className="font-bold text-white tracking-tight">TaskFlow</span>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* User pill */}
          <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10">
            <div className="w-6 h-6 rounded-full bg-brand-600 flex items-center justify-center text-[10px] font-bold text-white">
              {initials}
            </div>
            <span className="text-sm text-slate-300 font-medium">{user?.name}</span>
          </div>

          <button onClick={handleLogout} className="btn-ghost text-rose-400/80 hover:text-rose-400 hover:bg-rose-500/10 px-3 py-2">
            <LogOut size={16} />
            <span className="hidden sm:inline">Sign out</span>
          </button>
        </div>
      </div>
    </header>
  );
}
