import React, { useState } from 'react';
import { supabase } from '../utils/supabase';

export default function AuthScreens({ authView, setAuthView, onRegisterSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [forgotPasswordStep, setForgotPasswordStep] = useState(1);
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showRecoveryModal, setShowRecoveryModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Clear errors when switching views
  const switchView = (view) => {
    setError(null);
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setShowPassword(false);
    setShowConfirmPassword(false);
    setForgotPasswordStep(1);
    setResetCode('');
    setNewPassword('');
    setConfirmNewPassword('');
    setShowRecoveryModal(false);
    setShowSuccessModal(false);
    setAuthView(view);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      if (error.message === 'Invalid login credentials') {
        // Attempt to check if the email exists using a custom RPC function
        const { data: exists, error: rpcError } = await supabase.rpc('check_email_exists', { check_email: email });
        
        if (!rpcError && exists !== null) {
          if (exists) {
            setError("incorrect password");
          } else {
            setError("account doesn't exist");
          }
        } else {
          // Fallback if RPC is not set up
          setError(error.message);
        }
      } else {
        setError(error.message);
      }
    }
    setLoading(false);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) {
      setError(error.message);
    } else {
      if (onRegisterSuccess) onRegisterSuccess();
    }
    setLoading(false);
  };

  const handleRequestRecovery = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { data, error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) {
      setError(error.message);
    } else {
      setShowRecoveryModal(true);
    }
    setLoading(false);
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { data, error } = await supabase.auth.verifyOtp({
      email: email,
      token: resetCode,
      type: 'recovery'
    });
    if (error) {
      setError(error.message);
    } else {
      setForgotPasswordStep(3);
    }
    setLoading(false);
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    setError(null);
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword
    });
    if (error) {
      setError(error.message);
    } else {
      setShowSuccessModal(true);
    }
    setLoading(false);
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
            onClick={() => switchView('register')}
            className="retro-btn bg-[#F5D6D8] text-brand-plum py-3 px-6 font-pixel text-[10px] sm:text-xs tracking-wider border-2 border-brand-plum active:translate-y-[1px] transition-transform shadow-sm hover:shadow-inner hover:bg-[#eecbcd] w-full flex-shrink-0"
          >
            [ Register ]
          </button>
          <button 
            onClick={() => switchView('login')}
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
      
      <form onSubmit={handleLogin} className="p-6 flex flex-col gap-4">
        {error && (
          <div className="bg-red-100 text-red-700 border-2 border-red-500 px-3 py-2 text-xs font-medium rounded-md text-center">
            {error}
          </div>
        )}
        <div className="flex flex-col gap-1">
          <label className="font-pixel text-[10px] text-brand-plum uppercase tracking-wider">Email</label>
          <input 
            type="email" 
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-[#FFFDF9] border-2 border-brand-plum focus:border-brand-plum focus:bg-white text-brand-plum px-3 py-2 text-sm font-medium outline-none transition-colors"
            placeholder="Enter email"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="font-pixel text-[10px] text-brand-plum uppercase tracking-wider">Password</label>
          <div className="relative">
            <input 
              type={showPassword ? "text" : "password"} 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#FFFDF9] border-2 border-brand-plum focus:border-brand-plum focus:bg-white text-brand-plum px-3 py-2 pr-10 text-sm font-medium outline-none transition-colors"
              placeholder="Enter password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-brand-plum/50 hover:text-brand-plum px-1 py-1"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                  <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                  <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                  <line x1="2" x2="22" y1="2" y2="22" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>
          <div className="flex flex-col gap-1 mt-1 items-end">
            <button 
              type="button" 
              onClick={() => switchView('forgot_password')} 
              className="text-[9px] text-brand-plum/70 underline font-pixel tracking-wider hover:text-brand-plum transition-colors"
            >
              Forgot Password?
            </button>
          </div>
        </div>

        <div className="flex justify-between items-center mt-4">
          <button 
            type="button"
            onClick={() => switchView('landing')}
            className="font-pixel text-[10px] text-brand-plum/60 hover:text-brand-plum underline decoration-brand-plum/40 hover:decoration-brand-plum transition-colors uppercase tracking-widest"
          >
            [ Back ]
          </button>

          <button 
            type="submit"
            disabled={loading}
            className={`retro-btn bg-brand-cream text-brand-plum py-2 px-6 font-pixel text-xs tracking-wider border-2 border-brand-plum active:translate-y-[1px] transition-transform shadow-sm hover:shadow-inner ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'WAIT...' : 'Sign In'}
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
      
      <form onSubmit={handleRegister} className="p-6 flex flex-col gap-5">
        {error && (
          <div className="bg-red-100 text-red-700 border-2 border-red-500 px-3 py-2 text-xs font-medium rounded-md text-center">
            {error}
          </div>
        )}
        <div className="flex flex-col gap-1">
          <label className="font-pixel text-[10px] text-brand-plum uppercase tracking-wider">Email</label>
          <input 
            type="email" 
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-[#FFFDF9] border-2 border-brand-plum focus:border-brand-plum focus:bg-white text-brand-plum px-3 py-2 text-sm font-medium outline-none transition-colors"
            placeholder="Choose email"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="font-pixel text-[10px] text-brand-plum uppercase tracking-wider">Password</label>
          <div className="relative">
            <input 
              type={showPassword ? "text" : "password"} 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#FFFDF9] border-2 border-brand-plum focus:border-brand-plum focus:bg-white text-brand-plum px-3 py-2 pr-10 text-sm font-medium outline-none transition-colors"
              placeholder="Choose password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-brand-plum/50 hover:text-brand-plum px-1 py-1"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                  <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                  <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                  <line x1="2" x2="22" y1="2" y2="22" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="font-pixel text-[10px] text-brand-plum uppercase tracking-wider">Confirm Password</label>
          <div className="relative">
            <input 
              type={showConfirmPassword ? "text" : "password"} 
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-[#FFFDF9] border-2 border-brand-plum focus:border-brand-plum focus:bg-white text-brand-plum px-3 py-2 pr-10 text-sm font-medium outline-none transition-colors"
              placeholder="Confirm password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-brand-plum/50 hover:text-brand-plum px-1 py-1"
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            >
              {showConfirmPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                  <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                  <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                  <line x1="2" x2="22" y1="2" y2="22" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>
        </div>

        <div className="flex justify-between items-center mt-4">
          <button 
            type="button"
            onClick={() => switchView('landing')}
            className="font-pixel text-[10px] text-brand-plum/60 hover:text-brand-plum underline decoration-brand-plum/40 hover:decoration-brand-plum transition-colors uppercase tracking-widest"
          >
            [ Back ]
          </button>

          <button 
            type="submit"
            disabled={loading}
            className={`retro-btn bg-[#D2E4D6] text-brand-plum py-2 px-4 font-pixel text-[10px] sm:text-xs tracking-wider border-2 border-brand-plum active:translate-y-[1px] transition-transform shadow-sm hover:shadow-inner ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'WAIT...' : 'Create Account'}
          </button>
        </div>
      </form>
    </div>
  );

  const renderForgotPassword = () => (
    <div className="retro-window max-w-sm w-full flex flex-col bg-brand-pinklight/40 border-2 border-brand-plum shadow-2xl relative">
      <div className="bg-brand-gold text-brand-plum border-b-2 border-brand-plum p-2 flex items-center justify-between">
        <span className="font-bold text-[10px] font-pixel tracking-widest uppercase">RECOVERY.SYS</span>
      </div>
      
      <div className="p-6 flex flex-col gap-5">
        {error && (
          <div className="bg-red-100 text-red-700 border-2 border-red-500 px-3 py-2 text-xs font-medium rounded-md text-center">
            {error}
          </div>
        )}

        {forgotPasswordStep === 1 && (
          <form onSubmit={handleRequestRecovery} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="font-pixel text-[10px] text-brand-plum uppercase tracking-wider">Email Address</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#FFFDF9] border-2 border-brand-plum focus:border-brand-plum focus:bg-white text-brand-plum px-3 py-2 text-sm font-medium outline-none transition-colors"
                placeholder="Enter email to recover"
              />
            </div>
            <div className="flex justify-between items-center mt-2">
              <button 
                type="button"
                onClick={() => switchView('login')}
                className="font-pixel text-[10px] text-brand-plum/60 hover:text-brand-plum underline decoration-brand-plum/40 hover:decoration-brand-plum transition-colors uppercase tracking-widest"
              >
                [ Cancel ]
              </button>
              <button 
                type="submit"
                disabled={loading}
                className={`retro-btn bg-brand-cream text-brand-plum py-2 px-4 font-pixel text-[10px] sm:text-xs tracking-wider border-2 border-brand-plum active:translate-y-[1px] transition-transform shadow-sm hover:shadow-inner ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {loading ? 'WAIT...' : 'Send Code'}
              </button>
            </div>
          </form>
        )}

        {forgotPasswordStep === 2 && (
          <form onSubmit={handleVerifyCode} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="font-pixel text-[10px] text-brand-plum uppercase tracking-wider">6-Digit Code</label>
              <input 
                type="text" 
                required
                value={resetCode}
                onChange={(e) => setResetCode(e.target.value)}
                className="w-full bg-[#FFFDF9] border-2 border-brand-plum focus:border-brand-plum focus:bg-white text-brand-plum px-3 py-2 text-sm font-medium outline-none transition-colors text-center tracking-widest"
                placeholder="000000"
                maxLength={6}
              />
            </div>
            <div className="flex justify-between items-center mt-2">
              <button 
                type="button"
                onClick={() => setForgotPasswordStep(1)}
                className="font-pixel text-[10px] text-brand-plum/60 hover:text-brand-plum underline decoration-brand-plum/40 hover:decoration-brand-plum transition-colors uppercase tracking-widest"
              >
                [ Back ]
              </button>
              <button 
                type="submit"
                disabled={loading}
                className={`retro-btn bg-brand-gold text-brand-plum py-2 px-4 font-pixel text-[10px] sm:text-xs tracking-wider border-2 border-brand-plum active:translate-y-[1px] transition-transform shadow-sm hover:shadow-inner ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {loading ? 'WAIT...' : 'Verify'}
              </button>
            </div>
          </form>
        )}

        {forgotPasswordStep === 3 && (
          <form onSubmit={handleUpdatePassword} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="font-pixel text-[10px] text-brand-plum uppercase tracking-wider">New Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-[#FFFDF9] border-2 border-brand-plum focus:border-brand-plum focus:bg-white text-brand-plum px-3 py-2 pr-10 text-sm font-medium outline-none transition-colors"
                  placeholder="New password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-brand-plum/50 hover:text-brand-plum px-1 py-1"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" /><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" /><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" /><line x1="2" x2="22" y1="2" y2="22" /></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>
                  )}
                </button>
              </div>
            </div>
            
            <div className="flex flex-col gap-1">
              <label className="font-pixel text-[10px] text-brand-plum uppercase tracking-wider">Confirm New Password</label>
              <div className="relative">
                <input 
                  type={showConfirmPassword ? "text" : "password"} 
                  required
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  className="w-full bg-[#FFFDF9] border-2 border-brand-plum focus:border-brand-plum focus:bg-white text-brand-plum px-3 py-2 pr-10 text-sm font-medium outline-none transition-colors"
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-brand-plum/50 hover:text-brand-plum px-1 py-1"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" /><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" /><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" /><line x1="2" x2="22" y1="2" y2="22" /></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>
                  )}
                </button>
              </div>
            </div>
            
            <div className="flex justify-between items-center mt-2">
              <button 
                type="button"
                onClick={() => switchView('login')}
                className="font-pixel text-[10px] text-brand-plum/60 hover:text-brand-plum underline decoration-brand-plum/40 hover:decoration-brand-plum transition-colors uppercase tracking-widest"
              >
                [ Cancel ]
              </button>
              <button 
                type="submit"
                disabled={loading}
                className={`retro-btn bg-[#D2E4D6] text-brand-plum py-2 px-4 font-pixel text-[10px] sm:text-xs tracking-wider border-2 border-brand-plum active:translate-y-[1px] transition-transform shadow-sm hover:shadow-inner ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {loading ? 'WAIT...' : 'Update'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-brand-pink select-none relative z-50">
      {/* Dynamic Background Pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-0" 
           style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M54.627 0l.83.83v58.34h-58.34l-.83-.83V0h58.34zM29.585 18.06c-2.316-.2-5.74-.24-8.736.9-2.996 1.14-5.992 4.28-7.04 8.04-1.049 3.76-.749 6.8-.299 8.64.449 1.84 2.546 5.8 7.339 6.4 4.793.6 8.986-1.6 11.233-4.2 2.247-2.6 3.445-6.8 3.595-10.4.15-3.6-1.648-7.2-4.194-8.6-2.546-1.4-4.644-1.1-6.892-1.1z\' fill=\'%233E2312\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")' }} 
      />
      
      <div className="z-10 w-full flex-1 min-h-0 overflow-y-auto overflow-x-hidden flex flex-col items-center justify-center p-6">
        <div className="flex-shrink-0 w-full flex justify-center min-h-[fit-content]">
          {authView === 'landing' && renderLanding()}
          {authView === 'login' && renderLogin()}
          {authView === 'register' && renderRegister()}
          {authView === 'forgot_password' && renderForgotPassword()}
        </div>
      </div>

      {/* Recovery Sent Modal */}
      {showRecoveryModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-brand-plum/20 backdrop-blur-sm p-4">
          <div className="retro-window border-2 border-brand-plum max-w-sm w-full flex flex-col items-center gap-6 text-center shadow-2xl bg-[#FFFBF5]" style={{ padding: '2rem 1.5rem' }}>
            <div className="flex flex-col items-center gap-2">
              <span className="text-5xl drop-shadow-sm">📧</span>
              <h2 className="font-pixel text-brand-plum text-lg leading-tight mt-2">Code Sent!</h2>
              <p className="text-brand-plum/80 font-medium text-sm">Recovery code sent to the email.</p>
            </div>
            <div className="w-full mt-2">
              <button className="w-full retro-btn bg-[#D2E4D6] text-brand-plum py-2.5 font-pixel text-[10px] tracking-wider border-2 border-brand-plum active:translate-y-[1px] transition-transform shadow-sm hover:shadow-inner uppercase"
                onClick={() => {
                  setShowRecoveryModal(false);
                  setForgotPasswordStep(2);
                }}>
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Password Reset Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-brand-plum/20 backdrop-blur-sm p-4">
          <div className="retro-window border-2 border-brand-plum max-w-sm w-full flex flex-col items-center gap-6 text-center shadow-2xl bg-[#FFFBF5]" style={{ padding: '2rem 1.5rem' }}>
            <div className="flex flex-col items-center gap-2">
              <span className="text-5xl drop-shadow-sm">✅</span>
              <h2 className="font-pixel text-brand-plum text-lg leading-tight mt-2">Success!</h2>
              <p className="text-brand-plum/80 font-medium text-sm">Successfully changed password.</p>
            </div>
            <div className="w-full mt-2">
              <button className="w-full retro-btn bg-[#D2E4D6] text-brand-plum py-2.5 font-pixel text-[10px] tracking-wider border-2 border-brand-plum active:translate-y-[1px] transition-transform shadow-sm hover:shadow-inner uppercase"
                onClick={() => switchView('login')}>
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
