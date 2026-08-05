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

let alarmInterval = null;

export const playAlarmSound = () => {
  const savedSoundFx = localStorage.getItem('tuskee_sound_fx');
  if (savedSoundFx === 'false') return;

  const playSequence = () => {
    try {
      const ctx = initAudio();
      const savedVolume = localStorage.getItem('tuskee_volume');
      const volumeMultiplier = savedVolume ? (parseInt(savedVolume, 10) / 50) : 1;
      const ringtoneType = localStorage.getItem('tuskee_alarm_ringtone') || 'Classic';

      if (ringtoneType === 'Digital') {
        [1200, 0, 1200].forEach((freq, index) => {
          if (freq === 0) return; // pause
          const osc = ctx.createOscillator();
          const gainNode = ctx.createGain();
          const startTime = ctx.currentTime + index * 0.15;
          osc.type = 'square';
          osc.frequency.value = freq;
          gainNode.gain.setValueAtTime(0, startTime);
          gainNode.gain.linearRampToValueAtTime(0.1 * volumeMultiplier, startTime + 0.01);
          gainNode.gain.exponentialRampToValueAtTime(0.01 * volumeMultiplier, startTime + 0.1);
          osc.connect(gainNode);
          gainNode.connect(ctx.destination);
          osc.start(startTime);
          osc.stop(startTime + 0.1);
        });
      } else if (ringtoneType === 'Gentle') {
        [440, 554].forEach((freq, index) => {
          const osc = ctx.createOscillator();
          const gainNode = ctx.createGain();
          const startTime = ctx.currentTime + index * 0.5;
          osc.type = 'sine';
          osc.frequency.value = freq;
          gainNode.gain.setValueAtTime(0, startTime);
          gainNode.gain.linearRampToValueAtTime(0.3 * volumeMultiplier, startTime + 0.1);
          gainNode.gain.exponentialRampToValueAtTime(0.01 * volumeMultiplier, startTime + 0.4);
          osc.connect(gainNode);
          gainNode.connect(ctx.destination);
          osc.start(startTime);
          osc.stop(startTime + 0.4);
        });
      } else if (ringtoneType === 'Retro') {
        [400, 600, 800, 1000].forEach((freq, index) => {
          const osc = ctx.createOscillator();
          const gainNode = ctx.createGain();
          const startTime = ctx.currentTime + index * 0.1;
          osc.type = 'sawtooth';
          osc.frequency.value = freq;
          gainNode.gain.setValueAtTime(0, startTime);
          gainNode.gain.linearRampToValueAtTime(0.15 * volumeMultiplier, startTime + 0.01);
          gainNode.gain.exponentialRampToValueAtTime(0.01 * volumeMultiplier, startTime + 0.1);
          osc.connect(gainNode);
          gainNode.connect(ctx.destination);
          osc.start(startTime);
          osc.stop(startTime + 0.1);
        });
      } else {
        // Classic
        [800, 1000, 1200].forEach((freq, index) => {
          const osc = ctx.createOscillator();
          const gainNode = ctx.createGain();
          const startTime = ctx.currentTime + index * 0.15;
          osc.type = 'triangle';
          osc.frequency.value = freq;
          gainNode.gain.setValueAtTime(0, startTime);
          gainNode.gain.linearRampToValueAtTime(0.2 * volumeMultiplier, startTime + 0.02);
          gainNode.gain.exponentialRampToValueAtTime(0.01 * volumeMultiplier, startTime + 0.15);
          osc.connect(gainNode);
          gainNode.connect(ctx.destination);
          osc.start(startTime);
          osc.stop(startTime + 0.15);
        });
      }
    } catch (e) {
      console.error("Audio error", e);
    }
  };

  playSequence();
  if (alarmInterval) clearInterval(alarmInterval);
  alarmInterval = setInterval(playSequence, 1500); // Repeat every 1.5s
};

export const previewAlarmSound = (type) => {
  const savedType = localStorage.getItem('tuskee_alarm_ringtone');
  localStorage.setItem('tuskee_alarm_ringtone', type); // Temporarily set for the play call
  
  if (alarmInterval) {
    clearInterval(alarmInterval);
    alarmInterval = null;
  }
  
  playAlarmSound();
  
  setTimeout(() => {
    stopAlarmSound();
    if (savedType) {
      localStorage.setItem('tuskee_alarm_ringtone', savedType);
    } else {
      localStorage.removeItem('tuskee_alarm_ringtone');
    }
  }, 1000); // Stop the preview after 1 second
};

export const stopAlarmSound = () => {
  if (alarmInterval) {
    clearInterval(alarmInterval);
    alarmInterval = null;
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
