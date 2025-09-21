'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Play,
  Pause,
  Volume2,
  SkipForward,
  SkipBack
} from 'lucide-react';

export default function MusicPlayer({ track, favorites = [], setFavorites }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(30);
  const [volume, setVolume] = useState(1);

  const isFavorite = favorites.some((fav) => fav.id === track.id);

  const toggleFavorite = () => {
    const updated = isFavorite
      ? favorites.filter((fav) => fav.id !== track.id)
      : [...favorites, track];

    setFavorites(updated);
  };

  useEffect(() => {
    if (!track?.preview) return;

    const audio = new Audio(track.preview);
    audio.volume = volume;
    audioRef.current = audio;

    const playAudio = async () => {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch (err) {
        console.warn('Playback failed:', err.message);
      }
    };

    playAudio();

    const updateTime = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => setDuration(audio.duration || 30);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);

    return () => {
      audio.pause();
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
    };
  }, [track]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true));
    }
  };

  const handleSliderChange = (e) => {
    const newTime = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const skipToStart = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
    }
  };

  const skipToEnd = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = duration;
      setCurrentTime(duration);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
  };

  if (!track?.preview) {
    return (
      <div className="fixed bottom-0 left-0 w-full bg-gray-900 text-white p-4 text-center">
        <p>No preview available for this track.</p>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 w-full bg-gray-900 text-white px-6 py-3 flex items-center justify-between border-t border-gray-800">
      {/* LEFT - Track Info */}
      <div className="flex items-center gap-3 w-1/4">
        <img
          src={track.album.cover_small}
          alt={track.title}
          className="w-12 h-12 rounded-md object-cover"
        />
        <div>
          <h4 className="font-semibold text-sm truncate">{track.title}</h4>
          <p className="text-xs text-gray-400 truncate">{track.artist.name}</p>
        </div>
        <button
          onClick={toggleFavorite}
          className={`ml-2 text-xl ${
            isFavorite ? 'text-green-500' : 'text-gray-400 hover:text-green-400'
          }`}
        >
          {isFavorite ? '♥' : '♡'}
        </button>
      </div>

      {/* CENTER - Controls & Progress */}
      <div className="flex flex-col items-center w-2/4">
        <div className="flex items-center gap-6 mb-1">
          <button onClick={skipToStart} className="hover:scale-110 transition">
            <SkipBack className="w-5 h-5" />
          </button>
          <button
            onClick={togglePlay}
            className="bg-white text-black rounded-full p-2 hover:scale-110 transition"
          >
            {isPlaying ? (
              <Pause className="w-6 h-6" />
            ) : (
              <Play className="w-6 h-6" />
            )}
          </button>
          <button onClick={skipToEnd} className="hover:scale-110 transition">
            <SkipForward className="w-5 h-5" />
          </button>
        </div>
        {/* Progress bar */}
        <div className="flex items-center gap-2 w-full">
          <span className="text-[10px] w-8 text-right">{Math.floor(currentTime)}s</span>
          <input
            type="range"
            min="0"
            max={duration}
            value={currentTime}
            onChange={handleSliderChange}
            className="w-full accent-green-500"
          />
          <span className="text-[10px] w-8">{Math.floor(duration)}s</span>
        </div>
      </div>

      {/* RIGHT - Volume */}
      <div className="flex items-center gap-3 w-1/4 justify-end">
        <Volume2 className="w-5 h-5 text-gray-400" />
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
          className="w-24 accent-green-500"
        />
      </div>
    </div>
  );
}
