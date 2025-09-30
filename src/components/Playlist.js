'use client';

import { useEffect, useState, useRef } from 'react';

export default function Playlist({ availableTracks = [], onTrackClick = () => {} }) {
  const [playlists, setPlaylists] = useState({});
  const [currentPlaylist, setCurrentPlaylist] = useState(null);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  // Load playlists from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('playlists');
    if (stored) setPlaylists(JSON.parse(stored));
  }, []);

  // Save playlists to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('playlists', JSON.stringify(playlists));
  }, [playlists]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex, currentPlaylist]);

  const handleCreatePlaylist = () => {
    const name = prompt('Enter playlist name:');
    if (name && !playlists[name]) {
      setPlaylists({ ...playlists, [name]: [] });
    } else if (playlists[name]) {
      alert('Playlist already exists!');
    }
  };

  const handleAddTrack = (playlistName, track) => {
    const updated = {
      ...playlists,
      [playlistName]: [...playlists[playlistName], track],
    };
    setPlaylists(updated);
  };

  const handleRemoveTrack = (playlistName, trackId) => {
    const updated = {
      ...playlists,
      [playlistName]: playlists[playlistName].filter((t) => t.id !== trackId),
    };
    setPlaylists(updated);
    if (currentTrackIndex >= updated[playlistName]?.length) setCurrentTrackIndex(0);
  };

  const handleSelectPlaylist = (playlistName) => {
    setCurrentPlaylist(currentPlaylist === playlistName ? null : playlistName);
    setCurrentTrackIndex(0);
    setIsPlaying(false);
  };

  const handlePlayPlaylist = (playlistName) => {
    if (!playlists[playlistName] || playlists[playlistName].length === 0) return;
    setCurrentPlaylist(playlistName);
    setCurrentTrackIndex(0);
    setIsPlaying(true);
  };

  const handleNextTrack = () => {
    if (!currentPlaylist) return;
    const tracks = playlists[currentPlaylist];
    if (currentTrackIndex < tracks.length - 1) {
      setCurrentTrackIndex(currentTrackIndex + 1);
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
      setCurrentTrackIndex(0);
    }
  };

  const handlePrevTrack = () => {
    if (!currentPlaylist) return;
    if (currentTrackIndex > 0) setCurrentTrackIndex(currentTrackIndex - 1);
  };

  const currentTrack =
    currentPlaylist && playlists[currentPlaylist]
      ? playlists[currentPlaylist][currentTrackIndex]
      : null;

  return (
    <div className="p-4 max-w-3xl mx-auto">
      {/* Playlists */}
      {Object.keys(playlists).length === 0 ? (
        <p className="text-gray-500">No playlists available. Create one!</p>
      ) : (
        Object.keys(playlists).map((playlist) => (
          <div
            key={playlist}
            className="border p-4 rounded mb-4 bg-white shadow hover:shadow-md transition"
          >
            <div className="flex justify-between items-center">
              <div
                className="cursor-pointer hover:bg-indigo-50 p-2 rounded transition"
                onClick={() => handleSelectPlaylist(playlist)}
              >
                <h3 className="font-semibold text-lg text-indigo-700">{playlist}</h3>
                <p className="text-sm text-gray-500">
                  {playlists[playlist]?.length || 0} songs
                </p>
              </div>

              <div className="flex gap-2">
                {availableTracks.length > 0 && (
                  <button
                    onClick={() =>
                      handleAddTrack(
                        playlist,
                        availableTracks[Math.floor(Math.random() * availableTracks.length)]
                      )
                    }
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                  >
                    ➕ Add Track
                  </button>
                )}
                <button
                  onClick={() => handlePlayPlaylist(playlist)}
                  className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700"
                >
                  ▶ Play Playlist
                </button>
              </div>
            </div>

            {currentPlaylist === playlist && (
              <div className="mt-4">
                <h2 className="text-lg font-semibold mb-2 text-indigo-600">Tracks</h2>
                {playlists[playlist].length > 0 ? (
                  <ul className="space-y-2">
                    {playlists[playlist].map((track, idx) => (
                      <li
                        key={track.id}
                        className={`flex items-center justify-between bg-indigo-50 p-3 rounded shadow hover:bg-indigo-100 transition cursor-pointer ${
                          currentTrackIndex === idx && isPlaying ? 'bg-indigo-200' : ''
                        }`}
                        onClick={() => {
                          setCurrentTrackIndex(idx);
                          setIsPlaying(true);
                          onTrackClick(track);
                        }}
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

      <div className="mt-6 flex justify-between items-center">
        <button
          onClick={handleCreatePlaylist}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          ➕ Create Playlist
        </button>

        {currentTrack && (
          <div className="flex items-center gap-4 bg-gray-100 p-3 rounded shadow">
            <img
              src={currentTrack.album.cover_small || '/placeholder.png'}
              alt=""
              className="w-12 h-12 rounded object-cover"
            />
            <div>
              <p className="font-semibold text-indigo-700">{currentTrack.title}</p>
              <p className="text-sm text-indigo-600">{currentTrack.artist.name}</p>
            </div>
            <div className="flex gap-2 ml-auto">
              <button
                onClick={handlePrevTrack}
                className="bg-gray-300 px-2 py-1 rounded hover:bg-gray-400"
              >
                ⏮
              </button>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="bg-gray-300 px-2 py-1 rounded hover:bg-gray-400"
              >
                {isPlaying ? '⏸' : '▶'}
              </button>
              <button
                onClick={handleNextTrack}
                className="bg-gray-300 px-2 py-1 rounded hover:bg-gray-400"
              >
                ⏭
              </button>
            </div>
            <audio
              ref={audioRef}
              src={currentTrack.audio || '/sample.mp3'}
              onEnded={handleNextTrack}
            />
          </div>
        )}
      </div>
    </div>
  );
}
