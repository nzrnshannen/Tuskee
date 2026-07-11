import React from 'react';
import { PixelCatEars } from './PixelIcons';

export default function CozyJukebox({ className = "" }) {
  const spotifyEmbedUrl = "https://open.spotify.com/embed/playlist/37i9dQZF1DWWQRwui0ExPn";

  return (
    <div className={`retro-window w-full flex flex-col select-none h-full bg-[#E5D7C5] ${className}`}>
      {/* Title Bar */}
      <div className="retro-window-header bg-[#CBE3F8] text-brand-plum">
        <PixelCatEars />
        <div className="retro-window-title">
          <span>MeowPlayer.mp3 - Player</span>
        </div>
      </div>

      {/* Decorative media status bar */}
      <div className="flex gap-3 px-6 py-1 bg-brand-cream/50 text-[0.65rem] border-b-2 border-brand-plum/10 font-medium shrink-0">
        <span>Play &nbsp; Track &nbsp; Options</span>
      </div>

      {/* Spotify iframe player block */}
      <div className="px-6 pb-6 pt-3 bg-brand-plum/5 flex-grow flex flex-col min-h-0">
        <div className="border-2 border-brand-plum overflow-hidden shadow-inner flex-grow flex flex-col h-full min-h-0">
          <iframe
            src={spotifyEmbedUrl}
            width="100%"
            height="100%"
            className="flex-grow w-full h-full min-h-[152px]"
            frameBorder="0"
            allowFullScreen=""
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            title="Spotify Cozy Lofi Player"
            style={{ border: 'none', display: 'block' }}
          />
        </div>
      </div>
    </div>
  );
}
