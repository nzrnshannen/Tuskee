import React from 'react';

export default function AuthScreens({ authView, setAuthView }) {
  
  const handleDirectLogin = (e) => {
    e.preventDefault();
    setAuthView('dashboard');
  };

  const renderLanding = () => (
    <div className="retro-window max-w-[680px] w-full flex flex-col sm:flex-row p-0 bg-[#F5D6D8]/20 border-2 border-brand-plum shadow-2xl relative overflow-hidden">
      {/* Absolute dots for style */}
      <div className="absolute top-2 left-2 flex gap-1 opacity-50 z-10">
        <div className="w-2 h-2 rounded-full bg-brand-plum"></div>
        <div className="w-2 h-2 rounded-full bg-brand-plum"></div>
      </div>
      
      {/* Left Side: Mascot / Graphic (Takes up ~45%) */}
      <div className="flex-1 flex justify-center items-center p-8 bg-brand-white/40 border-b-2 sm:border-b-0 sm:border-r-2 border-brand-plum/20 relative">
        <div className="relative">
          <span className="text-[6rem] sm:text-[8rem] drop-shadow-xl inline-block leading-none select-none">🖥️</span>
          <span className="absolute -top-2 -right-4 text-3xl sm:text-4xl animate-pulse cursor-default">✨</span>
          <span className="absolute -bottom-2 -left-4 text-3xl sm:text-4xl cursor-default drop-shadow-md">🌸</span>
        </div>
      </div>

      {/* Right Side: Content Area (Takes up ~55%) */}
      <div className="flex-[1.2] flex flex-col justify-center items-center pt-20 pb-4 px-4 sm:px-6 w-full bg-[#FFFDF9]/60">
        
        {/* Title Group */}
        <div className="flex flex-col items-center w-full flex-shrink-0 text-center">
          <h1 className="font-pixel text-4xl sm:text-5xl text-brand-plum drop-shadow-[2px_3px_0_rgba(62,35,18,0.15)] tracking-widest leading-none inline-block">
            TUSKEE
          </h1>
          
          {/* Subtle Tagline */}
          <div className="mt-8 px-6 py-4 bg-brand-plum/5 border border-brand-plum/10 rounded-full w-full max-w-[280px] min-h-[60px] flex items-center justify-center flex-shrink-0">
            <p className="text-brand-plum/90 font-pixel text-[9px] sm:text-[10px] tracking-widest uppercase leading-[1.8] text-center">
              ~ Cultivate your daily focus ~
            </p>
          </div>
        </div>

        {/* Unignorable Physical Spacer */}
        <div className="h-10 w-full flex-shrink-0"></div>

        {/* Buttons Group */}
        <div className="flex flex-col items-center gap-4 w-full max-w-[220px] flex-shrink-0">
          <button 
            onClick={() => setAuthView('register')}
            className="retro-btn bg-[#F5D6D8] text-brand-plum py-3 px-6 font-pixel text-[10px] sm:text-xs tracking-wider border-2 border-brand-plum active:translate-y-[1px] transition-transform shadow-sm hover:shadow-inner hover:bg-[#eecbcd] w-full flex-shrink-0"
          >
            [ Register ]
          </button>
          <button 
            onClick={() => setAuthView('login')}
            className="retro-btn bg-brand-cream text-brand-plum py-3 px-6 font-pixel text-[10px] sm:text-xs tracking-wider border-2 border-brand-plum active:translate-y-[1px] transition-transform shadow-sm hover:shadow-inner w-full flex-shrink-0"
          >
            [ Log In ]
          </button>
        </div>

        {/* Bottom Spacer to protect border */}
        <div className="h-4 w-full flex-shrink-0"></div>
      </div>
    </div>
  );

  const renderLogin = () => (
    <div className="retro-window max-w-sm w-full flex flex-col bg-brand-pinklight/40 border-2 border-brand-plum shadow-2xl relative">
      <div className="bg-[#D2E4D6] text-brand-plum border-b-2 border-brand-plum p-2 flex items-center justify-between">
        <span className="font-bold text-[10px] font-pixel tracking-widest uppercase">LOGIN.EXE</span>
      </div>
      
      <form onSubmit={handleDirectLogin} className="p-6 flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label className="font-pixel text-[10px] text-brand-plum uppercase tracking-wider">Username</label>
          <input 
            type="text" 
            required
            className="w-full bg-[#FFFDF9] border-2 border-brand-plum focus:border-brand-plum focus:bg-white text-brand-plum px-3 py-2 text-sm font-medium outline-none transition-colors"
            placeholder="Enter username"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="font-pixel text-[10px] text-brand-plum uppercase tracking-wider">Password</label>
          <input 
            type="password" 
            required
            className="w-full bg-[#FFFDF9] border-2 border-brand-plum focus:border-brand-plum focus:bg-white text-brand-plum px-3 py-2 text-sm font-medium outline-none transition-colors"
            placeholder="Enter password"
          />
        </div>

        <div className="flex justify-between items-center mt-4">
          <button 
            type="button"
            onClick={() => setAuthView('landing')}
            className="font-pixel text-[10px] text-brand-plum/60 hover:text-brand-plum underline decoration-brand-plum/40 hover:decoration-brand-plum transition-colors uppercase tracking-widest"
          >
            [ Back ]
          </button>

          <button 
            type="submit"
            className="retro-btn bg-brand-cream text-brand-plum py-2 px-6 font-pixel text-xs tracking-wider border-2 border-brand-plum active:translate-y-[1px] transition-transform shadow-sm hover:shadow-inner"
          >
            Sign In
          </button>
        </div>
      </form>
    </div>
  );

  const renderRegister = () => (
    <div className="retro-window max-w-sm w-full flex flex-col bg-brand-pinklight/40 border-2 border-brand-plum shadow-2xl relative">
      <div className="bg-[#F5D6D8] text-brand-plum border-b-2 border-brand-plum p-2 flex items-center justify-between">
        <span className="font-bold text-[10px] font-pixel tracking-widest uppercase">SIGNUP.SYS</span>
      </div>
      
      <form onSubmit={handleDirectLogin} className="p-6 flex flex-col gap-5">
        <div className="flex flex-col gap-1">
          <label className="font-pixel text-[10px] text-brand-plum uppercase tracking-wider">Username</label>
          <input 
            type="text" 
            required
            className="w-full bg-[#FFFDF9] border-2 border-brand-plum focus:border-brand-plum focus:bg-white text-brand-plum px-3 py-2 text-sm font-medium outline-none transition-colors"
            placeholder="Choose username"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="font-pixel text-[10px] text-brand-plum uppercase tracking-wider">Password</label>
          <input 
            type="password" 
            required
            className="w-full bg-[#FFFDF9] border-2 border-brand-plum focus:border-brand-plum focus:bg-white text-brand-plum px-3 py-2 text-sm font-medium outline-none transition-colors"
            placeholder="Choose password"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="font-pixel text-[10px] text-brand-plum uppercase tracking-wider">Confirm Password</label>
          <input 
            type="password" 
            required
            className="w-full bg-[#FFFDF9] border-2 border-brand-plum focus:border-brand-plum focus:bg-white text-brand-plum px-3 py-2 text-sm font-medium outline-none transition-colors"
            placeholder="Confirm password"
          />
        </div>

        <div className="flex justify-between items-center mt-4">
          <button 
            type="button"
            onClick={() => setAuthView('landing')}
            className="font-pixel text-[10px] text-brand-plum/60 hover:text-brand-plum underline decoration-brand-plum/40 hover:decoration-brand-plum transition-colors uppercase tracking-widest"
          >
            [ Back ]
          </button>

          <button 
            type="submit"
            className="retro-btn bg-[#D2E4D6] text-brand-plum py-2 px-4 font-pixel text-[10px] sm:text-xs tracking-wider border-2 border-brand-plum active:translate-y-[1px] transition-transform shadow-sm hover:shadow-inner"
          >
            Create Account
          </button>
        </div>
      </form>
    </div>
  );

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col items-center justify-center p-6 bg-brand-pink select-none relative z-50">
      {/* Dynamic Background Pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-0" 
           style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M54.627 0l.83.83v58.34h-58.34l-.83-.83V0h58.34zM29.585 18.06c-2.316-.2-5.74-.24-8.736.9-2.996 1.14-5.992 4.28-7.04 8.04-1.049 3.76-.749 6.8-.299 8.64.449 1.84 2.546 5.8 7.339 6.4 4.793.6 8.986-1.6 11.233-4.2 2.247-2.6 3.445-6.8 3.595-10.4.15-3.6-1.648-7.2-4.194-8.6-2.546-1.4-4.644-1.1-6.892-1.1z\' fill=\'%233E2312\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")' }} 
      />
      
      <div className="z-10 w-full flex justify-center">
        {authView === 'landing' && renderLanding()}
        {authView === 'login' && renderLogin()}
        {authView === 'register' && renderRegister()}
      </div>
    </div>
  );
}
