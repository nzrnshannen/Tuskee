import React, { useEffect } from 'react';

export default function NotificationModal({ notification, onClose, autoDismiss = true }) {
  useEffect(() => {
    if (notification && autoDismiss) {
      const timer = setTimeout(() => {
        onClose();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [notification, onClose, autoDismiss]);

  if (!notification) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-brand-plum/20 backdrop-blur-sm p-4">
      <div 
        className="retro-window border-2 border-brand-plum max-w-sm w-full flex flex-col items-center gap-4 text-center shadow-2xl animate-bounce-short"
        style={{ paddingTop: '2rem', paddingBottom: '1.5rem', paddingLeft: '1.5rem', paddingRight: '1.5rem', backgroundColor: '#FFFBF5' }}
      >
        <div style={{ marginTop: '0.5rem', marginBottom: '0.5rem' }}>
          <span className="text-5xl leading-none" style={{ display: 'inline-block' }}>{notification.icon || '✨'}</span>
        </div>
        <h2 className="font-pixel text-brand-plum text-sm leading-tight">{notification.title || 'Success'}</h2>
        <p className="text-brand-plum/80 font-medium text-xs whitespace-pre-line">
          {notification.message}
        </p>
        <div className="w-full mt-4 flex gap-4">
          <button 
            className="retro-btn px-4 py-2 w-full text-[10px] font-pixel tracking-wider"
            onClick={onClose}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}
