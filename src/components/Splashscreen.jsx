import React, { useEffect, useState } from 'react';

export default function Splashscreen() {
  const [fading, setFading] = useState(false);

  useEffect(() => {
    // Start fading out slightly before the parent unmounts (e.g. at 2.5s out of 2.8s)
    const timer = setTimeout(() => {
      setFading(true);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden bg-[#FDF6EB] transition-opacity duration-300 ease-in-out ${fading ? 'opacity-0' : 'opacity-100'}`}>
      
      {/* Background Pattern matches App.jsx */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-[-1]" 
           style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M54.627 0l.83.83v58.34h-58.34l-.83-.83V0h58.34zM29.585 18.06c-2.316-.2-5.74-.24-8.736.9-2.996 1.14-5.992 4.28-7.04 8.04-1.049 3.76-.749 6.8-.299 8.64.449 1.84 2.546 5.8 7.339 6.4 4.793.6 8.986-1.6 11.233-4.2 2.247-2.6 3.445-6.8 3.595-10.4.15-3.6-1.648-7.2-4.194-8.6-2.546-1.4-4.644-1.1-6.892-1.1z\' fill=\'%233E2312\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")' }} 
      />

      <div className="flex flex-col items-center justify-center">
        {/* Cute animated cat graphic */}
        <div className="relative">
          <span className="text-[6rem] sm:text-[8rem] drop-shadow-xl inline-block leading-none select-none animate-bounce" style={{ animationDuration: '2s' }}>
            🐱
          </span>
          <span className="absolute -top-4 -right-4 text-3xl sm:text-4xl animate-pulse cursor-default">✨</span>
          <span className="absolute -bottom-2 -left-6 text-3xl sm:text-4xl cursor-default drop-shadow-md">🌸</span>
        </div>
        
        <h1 className="mt-10 font-pixel text-4xl sm:text-5xl text-brand-plum drop-shadow-[2px_3px_0_rgba(62,35,18,0.15)] tracking-widest leading-none">
          TUSKEE
        </h1>
        
        <div className="mt-8 px-6 py-3 bg-brand-plum/5 border border-brand-plum/10 rounded-full flex items-center justify-center">
          <p className="text-brand-plum/90 font-pixel text-[10px] tracking-widest uppercase animate-pulse">
            Loading...
          </p>
        </div>
      </div>
    </div>
  );
}
