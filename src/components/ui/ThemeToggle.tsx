import { motion } from 'motion/react';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  isDarkMode: boolean;
  onToggle: () => void;
}

export function ThemeToggle({ isDarkMode, onToggle }: ThemeToggleProps) {
  return (
    <button
      onClick={onToggle}
      className="relative w-16 h-8 rounded-full bg-[#EAE6D7] dark:bg-[#27272A] p-1 transition-colors duration-500 flex items-center shadow-inner overflow-hidden group"
      aria-label="Toggle theme"
    >
      {/* Background Glow */}
      <div className={`absolute inset-0 transition-opacity duration-500 ${isDarkMode ? 'bg-blue-500/10 opacity-100' : 'bg-orange-500/10 opacity-100'}`} />
      
      {/* Sliding Pill */}
      <motion.div
        className="relative z-10 w-6 h-6 rounded-full flex items-center justify-center shadow-lg"
        animate={{ 
          x: isDarkMode ? 32 : 0,
          backgroundColor: isDarkMode ? '#3B82F6' : '#F97316',
          rotate: isDarkMode ? 360 : 0
        }}
        transition={{ 
          type: "spring", 
          stiffness: 400, 
          damping: 30,
          duration: 0.5
        }}
      >
        {isDarkMode ? (
          <Moon className="w-3.5 h-3.5 text-white fill-white" />
        ) : (
          <Sun className="w-3.5 h-3.5 text-white fill-white" />
        )}
      </motion.div>

      {/* Static Icons for background */}
      <div className="absolute inset-0 flex items-center justify-between px-2 pointer-events-none">
        <Sun className={`w-3.5 h-3.5 transition-all duration-500 ${isDarkMode ? 'text-[#888880] opacity-40' : 'text-orange-500 opacity-0'}`} />
        <Moon className={`w-3.5 h-3.5 transition-all duration-500 ${isDarkMode ? 'text-blue-500 opacity-0' : 'text-[#888880] opacity-40'}`} />
      </div>
    </button>
  );
}
