'use client';

import { useEffect, useState } from 'react';

export default function Playlist({ onTrackClick = () => {} }) {
  const [playlists, setPlaylists] = useState({});
  const [currentPlaylist, setCurrentPlaylist] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('playlists');
    if (stored) setPlaylists(JSON.parse(stored));
  }, []);

  const handleCreatePlaylist = () => {
    const name = prompt('Enter playlist name:');
    if (name && !playlists[name]) {
      const updated = { ...playlists, [name]: [] };
      localStorage.setItem('playlists', JSON.stringify(updated));
      setPlaylists(updated);
    }
  };

  const handleRemoveTrack = (playlistName, trackId) => {
    const updated = {
      ...playlists,
      [playlistName]: playlists[playlistName].filter((t) => t.id !== trackId),
    };
    setPlaylists(updated);
    localStorage.setItem('playlists', JSON.stringify(updated));
  };

  return (
    <div>
      {Object.keys(playlists).length === 0 ? (
        <p className="text-gray-500">No playlists available. Create one!</p>
      ) : (
        Object.keys(playlists).map((playlist, index) => (
          <div
            key={index}
            className="border p-4 rounded mb-4 bg-white shadow hover:shadow-md transition"
          >
            <div
              className="cursor-pointer hover:bg-indigo-50 p-2 rounded transition"
              onClick={() =>
                setCurrentPlaylist(currentPlaylist === playlist ? null : playlist)
              }
            >
              <h3 className="font-semibold text-lg text-indigo-700">{playlist}</h3>
              <p className="text-sm text-gray-500">
                {playlists[playlist]?.length || 0} songs
              </p>
            </div>

            {currentPlaylist === playlist && (
              <div className="mt-4">
                <h2 className="text-lg font-semibold mb-2 text-indigo-600">Tracks</h2>
                {Array.isArray(playlists[playlist]) && playlists[playlist].length > 0 ? (
                  <ul className="space-y-2">
                    {playlists[playlist].map((track, index) => (
                      <li
                        key={index}
                        className="flex items-center justify-between bg-indigo-50 p-3 rounded shadow hover:bg-indigo-100 transition cursor-pointer"
                        onClick={() => onTrackClick(track)}
                      >
                        <div className="flex items-center gap-4">
                          <img
                            src={track.album.cover_small || '/placeholder.png'}
                            alt=""
                            className="w-12 h-12 rounded object-cover"
                          />
                          <div>
                            <p className="font-medium text-indigo-800">{track.title}</p>
                            <p className="text-sm text-indigo-600">{track.artist.name}</p>
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveTrack(playlist, track.id);
                          }}
                          className="text-red-500 hover:text-red-700"
                        >
                          ✕
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-600">No tracks in this playlist.</p>
                )}
              </div>
            )}
          </div>
        ))
      )}

      <div className="mt-6">
        <button
          onClick={handleCreatePlaylist}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          ➕ Create Playlist
        </button>
      </div>
    </div>
  );
}