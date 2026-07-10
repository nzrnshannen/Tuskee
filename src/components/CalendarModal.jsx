import React, { useState } from 'react';
import { PixelArrowLeft, PixelArrowRight } from './PixelIcons';

export default function CalendarModal({ activeDate, onSelectDate, onClose, records = {} }) {
  // Parse activeDate (YYYY-MM-DD)
  const [activeY, activeM, activeD] = activeDate.split('-').map(Number);

  // Maintain local state for navigation viewing window
  const [viewMonth, setViewMonth] = useState(activeM - 1); // 0-indexed month
  const [viewYear, setViewYear] = useState(activeY);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const weekdays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  // Date calculation helpers
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getStartDayOfWeek = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const handlePrevMonth = () => {
    setViewMonth((prev) => {
      if (prev === 0) {
        setViewYear(viewYear - 1);
        return 11;
      }
      return prev - 1;
    });
  };

  const handleNextMonth = () => {
    setViewMonth((prev) => {
      if (prev === 11) {
        setViewYear(viewYear + 1);
        return 0;
      }
      return prev + 1;
    });
  };

  const handlePrevYear = () => setViewYear(viewYear - 1);
  const handleNextYear = () => setViewYear(viewYear + 1);

  // Render date grid slots
  const renderDateSlots = () => {
    const days = getDaysInMonth(viewYear, viewMonth);
    const startDay = getStartDayOfWeek(viewYear, viewMonth);
    const slots = [];

    // Fill blank preceding slots
    for (let i = 0; i < startDay; i++) {
      slots.push(<div key={`empty-${i}`} className="w-8 h-8" />);
    }

    // Fill days of month
    for (let day = 1; day <= days; day++) {
      const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const isActive = day === activeD && (viewMonth + 1) === activeM && viewYear === activeY;
      const hasNotes = records[dateStr] && records[dateStr].notes && records[dateStr].notes.trim().length > 0;

      slots.push(
        <button
          key={`day-${day}`}
          className={`w-8 h-8 font-pixel text-[8px] transition-colors border flex flex-col items-center justify-center cursor-pointer relative
            ${isActive 
              ? 'bg-brand-plum text-brand-white border-brand-plum font-bold' 
              : 'bg-brand-white hover:bg-brand-pink/30 text-brand-plum border-brand-pink/20'
            }`}
          onClick={() => {
            onSelectDate(dateStr);
            onClose();
          }}
        >
          <span className="leading-none">{day}</span>
          {hasNotes && (
            <span className="absolute bottom-0.5 right-0.5 text-[6px]" title="Contains notes">
              🐱
            </span>
          )}
        </button>
      );
    }

    return slots;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#68093e]/30 backdrop-blur-xs">
      <div className="retro-window w-80 max-w-full">
        {/* Title Bar */}
        <div className="retro-window-header bg-brand-cream text-brand-plum">
          <div className="retro-window-title">
            <span>📅 CALENDAR.EXE</span>
          </div>
          <button className="retro-close-btn" onClick={onClose}>×</button>
        </div>

        {/* Calendar Body */}
        <div className="p-4 flex flex-col gap-4">
          
          {/* Year Navigation */}
          <div className="flex items-center justify-between border-b-2 border-brand-plum/10 pb-2">
            <button className="retro-btn p-1 px-2" onClick={handlePrevYear} title="Previous Year">
              <PixelArrowLeft />
            </button>
            <span className="font-pixel text-[10px] text-brand-plum">
              {viewYear}
            </span>
            <button className="retro-btn p-1 px-2" onClick={handleNextYear} title="Next Year">
              <PixelArrowRight />
            </button>
          </div>

          {/* Month Navigation */}
          <div className="flex items-center justify-between">
            <button className="retro-btn p-1 px-2" onClick={handlePrevMonth} title="Previous Month">
              <PixelArrowLeft />
            </button>
            <span className="font-pixel text-[9px] text-brand-plum">
              {months[viewMonth]}
            </span>
            <button className="retro-btn p-1 px-2" onClick={handleNextMonth} title="Next Month">
              <PixelArrowRight />
            </button>
          </div>

          {/* Weekday Grid */}
          <div className="grid grid-cols-7 gap-1 text-center font-pixel text-[8px] text-brand-plum/60 border-t border-b border-brand-plum/10 py-1">
            {weekdays.map((day, idx) => (
              <div key={`weekday-${idx}`} className="w-8">
                {day}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1 justify-items-center">
            {renderDateSlots()}
          </div>
        </div>

        {/* Footer Dialogue Bar */}
        <div className="bg-brand-cream/50 border-t border-brand-plum/10 p-2 flex justify-end">
          <button className="retro-btn text-[8px]" onClick={onClose}>
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
}
