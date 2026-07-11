import React, { useState, useEffect } from 'react';
import { PixelCatEars } from './PixelIcons';

export default function NotesSection({ notes, onNotesChange, activeDate }) {
  const [localNotes, setLocalNotes] = useState(notes || '');
  const [isDirty, setIsDirty] = useState(false);

  // Sync state when props change (e.g. date changes) — discard unsaved drafts
  useEffect(() => {
    setLocalNotes(notes || '');
    setIsDirty(false);
  }, [notes, activeDate]);

  const handleChange = (e) => {
    setLocalNotes(e.target.value);
    setIsDirty(true);
  };

  const handlePost = () => {
    onNotesChange(localNotes);
    setIsDirty(false);
  };

  const handleClear = () => {
    setLocalNotes('');
    onNotesChange('');
    setIsDirty(false);
  };

  const handleDiscard = () => {
    setLocalNotes(notes || '');
    setIsDirty(false);
  };

  return (
    <section className="retro-window w-full flex flex-col mt-8 mb-4 select-none">
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

      {/* Action Bar */}
      <div className="flex items-center justify-between py-2.5 pr-6 bg-brand-cream/40 border-t-2 border-[#7d6972]/20" style={{ paddingLeft: '28px' }}>
        {/* Left: Status */}
        <span className="font-pixel text-[7px] text-brand-plum/50 tracking-wide">
          {isDirty ? '[!] UNSAVED CHANGES' : '[OK] SAVED'}
        </span>

        {/* Right: Buttons */}
        <div className="flex gap-2">
          {isDirty && (
            <button
              className="retro-btn text-[7px] py-1.5 px-3"
              onClick={handleDiscard}
              title="Discard unsaved changes"
              aria-label="Discard changes"
            >
              DISCARD
            </button>
          )}
          <button
            className="retro-btn text-[7px] py-1.5 px-3"
            onClick={handleClear}
            title="Clear all notes for this day"
            aria-label="Clear notes"
          >
            CLEAR
          </button>
          <button
            className="retro-btn text-[7px] py-1.5 px-3"
            onClick={handlePost}
            disabled={!isDirty}
            title="Save notes"
            aria-label="Post notes"
          >
            POST
          </button>
        </div>
      </div>
    </section>
  );
}
