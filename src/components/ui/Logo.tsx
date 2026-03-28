export function Logo({ className = "" }: { className?: string }) {
  // Extract width/height vs other classes
  return (
    <div className={`flex flex-col items-start ${className}`}>
      <div className="w-full h-full min-w-max flex items-center justify-start">
        <svg viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 lg:w-8 lg:h-8 text-[#6B6B66] dark:text-[#A1A1AA] transition-colors duration-300">
          {/* Document Base */}
          <path d="M20 10 C20 5, 25 0, 30 0 L70 0 L100 30 L100 90 C100 95, 95 100, 90 100 L30 100 C25 100, 20 95, 20 90 Z" fill="currentColor" />
          {/* Folded Corner */}
          <path d="M70 0 L70 30 L100 30 Z" fill="currentColor" opacity="0.9" />
          {/* Document Lines */}
          <rect x="35" y="30" width="25" height="6" rx="3" className="fill-[#FDFCF8] dark:fill-[#111110] transition-colors duration-300" />
          <rect x="35" y="45" width="40" height="6" rx="3" className="fill-[#FDFCF8] dark:fill-[#111110] transition-colors duration-300" />
          <rect x="35" y="60" width="40" height="6" rx="3" className="fill-[#FDFCF8] dark:fill-[#111110] transition-colors duration-300" />
          <rect x="35" y="75" width="30" height="6" rx="3" className="fill-[#FDFCF8] dark:fill-[#111110] transition-colors duration-300" />
          
          {/* Gavel Handle */}
          <path d="M95 95 L65 65" className="stroke-[#FDFCF8] dark:stroke-[#111110] transition-colors duration-300" strokeWidth="8" strokeLinecap="round" />
          {/* Gavel Head */}
          <path d="M50 70 L70 50 L80 60 L60 80 Z" className="fill-[#FDFCF8] dark:fill-[#111110] transition-colors duration-300" />
          <path d="M45 65 L55 55" className="stroke-[#FDFCF8] dark:stroke-[#111110] transition-colors duration-300" strokeWidth="6" strokeLinecap="round" />
          <path d="M75 95 L85 85" className="stroke-[#FDFCF8] dark:stroke-[#111110] transition-colors duration-300" strokeWidth="6" strokeLinecap="round" />
        </svg>
      </div>
      <span className="mt-1 font-sans font-bold tracking-[0.2em] text-[8px] text-[#111110] dark:text-[#FDFCF8] transition-colors duration-300 whitespace-nowrap uppercase">Grievance</span>
    </div>
  );
}
