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
  const [highScore, setHighScore] = useState(0);
  const [isNewHighScore, setIsNewHighScore] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('tuskee_snake_highscore');
    if (saved) setHighScore(parseInt(saved, 10));
  }, []);

  useEffect(() => {
    if (isGameOver && score > highScore) {
      setHighScore(score);
      localStorage.setItem('tuskee_snake_highscore', score);
      setIsNewHighScore(true);
    }
  }, [isGameOver, score, highScore]);
  
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
    setIsNewHighScore(false);
  };

  const checkCollision = (head, currentSnake) => {
    // Wall collision
    if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
      return true;
    }
    // Self collision
    // Skip the head (index 0) to prevent instant self-collision
    const body = currentSnake.slice(1);
    for (let segment of body) {
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

      if (checkCollision(newHead, prevSnake)) {
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
  }, [isGameOver, hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;
    // Increase speed slightly as score goes up
    const speed = Math.max(50, INITIAL_SPEED - Math.floor(score / 30) * 10);
    const interval = setInterval(moveSnake, speed);
    return () => clearInterval(interval);
  }, [moveSnake, score, hasStarted]);

  return (
    <div className="flex flex-col items-center gap-6 w-full p-4">
      
      {/* Header Bar */}
      <div className="flex justify-between items-center w-full max-w-[320px] bg-[#D2E4D6] p-4 rounded-xl border-2 border-brand-plum/30 shadow-sm mb-2">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <div className="flex flex-col">
              <span className="font-pixel text-[10px] text-brand-plum/70">SCORE</span>
              <span className="font-pixel text-xl sm:text-2xl text-brand-plum leading-none truncate">{score}</span>
            </div>
            <div className="flex flex-col border-l-2 border-brand-plum/20 pl-3">
              <span className="font-pixel text-[10px] text-brand-plum/70">HI-SCORE</span>
              <span className="font-pixel text-xl sm:text-2xl text-brand-plum leading-none truncate">{highScore}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1 text-right">
          <span className="font-pixel text-[10px] text-brand-plum/70">STATUS</span>
          <span className="font-pixel text-sm sm:text-base text-brand-plum uppercase leading-none truncate max-w-[120px]">
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
            <h2 className={`w-full text-center font-pixel text-4xl animate-bounce drop-shadow-md ${isGameOver ? 'text-red-600' : 'text-brand-plum'}`}>
              {isGameOver ? 'GAME OVER!' : 'Snake Game'}
            </h2>
            {isGameOver && (
              <div className="flex flex-col items-center gap-2">
                <span className="font-pixel text-[10px] text-brand-plum/70 mt-2">Final Score: {score}</span>
                {isNewHighScore && (
                  <span className="font-pixel text-sm text-[#e94560] animate-pulse bg-white/80 px-2 py-1 rounded border border-[#e94560]">
                    NEW HIGH SCORE!
                  </span>
                )}
              </div>
            )}
            <button
              onClick={() => {
                if (isGameOver) resetGame();
                setHasStarted(true);
              }}
              className="retro-btn bg-[#D2E4D6] hover:bg-[#a6cca0] text-brand-plum w-32 h-12 flex items-center justify-center rounded-sm font-pixel text-lg border-4 border-brand-plum shadow-[4px_4px_0px_rgba(0,0,0,0.3)] active:translate-y-[4px] active:shadow-none hover:-translate-y-[1px] transition-all"
            >
              {isGameOver ? 'RETRY' : 'PLAY'}
            </button>
          </div>
        )}
      </div>

      <div className="font-pixel text-[10px] text-brand-plum/60 text-center max-w-[300px]">
        Use <kbd className="bg-brand-cream px-1 border border-brand-plum rounded">WASD</kbd> or Arrow Keys to move. Press <kbd className="bg-brand-cream px-1 border border-brand-plum rounded">Space</kbd> to pause.
      </div>
    </div>
  );
}
