import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import NotesSection from './components/NotesSection';
import TodoSection from './components/TodoSection';
import CozyJukebox from './components/CozyJukebox';
import FocusTimer from './components/FocusTimer';
import CalendarModal from './components/CalendarModal';
import { PixelCatEars } from './components/PixelIcons';
import './App.css';

export default function App() {
  // Global Active Date Key (YYYY-MM-DD)
  const [activeDate, setActiveDate] = useState('2026-07-11');
  const [calendarOpen, setCalendarOpen] = useState(false);

  // Focus timer duration state (default 25 minutes, editable)
  const [focusMinutes, setFocusMinutes] = useState(25);
  const [timerSeconds, setTimerSeconds] = useState(1500); // 25 * 60
  const [timerRunning, setTimerRunning] = useState(false);

  // Local storage records
  const [records, setRecords] = useState(() => {
    const saved = localStorage.getItem('tuskee_records');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse Tuskee local records:', e);
      }
    }
    
    // Seed cozy retro OS theme mock logs
    return {
      '2026-07-11': {
        notes: "Tuskee Meow-Station started successfully. 💻✨\n\nDaily log: Connected the lofi jukebox streams, configured Tailwind v4 compile filters, and set up the beveled 3D windows. Everything feels incredibly cozy in this desktop workspace!\n\nClick the Calendar shortcut on the left to navigate macros, or start the focus clock to get into the vibe. 🌸",
        todos: [
          { id: 1, text: "Click calendar shortcut to test Month/Year modal", completed: true },
          { id: 2, text: "Start FocusTimer.sys (25:00 countdown)", completed: true },
          { id: 3, text: "Play cozy lofi tracks on Jukebox.mp3", completed: false },
          { id: 4, text: "Clear task list for today's logs", completed: false }
        ],
        mood: 'sun'
      }
    };
  });

  // Focus timer countdown loop
  useEffect(() => {
    let interval = null;
    if (timerRunning) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            setTimerRunning(false);
            alert("⏰ Focus session complete! Take a cozy stretch break. 🍓");
            return focusMinutes * 60; // Reset to user configured custom minutes
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning, focusMinutes]);

  // Focus Timer actions
  const handleToggleTimer = () => setTimerRunning(!timerRunning);
  const handleResetTimer = () => {
    setTimerRunning(false);
    setTimerSeconds(focusMinutes * 60); // Reset to custom duration
  };

  const handleTimeChange = (newSeconds) => {
    if (timerRunning) return;
    const mins = Math.floor(newSeconds / 60);
    setFocusMinutes(mins);
    setTimerSeconds(newSeconds);
  };

  // Helper to save records state
  const saveRecords = (updatedRecords) => {
    setRecords(updatedRecords);
    localStorage.setItem('tuskee_records', JSON.stringify(updatedRecords));
  };

  // Extract active day details
  const activeRecord = records[activeDate] || {
    notes: '',
    todos: [],
    mood: 'sun'
  };

  // Date pagination controls
  const handlePrevDay = () => {
    const [year, month, day] = activeDate.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    date.setDate(date.getDate() - 1);
    
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    setActiveDate(`${y}-${m}-${d}`);
  };

  const handleNextDay = () => {
    const [year, month, day] = activeDate.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    date.setDate(date.getDate() + 1);
    
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    setActiveDate(`${y}-${m}-${d}`);
  };

  const handleNotesChange = (newNotes) => {
    const updatedRecords = {
      ...records,
      [activeDate]: {
        ...activeRecord,
        notes: newNotes
      }
    };
    saveRecords(updatedRecords);
  };

  const handleAddTodo = (todoText) => {
    const newTodo = {
      id: Date.now(),
      text: todoText,
      completed: false
    };
    
    const updatedRecords = {
      ...records,
      [activeDate]: {
        ...activeRecord,
        todos: [...(activeRecord.todos || []), newTodo]
      }
    };
    saveRecords(updatedRecords);
  };

  const handleToggleTodo = (todoId) => {
    const updatedTodos = (activeRecord.todos || []).map(todo => {
      if (todo.id === todoId) {
        return { ...todo, completed: !todo.completed };
      }
      return todo;
    });

    const updatedRecords = {
      ...records,
      [activeDate]: {
        ...activeRecord,
        todos: updatedTodos
      }
    };
    saveRecords(updatedRecords);
  };

  const handleDeleteTodo = (todoId) => {
    const updatedTodos = (activeRecord.todos || []).filter(todo => todo.id !== todoId);
    
    const updatedRecords = {
      ...records,
      [activeDate]: {
        ...activeRecord,
        todos: updatedTodos
      }
    };
    saveRecords(updatedRecords);
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center p-6 bg-brand-pink select-none overflow-hidden">
      
      {/* Master Notebook Centered Container Panel */}
      <main className="retro-window max-w-[1300px] w-full h-[88vh] flex flex-col">
        
        {/* Cat-Eared Header Container for Unified Navigation */}
        <Header 
          activeDate={activeDate}
          onPrevDay={handlePrevDay}
          onNextDay={handleNextDay}
          onOpenCalendar={() => setCalendarOpen(true)}
        />

        {/* Scrollable Journal Sheets Area */}
        <div className="flex-grow p-6 flex flex-col gap-6 overflow-hidden bg-brand-pinklight/20">
          
          {/* Top Row: Daily Notes Notepad (Full Width) */}
          <NotesSection 
            notes={activeRecord.notes}
            onNotesChange={handleNotesChange}
            activeDate={activeDate}
          />

          {/* Bottom Row: Split Grid Layout */}
          <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-6 min-h-0">
            
            {/* Left Column: Task Checklist Manager */}
            <TodoSection 
              todos={activeRecord.todos || []}
              onAddTodo={handleAddTodo}
              onToggleTodo={handleToggleTodo}
              onDeleteTodo={handleDeleteTodo}
            />

            {/* Right Column: stacked Spotify Media Player and countdown clock */}
            <div className="flex flex-col gap-6 h-full min-h-0">
              
              <CozyJukebox className="flex-grow min-h-0" />

              <FocusTimer 
                secondsLeft={timerSeconds}
                isRunning={timerRunning}
                onToggleStart={handleToggleTimer}
                onReset={handleResetTimer}
                onTimeChange={handleTimeChange}
              />

            </div>

          </div>

        </div>

      </main>

      {/* Calendar Navigation Modal Popup */}
      {calendarOpen && (
        <CalendarModal 
          activeDate={activeDate}
          onSelectDate={(date) => setActiveDate(date)}
          onClose={() => setCalendarOpen(false)}
          records={records}
        />
      )}

    </div>
  );
}
