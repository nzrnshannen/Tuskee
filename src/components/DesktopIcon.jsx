import React from 'react';

// 1. 32x32 Calendar Desktop Icon SVG
export const PixelCalendarIcon = () => (
  <svg viewBox="0 0 32 32" width="48" height="48" style={{ imageRendering: 'pixelated' }}>
    {/* Outline */}
    <rect x="4" y="4" width="24" height="24" fill="#3E2312" />
    <rect x="6" y="2" width="2" height="4" fill="#3E2312" />
    <rect x="24" y="2" width="2" height="4" fill="#3E2312" />
    
    {/* Page background */}
    <rect x="6" y="6" width="20" height="20" fill="#ffffff" />
    
    {/* Red Binder Header */}
    <rect x="6" y="6" width="20" height="5" fill="#fa5c5c" />
    
    {/* Ring binds */}
    <rect x="7" y="3" width="1" height="2" fill="#EFE6D9" />
    <rect x="24" y="3" width="1" height="2" fill="#EFE6D9" />

    {/* Calendar Grids (dashes) */}
    <rect x="9" y="14" width="2" height="2" fill="#3E2312" />
    <rect x="15" y="14" width="2" height="2" fill="#3E2312" />
    <rect x="21" y="14" width="2" height="2" fill="#3E2312" />
    <rect x="9" y="19" width="2" height="2" fill="#3E2312" />
    <rect x="15" y="19" width="2" height="2" fill="#3E2312" />
    <rect x="21" y="19" width="2" height="2" fill="#fa5c5c" /> {/* highlighted active date dot! */}
  </svg>
);

// 2. 32x32 Cat Food Bowl Icon SVG (acting as Recycle Bin/Reset)
export const PixelRecycleBinIcon = () => (
  <svg viewBox="0 0 32 32" width="48" height="48" style={{ imageRendering: 'pixelated' }}>
    {/* Bowl Outline */}
    <path d="M 6 18 L 8 26 L 24 26 L 26 18 Z" fill="#3E2312" />
    
    {/* Bowl Inner Color (Orange / Gold) */}
    <path d="M 8 19 L 9 25 L 23 25 L 24 19 Z" fill="#FF9E3A" />
    
    {/* Bowl Rim Highlight */}
    <rect x="7" y="18" width="18" height="2" fill="#EADBC8" />
    <rect x="7" y="17" width="18" height="1" fill="#3E2312" />
    
    {/* Fish Bone sticking out */}
    {/* Spine */}
    <rect x="12" y="12" width="8" height="1" fill="#3E2312" />
    {/* Head skeleton triangle */}
    <path d="M 20 9 L 24 12 L 20 15 Z" fill="#3E2312" />
    <path d="M 21 11 L 23 12 L 21 13 Z" fill="#ffffff" />
    {/* Rib bones */}
    <rect x="14" y="10" width="1" height="5" fill="#3E2312" />
    <rect x="17" y="10" width="1" height="5" fill="#3E2312" />
    {/* Tail fin */}
    <path d="M 10 10 L 12 12 L 10 14 Z" fill="#3E2312" />
  </svg>
);

export default function DesktopIcon({ iconType, label, onClick }) {
  return (
    <div 
      className="flex flex-col items-center justify-center w-28 h-24 p-2 rounded cursor-pointer select-none hover:bg-brand-plum/10 active:bg-brand-plum/20"
      onClick={onClick}
    >
      <div className="mb-2 shrink-0">
        {iconType === 'calendar' ? <PixelCalendarIcon /> : <PixelRecycleBinIcon />}
      </div>
      <span className="font-pixel text-[8px] leading-relaxed tracking-wider text-center text-brand-plum break-words w-full px-1">
        {label}
      </span>
    </div>
  );
}
