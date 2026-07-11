import React from 'react';

// Common icon properties: 16x16 grid coordinates, rendered pixelated

// 1. Hourglass (Pomodoro visual countdown decoration)
export const PixelHourglass = ({ className = "", active = false }) => (
  <svg viewBox="0 0 16 16" width="48" height="48" className={`${className} ${active ? 'plant-sway' : ''}`} style={{ imageRendering: 'pixelated' }}>
    {/* Wooden plates (top/bottom) outline */}
    <rect x="2" y="1" width="12" height="2" fill="#2f1807" />
    <rect x="2" y="13" width="12" height="2" fill="#2f1807" />
    {/* Left and Right struts */}
    <rect x="2" y="3" width="2" height="10" fill="#2f1807" />
    <rect x="12" y="3" width="2" height="10" fill="#2f1807" />
    {/* Glass bulb contour */}
    <rect x="4" y="3" width="8" height="10" fill="#2f1807" />
    
    {/* Inner Plates Fill */}
    <rect x="3" y="2" width="10" height="1" fill="#9e663c" />
    <rect x="3" y="13" width="10" height="1" fill="#754825" />
    {/* Struts Fill */}
    <rect x="3" y="3" width="1" height="10" fill="#9e663c" />
    <rect x="12" y="3" width="1" height="10" fill="#754825" />

    {/* Glass Inner Bulb */}
    <rect x="5" y="4" width="6" height="8" fill="#e2f3f5" />
    <rect x="6" y="5" width="4" height="6" fill="#e2f3f5" />
    <rect x="7" y="7" width="2" height="2" fill="#e2f3f5" />
    
    {/* Sand in top */}
    <rect x="6" y="4" width="4" height="2" fill="#ffd05b" />
    <rect x="7" y="6" width="2" height="1" fill="#ffd05b" />

    {/* Sand falling stream */}
    <rect x="7" y="7" width="2" height="2" fill="#ffe28a" />
    
    {/* Sand in bottom accumulation */}
    <rect x="7" y="9" width="2" height="1" fill="#ffd05b" />
    <rect x="6" y="10" width="4" height="2" fill="#ffd05b" />

    {/* Highlights */}
    <rect x="5" y="4" width="1" height="3" fill="#ffffff" />
    <rect x="10" y="8" width="1" height="3" fill="#ffffff" />
  </svg>
);

// 2. Radio/Music notes (Jukebox panel decoration)
export const PixelRadioNotes = ({ className = "" }) => (
  <svg viewBox="0 0 16 16" width="36" height="36" className={className} style={{ imageRendering: 'pixelated' }}>
    {/* Radio Box */}
    <rect x="2" y="4" width="12" height="10" fill="#2f1807" />
    <rect x="3" y="5" width="10" height="8" fill="#9e663c" />
    {/* Speaker Grill */}
    <rect x="4" y="7" width="4" height="4" fill="#2f1807" />
    <rect x="5" y="8" width="2" height="2" fill="#754825" />
    {/* Dials */}
    <rect x="10" y="7" width="2" height="2" fill="#ffd05b" />
    <rect x="10" y="10" width="2" height="2" fill="#2f1807" />
    {/* Antenna */}
    <rect x="4" y="1" width="1" height="3" fill="#2f1807" />
    <rect x="5" y="2" width="4" height="1" fill="#2f1807" />
    {/* Music Notes */}
    <rect x="12" y="1" width="1" height="3" fill="#385129" />
    <rect x="13" y="1" width="2" height="1" fill="#385129" />
    <rect x="1" y="2" width="1" height="2" fill="#385129" />
  </svg>
);

// --- WEATHER / STATUS ICONS ---

// 1. Sun
export const PixelSun = ({ className = "", active = false }) => (
  <svg viewBox="0 0 16 16" width="28" height="28" className={className} style={{ imageRendering: 'pixelated' }}>
    {/* Outline */}
    <rect x="5" y="2" width="6" height="12" fill={active ? "#ebd3a3" : "#2f1807"} />
    <rect x="2" y="5" width="12" height="6" fill={active ? "#ebd3a3" : "#2f1807"} />
    <rect x="4" y="4" width="8" height="8" fill={active ? "#ebd3a3" : "#2f1807"} />
    {/* Glow */}
    <rect x="5" y="3" width="6" height="10" fill="#ffa300" />
    <rect x="3" y="5" width="10" height="6" fill="#ffa300" />
    <rect x="4" y="4" width="8" height="8" fill="#ffa300" />
    {/* Center */}
    <rect x="6" y="5" width="4" height="6" fill="#ffd05b" />
    <rect x="5" y="6" width="6" height="4" fill="#ffd05b" />
    <rect x="6" y="6" width="2" height="2" fill="#ffffff" />
  </svg>
);

