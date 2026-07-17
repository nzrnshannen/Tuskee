let audioCtx = null;

const initAudio = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
};

export const playClickSound = () => {
  const savedSoundFx = localStorage.getItem('tuskee_sound_fx');
  if (savedSoundFx === 'false') return;
  
  const savedVolume = localStorage.getItem('tuskee_volume');
  // Default is 50%, so we multiply by (vol / 50) to keep default at 0.4 gain, or better:
  // We can map 0-100 to a scale where 50 is the normal volume.
  // Original gain was 0.4. So volumeMultiplier = (vol / 100) * 2. 
  // If vol=50, mult=1. If vol=100, mult=2.
  const volumeMultiplier = savedVolume ? (parseInt(savedVolume, 10) / 50) : 1;

  try {
    const ctx = initAudio();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    // A very short, sharp high-pitched drop creates a cute "click" / "tick" sound
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1500, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(500, ctx.currentTime + 0.02);
    
    gainNode.gain.setValueAtTime(0.4 * volumeMultiplier, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01 * volumeMultiplier, ctx.currentTime + 0.02);
    
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.02);
  } catch (e) {
    console.error("Audio error", e);
  }
};

export const playAlarmSound = () => {
  const savedSoundFx = localStorage.getItem('tuskee_sound_fx');
  if (savedSoundFx === 'false') return;

  const savedVolume = localStorage.getItem('tuskee_volume');
  const volumeMultiplier = savedVolume ? (parseInt(savedVolume, 10) / 50) : 1;

  try {
    const ctx = initAudio();
    
    // Sequence of 3 notes
    const notes = [800, 1000, 1200];
    const duration = 0.15;
    
    notes.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      const startTime = ctx.currentTime + index * duration;
      
      osc.type = 'triangle';
      osc.frequency.value = freq;
      
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(0.2 * volumeMultiplier, startTime + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.01 * volumeMultiplier, startTime + duration);
      
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      osc.start(startTime);
      osc.stop(startTime + duration);
    });
  } catch (e) {
    console.error("Audio error", e);
  }
};

export const setupGlobalClickSound = () => {
  if (typeof window === 'undefined') return;
  window.addEventListener('click', (e) => {
    // Check if clicked element is a button, a link, or has cursor-pointer
    const clickable = e.target.closest('button, a, .cursor-pointer, .retro-btn');
    if (clickable) {
      playClickSound();
    }
  });
};
