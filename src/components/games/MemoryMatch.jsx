import React, { useState, useEffect } from 'react';

const ICONS = ['🌱', '🌸', '🍓', '🍄', '🐱', '🦋', '⭐', '🌙'];

export default function MemoryMatch() {
  const [cards, setCards] = useState([]);
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [moves, setMoves] = useState(0);
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    const deck = [...ICONS, ...ICONS]
      .sort(() => Math.random() - 0.5)
      .map((icon, index) => ({ id: index, icon, isFlipped: false, isMatched: false }));
    
    setCards(deck);
    setFlippedIndices([]);
    setMatchedPairs(0);
    setMoves(0);
    setIsLocked(false);
  };

  const handleCardClick = (index) => {
    if (isLocked || cards[index].isFlipped || cards[index].isMatched) return;

    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setIsLocked(true);
      setMoves(m => m + 1);

      const [firstIndex, secondIndex] = newFlipped;
      if (newCards[firstIndex].icon === newCards[secondIndex].icon) {
        // Match!
        newCards[firstIndex].isMatched = true;
        newCards[secondIndex].isMatched = true;
        setCards(newCards);
        setMatchedPairs(p => p + 1);
        setFlippedIndices([]);
        setIsLocked(false);
      } else {
        // No match, flip back after delay
        setTimeout(() => {
          const resetCards = [...cards];
          resetCards[firstIndex].isFlipped = false;
          resetCards[secondIndex].isFlipped = false;
          setCards(resetCards);
          setFlippedIndices([]);
          setIsLocked(false);
        }, 1000);
      }
    }
  };

  const isWon = matchedPairs === ICONS.length;

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-sm">
      
      {/* Header Bar */}
      <div className="flex justify-between items-center w-full bg-[#D2E4D6] p-3 rounded-xl border-2 border-brand-plum/30 shadow-sm">
        <div className="flex flex-col">
          <span className="font-pixel text-[8px] text-brand-plum/70">MOVES</span>
          <span className="font-pixel text-xl text-brand-plum">{moves}</span>
        </div>
        <button
          onClick={initializeGame}
          className="retro-btn bg-[#F5D6D8] text-brand-plum px-3 py-1 rounded font-pixel text-[8px] uppercase border border-brand-plum active:translate-y-[1px] transition-all"
        >
          Restart
        </button>
      </div>

      {/* Game Board */}
      <div className="bg-[#d8d8c0] border-4 border-brand-plum shadow-[inset_2px_4px_8px_rgba(0,0,0,0.3)] p-3 rounded-xl relative w-full">
        <div className="grid grid-cols-4 gap-2 sm:gap-3">
          {cards.map((card, idx) => (
            <button
              key={card.id}
              onClick={() => handleCardClick(idx)}
              className={`aspect-square rounded-lg border-2 border-brand-plum font-pixel text-2xl sm:text-3xl flex items-center justify-center transition-all duration-300 transform preserve-3d
                ${card.isFlipped || card.isMatched 
                  ? 'bg-[#FFFBF5] shadow-inner rotate-y-180' 
                  : 'bg-brand-plum shadow-[0_4px_0_rgba(0,0,0,0.2)] hover:-translate-y-1 active:translate-y-1 active:shadow-none'}`}
            >
              <div className="relative w-full h-full flex items-center justify-center">
                {card.isFlipped || card.isMatched ? (
                  <span className="animate-pop-in">{card.icon}</span>
                ) : (
                  <span className="text-brand-pinklight/40 text-xs">?</span>
                )}
              </div>
            </button>
          ))}
        </div>

        {isWon && (
          <div className="absolute inset-0 bg-brand-pinklight/80 backdrop-blur-sm flex flex-col items-center justify-center gap-4 z-20 rounded-lg">
            <h2 className="font-pixel text-2xl text-brand-plum animate-bounce">YOU WIN!</h2>
            <p className="font-pixel text-[10px] text-brand-plum">Completed in {moves} moves!</p>
          </div>
        )}
      </div>

    </div>
  );
}
