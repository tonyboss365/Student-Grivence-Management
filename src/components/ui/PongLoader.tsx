import { motion } from 'motion/react';

export function PongLoader() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#FDFCF8] dark:bg-[#111110] z-50 transition-colors duration-300">
      <div className="relative w-32 h-24 border-2 border-[#E5E3D9] dark:border-[#333333] rounded-xl bg-white/50 dark:bg-black/50 backdrop-blur-sm overflow-hidden shadow-sm transition-colors duration-300">
        {/* Center Dashed Line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-[2px] -translate-x-1/2 border-l-2 border-dashed border-[#E5E3D9]/60 dark:border-[#333333]/60" />
        
        {/* Left Paddle */}
        <motion.div
          animate={{ y: [6, 42, 6] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-3 top-0 w-2 h-10 bg-[#111110] dark:bg-[#FDFCF8] rounded-full transition-colors duration-300"
        />
        
        {/* Right Paddle */}
        <motion.div
          animate={{ y: [42, 6, 42] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute right-3 top-0 w-2 h-10 bg-[#111110] dark:bg-[#FDFCF8] rounded-full transition-colors duration-300"
        />
        
        {/* Ball */}
        <motion.div
          animate={{
            x: [24, 96, 24],
            y: [12, 72, 12]
          }}
          transition={{ 
            x: { duration: 1.2, repeat: Infinity, ease: "linear" },
            y: { duration: 0.6, repeat: Infinity, ease: "linear" }
          }}
          className="absolute top-0 left-0 w-3 h-3 bg-[#FF4E00] rounded-full shadow-[0_0_12px_rgba(255,78,0,0.6)]"
        />
      </div>
      <motion.div 
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        className="mt-8 text-xs font-sans font-bold text-[#6B6B66] dark:text-[#A1A1AA] tracking-[0.3em] uppercase transition-colors duration-300"
      >
        Loading
      </motion.div>
    </div>
  );
}
