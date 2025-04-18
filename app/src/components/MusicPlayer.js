'use client';

import { useEffect, useRef, useState } from 'react';

export default function MusicPlayer({ track }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    // Reset on new track
    if (track && track.preview_url) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      audioRef.current = new Audio(track.preview_url);
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
      setIsPlaying(true);
      audioRef.current.play();
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [track]);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      setCurrentTime(audioRef.current.currentTime);
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.currentTime = currentTime;
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  if (!track) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full bg-gray-900 text-white p-4 flex items-center justify-between z-50 shadow-lg">
      <div>
        <p className="font-semibold">{track.name}</p>
        <p className="text-sm text-gray-300">{track.artists.map((a) => a.name).join(', ')}</p>
      </div>
      <button
        onClick={togglePlay}
        className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600 transition"
      >
        {isPlaying ? 'Pause' : 'Play'}
      </button>
    </div>
  );
}
