import React, { useState } from 'react';

export default function Header({ activeDate, onPrevDay, onNextDay, onOpenCalendar }) {
  const [showResetModal, setShowResetModal] = useState(false);

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
        <span>TUSKEE MEOW-STATION</span>
      </div>

      {/* Center: Consolidated Navigation Ticker */}
      <div className="flex items-center gap-2">
        <button 
          className="retro-btn w-6 h-6 flex items-center justify-center p-0 text-[8px] font-pixel pb-[2px]" 
          onClick={onPrevDay}
          title="Previous Day"
          aria-label="Previous Day"
        >
          ◄
        </button>
        
        <button 
          className="retro-btn h-6 px-3 flex items-center gap-1 font-pixel text-[8px] cursor-pointer"
          onClick={onOpenCalendar}
          title="Open Calendar Modal"
          aria-label="Open Calendar Modal"
        >
          {formatHeaderDate(activeDate)}
        </button>

        <button 
          className="retro-btn w-6 h-6 flex items-center justify-center p-0 text-[8px] font-pixel pb-[2px] pl-[2px]" 
          onClick={onNextDay}
          title="Next Day"
          aria-label="Next Day"
        >
          ►
        </button>
      </div>

      {/* Right Side: Decorative controls and reset button */}
      <div className="flex gap-1">
        <button 
          className="retro-close-btn w-4 h-4 flex items-center justify-center font-bold text-[7px]" 
          onClick={() => setShowResetModal(true)}
          title="Reset Database"
          aria-label="Reset Database"
        >
          ↺
        </button>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-brand-plum/20 backdrop-blur-sm p-4">
          <div 
            className="retro-window border-2 border-brand-plum max-w-sm w-full flex flex-col items-center gap-4 text-center shadow-2xl"
            style={{ paddingTop: '2rem', paddingBottom: '1.5rem', paddingLeft: '1.5rem', paddingRight: '1.5rem', backgroundColor: '#FFFBF5' }}
          >
            <div style={{ marginTop: '0.5rem', marginBottom: '0.5rem' }}>
              <span className="text-5xl leading-none" style={{ display: 'inline-block' }}>🗑️</span>
            </div>
            <h2 className="font-pixel text-brand-plum text-sm leading-tight">System Reset</h2>
            <p className="text-brand-plum/80 font-medium text-xs">
              Are you sure you want to reset all notebook page logs to demo seeds? This cannot be undone!
            </p>
            <div className="w-full mt-4 flex gap-4">
              <button 
                className="retro-btn px-4 py-2 w-full text-[10px] font-pixel tracking-wider"
                onClick={() => setShowResetModal(false)}
              >
                CANCEL
              </button>
              <button 
                className="retro-btn px-4 py-2 w-full text-[10px] font-pixel tracking-wider text-red-600"
                onClick={() => {
                  localStorage.removeItem('tuskee_records');
                  window.location.reload();
                }}
              >
                RESET
              </button>
            </div>
          </div>
        </div>
      )}

    </header>
  );
}
