import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import NotesSection from './components/NotesSection';
import TodoSection from './components/TodoSection';
import CozyJukebox from './components/CozyJukebox';
import FocusTimer from './components/FocusTimer';
import Calculator from './components/Calculator';
import Arcade from './components/Arcade';
import SettingsPanel from './components/SettingsPanel';
import CalendarModal from './components/CalendarModal';
import AuthScreens from './components/AuthScreens';
import { setupGlobalClickSound } from './utils/audio';
import { PixelCatEars } from './components/PixelIcons';
import { supabase } from './utils/supabase';
import { useAuth } from './context/AuthContext';
import './App.css';

// --- Global Desktop Dock Icon Component ---
const DesktopIcon = ({ emoji, label, isActive, onClick }) => {
  return (
    <button 
      onClick={onClick}
      className={`group flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-200 border-2 ${
        isActive 
          ? 'bg-brand-plum border-brand-plum text-brand-white shadow-[inset_0_3px_6px_rgba(0,0,0,0.4)]' 
          : 'bg-brand-white/40 border-brand-plum/10 hover:bg-brand-white/80 hover:border-brand-plum/30 text-brand-plum shadow-sm'
      }`}
      title={label}
    >
      <span className="text-xl drop-shadow-sm group-hover:scale-110 transition-transform">{emoji}</span>
    </button>
  );
};

