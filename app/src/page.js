'use client';

import { useState, useEffect } from 'react';
import SearchBar from './components/SerchBar';
import MusicList from './components/MusicList';
import MusicPlayer from './components/MusicPlayer';
import { getSpotifyToken, fetchMusicData } from './api/spotifyApi';

export default function Home() {
  const [token, setToken] = useState('');
  const [tracks, setTracks] = useState([]);
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch Spotify token when the component loads
  useEffect(() => {
    const loadToken = async () => {
      const accessToken = await getSpotifyToken();
      setToken(accessToken);
    };
    loadToken();
  }, []);

  // Handle search and fetch data from Spotify API
  const handleSearch = async (query) => {
    if (!token) return;
    setLoading(true);
    setError(null);

    try {
      const results = await fetchMusicData(token, query);
      setTracks(results.tracks.items); // Make sure we're getting the items
    } catch (err) {
      setError('Failed to fetch tracks. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Handle track selection
  const handleTrackClick = (track) => {
    setSelectedTrack(track);
  };

  return (
    <main className="p-10 pb-24">
      <h1 className="text-3xl font-bold mb-6">🎶 Spotify Music Search</h1>

      {/* Search bar component */}
      <SearchBar onSearch={handleSearch} />

      {/* Error message if the search fails */}
      {error && <div className="text-red-500 mb-4">{error}</div>}

      {/* Loading state */}
      {loading && <div className="mb-4">Loading...</div>}

      {/* Music list component */}
      <MusicList tracks={tracks} onTrackClick={handleTrackClick} />

      {/* Music player component, only show when a track is selected */}
      {selectedTrack && <MusicPlayer track={selectedTrack} />}
    </main>
  );
}
