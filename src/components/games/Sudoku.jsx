import React, { useState, useEffect } from 'react';

// 0 represents empty cell
const SUDOKU_TEMPLATES = [
  [
    [5,3,0,0,7,0,0,0,0],
    [6,0,0,1,9,5,0,0,0],
    [0,9,8,0,0,0,0,6,0],
    [8,0,0,0,6,0,0,0,3],
    [4,0,0,8,0,3,0,0,1],
    [7,0,0,0,2,0,0,0,6],
    [0,6,0,0,0,0,2,8,0],
    [0,0,0,4,1,9,0,0,5],
    [0,0,0,0,8,0,0,7,9]
  ],
  [
    [0,0,0,2,6,0,7,0,1],
    [6,8,0,0,7,0,0,9,0],
    [1,9,0,0,0,4,5,0,0],
    [8,2,0,1,0,0,0,4,0],
    [0,0,4,6,0,2,9,0,0],
    [0,5,0,0,0,3,0,2,8],
    [0,0,9,3,0,0,0,7,4],
    [0,4,0,0,5,0,0,3,6],
    [7,0,3,0,1,8,0,0,0]
  ]
];

export default function Sudoku() {
  const [board, setBoard] = useState([]);
  const [initialBoard, setInitialBoard] = useState([]);
  const [selectedCell, setSelectedCell] = useState(null);
  const [errors, setErrors] = useState([]);
  const [isWon, setIsWon] = useState(false);

  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = () => {
    const template = SUDOKU_TEMPLATES[Math.floor(Math.random() * SUDOKU_TEMPLATES.length)];
    const newBoard = template.map(row => [...row]);
    setBoard(newBoard);
    setInitialBoard(template);
    setSelectedCell(null);
    setErrors([]);
    setIsWon(false);
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
      if (isFull) setIsWon(true);
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
    if (!selectedCell || isWon) return;

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
    <div className="flex flex-col items-center gap-4 w-full">
      <div className="flex justify-between items-center w-full max-w-[340px] bg-[#D2E4D6] p-3 rounded-xl border-2 border-brand-plum/30 shadow-sm">
        <span className="font-pixel text-[10px] uppercase text-brand-plum tracking-widest">
          {isWon ? '🎉 PUZZLE SOLVED!' : 'SUDOKU'}
        </span>
        <button
          onClick={startNewGame}
          className="retro-btn bg-[#F5D6D8] text-brand-plum px-3 py-1 rounded font-pixel text-[8px] uppercase border border-brand-plum active:translate-y-[1px] transition-all"
        >
          New Game
        </button>
      </div>

      <div className="bg-[#d8d8c0] border-4 border-brand-plum shadow-[inset_2px_4px_8px_rgba(0,0,0,0.3)] p-2 rounded-xl relative">
        <div className="grid grid-cols-9 gap-0 bg-brand-plum border-2 border-brand-plum">
          {board.map((row, r) => (
            row.map((cell, c) => {
              const isInitial = initialBoard[r][c] !== 0;
              const isSelected = selectedCell?.r === r && selectedCell?.c === c;
              const isError = errors.includes(`${r},${c}`);
              
              // Borders for 3x3 blocks
              const borderRight = c % 3 === 2 && c !== 8 ? 'border-r-2 border-brand-plum' : 'border-r border-brand-plum/20';
              const borderBottom = r % 3 === 2 && r !== 8 ? 'border-b-2 border-brand-plum' : 'border-b border-brand-plum/20';

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
