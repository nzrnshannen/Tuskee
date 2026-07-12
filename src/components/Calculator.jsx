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
    bgClass = 'bg-[#F5D6D8]';
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
  const [normalHistory, setNormalHistory] = useState([]);
  const [scientificHistory, setScientificHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [historyTab, setHistoryTab] = useState('normal'); // 'normal' | 'scientific'
  const [topDisplay, setTopDisplay] = useState('');
  const [justEvaluated, setJustEvaluated] = useState(false);

  const handleInput = (val) => {
    if (justEvaluated) {
      const isOperator = ['+', '-', '×', '÷', '%', '^'].includes(val);
      if (isOperator) {
        setDisplayValue(displayValue + val);
      } else {
        setDisplayValue(val);
      }
      setTopDisplay('');
      setJustEvaluated(false);
    } else {
      if (displayValue === '0' || displayValue === 'Error') {
        setDisplayValue(val);
      } else {
        setDisplayValue(displayValue + val);
      }
    }
  };

  const handleClear = () => {
    setDisplayValue('0');
    setTopDisplay('');
    setJustEvaluated(false);
  };

  const handleBackspace = () => {
    if (justEvaluated) {
      setTopDisplay('');
      setJustEvaluated(false);
    }
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
    if (justEvaluated) return;
    const result = evaluateMath(displayValue);
    
    setTopDisplay(displayValue + ' =');
    
    if (result !== 'Error' && displayValue !== result) {
      if (mode === 'normal') {
        setNormalHistory((prev) => [{ equation: displayValue, result }, ...prev]);
      } else {
        setScientificHistory((prev) => [{ equation: displayValue, result }, ...prev]);
      }
    }
    setDisplayValue(result);
    setJustEvaluated(true);
  };

  const handleHistoryClick = (item) => {
    setDisplayValue(item.result);
    setTopDisplay(item.equation + ' =');
    setJustEvaluated(true);
    setShowHistory(false);
  };

  const clearHistory = () => {
    if (historyTab === 'normal') setNormalHistory([]);
    else setScientificHistory([]);
  };

  return (
    <div className="w-full flex flex-col items-center max-w-md mx-auto h-full relative">
      
      {/* History Toggle Button outside the main window */}
      <div className="w-full flex justify-end mb-2">
        <button 
          onClick={() => setShowHistory(!showHistory)}
          className="retro-btn bg-[#F5D6D8] hover:bg-brand-plum text-brand-plum hover:text-brand-white px-4 py-1 rounded-xl font-pixel text-[10px] uppercase shadow-sm border-2 border-brand-plum transition-all"
        >
          [ History ]
        </button>
      </div>

      <div className="retro-window bg-brand-pinklight border-2 border-brand-plum w-full flex flex-col select-none shadow-xl flex-grow">
        
        {/* Title Bar */}
        <div className="retro-window-header bg-[#D2E4D6] text-brand-plum border-b-2 border-brand-plum p-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PixelCatEars />
            <span className="font-bold text-xs font-pixel tracking-widest uppercase">CALCULATOR.EXE</span>
          </div>
        </div>

        <div className="p-6 sm:p-8 flex flex-col gap-4 flex-grow relative">
          
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
            <div className="absolute top-1 left-2 flex items-center gap-2">
              <span className="opacity-30 text-[8px] font-pixel">CASIO-MEOW</span>
            </div>
            
            {/* Top Line for History */}
            <span className="font-pixel text-[10px] text-brand-plum/50 tracking-widest truncate w-full text-right mb-1 min-h-[14px]">
              {topDisplay}
            </span>

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

      {/* History Drawer Overlay (covers the calculator) */}
      {showHistory && (
        <div className="absolute top-12 left-0 right-0 bottom-0 bg-[#FFFBF5]/95 backdrop-blur-md border-2 border-brand-plum shadow-2xl rounded-xl z-20 flex flex-col overflow-hidden animate-slide-in-right">
          <div className="bg-[#D2E4D6] text-brand-plum text-[10px] font-pixel p-2 text-center uppercase tracking-widest border-b-2 border-brand-plum flex justify-between items-center">
            <span>Calculation History</span>
            <button onClick={() => setShowHistory(false)} className="hover:text-red-500 font-bold px-2">X</button>
          </div>
          
          <div className="flex bg-brand-plum/10 p-1 border-b-2 border-brand-plum/20">
            <button 
              className={`flex-1 font-pixel text-[10px] py-2 transition-all rounded ${historyTab === 'normal' ? 'bg-brand-white border border-brand-plum shadow-sm text-brand-plum' : 'text-brand-plum/60 border border-transparent hover:text-brand-plum'}`}
              onClick={() => setHistoryTab('normal')}
            >
              [ Normal ]
            </button>
            <button 
              className={`flex-1 font-pixel text-[10px] py-2 transition-all rounded ${historyTab === 'scientific' ? 'bg-brand-white border border-brand-plum shadow-sm text-brand-plum' : 'text-brand-plum/60 border border-transparent hover:text-brand-plum'}`}
              onClick={() => setHistoryTab('scientific')}
            >
              [ Scientific ]
            </button>
          </div>

          <div className="flex-grow overflow-y-auto p-2 flex flex-col gap-2">
            {(historyTab === 'normal' ? normalHistory : scientificHistory).length === 0 ? (
              <div className="text-center text-brand-plum/50 text-[10px] font-pixel mt-4">No history yet.</div>
            ) : (
              (historyTab === 'normal' ? normalHistory : scientificHistory).map((item, idx) => (
                <button 
                  key={idx}
                  onClick={() => handleHistoryClick(item)}
                  className="text-right p-3 px-4 hover:bg-brand-plum/10 rounded-lg border border-transparent hover:border-brand-plum/20 transition-all flex flex-col items-end gap-2"
                >
                  <span className="text-[10px] text-brand-plum/60 font-pixel">{item.equation}</span>
                  <span className="text-sm text-brand-plum font-pixel font-bold">= {item.result}</span>
                </button>
              ))
            )}
          </div>
          
          <div className="p-2 border-t-2 border-brand-plum bg-brand-pinklight/50">
            <button 
              onClick={clearHistory}
              className="w-full retro-btn rounded-lg bg-[#F5D6D8] text-red-700 font-pixel text-[10px] py-2 active:translate-y-[2px] transition-transform"
            >
              [ Clear History ]
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
