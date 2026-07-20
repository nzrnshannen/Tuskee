import React, { useState } from 'react';
import TicTacToe from './games/TicTacToe';
import Snake from './games/Snake';
import Sudoku from './games/Sudoku';
import MemoryMatch from './games/MemoryMatch';
import FarmClicker from './games/FarmClicker';

const GAME_LIST = [
  { id: 'tictactoe', name: 'Tic-Tac-Toe', icon: '❌' },
  { id: 'snake', name: 'Snake Game', icon: '🐍' },
  { id: 'sudoku', name: 'Sudoku', icon: '🔢' },
  { id: 'memory', name: 'Slime Memory', icon: '🎴' },
  { id: 'farm', name: 'Farm Clicker', icon: '🌱' },
];

export default function Arcade() {
  const [activeMiniGame, setActiveMiniGame] = useState('tictactoe');

  const renderActiveGame = () => {
    switch (activeMiniGame) {
      case 'tictactoe': return <TicTacToe />;
      case 'snake': return <Snake />;
      case 'sudoku': return <Sudoku />;
      case 'memory': return <MemoryMatch />;
      case 'farm': return <FarmClicker />;
      default: return <TicTacToe />;
    }
  };

  return (
    <div className="retro-window bg-brand-pinklight border-2 border-brand-plum w-full max-w-5xl mx-auto flex flex-col h-full select-none shadow-xl">
      
      {/* Title Bar */}
      <div className="retro-window-header bg-[#D2E4D6] text-brand-plum border-b-2 border-brand-plum p-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm grayscale">🎮</span>
          <span className="font-bold text-xs font-pixel tracking-widest uppercase">ARCADE.EXE</span>
        </div>
      </div>

      <div className="flex flex-col md:flex-row flex-grow min-h-0">
        
        {/* Left Column (30%) - Sidebar */}
        <div className="w-full md:w-[30%] md:min-w-[180px] border-b-2 md:border-b-0 md:border-r-2 border-brand-plum bg-brand-pinklight/40 flex flex-col shrink-0">
          <div className="flex flex-row md:flex-col gap-2 md:gap-3 overflow-x-auto md:overflow-hidden p-2 md:p-4 snap-x">
          {GAME_LIST.map(game => (
            <button
              key={game.id}
              onClick={() => setActiveMiniGame(game.id)}
              className={`flex shrink-0 items-center gap-2 md:gap-3 p-2 md:p-3 rounded-lg border-2 font-pixel text-[10px] sm:text-xs transition-all w-max md:w-full text-left
                ${activeMiniGame === game.id 
                  ? 'bg-brand-cream border-brand-plum text-brand-plum shadow-[inset_0px_3px_5px_rgba(0,0,0,0.15)] translate-y-[2px]' 
                  : 'bg-[#F5D6D8] border-transparent text-brand-plum hover:bg-brand-cream hover:border-brand-plum/50 hover:-translate-y-1 shadow-sm'
                }`}
            >
              <span className="text-xl drop-shadow-sm">{game.icon}</span>
              <span className="truncate">{game.name}</span>
            </button>
          ))}
          </div>
        </div>

        {/* Right Column (70%) - Game Stage */}
        <div className="w-full md:w-[70%] bg-brand-cream/50 p-4 md:p-6 flex flex-col justify-center items-center min-h-0 relative flex-grow">
          {/* CRT Screen Inset container */}
          <div className="w-full h-full bg-[#d8d8c0] border-4 border-brand-plum shadow-[inset_4px_6px_16px_rgba(0,0,0,0.3)] rounded-xl flex items-center justify-center relative overflow-hidden">
            <div className="absolute top-4 left-4 opacity-20 text-[10px] font-pixel pointer-events-none">GAME-BOY ADVANCE</div>
            <div className="w-full h-full flex flex-col items-center justify-center overflow-hidden p-4 z-10">
              {renderActiveGame()}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
