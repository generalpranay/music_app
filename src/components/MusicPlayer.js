'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import {
  Play, Pause, SkipBack, SkipForward,
  Volume2, VolumeX, Shuffle,
  Repeat, Repeat1, Heart
} from 'lucide-react';

function fmt(t = 0) {
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

/**
 * Props:
 * - track:     current track object (expects .preview, .title, .artist?.name, .album?.cover_medium)
 * - queue:     optional array of tracks (for prev/next/shuffle)
 * - onChangeTrack(track): callback when player picks next/prev/shuffle
 * - favorites, setFavorites: same as you already use elsewhere
 */
export default function MusicPlayer({
  track,
  queue = [],
  onChangeTrack,
  favorites = [],
  setFavorites = () => {},
}) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [dur, setDur] = useState(30);             // Deezer preview is ~30s
  const [pos, setPos] = useState(0);
  const [dragging, setDragging] = useState(false);

  const [vol, setVol] = useState(0.9);
  const [muted, setMuted] = useState(false);

  // repeat: 'off' | 'all' | 'one'
  const [repeat, setRepeat] = useState('off');
  const [shuffle, setShuffle] = useState(false);

  const mountedKey = 'dmx_volume_v1';

  const currentIndex = useMemo(() => {
    if (!queue?.length || !track) return -1;
    return queue.findIndex((t) => String(t.id) === String(track.id));
  }, [queue, track]);

  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex !== -1 && currentIndex < queue.length - 1;

  const isFav = (t) => favorites?.some((f) => String(f.id) === String(t.id));
  const toggleFav = (t) => {
    if (!t) return;
    setFavorites((prev) =>
      isFav(t) ? prev.filter((f) => String(f.id) !== String(t.id)) : [{ ...t }, ...prev]
    );
  };

  // Load initial volume once
  useEffect(() => {
    try {
      const saved = localStorage.getItem(mountedKey);
      if (saved != null) setVol(Number(saved));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(mountedKey, String(vol));
    } catch {}
    if (audioRef.current) {
      audioRef.current.volume = muted ? 0 : vol;
    }
  }, [vol, muted]);

  // When track changes, load and auto play
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    setPos(0);
    setPlaying(false);
    if (!track?.preview) return;

    a.src = track.preview;
    a.load();
    // a.play() will be triggered on metadata (some browsers need a user gesture)
  }, [track?.preview]);

  const onLoaded = () => {
    const a = audioRef.current;
    if (!a) return;
    setDur(a.duration || 30);
    // try to play
    a.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
  };

  const onTimeUpdate = () => {
    if (dragging) return;
    const a = audioRef.current;
    if (!a) return;
    setPos(a.currentTime);
  };

  const togglePlay = () => {
    const a = audioRef.current;
    if (!a) return;
    if (playing) {
      a.pause();
      setPlaying(false);
    } else {
      a.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    }
  };

  const seek = (newPos) => {
    const a = audioRef.current;
    if (!a) return;
    a.currentTime = Math.min(Math.max(0, newPos), dur);
    setPos(a.currentTime);
  };

  const cycleRepeat = () => {
    setRepeat((r) => (r === 'off' ? 'all' : r === 'all' ? 'one' : 'off'));
  };

  const handleEnded = () => {
    if (repeat === 'one') {
      seek(0);
      audioRef.current?.play();
      setPlaying(true);
      return;
    }
    // With a queue
    if (queue?.length && onChangeTrack) {
      if (shuffle) {
        // Pick a random different index
        const pool = queue.filter((t) => String(t.id) !== String(track.id));
        const next = pool[Math.floor(Math.random() * Math.max(pool.length, 1))] || track;
        if (next && next !== track) onChangeTrack(next);
        else if (repeat !== 'off') onChangeTrack(queue[0]);
        return;
      }
      if (hasNext) {
        onChangeTrack(queue[currentIndex + 1]);
      } else if (repeat !== 'off') {
        onChangeTrack(queue[0]);
      }
    } else {
      // No queue → just stop
      setPlaying(false);
      seek(0);
    }
  };

  const goPrev = () => {
    if (!queue?.length || !onChangeTrack) return;
    if (shuffle) {
      const pool = queue.filter((t) => String(t.id) !== String(track.id));
      const prev = pool[Math.floor(Math.random() * Math.max(pool.length, 1))];
      if (prev) onChangeTrack(prev);
      return;
    }
    if (hasPrev) onChangeTrack(queue[currentIndex - 1]);
  };

  const goNext = () => {
    if (!queue?.length || !onChangeTrack) return;
    if (shuffle) {
      const pool = queue.filter((t) => String(t.id) !== String(track.id));
      const nxt = pool[Math.floor(Math.random() * Math.max(pool.length, 1))];
      if (nxt) onChangeTrack(nxt);
      return;
    }
    if (hasNext) onChangeTrack(queue[currentIndex + 1]);
    else if (repeat !== 'off') onChangeTrack(queue[0]);
  };

  if (!track) return null;

  return (
    <div className="mx-auto max-w-6xl px-4">
      <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white/95 px-4 py-3 shadow-lg backdrop-blur">
        {/* Artwork */}
        <div className="relative h-14 w-14 overflow-hidden rounded-xl ring-1 ring-black/10">
          <Image
            src={track.album?.cover_medium || '/placeholder.svg'}
            alt={track.title || 'Artwork'}
            fill
            unoptimized
            className="object-cover"
          />
        </div>

        {/* Title / Artist */}
        <div className="min-w-0">
          <div className="truncate font-semibold text-slate-900">{track.title}</div>
          <div className="truncate text-sm text-slate-600">{track.artist?.name}</div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 ml-auto">
          {/* Shuffle */}
          <button
            className={`rounded-full p-2 ${shuffle ? 'text-blue-600 bg-blue-50' : 'text-slate-700 hover:bg-slate-100'}`}
            title="Shuffle"
            onClick={() => setShuffle((s) => !s)}
          >
            <Shuffle className="h-5 w-5" />
          </button>

          {/* Prev */}
          <button
            className="rounded-full p-2 text-slate-700 hover:bg-slate-100 disabled:opacity-40"
            onClick={goPrev}
            disabled={!queue?.length || (!hasPrev && !shuffle)}
            title="Previous"
          >
            <SkipBack className="h-5 w-5" />
          </button>

          {/* Play / Pause */}
          <button
            className="rounded-full bg-blue-600 p-2 text-white hover:bg-blue-700"
            onClick={togglePlay}
            title={playing ? 'Pause' : 'Play'}
          >
            {playing ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
          </button>

          {/* Next */}
          <button
            className="rounded-full p-2 text-slate-700 hover:bg-slate-100 disabled:opacity-40"
            onClick={goNext}
            disabled={!queue?.length || (!hasNext && repeat === 'off' && !shuffle)}
            title="Next"
          >
            <SkipForward className="h-5 w-5" />
          </button>

          {/* Repeat */}
          <button
            className={`rounded-full p-2 ${repeat !== 'off' ? 'text-blue-600 bg-blue-50' : 'text-slate-700 hover:bg-slate-100'}`}
            onClick={cycleRepeat}
            title={`Repeat: ${repeat}`}
          >
            {repeat === 'one' ? <Repeat1 className="h-5 w-5" /> : <Repeat className="h-5 w-5" />}
          </button>

          {/* Favorite */}
          <button
            className={`rounded-full p-2 ${isFav(track) ? 'text-pink-600 bg-pink-50' : 'text-slate-700 hover:bg-slate-100'}`}
            onClick={() => toggleFav(track)}
            title={isFav(track) ? 'Remove favorite' : 'Add to favorites'}
          >
            <Heart className={`h-5 w-5 ${isFav(track) ? 'fill-pink-500 stroke-pink-600' : ''}`} />
          </button>

          {/* Volume */}
          <button
            className="rounded-full p-2 text-slate-700 hover:bg-slate-100"
            onClick={() => setMuted((m) => !m)}
            title={muted ? 'Unmute' : 'Mute'}
          >
            {muted || vol === 0 ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
          </button>

          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={muted ? 0 : vol}
            onChange={(e) => setVol(Number(e.target.value))}
            className="h-2 w-28 cursor-pointer accent-blue-500"
            aria-label="Volume"
          />
        </div>
      </div>

      {/* Seek bar */}
      <div className="mt-2 flex items-center gap-3 text-xs text-slate-600">
        <span className="tabular-nums">{fmt(pos)}</span>
        <input
          type="range"
          min={0}
          max={dur || 30}
          step={0.1}
          value={pos}
          onMouseDown={() => setDragging(true)}
          onTouchStart={() => setDragging(true)}
          onChange={(e) => setPos(Number(e.target.value))}
          onMouseUp={(e) => { setDragging(false); seek(Number(e.currentTarget.value)); }}
          onTouchEnd={(e) => { setDragging(false); seek(Number(e.currentTarget.value)); }}
          className="h-2 w-full cursor-pointer accent-blue-500"
          aria-label="Seek"
        />
        <span className="tabular-nums">{fmt(dur)}</span>
      </div>

      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        onLoadedMetadata={onLoaded}
        onTimeUpdate={onTimeUpdate}
        onEnded={handleEnded}
        preload="metadata"
      />
    </div>
  );
}