// 2. Rain
export const PixelRain = ({ className = "", active = false }) => (
  <svg viewBox="0 0 16 16" width="28" height="28" className={className} style={{ imageRendering: 'pixelated' }}>
    {/* Outline */}
    <rect x="3" y="4" width="10" height="6" fill={active ? "#ebd3a3" : "#2f1807"} />
    <rect x="2" y="6" width="12" height="4" fill={active ? "#ebd3a3" : "#2f1807"} />
    {/* Fill */}
    <rect x="4" y="5" width="8" height="4" fill="#afb8c6" />
    <rect x="3" y="6" width="10" height="3" fill="#cbd2db" />
    <rect x="5" y="5" width="3" height="1" fill="#ffffff" />
    {/* Rain drops */}
    <rect x="4" y="10" width="1" height="2" fill="#74a3ff" />
    <rect x="7" y="11" width="1" height="2" fill="#74a3ff" />
    <rect x="10" y="10" width="1" height="2" fill="#74a3ff" />
    <rect x="6" y="13" width="1" height="2" fill="#74a3ff" />
  </svg>
);

// 3. Cloud
export const PixelCloud = ({ className = "", active = false }) => (
  <svg viewBox="0 0 16 16" width="28" height="28" className={className} style={{ imageRendering: 'pixelated' }}>
    {/* Outline */}
    <rect x="3" y="4" width="10" height="7" fill={active ? "#ebd3a3" : "#2f1807"} />
    <rect x="2" y="6" width="12" height="5" fill={active ? "#ebd3a3" : "#2f1807"} />
    {/* Fill */}
    <rect x="4" y="5" width="8" height="5" fill="#fffcf4" />
    <rect x="3" y="6" width="10" height="4" fill="#ebd3a3" />
    <rect x="5" y="5" width="4" height="2" fill="#ffffff" />
  </svg>
);

// --- UTILITY ICONS ---

// Checklist Checkmark
export const PixelCheck = () => (
  <svg viewBox="0 0 16 16" width="16" height="16" style={{ imageRendering: 'pixelated' }}>
    <path d="M12 4l1 1-6 6-3-3 1-1 2 2z" fill="#385129" />
  </svg>
);

// Trash Can
export const PixelTrash = ({ className = "" }) => (
  <svg viewBox="0 0 16 16" width="20" height="20" className={className} style={{ imageRendering: 'pixelated' }}>
    <rect x="3" y="2" width="10" height="2" fill="#2f1807" />
    <rect x="6" y="1" width="4" height="1" fill="#2f1807" />
    <rect x="4" y="4" width="8" height="10" fill="#2f1807" />
    <rect x="5" y="4" width="6" height="9" fill="#b63728" />
    <rect x="6" y="5" width="1" height="7" fill="#d96459" />
    <rect x="8" y="5" width="1" height="7" fill="#d96459" />
    <rect x="4" y="3" width="8" height="1" fill="#d96459" />
  </svg>
);

// Navigation Arrows
export const PixelArrowLeft = () => (
  <svg viewBox="0 0 16 16" width="16" height="16" style={{ imageRendering: 'pixelated' }}>
    <path d="M10 3L5 8l5 5V3z" fill="currentColor" />
  </svg>
);

export const PixelArrowRight = () => (
  <svg viewBox="0 0 16 16" width="16" height="16" style={{ imageRendering: 'pixelated' }}>
    <path d="M6 3l5 5-5 5V3z" fill="currentColor" />
  </svg>
);

// 3. Pixel Paw footprint for completed checklists
export const PixelPaw = () => (
  <svg viewBox="0 0 16 16" width="14" height="14" style={{ imageRendering: 'pixelated' }}>
    {/* Main pad */}
    <rect x="5" y="7" width="6" height="5" rx="1" fill="#3E2312" />
    <rect x="4" y="8" width="8" height="3" fill="#3E2312" />
    {/* Toes */}
    <rect x="3" y="4" width="2" height="2" fill="#3E2312" />
    <rect x="6" y="3" width="2" height="2" fill="#3E2312" />
    <rect x="9" y="3" width="2" height="2" fill="#3E2312" />
    <rect x="12" y="4" width="2" height="2" fill="#3E2312" />
  </svg>
);

// 4. Cat Ears for Window Headers
export const PixelCatEars = () => (
  <>
    {/* Left Ear */}
    <svg 
      viewBox="0 0 16 12" 
      className="absolute -top-[11.5px] left-4 w-5 h-[12px] z-10 animate-ear-left"
      style={{ imageRendering: 'pixelated' }}
    >
      <path d="M 0 12 L 4 4 L 8 0 L 12 4 L 16 12 Z" fill="#3E2312" />
      <path d="M 3 12 L 6 6 L 8 4 L 10 6 L 13 12 Z" fill="#FFA5A5" />
    </svg>
    {/* Right Ear */}
    <svg 
      viewBox="0 0 16 12" 
      className="absolute -top-[11.5px] right-4 w-5 h-[12px] z-10 animate-ear-right"
      style={{ imageRendering: 'pixelated' }}
    >
      <path d="M 0 12 L 4 4 L 8 0 L 12 4 L 16 12 Z" fill="#3E2312" />
      <path d="M 3 12 L 6 6 L 8 4 L 10 6 L 13 12 Z" fill="#FFA5A5" />
    </svg>
  </>
);

// 6. Pixel Pencil (Edit icon for todos)
export const PixelPencil = ({ className = "" }) => (
  <svg viewBox="0 0 16 16" width="14" height="14" className={className} fill="none" stroke="#3E2312" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11.5 1.5l3 3-9 9H2.5v-3l9-9z" fill="#FFD05B" stroke="#3E2312" />
    <line x1="9" y1="4" x2="12" y2="7" />
  </svg>
);
