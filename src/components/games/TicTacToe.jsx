import React, { useState, useEffect } from 'react';

const WIN_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Cols
  [0, 4, 8], [2, 4, 6]             // Diagonals
];

export default function TicTacToe() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [difficulty, setDifficulty] = useState('easy'); // 'easy' | 'medium' | 'hard'
  const [xIsNext, setXIsNext] = useState(true);
  const [winner, setWinner] = useState(null);

  useEffect(() => {
    const currentWinner = calculateWinner(board);
    if (currentWinner && winner !== currentWinner) {
      setWinner(currentWinner);
    }
    
    // AI Turn
    if (!xIsNext && !currentWinner && board.includes(null)) {
      const timer = setTimeout(() => {
        makeAiMove();
      }, 500); // slight delay for feel
      return () => clearTimeout(timer);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [xIsNext, board, winner]);

  const calculateWinner = (squares) => {
    for (let i = 0; i < WIN_LINES.length; i++) {
      const [a, b, c] = WIN_LINES[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    if (!squares.includes(null)) {
      return 'draw';
    }
    return null;
  };

  const handleClick = (index) => {
    if (board[index] || winner || !xIsNext) return;

    const newBoard = [...board];
    newBoard[index] = 'X';
    setBoard(newBoard);
    setXIsNext(false);
  };

  const makeAiMove = () => {
    const newBoard = [...board];
    
    if (difficulty === 'easy') {
      // Random move
      const empty = newBoard.map((val, idx) => val === null ? idx : null).filter(val => val !== null);
      if (empty.length > 0) {
        const randomIdx = empty[Math.floor(Math.random() * empty.length)];
        newBoard[randomIdx] = 'O';
      }
    } else if (difficulty === 'medium') {
      // Block or Random
      const move = findWinningMove(newBoard, 'O') ?? findWinningMove(newBoard, 'X') ?? getRandomMove(newBoard);
      if (move !== null) newBoard[move] = 'O';
    } else if (difficulty === 'hard') {
      // Minimax
      let bestScore = -Infinity;
      let move = -1;
      for (let i = 0; i < 9; i++) {
        if (newBoard[i] === null) {
          newBoard[i] = 'O';
          let score = minimax(newBoard, 0, false);
          newBoard[i] = null;
          if (score > bestScore) {
            bestScore = score;
            move = i;
          }
        }
      }
      if (move !== -1) newBoard[move] = 'O';
    }

    setBoard(newBoard);
    setXIsNext(true);
  };

  const getRandomMove = (squares) => {
    const empty = squares.map((val, idx) => val === null ? idx : null).filter(val => val !== null);
    return empty.length > 0 ? empty[Math.floor(Math.random() * empty.length)] : null;
  };

  const findWinningMove = (squares, player) => {
    for (let i = 0; i < 9; i++) {
      if (squares[i] === null) {
        squares[i] = player;
        if (calculateWinner(squares) === player) {
          squares[i] = null;
          return i;
        }
        squares[i] = null;
      }
    }
    return null;
  };

  // Minimax algorithm for unbeatable Hard AI
  const minimax = (squares, depth, isMaximizing) => {
    let result = calculateWinner(squares);
    if (result === 'O') return 10 - depth;
    if (result === 'X') return depth - 10;
    if (result === 'draw') return 0;

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < 9; i++) {
        if (squares[i] === null) {
          squares[i] = 'O';
          let score = minimax(squares, depth + 1, false);
          squares[i] = null;
          bestScore = Math.max(score, bestScore);
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < 9; i++) {
        if (squares[i] === null) {
          squares[i] = 'X';
          let score = minimax(squares, depth + 1, true);
          squares[i] = null;
          bestScore = Math.min(score, bestScore);
        }
      }
      return bestScore;
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setWinner(null);
    setXIsNext(true);
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-sm">
      
      {/* Controls */}
      <div className="flex flex-col items-center gap-2 bg-[#D2E4D6] p-3 rounded-xl border-2 border-brand-plum/30 shadow-sm w-full">
        <span className="font-pixel text-[10px] uppercase text-brand-plum tracking-widest">Difficulty</span>
        <div className="flex gap-2">
          {['easy', 'medium', 'hard'].map((level) => (
            <button
              key={level}
              onClick={() => { setDifficulty(level); resetGame(); }}
              className={`font-pixel text-[10px] px-3 py-1 rounded border-2 transition-all capitalize
                ${difficulty === level 
                  ? 'bg-brand-plum text-brand-white border-brand-plum shadow-inner' 
                  : 'bg-brand-cream text-brand-plum border-brand-plum/20 hover:border-brand-plum'}`}
            >
              [ {level} ]
            </button>
          ))}
        </div>
      </div>

      {/* Status */}
      <div className="font-pixel text-lg text-brand-plum tracking-widest h-6">
        {winner 
          ? winner === 'draw' ? "IT'S A DRAW!" : `${winner} WINS!`
          : `${xIsNext ? 'PLAYER (X)' : 'CPU (O)'} TURN`}
      </div>

      {/* Board */}
      <div className="grid grid-cols-3 gap-2 bg-brand-plum/20 p-2 rounded-xl shadow-inner w-64 h-64">
        {board.map((cell, idx) => (
          <button
            key={idx}
            onClick={() => handleClick(idx)}
            disabled={cell !== null || winner !== null || !xIsNext}
            className={`flex items-center justify-center text-4xl font-pixel bg-[#FFFBF5] rounded-lg border-b-4 
              ${cell ? 'border-brand-plum/20 active:translate-y-0 active:border-b-4' : 'border-brand-plum hover:bg-[#D2E4D6] active:translate-y-1 active:border-b-0'} 
              transition-all ${!xIsNext ? 'cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <span className={`${cell === 'X' ? 'text-[#e94560]' : 'text-[#533483]'}`}>
              {cell}
            </span>
          </button>
        ))}
      </div>

      {/* Reset */}
      <button
        onClick={resetGame}
        className="retro-btn bg-[#F5D6D8] text-brand-plum px-6 py-2 rounded-lg font-pixel text-xs uppercase border-2 border-brand-plum mt-2 active:translate-y-1 active:shadow-none transition-all"
      >
        Restart Game
      </button>

    </div>
  );
}
