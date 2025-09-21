'use client';
import { createContext, useContext, useState } from 'react';

const PlayerCtx = createContext(null);

export function PlayerProvider({ children }) {
  const [track, setTrack] = useState(null);
  const [queue, setQueue] = useState([]);

  // call this to start playback from any page/component
  const play = (t, q = []) => {
    setQueue(Array.isArray(q) ? q : []);
    setTrack(t || null);
  };

  return (
    <PlayerCtx.Provider value={{ track, queue, play, setTrack, setQueue }}>
      {children}
    </PlayerCtx.Provider>
  );
}

export const usePlayer = () => {
  const ctx = useContext(PlayerCtx);
  if (!ctx) throw new Error('usePlayer must be used inside <PlayerProvider>');
  return ctx;
};
