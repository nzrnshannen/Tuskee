import React, { useState, useEffect } from 'react';
import { PixelCatEars } from './PixelIcons';
import { format, startOfWeek } from 'date-fns';

export default function WeeklyGoals({ goals, saveGoals }) {
  // Get current ISO week string (e.g. 2026-W31)
  const today = new Date();
  const weekStart = startOfWeek(today);
  const currentWeekKey = `${format(weekStart, 'yyyy')}-W${format(weekStart, 'I')}`;
  
  const currentWeeklyGoal = (goals.weekly && goals.weekly[currentWeekKey]) || '';
  
  const [localText, setLocalText] = useState(currentWeeklyGoal);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    setLocalText(currentWeeklyGoal);
    setIsDirty(false);
  }, [currentWeeklyGoal, currentWeekKey]);

  const handleChange = (e) => {
    setLocalText(e.target.value);
    setIsDirty(true);
  };

  const handlePost = () => {
    const updatedWeekly = { ...(goals.weekly || {}) };
    updatedWeekly[currentWeekKey] = localText;
    
    saveGoals({
      ...goals,
      weekly: updatedWeekly
    });
    setIsDirty(false);
  };

  const handleDiscard = () => {
    setLocalText(currentWeeklyGoal);
    setIsDirty(false);
  };

  return (
    <section className="retro-window w-full flex flex-col mt-6 select-none">
      <div className="retro-window-header bg-[#F5D6D8] text-brand-plum">
        <PixelCatEars />
        <div className="retro-window-title">
          <span>Goals.exe - Weekly_Objectives_{currentWeekKey}.txt</span>
        </div>
      </div>

      <textarea
        className="w-full min-h-[90px] text-brand-plum bg-[#FFFDF9] border-t-2 border-[#7d6972]/30 outline-none resize-y text-sm font-cozy leading-[1.8]"
        style={{ paddingLeft: '28px', paddingRight: '24px', paddingTop: '20px', paddingBottom: '20px' }}
        value={localText}
        onChange={handleChange}
        placeholder="What are your main goals for this week?"
        spellCheck="false"
      />

      <div className="flex items-center justify-between py-2.5 pr-6 bg-brand-cream/40 border-t-2 border-[#7d6972]/20" style={{ paddingLeft: '28px' }}>
        <span className="font-pixel text-[7px] text-brand-plum/50 tracking-wide">
          {isDirty ? '[!] UNSAVED WEEKLY GOALS' : '[OK] SAVED'}
        </span>

        <div className="flex gap-2">
          {isDirty && (
            <button
              className="retro-btn text-[7px] py-1.5 px-3"
              onClick={handleDiscard}
            >
              DISCARD
            </button>
          )}
          <button
            className="retro-btn text-[7px] py-1.5 px-3"
            onClick={handlePost}
            disabled={!isDirty}
          >
            SAVE
          </button>
        </div>
      </div>
    </section>
  );
}
