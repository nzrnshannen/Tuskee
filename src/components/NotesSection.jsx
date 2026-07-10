import React, { useState, useEffect, useRef } from 'react';
import { PixelCatEars } from './PixelIcons';

export default function NotesSection({ notes, onNotesChange, activeDate }) {
  const [localNotes, setLocalNotes] = useState(notes || '');
  const [saveStatus, setSaveStatus] = useState('Saved');
  const debounceTimer = useRef(null);

  // Sync state when props change (e.g. date changes)
  useEffect(() => {
    setLocalNotes(notes || '');
    setSaveStatus('Saved');
  }, [notes, activeDate]);

  const handleChange = (e) => {
    const value = e.target.value;
    setLocalNotes(value);
    setSaveStatus('Saving...');

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      onNotesChange(value);
      setSaveStatus('Saved');
    }, 600);
  };

  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  return (
    <section className="retro-window w-full flex flex-col mb-4 select-none">
      {/* Title Bar */}
      <div className="retro-window-header bg-[#D2E4D6] text-brand-plum">
        <PixelCatEars />
        <div className="retro-window-title">
          <span>MeowPad.txt - Daily_Journal_{activeDate}.txt</span>
        </div>
      </div>

      {/* Notepad body */}
      <textarea
        className="w-full min-h-[110px] text-brand-plum bg-[#FFFDF9] border-t-2 border-[#7d6972]/30 outline-none resize-y text-sm font-cozy leading-[1.8]"
        style={{ paddingLeft: '28px', paddingRight: '24px', paddingTop: '24px', paddingBottom: '24px' }}
        value={localNotes}
        onChange={handleChange}
        placeholder="Write your logs, journals, or thoughts here..."
        spellCheck="false"
      />
    </section>
  );
}
