import React, { useState } from 'react';
import { PixelHourglass, PixelCatEars } from './PixelIcons';

export default function FocusTimer({ 
  secondsLeft, 
  isRunning, 
  onToggleStart, 
  onReset,
  onTimeChange,
  className = ""
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempMinutes, setTempMinutes] = useState('25');

  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleStartEdit = () => {
    if (isRunning) return;
    setTempMinutes(String(Math.floor(secondsLeft / 60)));
    setIsEditing(true);
  };

  const handleSave = () => {
    let mins = parseInt(tempMinutes, 10);
    if (isNaN(mins)) mins = 25;
    mins = Math.max(1, Math.min(99, mins));
    onTimeChange(mins * 60);
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSave();
    else if (e.key === 'Escape') setIsEditing(false);
  };

  const handleIncrement = () => {
    if (isRunning) return;
    const next = Math.min(99, Math.floor(secondsLeft / 60) + 1);
    onTimeChange(next * 60);
  };

  const handleDecrement = () => {
    if (isRunning) return;
    const next = Math.max(1, Math.floor(secondsLeft / 60) - 1);
    onTimeChange(next * 60);
  };

  return (
    <div className={`retro-window w-full flex flex-col select-none ${className}`}>
      {/* Title Bar */}
      <div className="retro-window-header bg-[#F5D6D8] text-brand-plum">
        <PixelCatEars />
        <div className="retro-window-title">
          <span>CatNapTimer.sys</span>
        </div>
      </div>

      {/* 3-Column Body: Hourglass | Timer | Controls */}
      <div className="px-3 sm:px-6 py-5 flex flex-wrap sm:flex-nowrap items-center justify-center gap-3 sm:gap-5 bg-[#FFFDF9]">

        {/* Left: Framed Hourglass */}
        <div className="shrink-0 w-14 h-14 bg-[#FDF6EB] border-2 border-[#7d6972]/40 flex items-center justify-center shadow-inner rounded-sm">
          <PixelHourglass active={isRunning} />
        </div>

        {/* Center: Timer Readout */}
        <div className="flex-grow flex flex-col items-center justify-center">
          <span className="font-pixel text-[7px] text-brand-plum/50 tracking-widest mb-1.5">
            POMODORO
          </span>

          <div className="flex items-center justify-center gap-1.5">
            {isEditing ? (
              <input
                type="text"
                className="w-16 text-center font-pixel text-[14px] bg-[#FFFDF9] border-2 border-brand-plum text-brand-plum py-1 outline-none"
                value={tempMinutes}
                onChange={(e) => setTempMinutes(e.target.value.replace(/\D/g, ''))}
                onBlur={handleSave}
                onKeyDown={handleKeyDown}
                autoFocus
              />
            ) : (
              <span 
                className={`font-pixel text-[20px] tracking-[0.2em] text-brand-plum ${isRunning ? 'cursor-default' : 'cursor-pointer hover:text-brand-plum/70'}`}
                onClick={handleStartEdit}
                title={isRunning ? '' : 'Click to edit minutes'}
              >
                {formatTime(secondsLeft)}
              </span>
            )}

            {/* Spinner arrows */}
            {!isRunning && !isEditing && (
              <div className="flex flex-col gap-px">
                <button 
                  onClick={handleIncrement}
                  className="retro-btn !p-0 w-5 h-4 text-[6px] flex items-center justify-center"
                  aria-label="Add 1 minute"
                >▲</button>
                <button 
                  onClick={handleDecrement}
                  className="retro-btn !p-0 w-5 h-4 text-[6px] flex items-center justify-center"
                  aria-label="Subtract 1 minute"
                >▼</button>
              </div>
            )}
          </div>
        </div>

        {/* Right: Stacked Controls */}
        <div className="shrink-0 flex flex-col gap-2 w-[72px]">
          <button 
            className="retro-btn text-[7px] py-2 w-full"
            onClick={onToggleStart}
            aria-label={isRunning ? 'Pause Focus' : 'Start Focus'}
          >
            {isRunning ? 'PAUSE' : 'START'}
          </button>
          <button 
            className="retro-btn text-[7px] py-2 w-full"
            onClick={onReset}
            aria-label="Reset focus timer"
          >
            RESET
          </button>
        </div>

      </div>
    </div>
  );
}
