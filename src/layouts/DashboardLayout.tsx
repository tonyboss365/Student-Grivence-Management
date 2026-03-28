import { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Button } from '../components/ui/Button';
import { motion } from 'motion/react';
import { Logo } from '../components/ui/Logo';
import { LayoutDashboard, PlusCircle, Bell, LogOut, User, BarChart2, Book, Settings } from 'lucide-react';
import { PongLoader } from '../components/ui/PongLoader';
import { ThemeToggle } from '../components/ui/ThemeToggle';

export default function DashboardLayout() {
  const { user, logout, loading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  if (loading) return <PongLoader />;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: user ? `/dashboard/${user.role}` : '/dashboard', icon: LayoutDashboard },
    ...(user?.role === 'student' ? [
      { name: 'Submit Grievance', path: '/dashboard/student/submit', icon: PlusCircle }
    ] : []),
    { name: 'Analytics', path: '/dashboard/analytics', icon: BarChart2 },
    { name: 'Help Center', path: '/dashboard/help', icon: Book },
    { name: 'Settings', path: '/dashboard/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#FDFCF8] dark:bg-[#111110] text-[#111110] dark:text-[#FDFCF8] flex font-sans transition-colors duration-300">
      {/* Sidebar */}
      <motion.aside 
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-64 border-r border-[#E5E3D9] dark:border-[#333333] bg-[#FDFCF8] dark:bg-[#111110] flex flex-col z-20 transition-colors duration-300"
      >
        <div className="h-20 flex items-center px-8 border-b border-[#E5E3D9] dark:border-[#333333] transition-colors duration-300">
          <Logo />
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors relative ${
                  isActive ? 'text-[#111110] dark:text-[#FDFCF8]' : 'text-[#6B6B66] dark:text-[#A1A1AA] hover:text-[#111110] dark:hover:text-[#FDFCF8] hover:bg-[#F2EFE5] dark:hover:bg-[#27272A]'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-nav"
                    className="absolute inset-0 bg-[#EAE6D7] dark:bg-[#27272A] rounded-xl"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <Icon className="w-5 h-5 relative z-10" />
                <span className="relative z-10 font-mono text-[10px] uppercase tracking-[0.2em]">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-[#E5E3D9] dark:border-[#333333] transition-colors duration-300">
          <div className="flex items-center gap-3 px-4 py-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-[#EAE6D7] dark:bg-[#27272A] flex items-center justify-center text-[#111110] dark:text-[#FDFCF8]">
              <User className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-mono uppercase tracking-wider truncate">{user?.name}</p>
              <p className="text-[10px] font-mono uppercase tracking-widest text-[#888880] dark:text-[#A1A1AA] capitalize">{user?.role}</p>
            </div>
          </div>
          <Button variant="ghost" className="w-full justify-start text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Sign out
          </Button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Header */}
        <header className="h-20 border-b border-[#E5E3D9] dark:border-[#333333] bg-[#FDFCF8]/80 dark:bg-[#111110]/80 backdrop-blur-xl flex items-center justify-between px-8 sticky top-0 z-10 transition-colors duration-300">
          <h1 className="text-2xl font-serif tracking-tight">
            {navItems.find(i => i.path === location.pathname)?.name || 'Dashboard'}
          </h1>
          <div className="flex items-center gap-6">
            <ThemeToggle isDarkMode={theme === 'dark'} onToggle={toggleTheme} />
            <button className="relative p-2 text-[#6B6B66] dark:text-[#A1A1AA] hover:text-[#111110] dark:hover:text-[#FDFCF8] transition-colors rounded-full hover:bg-[#F2EFE5] dark:hover:bg-[#27272A]">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-[#FDFCF8] dark:border-[#111110]"></span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-8 relative z-0">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
