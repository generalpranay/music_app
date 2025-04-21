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
  const [showVolume, setShowVolume] = useState(false);

  const isFavorite = favorites.some((fav) => fav.id === track.id);

  const toggleFavorite = () => {
    const updated = isFavorite
      ? favorites.filter((fav) => fav.id !== track.id)
      : [...favorites, track];

    setFavorites(updated);
    localStorage.setItem('favorites', JSON.stringify(updated));
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

  const toggleVolumeSlider = () => {
    setShowVolume((prev) => !prev);
  };

  if (!track?.preview) {
    return (
      <div className="fixed bottom-0 left-0 w-full bg-gray-900 text-white p-4 text-center">
        <p>No preview available for this track.</p>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 w-full bg-gray-900 text-white p-4 flex flex-col gap-2 items-center">
      <div className="text-center">
        <h4 className="font-semibold">{track.title}</h4>
        <p className="text-sm text-gray-400">{track.artist.name}</p>
      </div>
      <div className="flex items-center gap-4">
        <button onClick={skipToStart} className="bg-white p-2 rounded">
          <SkipBack className="w-5 h-5 text-black" />
        </button>
        <button onClick={togglePlay} className="bg-white p-2 rounded">
          {isPlaying ? (
            <Pause className="w-5 h-5 text-black" />
          ) : (
            <Play className="w-5 h-5 text-black" />
          )}
        </button>
        <button onClick={skipToEnd} className="bg-white p-2 rounded">
          <SkipForward className="w-5 h-5 text-black" />
        </button>
      </div>
      <div className="w-full max-w-md flex items-center gap-2 relative">
        <span className="text-sm">{Math.floor(currentTime)}s</span>
        <input
          type="range"
          min="0"
          max={duration}
          value={currentTime}
          onChange={handleSliderChange}
          className="w-full"
        />
        <span className="text-sm">{Math.floor(duration)}s</span>
        <div className="relative flex items-center gap-2">
          <button onClick={toggleVolumeSlider} className="bg-white p-2 rounded ">
            <Volume2 className="w-5 h-5 text-black" />
          </button>
          {showVolume && (
            <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 bg-gray-800 rounded shadow h-28 w-8 flex items-center justify-center">
              <div className="relative w-2 h-24 bg-gray-600 rounded-full overflow-hidden">
                <div
                  className="absolute bottom-0 left-0 w-full bg-blue-500 pointer-events-none"
                  style={{ height: `${volume * 100}%` }}
                ></div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="absolute left-0 top-0 w-full h-full opacity-0 cursor-pointer"
                  style={{ writingMode: 'bt-lr', WebkitAppearance: 'slider-vertical' }}
                />
              </div>
            </div>
          )}
          <button
            onClick={toggleFavorite}
            className={`text-3xl transition ${
              isFavorite ? 'text-yellow-500' : 'text-white/50 hover:text-yellow-400'
            }`}
          >
            {isFavorite ? '★' : '☆'}
          </button>
        </div>
      </div>
    </div>
  );
}
