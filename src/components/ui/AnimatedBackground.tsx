import { motion } from 'motion/react';

export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 bg-[#FDFCF8]">
      <div className="noise-bg" />
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          x: [0, 50, 0],
          y: [0, 30, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-[20%] -left-[10%] w-[60vw] h-[60vw] rounded-full bg-[#F2EFE5] blur-[120px] opacity-80"
      />
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          x: [0, -60, 0],
          y: [0, -40, 0],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[40%] -right-[10%] w-[50vw] h-[50vw] rounded-full bg-[#EAE6D7] blur-[100px] opacity-70"
      />
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          x: [0, 40, 0],
          y: [0, -50, 0],
        }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -bottom-[20%] left-[20%] w-[40vw] h-[40vw] rounded-full bg-[#E5E3D9] blur-[90px] opacity-60"
      />
    </div>
  );
}
