import React, { useState } from 'react';
import { PixelCatEars } from './PixelIcons';

const CalcButton = ({ label, onClick, variant = 'default', colSpan = 1 }) => {
  let bgClass = 'bg-brand-cream';
  let textClass = 'text-brand-plum';

  if (variant === 'function') {
    bgClass = 'bg-[#DCD2F7]';
  } else if (variant === 'action') {
    bgClass = 'bg-[#F5D6D8]';
    textClass = 'text-red-700';
  } else if (variant === 'equals') {
    bgClass = 'bg-brand-pink';
  }

  return (
    <button
      onClick={onClick}
      className={`retro-btn rounded-lg flex items-center justify-center font-pixel text-xs md:text-sm h-10 active:translate-y-[2px] active:shadow-none transition-all ${bgClass} ${textClass}`}
      style={{ gridColumn: `span ${colSpan}` }}
    >
      {label}
    </button>
  );
};

export default function Calculator() {
  const [mode, setMode] = useState('normal'); // 'normal' | 'scientific'
  const [displayValue, setDisplayValue] = useState('0');

  const handleInput = (val) => {
    if (displayValue === '0' || displayValue === 'Error') {
      setDisplayValue(val);
    } else {
      setDisplayValue(displayValue + val);
    }
  };

  const handleClear = () => {
    setDisplayValue('0');
  };

  const handleBackspace = () => {
    if (displayValue === 'Error') {
      setDisplayValue('0');
      return;
    }
    if (displayValue.length > 1) {
      setDisplayValue(displayValue.slice(0, -1));
    } else {
      setDisplayValue('0');
    }
  };

  const evaluateMath = (expr) => {
    try {
      // Basic sanitization and conversion to JS math functions
      let parsed = expr
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/π/g, 'Math.PI')
        .replace(/√\(/g, 'Math.sqrt(')
        // Convert degrees to radians for trig functions!
        .replace(/sin\(/g, 'Math.sin((Math.PI/180)*')
        .replace(/cos\(/g, 'Math.cos((Math.PI/180)*')
        .replace(/tan\(/g, 'Math.tan((Math.PI/180)*')
        .replace(/log\(/g, 'Math.log10(')
        .replace(/\^/g, '**');

      // Replace % with /100
      parsed = parsed.replace(/%/g, '/100');

      // Add missing closing parentheses
      const openParens = (parsed.match(/\(/g) || []).length;
      const closeParens = (parsed.match(/\)/g) || []).length;
      for (let i = 0; i < openParens - closeParens; i++) {
        parsed += ')';
      }

      // Safe evaluation using Function
      // eslint-disable-next-line no-new-func
      const result = new Function('return ' + parsed)();
      
      if (!isFinite(result) || isNaN(result)) {
        return 'Error';
      }

      // Clean floating point rounding errors (e.g., 0.1 + 0.2)
      return parseFloat(result.toFixed(8)).toString();
    } catch (error) {
      return 'Error';
    }
  };

  const handleEqual = () => {
    setDisplayValue(evaluateMath(displayValue));
  };

  return (
    <div className="retro-window bg-brand-pinklight border-2 border-brand-plum w-full max-w-md mx-auto flex flex-col select-none shadow-xl">
      
      {/* Title Bar */}
      <div className="retro-window-header bg-[#D2E4D6] text-brand-plum border-b-2 border-brand-plum p-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <PixelCatEars />
          <span className="font-bold text-xs font-pixel tracking-widest uppercase">CALCULATOR.EXE</span>
        </div>
      </div>

      <div className="p-6 sm:p-8 flex flex-col gap-4 flex-grow">
        
        {/* Mode Toggle */}
        <div className="flex bg-brand-plum/10 rounded-lg p-1 border-2 border-brand-plum/20">
          <button 
            className={`flex-1 font-pixel text-[10px] py-1 transition-all ${mode === 'normal' ? 'bg-brand-white border-2 border-brand-plum shadow-sm text-brand-plum' : 'text-brand-plum/60 border-2 border-transparent hover:text-brand-plum'}`}
            onClick={() => setMode('normal')}
          >
            [ Normal ]
          </button>
          <button 
            className={`flex-1 font-pixel text-[10px] py-1 transition-all ${mode === 'scientific' ? 'bg-brand-white border-2 border-brand-plum shadow-sm text-brand-plum' : 'text-brand-plum/60 border-2 border-transparent hover:text-brand-plum'}`}
            onClick={() => setMode('scientific')}
          >
            [ Scientific ]
          </button>
        </div>

        {/* Display Screen */}
        <div className="bg-[#d8d8c0] border-4 border-brand-plum shadow-[inset_2px_4px_8px_rgba(0,0,0,0.3)] h-20 rounded p-3 flex flex-col justify-end items-end relative overflow-hidden">
          <div className="absolute top-1 left-2 opacity-30 text-[8px] font-pixel">CASIO-MEOW</div>
          <span className="font-pixel text-3xl text-brand-plum tracking-widest truncate w-full text-right">
            {displayValue}
          </span>
        </div>

        {/* Normal Mode Layout */}
        {mode === 'normal' && (
          <div className="grid grid-cols-4 gap-2 flex-grow mt-2">
            <CalcButton label="C" onClick={handleClear} variant="action" />
            <CalcButton label="DEL" onClick={handleBackspace} variant="action" />
            <CalcButton label="%" onClick={() => handleInput('%')} variant="function" />
            <CalcButton label="÷" onClick={() => handleInput('÷')} variant="function" />

            <CalcButton label="7" onClick={() => handleInput('7')} />
            <CalcButton label="8" onClick={() => handleInput('8')} />
            <CalcButton label="9" onClick={() => handleInput('9')} />
            <CalcButton label="×" onClick={() => handleInput('×')} variant="function" />

            <CalcButton label="4" onClick={() => handleInput('4')} />
            <CalcButton label="5" onClick={() => handleInput('5')} />
            <CalcButton label="6" onClick={() => handleInput('6')} />
            <CalcButton label="-" onClick={() => handleInput('-')} variant="function" />

            <CalcButton label="1" onClick={() => handleInput('1')} />
            <CalcButton label="2" onClick={() => handleInput('2')} />
            <CalcButton label="3" onClick={() => handleInput('3')} />
            <CalcButton label="+" onClick={() => handleInput('+')} variant="function" />

            <CalcButton label="0" onClick={() => handleInput('0')} colSpan={2} />
            <CalcButton label="." onClick={() => handleInput('.')} />
            <CalcButton label="=" onClick={handleEqual} variant="equals" />
          </div>
        )}

        {/* Scientific Mode Layout */}
        {mode === 'scientific' && (
          <div className="flex flex-col gap-4 flex-grow mt-2">
            
            {/* Top Section: Scientific & Utility Functions */}
            <div className="grid grid-cols-4 gap-2 p-3 bg-brand-plum/5 rounded-xl border border-brand-plum/10 shadow-inner">
              <CalcButton label="sin" onClick={() => handleInput('sin(')} variant="function" />
              <CalcButton label="cos" onClick={() => handleInput('cos(')} variant="function" />
              <CalcButton label="tan" onClick={() => handleInput('tan(')} variant="function" />
              <CalcButton label="log" onClick={() => handleInput('log(')} variant="function" />
              
              <CalcButton label="(" onClick={() => handleInput('(')} variant="function" />
              <CalcButton label=")" onClick={() => handleInput(')')} variant="function" />
              <CalcButton label="√" onClick={() => handleInput('√(')} variant="function" />
              <CalcButton label="^" onClick={() => handleInput('^')} variant="function" />
              
              <CalcButton label="π" onClick={() => handleInput('π')} variant="function" />
              <CalcButton label="%" onClick={() => handleInput('%')} variant="function" />
              <CalcButton label="C" onClick={handleClear} variant="action" />
              <CalcButton label="DEL" onClick={handleBackspace} variant="action" />
            </div>

            {/* Bottom Section: Standard Numeric Keypad */}
            <div className="grid grid-cols-4 gap-2">
              <CalcButton label="7" onClick={() => handleInput('7')} />
              <CalcButton label="8" onClick={() => handleInput('8')} />
              <CalcButton label="9" onClick={() => handleInput('9')} />
              <CalcButton label="÷" onClick={() => handleInput('÷')} variant="function" />

              <CalcButton label="4" onClick={() => handleInput('4')} />
              <CalcButton label="5" onClick={() => handleInput('5')} />
              <CalcButton label="6" onClick={() => handleInput('6')} />
              <CalcButton label="×" onClick={() => handleInput('×')} variant="function" />

              <CalcButton label="1" onClick={() => handleInput('1')} />
              <CalcButton label="2" onClick={() => handleInput('2')} />
              <CalcButton label="3" onClick={() => handleInput('3')} />
              <CalcButton label="-" onClick={() => handleInput('-')} variant="function" />

              <CalcButton label="0" onClick={() => handleInput('0')} colSpan={2} />
              <CalcButton label="." onClick={() => handleInput('.')} />
              <CalcButton label="+" onClick={() => handleInput('+')} variant="function" />

              <CalcButton label="=" onClick={handleEqual} variant="equals" colSpan={4} />
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
