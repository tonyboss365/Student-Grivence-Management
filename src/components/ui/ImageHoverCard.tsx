import { motion } from 'motion/react';
import { cn } from '@/src/lib/utils';

interface Tag {
  label: string;
  bgColor: string;
  textColor: string;
}

interface ImageHoverCardProps {
  title: string;
  description: string;
  tags: Tag[];
  imageUrl: string;
  className?: string;
}

export function ImageHoverCard({ title, description, tags, imageUrl, className }: ImageHoverCardProps) {
  return (
    <motion.div
      className={cn("relative overflow-hidden rounded-[24px] group cursor-pointer h-[380px] w-full bg-[#E5E3D9]", className)}
      initial="initial"
      whileHover="hover"
    >
      {/* Background Image */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${imageUrl})` }}
        variants={{
          initial: { scale: 1 },
          hover: { scale: 1.05 }
        }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      />

      {/* Subtle overlay to ensure image isn't too bright */}
      <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors duration-500" />

      {/* Info Box (Emerges on hover) */}
      <motion.div
        className="absolute bottom-3 left-3 right-3 bg-white rounded-[20px] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.08)]"
        variants={{
          initial: { y: 20, opacity: 0 },
          hover: { y: 0, opacity: 1 }
        }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <h3 className="text-[17px] font-sans font-medium text-[#111110] mb-1.5">{title}</h3>
        <p className="text-[13px] text-[#6B6B66] mb-4 leading-relaxed">{description}</p>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, i) => (
            <span
              key={i}
              className="text-[11px] font-medium px-2.5 py-1 rounded-md"
              style={{
                backgroundColor: tag.bgColor,
                color: tag.textColor
              }}
            >
              {tag.label}
            </span>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
