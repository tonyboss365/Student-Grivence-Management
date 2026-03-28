import { motion } from 'motion/react';

export function TextReveal({ text, className }: { text: string; className?: string }) {
  const words = text.split(" ");
  return (
    <span className={className}>
      {words.map((word, i) => (
        <span key={i} className="inline-flex overflow-hidden pb-2 -mb-2">
          <motion.span
            initial={{ y: "100%", opacity: 0, rotateZ: 3 }}
            animate={{ y: 0, opacity: 1, rotateZ: 0 }}
            transition={{ duration: 0.9, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
            className="inline-block origin-bottom-left"
          >
            {word}&nbsp;
          </motion.span>
        </span>
      ))}
    </span>
  );
}
