import React, { useState, useEffect } from 'react';
import { generateSudoku } from '../../utils/sudokuGenerator';

export default function Sudoku() {
  const [board, setBoard] = useState([]);
  const [difficulty, setDifficulty] = useState('easy');
  const [initialBoard, setInitialBoard] = useState([]);
  const [selectedCell, setSelectedCell] = useState(null);
  const [errors, setErrors] = useState([]);
  const [isWon, setIsWon] = useState(false);
  const [time, setTime] = useState(0);
  const [bestTimes, setBestTimes] = useState({ easy: null, medium: null, hard: null });
  const [isGameActive, setIsGameActive] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('tuskee_sudoku_best_times');
    if (saved) {
      try {
        setBestTimes(JSON.parse(saved));
      } catch(e) {}
    }
    startNewGame();
  }, []);

  useEffect(() => {
    let interval;
    if (isGameActive && !isWon && board.length > 0) {
      interval = setInterval(() => setTime(t => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isGameActive, isWon, board]);

  const startNewGame = (selectedDiff = difficulty) => {
    const template = generateSudoku(selectedDiff);
    const newBoard = template.map(row => [...row]);
    setBoard(newBoard);
    setInitialBoard(template);
    setSelectedCell(null);
    setErrors([]);
    setIsWon(false);
    setTime(0);
    setIsGameActive(false);
  };

  const validateBoard = (currentBoard) => {
    const newErrors = [];
    
    // Helper to check array for duplicates (ignoring 0)
    const getDuplicates = (arr, type, index) => {
      const seen = new Map();
      arr.forEach((val, i) => {
        if (val !== 0) {
          if (seen.has(val)) {
            if (type === 'row') {
              newErrors.push(`${index},${seen.get(val)}`, `${index},${i}`);
            } else if (type === 'col') {
              newErrors.push(`${seen.get(val)},${index}`, `${i},${index}`);
            } else {
              // Block
              const startRow = Math.floor(index / 3) * 3;
              const startCol = (index % 3) * 3;
              const r1 = startRow + Math.floor(seen.get(val) / 3);
              const c1 = startCol + (seen.get(val) % 3);
              const r2 = startRow + Math.floor(i / 3);
              const c2 = startCol + (i % 3);
              newErrors.push(`${r1},${c1}`, `${r2},${c2}`);
            }
          } else {
            seen.set(val, i);
          }
        }
      });
    };

    // Check rows
    for (let r = 0; r < 9; r++) {
      getDuplicates(currentBoard[r], 'row', r);
    }

    // Check cols
    for (let c = 0; c < 9; c++) {
      const col = [];
      for (let r = 0; r < 9; r++) col.push(currentBoard[r][c]);
      getDuplicates(col, 'col', c);
    }

    // Check blocks
    for (let b = 0; b < 9; b++) {
      const block = [];
      const startRow = Math.floor(b / 3) * 3;
      const startCol = (b % 3) * 3;
      for (let i = 0; i < 9; i++) {
        block.push(currentBoard[startRow + Math.floor(i / 3)][startCol + (i % 3)]);
      }
      getDuplicates(block, 'block', b);
    }

    setErrors([...new Set(newErrors)]);

    // Check win condition
    if (newErrors.length === 0) {
      let isFull = true;
      for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
          if (currentBoard[r][c] === 0) isFull = false;
        }
      }
      if (isFull) {
        setIsWon(true);
        // Check best time
        setBestTimes(prev => {
          const currentBest = prev[difficulty];
          if (currentBest === null || time < currentBest) {
            const newBest = { ...prev, [difficulty]: time };
            localStorage.setItem('tuskee_sudoku_best_times', JSON.stringify(newBest));
            return newBest;
          }
          return prev;
        });
      }
    } else {
      setIsWon(false);
    }
  };

  const handleCellClick = (r, c) => {
    // Only allow selecting cells that weren't in the initial puzzle
    if (initialBoard[r][c] === 0) {
      setSelectedCell({ r, c });
    }
  };

  const handleKeyPress = (e) => {
    if (!selectedCell || isWon || !isGameActive) return;

    const key = e.key;
    if (/^[1-9]$/.test(key)) {
      updateCell(parseInt(key));
    } else if (key === 'Backspace' || key === 'Delete') {
      updateCell(0);
    }
  };

  const updateCell = (val) => {
    const newBoard = board.map(row => [...row]);
    newBoard[selectedCell.r][selectedCell.c] = val;
    setBoard(newBoard);
    validateBoard(newBoard);
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCell, board, isWon]);

  if (!board.length) return null;

  return (
    <div className="flex flex-col items-center gap-6 w-full p-4">
      <div className="flex flex-col gap-3 w-full max-w-[340px] bg-[#D2E4D6] p-4 rounded-xl border-2 border-brand-plum/30 shadow-sm mb-2">
        
        <div className="flex justify-between items-center w-full px-2">
          <span className="font-pixel flex items-center leading-none text-[10px] sm:text-xs uppercase text-brand-plum tracking-widest mr-2 pl-1">
            {isWon ? '🎉 PUZZLE SOLVED!' : 'SUDOKU'}
          </span>
          <button
            onClick={() => startNewGame()}
            className="retro-btn bg-[#F5D6D8] text-brand-plum px-3 py-1 rounded font-pixel text-[8px] uppercase border border-brand-plum active:translate-y-[1px] transition-all"
          >
            New Game
          </button>
        </div>

        <div className="grid grid-cols-3 gap-1 sm:gap-2 mt-1 w-full">
          {['easy', 'medium', 'hard'].map((level) => {
            const isActive = difficulty === level;
            let activeBg = 'bg-brand-plum text-brand-white shadow-inner';
            if (level === 'easy') activeBg = 'bg-[#a6cca0] text-brand-plum border-brand-plum shadow-inner';
            else if (level === 'medium') activeBg = 'bg-[#f4e094] text-brand-plum border-brand-plum shadow-inner';
            else if (level === 'hard') activeBg = 'bg-[#e94560] text-brand-white border-brand-plum shadow-inner';

            return (
              <button
                key={level}
                onClick={() => { 
                  setDifficulty(level); 
                  startNewGame(level); 
                }}
                className={`font-pixel text-[9px] sm:text-[10px] py-1 rounded border-2 transition-all capitalize whitespace-nowrap flex items-center justify-center
                  ${isActive 
                    ? activeBg 
                    : 'bg-brand-cream text-brand-plum border-brand-plum/20 hover:border-brand-plum'}`}
              >
                [ {level} ]
              </button>
            );
          })}
        </div>

        {/* Timer Display */}
        <div className="flex justify-between items-center w-full mt-2 px-2 border-t border-brand-plum/10 pt-2">
          <div className="flex flex-col">
            <span className="font-pixel text-[8px] text-brand-plum/60 uppercase">Time</span>
            <span className="font-pixel text-sm text-brand-plum">
              {Math.floor(time / 60).toString().padStart(2, '0')}:{(time % 60).toString().padStart(2, '0')}
            </span>
          </div>
          <div className="flex flex-col items-end">
            <span className="font-pixel text-[8px] text-brand-plum/60 uppercase">Best ({difficulty})</span>
            <span className="font-pixel text-sm text-brand-plum">
              {bestTimes[difficulty] !== null 
                ? `${Math.floor(bestTimes[difficulty] / 60).toString().padStart(2, '0')}:${(bestTimes[difficulty] % 60).toString().padStart(2, '0')}`
                : '--:--'}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-[#d8d8c0] border-4 border-brand-plum shadow-[inset_2px_4px_8px_rgba(0,0,0,0.3)] p-2 rounded-xl relative">
        <div className="grid grid-cols-9 gap-0 bg-brand-plum border-2 border-brand-plum">
          {board.map((row, r) => (
            row.map((cell, c) => {
              const isInitial = initialBoard[r][c] !== 0;
              const isSelected = selectedCell?.r === r && selectedCell?.c === c;
              const isError = errors.includes(`${r},${c}`);
              
              // Borders for 3x3 blocks
              const borderRight = c === 2 || c === 5 ? 'border-r-4 border-brand-plum' : 'border-r border-brand-plum/20';
              const borderBottom = r === 2 || r === 5 ? 'border-b-4 border-brand-plum' : 'border-b border-brand-plum/20';

              return (
                <div
                  key={`${r}-${c}`}
                  onClick={() => handleCellClick(r, c)}
                  className={`w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center font-pixel text-sm sm:text-base transition-colors
                    ${borderRight} ${borderBottom}
                    ${isSelected ? 'bg-[#D2E4D6]' : 'bg-[#FFFBF5]'}
                    ${isInitial ? 'text-brand-plum font-bold bg-[#FFFBF5]/90' : 'text-[#644696] cursor-pointer'}
                    ${isError ? 'bg-[#F5D6D8] text-red-600' : ''}
                    ${!isInitial && !isSelected && !isError ? 'hover:bg-brand-cream' : ''}
                  `}
                >
                  {cell !== 0 ? cell : ''}
                </div>
              );
            })
          ))}
        </div>

        {!isGameActive && (
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg backdrop-blur-[6px] bg-[#FFFBF5]/40">
             <button 
               onClick={() => setIsGameActive(true)}
               className="retro-btn bg-[#D2E4D6] text-brand-plum px-6 py-3 font-pixel text-sm border-2 border-brand-plum shadow-[4px_4px_0px_rgba(0,0,0,0.3)] hover:bg-[#a6cca0] active:translate-y-1 active:shadow-none transition-all"
             >
               START GAME
             </button>
          </div>
        )}

        {isWon && (
          <div className="absolute inset-0 bg-brand-pinklight/80 backdrop-blur-sm flex flex-col items-center justify-center z-10 rounded-lg">
            <h2 className="font-pixel text-2xl text-brand-plum animate-pulse">YOU WIN!</h2>
          </div>
        )}
      </div>

      <div className="font-pixel text-[10px] text-brand-plum/60 text-center max-w-[300px]">
        Click an empty cell and type <kbd className="bg-brand-cream px-1 border border-brand-plum rounded">1-9</kbd>. Use <kbd className="bg-brand-cream px-1 border border-brand-plum rounded">Backspace</kbd> to clear.
      </div>
    </div>
  );
}
