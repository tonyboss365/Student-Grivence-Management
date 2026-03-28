import React from 'react';

export const StrokeStar = ({ className = '', ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="miter" className={className} {...props}>
    {/* A slightly imperfect, hand-drawn feeling star */}
    <path d="M12 2.5L14.88 8.84L21.5 9.4L16.5 13.9L18.06 20.4L12 16.9L5.94 20.4L7.5 13.9L2.5 9.4L9.12 8.84L12 2.5Z" strokeDasharray="300" strokeDashoffset="0" />
  </svg>
);

export const StrokeZap = ({ className = '', ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="miter" className={className} {...props}>
    {/* Stylized sharp minimalist lightning bolt */}
    <path d="M13 2.5L3 13.5H12L11 21.5L21 10.5H12L13 2.5Z" />
  </svg>
);

export const StrokeAlert = ({ className = '', ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="miter" className={className} {...props}>
    <circle cx="12" cy="12" r="10" strokeLinecap="round" />
    <path d="M12 7V13" strokeLinecap="round" />
    <circle cx="12" cy="17" r="0.5" stroke="currentColor" fill="currentColor" />
  </svg>
);

export const StrokeCheck = ({ className = '', ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="miter" className={className} {...props}>
    <path d="M4 12L9.5 18L20 6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const StrokeClock = ({ className = '', ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="miter" className={className} {...props}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6V12L15.5 15.5" strokeLinecap="round" />
  </svg>
);

export const StrokeUser = ({ className = '', ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="miter" className={className} {...props}>
    <path d="M20 21C20 18.5 17 16 12 16C7 16 4 18.5 4 21" strokeLinecap="round" />
    <circle cx="12" cy="8" r="5" />
  </svg>
);

export const StrokeLayout = ({ className = '', ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="miter" className={className} {...props}>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M3 9H21" />
    <path d="M9 21V9" />
  </svg>
);

export const StrokeSearch = ({ className = '', ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="miter" className={className} {...props}>
    <circle cx="11" cy="11" r="8" />
    <path d="M21 21L16.65 16.65" />
  </svg>
);

export const StrokeFilter = ({ className = '', ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="miter" className={className} {...props}>
    <path d="M22 3H2L10 12.46V19L14 21V12.46L22 3Z" />
  </svg>
);

export const StrokeChart = ({ className = '', ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="miter" className={className} {...props}>
    <path d="M12 20V10" />
    <path d="M18 20V4" />
    <path d="M6 20V16" />
  </svg>
);
