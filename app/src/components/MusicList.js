'use client';

import { useState, useEffect } from 'react';

export default function MusicList({ tracks, onTrackClick, favorites = [], setFavorites }) {
  const [showPlaylistFormFor, setShowPlaylistFormFor] = useState(null);
  const [playlists, setPlaylists] = useState({});
  const [newPlaylistName, setNewPlaylistName] = useState('');

  // Load playlists from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('playlists');
    if (stored) {
      setPlaylists(JSON.parse(stored));
    }
  }, []);

  // Save playlists to localStorage
  const savePlaylists = (updated) => {
    setPlaylists(updated);
    localStorage.setItem('playlists', JSON.stringify(updated));
  };

  // Toggle favorite tracks
  const toggleFavorite = (track) => {
    const isFav = favorites.find((fav) => fav.id === track.id);
    const updated = isFav
      ? favorites.filter((fav) => fav.id !== track.id)
      : [...favorites, track];

    setFavorites(updated);
    localStorage.setItem('favorites', JSON.stringify(updated));
  };

  // Add track to existing or new playlist
  const addToPlaylist = (track, name) => {
    if (!name) return;

    const existingTracks = playlists[name] || [];
    const alreadyInPlaylist = existingTracks.some((t) => t.id === track.id);

    if (!alreadyInPlaylist) {
      const updated = {
        ...playlists,
        [name]: [...existingTracks, track],
      };
      savePlaylists(updated);
    }

    setShowPlaylistFormFor(null);
    setNewPlaylistName('');
  };

  return (
    <div className="space-y-4">
      {tracks.map((track) => (
        <div
          key={track.id}
          className="border p-4 rounded cursor-pointer hover:bg-gray-100 transition flex items-center gap-4 relative"
          onClick={() => onTrackClick(track)}
        >
          <img
            src={track.album.cover_medium || '/placeholder.png'}
            alt="Album"
            className="w-16 h-16 rounded object-cover"
          />
          <div className="flex-1">
            <h3 className="font-semibold">{track.title}</h3>
            <p>{track.artist.name}</p>
            <p className="text-sm text-gray-500">{track.album.title}</p>
          </div>

          {/* Favorite Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(track);
            }}
            className={`text-2xl mr-2 ${
              favorites.find((fav) => fav.id === track.id)
                ? 'text-yellow-500'
                : 'text-black/50 hover:text-yellow-500'
            }`}
          >
            {favorites.find((fav) => fav.id === track.id) ? '★' : '☆'}
          </button>

          {/* Playlist Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowPlaylistFormFor((prev) => (prev === track.id ? null : track.id));
              setNewPlaylistName('');
            }}
            className="text-2xl text-blue-500 hover:text-blue-700"
          >
            ＋
          </button>

          {/* Dropdown */}
          {showPlaylistFormFor === track.id && (
  <div className="absolute right-0 top-full mt-2 bg-indigo-100 border border-indigo-300 rounded-xl shadow-xl p-4 z-20 w-64">
    <p className="font-semibold text-indigo-800 mb-2">Add to Playlist</p>

    {/* Existing playlists */}
    {Object.keys(playlists).length > 0 ? (
      Object.keys(playlists).map((name) => (
        <button
          key={name}
          onClick={(e) => {
            e.stopPropagation();
            addToPlaylist(track, name);
          }}
          className="block w-full text-left py-1 px-3 rounded-lg text-indigo-700 hover:bg-indigo-200 transition"
        >
          🎶 {name}
        </button>
      ))
    ) : (
      <p className="text-sm text-indigo-600">No playlists yet.</p>
    )}

    <hr className="my-3 border-indigo-300" />

    {/* Create new playlist */}
    <input
      value={newPlaylistName}
      onChange={(e) => setNewPlaylistName(e.target.value)}
      placeholder="New playlist name"
      className="w-full border border-indigo-300 focus:ring-2 focus:ring-indigo-400 px-3 py-1.5 rounded-lg text-sm mb-2 outline-none bg-white text-indigo-900"
    />
    <button
      onClick={(e) => {
        e.stopPropagation();
        if (newPlaylistName.trim()) {
          addToPlaylist(track, newPlaylistName.trim());
        }
      }}
      className="w-full bg-gradient-to-r from-indigo-500 to-indigo-700 text-white py-1.5 rounded-lg text-sm font-semibold hover:from-indigo-600 hover:to-indigo-800 transition"
    >
      ➕ Create & Add
    </button>
  </div>
)}

        </div>
      ))}
    </div>
  );
}
