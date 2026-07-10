import React from 'react';

export default function Header({ activeDate, onPrevDay, onNextDay, onOpenCalendar }) {
  
  // Format active date to a friendly label
  const formatHeaderDate = (dateStr) => {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <header className="retro-window-header bg-brand-cream text-brand-plum flex items-center justify-between p-2 select-none border-b-2 border-brand-plum">
      
      {/* Left Side: System/App title */}
      <div className="retro-window-title flex items-center gap-2 select-none">
        <span>🐱 TUSKEE MEOW-STATION</span>
      </div>

      {/* Center: Consolidated Navigation Ticker */}
      <div className="flex items-center gap-2">
        <button 
          className="retro-btn w-6 h-6 flex items-center justify-center p-0 text-[8px]" 
          onClick={onPrevDay}
          title="Previous Day"
          aria-label="Previous Day"
        >
          ←
        </button>
        
        <button 
          className="retro-btn h-6 px-3 flex items-center gap-1 font-pixel text-[8px] cursor-pointer"
          onClick={onOpenCalendar}
          title="Open Calendar Modal"
          aria-label="Open Calendar Modal"
        >
          📅 {formatHeaderDate(activeDate)}
        </button>

        <button 
          className="retro-btn w-6 h-6 flex items-center justify-center p-0 text-[8px]" 
          onClick={onNextDay}
          title="Next Day"
          aria-label="Next Day"
        >
          →
        </button>
      </div>

      {/* Right Side: Decorative controls and reset button */}
      <div className="flex gap-1">
        <button 
          className="retro-close-btn w-4 h-4 flex items-center justify-center font-bold text-[7px]" 
          onClick={() => {
            if (window.confirm("Reset active notebook page logs to demo seeds?")) {
              localStorage.removeItem('tuskee_records');
              window.location.reload();
            }
          }}
          title="Reset Database"
          aria-label="Reset Database"
        >
          ↺
        </button>
      </div>

    </header>
  );
}
