"use client";
import React, { useState, useEffect } from 'react';
import SearchBar from './components/SerchBar';
import MusicList from './components/MusicList';
import { getSpotifyToken, fetchMusicData } from './api/spotifyApi';

function App() {
  const [token, setToken] = useState('');
  const [musicData, setMusicData] = useState(null);

  useEffect(() => {
    const fetchToken = async () => {
      const accessToken = await getSpotifyToken();
      setToken(accessToken);
    };
    fetchToken();
  }, []);

  const handleSearch = async (query) => {
    if (!token) return;
    const data = await fetchMusicData(token, query);
    setMusicData(data);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>🎵 Music Search App</h1>
      <SearchBar onSearch={handleSearch} />
      {musicData && <MusicList musicData={musicData} />}
    </div>
  );
}

export default App;
