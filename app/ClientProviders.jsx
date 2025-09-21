'use client';

import MusicPlayer from '@/components/MusicPlayer';
import { PlayerProvider, usePlayer } from '@/contexts/PlayerContext';

function GlobalPlayer() {
  const { track, queue, setTrack } = usePlayer();
  if (!track) return null;

  return (

    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur border-t border-slate-200">
      <div className="mx-auto w-full max-w-6xl px-4 py-3">
        <MusicPlayer track={track} queue={queue} onChangeTrack={setTrack} />
      </div>
      {/* Respect iOS safe area */}
      <div className="pb-[env(safe-area-inset-bottom)]" />
    </div>
  );
}

export default function ClientProviders({ children }) {
  return (
    <PlayerProvider>
      {children}
      <GlobalPlayer />
    </PlayerProvider>
  );
}
