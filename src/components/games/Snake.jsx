import React, { useState, useEffect, useCallback, useRef } from 'react';

const GRID_SIZE = 15;
const INITIAL_SPEED = 150;

const getRandomPosition = () => {
  return {
    x: Math.floor(Math.random() * GRID_SIZE),
    y: Math.floor(Math.random() * GRID_SIZE)
  };
};

export default function Snake() {
  const [snake, setSnake] = useState([
    { x: 5, y: 5 },
    { x: 4, y: 5 },
    { x: 3, y: 5 }
  ]);
  const [apple, setApple] = useState(getRandomPosition());
  const [direction, setDirection] = useState({ x: 1, y: 0 });
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [score, setScore] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  
  // Use a ref to track the latest direction to prevent quick double-turn self-collisions
  const currentDirectionRef = useRef(direction);

  const resetGame = () => {
    setSnake([{ x: 5, y: 5 }, { x: 4, y: 5 }, { x: 3, y: 5 }]);
    setDirection({ x: 1, y: 0 });
    currentDirectionRef.current = { x: 1, y: 0 };
    setApple(getRandomPosition());
    setScore(0);
    setIsGameOver(false);
    setIsPaused(false);
  };

  const checkCollision = (head) => {
    // Wall collision
    if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
      return true;
    }
    // Self collision
    for (let segment of snake) {
      if (head.x === segment.x && head.y === segment.y) {
        return true;
      }
    }
    return false;
  };

  const moveSnake = useCallback(() => {
    if (isGameOver || isPaused) return;

    setSnake((prevSnake) => {
      const head = prevSnake[0];
      const newHead = {
        x: head.x + currentDirectionRef.current.x,
        y: head.y + currentDirectionRef.current.y
      };

      if (checkCollision(newHead)) {
        setIsGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Eat apple
      if (newHead.x === apple.x && newHead.y === apple.y) {
        setScore(s => s + 10);
        let newApple;
        // Ensure apple doesn't spawn on snake
        while (true) {
          newApple = getRandomPosition();
          if (!newSnake.some(seg => seg.x === newApple.x && seg.y === newApple.y)) {
            break;
          }
        }
        setApple(newApple);
      } else {
        newSnake.pop(); // Remove tail if no apple eaten
      }

      return newSnake;
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apple, isGameOver, isPaused]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isGameOver || !hasStarted) return;
      
      const { x, y } = currentDirectionRef.current;
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (y !== 1) currentDirectionRef.current = { x: 0, y: -1 };
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (y !== -1) currentDirectionRef.current = { x: 0, y: 1 };
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (x !== 1) currentDirectionRef.current = { x: -1, y: 0 };
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (x !== -1) currentDirectionRef.current = { x: 1, y: 0 };
          break;
        case ' ':
          setIsPaused(p => !p);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isGameOver]);

  useEffect(() => {
    if (!hasStarted) return;
    // Increase speed slightly as score goes up
    const speed = Math.max(50, INITIAL_SPEED - Math.floor(score / 30) * 10);
    const interval = setInterval(moveSnake, speed);
    return () => clearInterval(interval);
  }, [moveSnake, score, hasStarted]);

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      
      {/* Header Bar */}
      <div className="flex justify-between w-[300px] bg-[#D2E4D6] p-3 rounded-xl border-2 border-brand-plum/30 shadow-sm">
        <div className="flex flex-col">
          <span className="font-pixel text-[8px] text-brand-plum/70">SCORE</span>
          <span className="font-pixel text-xl text-brand-plum">{score}</span>
        </div>
        <div className="flex flex-col text-right">
          <span className="font-pixel text-[8px] text-brand-plum/70">STATUS</span>
          <span className="font-pixel text-sm text-brand-plum uppercase">
            {!hasStarted ? 'IDLE' : isGameOver ? 'GAME OVER' : isPaused ? 'PAUSED' : 'PLAYING'}
          </span>
        </div>
      </div>

      {/* Game Board */}
      <div className="relative bg-[#d8d8c0] border-4 border-brand-plum shadow-[inset_2px_4px_8px_rgba(0,0,0,0.3)] rounded-xl overflow-hidden p-2"
           style={{ width: '320px', height: '320px' }}>
        
        {/* Grid Container */}
        <div 
          className="w-full h-full relative"
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
            gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`
          }}
        >
          {/* Render Snake */}
          {snake.map((segment, idx) => {
            const isHead = idx === 0;
            return (
              <div
                key={idx}
                className={`flex items-center justify-center ${isHead ? 'z-10' : 'z-0'}`}
                style={{ gridColumn: segment.x + 1, gridRow: segment.y + 1 }}
              >
                <div className={`w-[90%] h-[90%] rounded-sm ${isHead ? 'bg-brand-plum scale-110' : 'bg-brand-plum/80'}`}></div>
              </div>
            );
          })}

          {/* Render Apple */}
          <div
            className="flex items-center justify-center z-0 animate-pulse"
            style={{ gridColumn: apple.x + 1, gridRow: apple.y + 1 }}
          >
            <span className="text-[14px]">🍎</span>
          </div>
        </div>

        {/* Start / Game Over Overlay */}
        {(!hasStarted || isGameOver) && (
          <div className="absolute inset-0 bg-brand-pinklight/90 backdrop-blur-sm flex flex-col items-center justify-center gap-6 z-20">
            <h2 className={`font-pixel text-4xl animate-bounce drop-shadow-md ${isGameOver ? 'text-red-600' : 'text-brand-plum'}`}>
              {isGameOver ? 'GAME OVER!' : 'SNAKE'}
            </h2>
            <button
              onClick={() => {
                if (isGameOver) resetGame();
                setHasStarted(true);
              }}
              className="retro-btn bg-[#D2E4D6] text-brand-plum w-32 h-12 flex items-center justify-center rounded-sm font-pixel text-lg border-4 border-brand-plum shadow-[4px_4px_0px_rgba(0,0,0,0.2)] active:translate-y-1 active:shadow-[0px_0px_0px_rgba(0,0,0,0.2)] hover:bg-[#b8d4be] transition-all"
            >
              {isGameOver ? 'RETRY' : 'PLAY'}
            </button>
            {isGameOver && (
              <span className="font-pixel text-[10px] text-brand-plum/70 mt-2">Final Score: {score}</span>
            )}
          </div>
        )}
      </div>

      <div className="font-pixel text-[10px] text-brand-plum/60 text-center max-w-[300px]">
        Use <kbd className="bg-brand-cream px-1 border border-brand-plum rounded">WASD</kbd> or Arrow Keys to move. Press <kbd className="bg-brand-cream px-1 border border-brand-plum rounded">Space</kbd> to pause.
      </div>
    </div>
  );
}
