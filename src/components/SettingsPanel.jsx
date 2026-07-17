import React, { useState, useEffect } from 'react';
import { PixelCatEars } from './PixelIcons';
import { useAuth } from '../context/AuthContext';

export default function SettingsPanel({ onBackgroundChange }) {
  const { profile, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('Profile');
  
  // States for Profile
  const [bgPattern, setBgPattern] = useState(profile?.bg_pattern || 'peach');
  
  // States for Security Credentials
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  
  // States for Audio
  const [soundFx, setSoundFx] = useState(true);
  const [volume, setVolume] = useState(50);
  
  // States for Danger Zone
  const [deleteSelection, setDeleteSelection] = useState('All Notes Contents');
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Load initial settings
  useEffect(() => {
    if (profile?.bg_pattern) {
      setBgPattern(profile.bg_pattern);
    } else {
      const savedBgPattern = localStorage.getItem('tuskee_bg_pattern');
      if (savedBgPattern) setBgPattern(savedBgPattern);
    }
    
    const savedSoundFx = localStorage.getItem('tuskee_sound_fx');
    if (savedSoundFx !== null) setSoundFx(savedSoundFx === 'true');
    
    const savedVolume = localStorage.getItem('tuskee_volume');
    if (savedVolume) setVolume(parseInt(savedVolume, 10));
  }, []);

  // Handlers
  const handleBgPatternChange = (patternName) => {
    setBgPattern(patternName);
    localStorage.setItem('tuskee_bg_pattern', patternName);
    if (onBackgroundChange) onBackgroundChange(patternName);
    if (updateProfile) updateProfile({ bg_pattern: patternName });
  };

  const handleUpdatePassword = () => {
    setPasswordError('');
    setPasswordSuccess('');
    
    // In a real app this would be checked securely on the backend.
    const actualPassword = localStorage.getItem('tuskee_password') || 'password'; // Mock default if not set
    
    if (currentPassword !== actualPassword) {
      setPasswordError('Incorrect current password.');
      return;
    }
    if (newPassword === currentPassword) {
      setPasswordError('New password cannot be the same as your current password.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }
    
    // Success
    localStorage.setItem('tuskee_password', newPassword);
    setPasswordSuccess('Password updated successfully!');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    
    // Clear success message after 3 seconds
    setTimeout(() => setPasswordSuccess(''), 3000);
  };

  const handleSoundFxChange = () => {
    const newSoundFx = !soundFx;
    setSoundFx(newSoundFx);
    localStorage.setItem('tuskee_sound_fx', newSoundFx.toString());
  };

  const handleVolumeChange = (e) => {
    const val = e.target.value;
    setVolume(val);
    localStorage.setItem('tuskee_volume', val);
  };

  const handleDeleteConfirm = () => {
    switch (deleteSelection) {
      case 'All Notes Contents':
        localStorage.removeItem('tuskee_records');
        break;
      case 'All Games (High Scores)':
        localStorage.removeItem('tuskee_snake_highscore');
        localStorage.removeItem('tuskee_ttt_stats');
        localStorage.removeItem('tuskee_sudoku_best_times');
        break;
      case 'Calculator History':
        localStorage.removeItem('tuskee_calc_history');
        break;
      case 'All Data (Factory Reset)':
        localStorage.clear();
        // Keep settings that were just cleared but are actively being displayed
        localStorage.setItem('tuskee_bg_pattern', bgPattern);
        localStorage.setItem('tuskee_sound_fx', soundFx.toString());
        localStorage.setItem('tuskee_volume', volume.toString());
        break;
      default:
        break;
    }
    setShowConfirmModal(false);
    // Optionally trigger a page reload to fully reset the app state if it's a factory reset
    if (deleteSelection === 'All Data (Factory Reset)') {
      window.location.reload();
    }
  };

  return (
    <div className="flex-grow flex flex-col p-6 h-full min-h-0 w-full relative">
      <div className="retro-window bg-brand-pinklight border-2 border-brand-plum shadow-xl flex-grow flex flex-col overflow-hidden">
        
        {/* Title Bar */}
        <div className="retro-window-header bg-[#D2E4D6] text-brand-plum border-b-2 border-brand-plum p-2 flex items-center gap-2">
          <PixelCatEars />
          <span className="font-bold text-xs font-pixel tracking-widest uppercase">SETTINGS.EXE</span>
        </div>

        {/* 2-Column Layout */}
        <div className="flex flex-col md:flex-row flex-grow min-h-0">
          
          {/* Left Sidebar */}
          <div className="w-full md:w-48 border-b-2 md:border-b-0 md:border-r-2 border-brand-plum/20 p-4 flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-y-auto shrink-0 bg-brand-white/30">
            {['Profile', 'Theme & Audio', 'Danger Zone'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`font-pixel text-[10px] sm:text-xs py-3 px-4 rounded-lg text-left transition-all whitespace-nowrap md:whitespace-normal border-2 ${
                  activeTab === tab 
                    ? 'bg-brand-cream border-brand-plum shadow-sm text-brand-plum' 
                    : 'bg-transparent border-transparent text-brand-plum/70 hover:bg-brand-white/40 hover:border-brand-plum/30'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Right Content Area */}
          <div className="flex-grow p-6 md:p-8 overflow-y-auto bg-brand-cream/20">
            
            {activeTab === 'Profile' && (
              <div className="flex flex-col gap-8 max-w-md">
                <h3 className="font-pixel text-lg text-brand-plum border-b-2 border-brand-plum/10 pb-2">Personalization</h3>

                <div className="flex flex-col gap-3">
                  <label className="font-pixel text-xs text-brand-plum/80">Background Grid Pattern</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'peach', label: 'Peach', color: '#FADBD8' },
                      { id: 'mint', label: 'Mint', color: '#D2E4D6' },
                      { id: 'cream', label: 'Cream', color: '#FFFBF5' },
                    ].map(pattern => (
                      <button
                        key={pattern.id}
                        onClick={() => handleBgPatternChange(pattern.id)}
                        className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-transform active:translate-y-[2px] ${
                          bgPattern === pattern.id 
                            ? 'border-brand-plum shadow-sm bg-brand-white' 
                            : 'border-brand-plum/20 bg-brand-cream/50 hover:border-brand-plum/50'
                        }`}
                      >
                        <div className="w-8 h-8 rounded-full border-2 border-brand-plum/20 shadow-inner" style={{ backgroundColor: pattern.color }} />
                        <span className="font-pixel text-[10px] text-brand-plum">{pattern.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <hr className="border-brand-plum/10 my-2" />

                <div className="flex flex-col gap-4">
                  <h3 className="font-pixel text-lg text-brand-plum">Security Credentials</h3>
                  
                  {passwordError && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded relative text-xs font-medium">
                      {passwordError}
                    </div>
                  )}
                  {passwordSuccess && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-3 py-2 rounded relative text-xs font-medium">
                      {passwordSuccess}
                    </div>
                  )}

                  <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="font-pixel text-[10px] text-brand-plum/80 uppercase">Current Password</label>
                      <input 
                        type="password" 
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full bg-[#FFFDF9] border-2 border-brand-plum rounded-lg px-4 py-3 text-brand-plum placeholder-brand-plum/40 focus:outline-none focus:ring-2 focus:ring-brand-plum/30 font-medium shadow-inner"
                        placeholder="••••••••"
                      />
                    </div>
                    
                    <div className="flex flex-col gap-1">
                      <label className="font-pixel text-[10px] text-brand-plum/80 uppercase">New Password</label>
                      <input 
                        type="password" 
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full bg-[#FFFDF9] border-2 border-brand-plum rounded-lg px-4 py-3 text-brand-plum placeholder-brand-plum/40 focus:outline-none focus:ring-2 focus:ring-brand-plum/30 font-medium shadow-inner"
                        placeholder="••••••••"
                      />
                    </div>
                    
                    <div className="flex flex-col gap-1">
                      <label className="font-pixel text-[10px] text-brand-plum/80 uppercase">Confirm New Password</label>
                      <input 
                        type="password" 
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full bg-[#FFFDF9] border-2 border-brand-plum rounded-lg px-4 py-3 text-brand-plum placeholder-brand-plum/40 focus:outline-none focus:ring-2 focus:ring-brand-plum/30 font-medium shadow-inner"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                  
                  <button 
                    onClick={handleUpdatePassword}
                    className="retro-btn bg-[#D2E4D6] text-brand-plum py-3 px-6 font-pixel text-[10px] sm:text-xs tracking-wider border-2 border-brand-plum active:translate-y-[1px] transition-transform shadow-sm hover:shadow-inner w-full mt-2"
                  >
                    Update Password
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'Theme & Audio' && (
              <div className="flex flex-col gap-8 max-w-md">
                <h3 className="font-pixel text-lg text-brand-plum border-b-2 border-brand-plum/10 pb-2">Audio Settings</h3>
                
                <div className="flex items-center justify-between bg-brand-cream border-2 border-brand-plum rounded-xl p-4 shadow-sm">
                  <span className="font-pixel text-xs text-brand-plum">UI Sound Effects</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={soundFx} onChange={handleSoundFxChange} />
                    <div className="w-11 h-6 bg-[#E0D7D9] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-brand-white after:border-brand-plum/20 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D2E4D6] border-2 border-brand-plum/50 shadow-inner"></div>
                  </label>
                </div>

                <div className="flex flex-col gap-4 bg-brand-cream border-2 border-brand-plum rounded-xl p-4 shadow-sm">
                  <div className="flex justify-between items-center">
                    <label className="font-pixel text-xs text-brand-plum">Master Volume</label>
                    <span className="font-pixel text-[10px] text-brand-plum/70">{volume}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={volume}
                    onChange={handleVolumeChange}
                    className="w-full h-3 bg-[#E0D7D9] rounded-lg appearance-none cursor-pointer border-2 border-brand-plum/30 accent-brand-plum"
                  />
                </div>
              </div>
            )}

            {activeTab === 'Danger Zone' && (
              <div className="flex flex-col gap-6 max-w-md">
                <div className="border-b-2 border-red-200 pb-2 flex items-center gap-2">
                  <span className="text-xl">⚠️</span>
                  <h3 className="font-pixel text-lg text-red-600">Danger Zone</h3>
                </div>
                
                <div className="bg-[#FFF5F5] border-2 border-red-300 rounded-xl p-5 shadow-sm flex flex-col gap-5">
                  <div className="flex flex-col gap-2">
                    <label className="font-pixel text-xs text-red-800">Data Management</label>
                    <p className="text-xs font-medium text-red-600/70 mb-1">Select data to permanently erase.</p>
                    <select 
                      value={deleteSelection}
                      onChange={(e) => setDeleteSelection(e.target.value)}
                      className="w-full bg-brand-white border-2 border-red-300 rounded-lg px-3 py-2 text-red-900 focus:outline-none focus:border-red-500 font-medium shadow-inner appearance-none cursor-pointer"
                    >
                      <option>All Notes Contents</option>
                      <option>All Games (High Scores)</option>
                      <option>Calculator History</option>
                      <option>All Data (Factory Reset)</option>
                    </select>
                  </div>

                  <button 
                    onClick={() => setShowConfirmModal(true)}
                    className="retro-btn bg-[#FFD1D1] text-red-700 border-2 border-red-500 py-3 rounded-lg font-pixel text-xs hover:bg-red-500 hover:text-white transition-colors uppercase tracking-wider"
                  >
                    Delete Selected Data
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Danger Zone Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-plum/20 backdrop-blur-sm p-4">
          <div 
            className="retro-window border-4 border-red-500 max-w-sm w-full flex flex-col items-center gap-5 text-center shadow-[0_10px_25px_rgba(220,38,38,0.3)] animate-bounce-short bg-[#FFFBF5]"
            style={{ padding: '2rem 1.5rem' }}
          >
            <div className="flex flex-col items-center gap-2">
              <span className="text-5xl drop-shadow-sm">🛑</span>
              <h2 className="font-pixel text-red-600 text-lg leading-tight mt-2">Are you sure?</h2>
              <p className="text-brand-plum/80 font-medium text-sm px-2">
                This action cannot be undone. You are about to delete <strong>{deleteSelection}</strong>.
              </p>
            </div>
            
            <div className="w-full flex gap-3 mt-4">
              <button 
                className="flex-1 bg-brand-cream/50 text-brand-plum/70 border-2 border-brand-plum/30 py-2.5 font-pixel text-[10px] tracking-wider rounded-lg hover:bg-brand-cream hover:text-brand-plum hover:border-brand-plum transition-all active:translate-y-[1px]"
                onClick={() => setShowConfirmModal(false)}
              >
                CANCEL
              </button>
              <button 
                className="flex-1 bg-red-500 text-white border-2 border-red-700 py-2.5 font-pixel text-[10px] tracking-wider rounded-lg hover:bg-red-600 transition-all active:translate-y-[1px] shadow-sm hover:shadow-inner"
                onClick={handleDeleteConfirm}
              >
                YES, DELETE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
