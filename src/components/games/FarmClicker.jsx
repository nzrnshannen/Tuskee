import React, { useState, useEffect } from 'react';

const UPGRADES = [
  { id: 'water', name: 'Watering Can', baseCost: 10, clickBonus: 1, autoBonus: 0, icon: '🚿' },
  { id: 'fertilizer', name: 'Fertilizer', baseCost: 50, clickBonus: 0, autoBonus: 1, icon: '✨' },
  { id: 'bees', name: 'Bee Hive', baseCost: 150, clickBonus: 0, autoBonus: 5, icon: '🐝' },
  { id: 'tractor', name: 'Mini Tractor', baseCost: 500, clickBonus: 10, autoBonus: 20, icon: '🚜' }
];

export default function FarmClicker() {
  const [coins, setCoins] = useState(0);
  const [clickPower, setClickPower] = useState(1);
  const [autoPower, setAutoPower] = useState(0);
  const [inventory, setInventory] = useState({
    water: 0,
    fertilizer: 0,
    bees: 0,
    tractor: 0
  });

  const [clickEffect, setClickEffect] = useState(false);

  // Auto-generation loop
  useEffect(() => {
    if (autoPower === 0) return;
    
    const interval = setInterval(() => {
      setCoins(prev => prev + autoPower);
    }, 1000);
    
    return () => clearInterval(interval);
  }, [autoPower]);

  const handleCropClick = () => {
    setCoins(prev => prev + clickPower);
    
    // Trigger tiny animation
    setClickEffect(true);
    setTimeout(() => setClickEffect(false), 100);
  };

  const getCost = (upgradeId, baseCost) => {
    return Math.floor(baseCost * Math.pow(1.15, inventory[upgradeId]));
  };

  const buyUpgrade = (upgrade) => {
    const cost = getCost(upgrade.id, upgrade.baseCost);
    if (coins >= cost) {
      setCoins(prev => prev - cost);
      setInventory(prev => ({ ...prev, [upgrade.id]: prev[upgrade.id] + 1 }));
      setClickPower(prev => prev + upgrade.clickBonus);
      setAutoPower(prev => prev + upgrade.autoBonus);
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full h-full p-2 text-brand-plum">
      
      {/* Header Stats */}
      <div className="flex justify-between items-center bg-[#D2E4D6] p-3 rounded-xl border-2 border-brand-plum/30 shadow-sm w-full">
        <div className="flex items-center gap-2">
          <span className="text-xl">🪙</span>
          <div className="flex flex-col">
            <span className="font-pixel text-[8px] opacity-70">COINS</span>
            <span className="font-pixel text-xl">{Math.floor(coins)}</span>
          </div>
        </div>
        <div className="flex flex-col text-right font-pixel text-[8px] opacity-80 gap-1">
          <span>+{clickPower} PER CLICK</span>
          <span>+{autoPower} PER SEC</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 flex-grow min-h-0">
        
        {/* Clicker Area */}
        <div className="flex-1 bg-[#d8d8c0] border-4 border-brand-plum shadow-[inset_2px_4px_8px_rgba(0,0,0,0.3)] rounded-xl flex flex-col items-center justify-center relative">
          <div className="absolute top-2 left-2 opacity-30 font-pixel text-[8px]">FARM V1.0</div>
          
          <button 
            onClick={handleCropClick}
            className={`text-8xl sm:text-9xl transition-transform active:scale-90 select-none ${clickEffect ? 'scale-105' : 'scale-100 hover:scale-105'}`}
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            🌱
          </button>
          
          {clickEffect && (
            <span className="absolute text-sm font-pixel text-brand-plum animate-float-up pointer-events-none" 
                  style={{ top: '40%', left: '50%', transform: 'translate(-50%, -50%)' }}>
              +{clickPower}
            </span>
          )}
        </div>

        {/* Upgrades Store */}
        <div className="flex-[1.2] bg-brand-cream border-2 border-brand-plum rounded-xl overflow-hidden flex flex-col">
          <div className="bg-brand-plum text-brand-white text-center font-pixel text-[10px] p-2 tracking-widest border-b-2 border-brand-plum uppercase">
            Upgrades Market
          </div>
          <div className="flex-grow overflow-y-auto p-2 flex flex-col gap-2">
            {UPGRADES.map(u => {
              const cost = getCost(u.id, u.baseCost);
              const canAfford = coins >= cost;
              return (
                <button
                  key={u.id}
                  onClick={() => buyUpgrade(u)}
                  disabled={!canAfford}
                  className={`flex items-center gap-3 p-2 rounded-lg border-2 transition-all text-left
                    ${canAfford 
                      ? 'bg-white border-brand-plum hover:bg-[#D2E4D6] active:translate-y-[1px] active:shadow-none shadow-[0_2px_0_rgba(0,0,0,0.2)]' 
                      : 'bg-brand-pinklight/20 border-brand-plum/20 opacity-60 cursor-not-allowed'}`}
                >
                  <span className="text-2xl bg-brand-pinklight p-1 rounded-md border border-brand-plum/10">{u.icon}</span>
                  <div className="flex-grow flex flex-col">
                    <span className="font-pixel text-[10px] text-brand-plum">{u.name}</span>
                    <span className="font-pixel text-[8px] text-brand-plum/70">
                      {u.clickBonus > 0 ? `+${u.clickBonus} Click` : `+${u.autoBonus} Auto`}
                    </span>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={`font-pixel text-[10px] ${canAfford ? 'text-green-700' : 'text-red-600'}`}>
                      {cost} 🪙
                    </span>
                    <span className="font-pixel text-[8px] bg-brand-plum text-brand-white px-1 rounded-sm">
                      LVL {inventory[u.id]}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </div>

    </div>
  );
}
