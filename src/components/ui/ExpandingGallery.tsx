import { useState } from 'react';
import { motion } from 'motion/react';
import { format } from 'date-fns';

interface Grievance {
  id: number;
  ticket_id?: string;
  title: string;
  category: string;
  status: string;
  created_at: string;
  description?: string;
}

interface ExpandingGalleryProps {
  items: Grievance[];
  onSelect: (g: Grievance) => void;
  disabled?: boolean;
}

const CATEGORY_IMAGES: Record<string, string> = {
  academic: '/images/academic.png',
  administrative: '/images/administrative.png',
  facilities: '/images/facilities.png',
  harassment: '/images/harassment.png',
  other: '/images/other.png',
};

export function ExpandingGallery({ items, onSelect, disabled = false }: ExpandingGalleryProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (!items || items.length === 0) {
    return (
      <div className="h-32 flex items-center justify-center border border-dashed border-[#E5E3D9] dark:border-[#333333] rounded-2xl text-[#888880] dark:text-[#A1A1AA] font-sans text-sm bg-white/30 dark:bg-black/30 transition-colors duration-300">
        No grievances in this section.
      </div>
    );
  }

  return (
    <div className="flex h-[400px] sm:h-[500px] w-full gap-2 overflow-hidden">
      {items.map((item, index) => {
        const isHovered = hoveredIndex === index;
        const imageUrl = CATEGORY_IMAGES[item.category] || CATEGORY_IMAGES.other;
        
        return (
          <motion.div
            key={item.id}
            className={`relative rounded-xl overflow-hidden bg-[#111110] min-w-[60px] sm:min-w-[80px] ${disabled ? 'cursor-default' : 'cursor-pointer'}`}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            onClick={() => !disabled && onSelect(item)}
            animate={{ flex: isHovered ? 4 : 1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${imageUrl})` }}
              animate={{ 
                scale: isHovered ? 1 : 1.15, 
                opacity: isHovered ? 1 : 0.4,
                filter: isHovered ? 'grayscale(0%)' : 'grayscale(100%)'
              }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            />
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-80" />
            
            <motion.div 
              className="absolute bottom-6 left-6 flex flex-col gap-2 items-start"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : -10 }}
              transition={{ duration: 0.4, delay: isHovered ? 0.1 : 0, ease: "easeOut" }}
            >
              <div className="px-4 py-2 border border-white/30 bg-black/40 backdrop-blur-md text-white font-serif italic text-lg sm:text-xl rounded-sm shadow-lg max-w-[200px] sm:max-w-[300px] truncate">
                {item.title}
              </div>
              <div className="flex gap-2 items-center">
                <div className="px-3 py-1.5 border border-white/30 bg-black/40 backdrop-blur-md text-white/90 font-sans text-[10px] sm:text-xs uppercase tracking-widest rounded-sm shadow-lg">
                  {item.category.replace('_', ' ')}
                </div>
                {item.ticket_id && (
                  <div className="px-3 py-1.5 border border-amber-500/30 bg-amber-500/10 backdrop-blur-md text-amber-500 font-mono text-[10px] sm:text-xs font-bold tracking-widest rounded-sm shadow-lg">
                    {item.ticket_id}
                  </div>
                )}
              </div>
              <div className="px-3 py-1.5 border border-white/30 bg-black/40 backdrop-blur-md text-white/80 font-sans text-[10px] sm:text-xs rounded-sm shadow-lg">
                {format(new Date(item.created_at), 'MMM d, yyyy')}
              </div>
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
}
