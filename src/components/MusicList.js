'use client';

import { useState, useEffect } from 'react';
import { Heart, Plus } from 'lucide-react';
import styles from './MusicList.module.css';

export default function MusicList({
  tracks,
  onTrackClick,          // (track) => play this track
  onPause,               // (track) => pause (optional)
  currentTrack,          // currently selected/playing track (optional)
  favorites = [],
  setFavorites,
}) {
  const [showPlaylistFormFor, setShowPlaylistFormFor] = useState(null);
  const [playlists, setPlaylists] = useState({});
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [mounted, setMounted] = useState(false); // hydration guard

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem('playlists');
    if (stored) setPlaylists(JSON.parse(stored));
  }, []);

  const savePlaylists = (updated) => {
    setPlaylists(updated);
    localStorage.setItem('playlists', JSON.stringify(updated));
  };

  const isFav = (track) => favorites?.some((fav) => String(fav.id) === String(track.id));

  const toggleFavorite = (track) => {
    const exists = isFav(track);
    const updated = exists
      ? favorites.filter((fav) => String(fav.id) !== String(track.id))
      : [track, ...favorites];
    setFavorites(updated);
  };

  const addToPlaylist = (track, name) => {
    if (!name) return;
    const list = playlists[name] || [];
    const already = list.some((t) => String(t.id) === String(track.id));
    if (!already) {
      const updated = { ...playlists, [name]: [...list, track] };
      savePlaylists(updated);
    }
    setShowPlaylistFormFor(null);
    setNewPlaylistName('');
  };

  const colors = ['#3498db']; // DucMix accent

  const handleRowActivate = (track) => {
    const isSame =
      currentTrack && String(currentTrack.id) === String(track.id);
    if (isSame && onPause) {
      onPause(track);        // pause if same row clicked again
    } else {
      onTrackClick?.(track); // otherwise play new track
    }
  };

  return (
    <div className="space-y-4">
      {tracks.map((track, index) => {
        const fav = mounted ? isFav(track) : false;
        const isPlaying = currentTrack && String(currentTrack.id) === String(track.id);

        return (
          <div
            key={track.id}
            className={`${styles.trackItem} border p-4 rounded flex items-center gap-4 relative bg-white shadow-sm hover:shadow transition ${isPlaying ? 'ring-2 ring-blue-400' : ''}`}
            style={{ '--hover-color': colors[index % colors.length] }}
            onClick={() => handleRowActivate(track)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') handleRowActivate(track);
            }}
            aria-pressed={!!isPlaying}
          >
            <img
              src={track.album?.cover_medium || '/placeholder.png'}
              alt="Album"
              className="w-16 h-16 rounded object-cover"
            />

            <div className="flex-1 min-w-0">
              <h3 className="text-black font-semibold truncate">{track.title}</h3>
              <p className="text-black truncate">{track.artist?.name}</p>
              <p className="text-sm text-gray-500 truncate">{track.album?.title}</p>
            </div>

            {/* Favorite (Heart) */}
            <button
              type="button"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleFavorite(track); }}
              aria-pressed={fav}
              title={fav ? 'Remove from favorites' : 'Add to favorites'}
              className={`inline-flex h-9 w-9 items-center justify-center rounded-full border transition mr-2 ${
                fav
                  ? 'border-pink-300 bg-pink-50 text-pink-600'
                  : 'border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Heart className={`h-4 w-4 ${fav ? 'fill-pink-500 stroke-pink-600' : ''}`} />
            </button>

            {/* Add to Playlist (Plus) */}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault(); e.stopPropagation();
                setShowPlaylistFormFor((prev) => (prev === track.id ? null : track.id));
                setNewPlaylistName('');
              }}
              title="Add to playlist"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-700 hover:bg-slate-100"
            >
              <Plus className="h-4 w-4" />
            </button>

            {/* Popover */}
            {showPlaylistFormFor === track.id && (
              <div
                className="absolute right-0 top-full mt-2 bg-indigo-100 border border-indigo-300 rounded-xl shadow-xl p-4 z-20 w-64"
                onClick={(e) => e.stopPropagation()}
              >
                <p className="font-semibold text-indigo-800 mb-2">Add to Playlist</p>

                {Object.keys(playlists).length > 0 ? (
                  Object.keys(playlists).map((name) => (
                    <button
                      key={name}
                      type="button"
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); addToPlaylist(track, name); }}
                      className="block w-full text-left py-1 px-3 rounded-lg text-indigo-700 hover:bg-indigo-200 transition"
                    >
                      🎶 {name} <span className="text-xs text-indigo-600">({playlists[name].length})</span>
                    </button>
                  ))
                ) : (
                  <p className="text-sm text-indigo-600">No playlists yet.</p>
                )}

                <hr className="my-3 border-indigo-300" />

                <input
                  value={newPlaylistName}
                  onChange={(e) => setNewPlaylistName(e.target.value)}
                  placeholder="New playlist name"
                  className="w-full border border-indigo-300 focus:ring-2 focus:ring-indigo-400 px-3 py-1.5 rounded-lg text-sm mb-2 outline-none bg-white text-indigo-900"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault(); e.stopPropagation();
                    if (newPlaylistName.trim()) addToPlaylist(track, newPlaylistName.trim());
                  }}
                  className="w-full bg-gradient-to-r from-indigo-500 to-indigo-700 text-white py-1.5 rounded-lg text-sm font-semibold hover:from-indigo-600 hover:to-indigo-800 transition"
                >
                  ➕ Create & Add
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