export default function App() {
  const { session, profile } = useAuth();
  
  // Global Authentication State
  const [authView, setAuthView] = useState('landing'); // 'landing', 'login', 'register', 'dashboard'

  // Initialize session view
  useEffect(() => {
    if (session) setAuthView('dashboard');
    else setAuthView('landing');
  }, [session]);

  // Global Active Date Key (YYYY-MM-DD)
  const [activeDate, setActiveDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [activeApp, setActiveApp] = useState('notebook');
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [showTimeUpModal, setShowTimeUpModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showRegistrationSuccess, setShowRegistrationSuccess] = useState(false);
  const [bgPattern, setBgPattern] = useState('peach');

  useEffect(() => {
    setupGlobalClickSound();
    const savedBgPattern = localStorage.getItem('tuskee_bg_pattern');
    if (savedBgPattern) {
      setBgPattern(savedBgPattern);
    }
  }, []);

  // Sync background from profile
  useEffect(() => {
    if (profile?.bg_pattern) {
      setBgPattern(profile.bg_pattern);
      localStorage.setItem('tuskee_bg_pattern', profile.bg_pattern);
    }
  }, [profile?.bg_pattern]);

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
            import('./utils/audio').then(({ playAlarmSound }) => playAlarmSound());
            setShowTimeUpModal(true);
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

  const handleRestoreTodo = (todo, index) => {
    const currentTodos = [...(activeRecord.todos || [])];
    currentTodos.splice(index, 0, todo);
    
    const updatedRecords = {
      ...records,
      [activeDate]: {
        ...activeRecord,
        todos: currentTodos
      }
    };
    saveRecords(updatedRecords);
  };

  const handleEditTodo = (todoId, newText) => {
    const updatedTodos = (activeRecord.todos || []).map(todo => {
      if (todo.id === todoId) {
        return { ...todo, text: newText };
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

  const handleConfirmLogout = async () => {
    // Clear active UI session and route to landing
    setShowLogoutModal(false);
    await supabase.auth.signOut();
    setAuthView('landing');
  };

  // If not logged in, render authentication screens
  if (authView !== 'dashboard') {
    return <AuthScreens authView={authView} setAuthView={setAuthView} onRegisterSuccess={() => setShowRegistrationSuccess(true)} />;
  }

  const getBgColor = (pattern) => {
    switch (pattern) {
      case 'mint': return '#D2E4D6';
      case 'cream': return '#FFFBF5';
      case 'peach': default: return '#FDF6EB';
    }
  };

  return (
    <div 
      className="min-h-screen w-screen flex flex-col items-center justify-between pb-6 pt-12 px-6 select-none overflow-x-hidden transition-colors duration-300"
      style={{ backgroundColor: getBgColor(bgPattern) }}
    >
      
      {/* Dynamic Background Pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-[-1]" 
           style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M54.627 0l.83.83v58.34h-58.34l-.83-.83V0h58.34zM29.585 18.06c-2.316-.2-5.74-.24-8.736.9-2.996 1.14-5.992 4.28-7.04 8.04-1.049 3.76-.749 6.8-.299 8.64.449 1.84 2.546 5.8 7.339 6.4 4.793.6 8.986-1.6 11.233-4.2 2.247-2.6 3.445-6.8 3.595-10.4.15-3.6-1.648-7.2-4.194-8.6-2.546-1.4-4.644-1.1-6.892-1.1z\' fill=\'%233E2312\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")' }} 
      />

      {/* Master Notebook Centered Container Panel */}
      <main className="retro-window max-w-[1300px] w-full flex-grow flex flex-col relative">
        
        {activeApp === 'notebook' && (
          <>
            {/* Cat-Eared Header Container for Unified Navigation */}
            <Header 
              activeDate={activeDate}
              onPrevDay={handlePrevDay}
              onNextDay={handleNextDay}
              onOpenCalendar={() => setCalendarOpen(true)}
            />

            {/* Journal Sheets Area */}
            <div className="flex-grow pt-6 px-6 pb-6 flex flex-col gap-6 bg-brand-pinklight/20">
          
          {/* Top Row: Daily Notes Notepad (Full Width) */}
          <NotesSection 
            notes={activeRecord.notes}
            onNotesChange={handleNotesChange}
            activeDate={activeDate}
          />

          {/* Bottom Row: 70/30 Split Grid Layout */}
          <div className="flex-grow grid grid-cols-1 md:grid-cols-[7fr_3fr] gap-6 min-h-0">
            
            {/* Left Column: Task Checklist Manager */}
            <div className="min-w-0 h-full">
              <TodoSection 
                todos={activeRecord.todos || []}
                onAddTodo={handleAddTodo}
                onToggleTodo={handleToggleTodo}
                onDeleteTodo={handleDeleteTodo}
                onEditTodo={handleEditTodo}
                onRestoreTodo={handleRestoreTodo}
              />
            </div>

            {/* Right Column: stacked Spotify Media Player and countdown clock */}
            <div className="flex flex-col gap-6 h-full min-h-0 min-w-0">
              
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
          </>
        )}

        {/* Calculator */}
        {activeApp === 'calculator' && (
          <div className="flex-grow flex flex-col items-center justify-center p-8 md:p-16 bg-brand-pinklight/20 h-full w-full">
            <Calculator />
          </div>
        )}

        {/* Arcade Games */}
        {activeApp === 'games' && (
          <div className="flex-grow flex flex-col items-center justify-center p-8 md:p-12 bg-brand-pinklight/20 h-full w-full">
            <Arcade />
          </div>
        )}

        {/* Settings Panel */}
        {activeApp === 'settings' && (
          <SettingsPanel onBackgroundChange={setBgPattern} />
        )}
      </main>

      {/* Bottom Navigation Dock */}
      <aside className="flex flex-row gap-4 mt-2 mb-8 items-center">
        <DesktopIcon emoji="📓" label="Notebook" isActive={activeApp === 'notebook'} onClick={() => setActiveApp('notebook')} />
        <DesktopIcon emoji="🧮" label="Calculator" isActive={activeApp === 'calculator'} onClick={() => setActiveApp('calculator')} />
        <DesktopIcon emoji="🎮" label="Games" isActive={activeApp === 'games'} onClick={() => setActiveApp('games')} />
        <DesktopIcon emoji="⚙️" label="Settings" isActive={activeApp === 'settings'} onClick={() => setActiveApp('settings')} />
        
        <div className="w-[2px] h-8 bg-brand-plum/20 rounded-full mx-2"></div>
        
        <DesktopIcon emoji="🚪" label="Log Out" isActive={false} onClick={() => setShowLogoutModal(true)} />
      </aside>

      {/* Calendar Navigation Modal Popup */}
      {calendarOpen && (
        <CalendarModal 
          activeDate={activeDate}
          onSelectDate={(date) => setActiveDate(date)}
          onClose={() => setCalendarOpen(false)}
          records={records}
        />
      )}

      {/* Time's Up Modal */}
      {showTimeUpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-plum/20 backdrop-blur-sm p-4">
          <div 
            className="retro-window border-2 border-brand-plum max-w-sm w-full flex flex-col items-center gap-4 text-center animate-bounce-short shadow-2xl"
            style={{ paddingTop: '3rem', paddingBottom: '1.5rem', paddingLeft: '1.5rem', paddingRight: '1.5rem', backgroundColor: '#FFFBF5' }}
          >
            <div style={{ marginTop: '1.5rem', marginBottom: '0.5rem' }}>
              <span className="text-5xl leading-none" style={{ display: 'inline-block' }}>⏰</span>
            </div>
            <h2 className="font-pixel text-brand-plum text-lg leading-tight">Time's Up!</h2>
            <p className="text-brand-plum/80 font-medium text-sm">Focus session complete! Take a cozy stretch break. 🍓</p>
            <div className="w-full mt-4">
              <button 
                className="retro-btn px-8 py-2 w-full text-xs font-pixel tracking-wider"
                onClick={() => setShowTimeUpModal(false)}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Log Out Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-brand-plum/20 backdrop-blur-sm p-4">
          <div 
            className="retro-window border-2 border-brand-plum max-w-sm w-full flex flex-col items-center gap-6 text-center shadow-2xl"
            style={{ padding: '2rem 1.5rem', backgroundColor: '#FFFBF5' }}
          >
            <div className="flex flex-col items-center gap-2">
              <span className="text-4xl">🚪</span>
              <h2 className="font-pixel text-brand-plum text-lg leading-tight mt-2">Log Out?</h2>
              <p className="text-brand-plum/80 font-medium text-sm">Are you sure you want to end your current session?</p>
            </div>
            
            <div className="w-full flex gap-3 mt-2">
              <button 
                className="flex-1 bg-brand-cream/50 text-brand-plum/70 border-2 border-brand-plum/30 py-2.5 font-pixel text-[10px] tracking-wider hover:bg-brand-cream hover:text-brand-plum hover:border-brand-plum transition-colors active:translate-y-[1px]"
                onClick={() => setShowLogoutModal(false)}
              >
                CANCEL
              </button>
              <button 
                className="flex-1 retro-btn bg-[#F5D6D8] text-brand-plum py-2.5 font-pixel text-[10px] tracking-wider border-2 border-brand-plum active:translate-y-[1px] transition-transform shadow-sm hover:shadow-inner hover:bg-[#eecbcd]"
                onClick={handleConfirmLogout}
              >
                LOG OUT
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Registration Success Modal */}
      {showRegistrationSuccess && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-brand-plum/20 backdrop-blur-sm p-4">
          <div 
            className="retro-window border-2 border-brand-plum max-w-sm w-full flex flex-col items-center gap-6 text-center shadow-2xl bg-[#FFFBF5]"
            style={{ padding: '2rem 1.5rem' }}
          >
            <div className="flex flex-col items-center gap-2">
              <span className="text-5xl drop-shadow-sm">🎉</span>
              <h2 className="font-pixel text-brand-plum text-lg leading-tight mt-2">Account Created!</h2>
              <p className="text-brand-plum/80 font-medium text-sm">Your account has been successfully created. Welcome to Tuskee!</p>
            </div>
            
            <div className="w-full mt-2">
              <button 
                className="w-full retro-btn bg-[#D2E4D6] text-brand-plum py-2.5 font-pixel text-[10px] tracking-wider border-2 border-brand-plum active:translate-y-[1px] transition-transform shadow-sm hover:shadow-inner uppercase"
                onClick={() => setShowRegistrationSuccess(false)}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
