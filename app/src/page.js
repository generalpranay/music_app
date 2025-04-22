'use client';

import { useState } from 'react';
import Playlist from './components/Playlist';
import SearchBar from './components/SearchBar';
import MusicList from './components/MusicList';
import MusicPlayer from './components/MusicPlayer';
import AlbumList from './components/AlbumList';
import ArtistList from './components/ArtistList';
import { fetchMusicData } from './api/musicAPI'; 
import Modal from './components/Modal';

export default function Home() {
  const [tracks, setTracks] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [artists, setArtists] = useState([]);
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('tracks');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [favorites, setFavorites] = useState(() => {
    if (typeof window !== 'undefined') {
      return JSON.parse(localStorage.getItem('favorites')) || [];
    }
    return [];
  });
  const [playlists, setPlaylists] = useState(() => {
    if (typeof window !== 'undefined') {
      return JSON.parse(localStorage.getItem('playlists')) || [];
    }
    return [];
  });

  const handleSearch = async (query) => {
    setLoading(true);
    setError(null);

    try {
      const results = await fetchMusicData(query); 
      setTracks(results.tracks);
      setAlbums(results.albums);    
      setArtists(results.artists);  
    } catch (err) {
      setError('Failed to fetch tracks. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleTrackClick = (track) => {
    setSelectedTrack(track);
  };

  const handleAlbumClick = async (album) => {
    console.log('Clicked album:', album);

    const proxy = 'https://cors-anywhere.herokuapp.com/';
    const url = `https://api.deezer.com/album/${album.id}`;

    try {
      const res = await fetch(proxy + url);
      const data = await res.json();

      setModalContent(
        <div>
          <h2 className="font-bold text-xl mb-2">{data.title}</h2>
          <p className="mb-4 text-sm text-gray-600">By {data.artist.name}</p>
          <ul className="space-y-2">
            {data.tracks.data.map((track) => (
              <li
                key={track.id}
                className="text-sm hover:bg-gray-100 p-2 rounded cursor-pointer"
                onClick={() => {
                  setSelectedTrack({
                    id: track.id,
                    title: track.title,
                    preview: track.preview,
                    artist: { name: track.artist.name },
                  });
                  setModalOpen(false);
                }}
              >
                🎵 {track.title} ({Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')})
              </li>
            ))}
          </ul>
        </div>
      );      
      setModalOpen(true);
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };

  const handleArtistClick = async (artist) => {
    const res = await fetch(`/api/artist?id=${artist.id}`);
    const data = await res.json();

    setModalContent(
      <div>
        <h2 className="font-bold text-xl mb-2">{artist.name} – Top 10 Tracks</h2>
        <ul className="space-y-1">
          {data.data.map((track) => (
            <li
              key={track.id}
              onClick={() => setSelectedTrack(track)}
              className="cursor-pointer hover:text-blue-500"
            >
              🎵 {track.title} ({Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')})
            </li>
          ))}
        </ul>
      </div>
    );

    setModalOpen(true);
  };

  const addPlaylist = (newPlaylist) => {
    setPlaylists((prevPlaylists) => {
      const updatedPlaylists = [...prevPlaylists, newPlaylist];
      localStorage.setItem('playlists', JSON.stringify(updatedPlaylists)); // Store in localStorage
      return updatedPlaylists;
    });
  };
  

  return (
    <>
      <main className="p-10 pb-40">
        <h1 className="text-3xl font-bold mb-6">🎶 DucMix</h1>

        <SearchBar onSearch={handleSearch} />

        <div className="flex space-x-4 mb-6">
          {['tracks', 'albums', 'artists', 'favorites','playlists'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded ${
                activeTab === tab
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {error && <div className="text-red-500 mb-4">{error}</div>}
        {loading && <div className="mb-4">Loading...</div>}

        {!loading && activeTab === 'tracks' && (
          <>
            <MusicList
              tracks={tracks}
              onTrackClick={handleTrackClick}
              favorites={favorites}
              setFavorites={setFavorites}
            />
            {!tracks.length && !error && (
              <p className="text-gray-500">No tracks found.</p>
            )}
          </>
        )}

        {!loading && activeTab === 'albums' && (
          <>
            <AlbumList albums={albums} onAlbumClick={handleAlbumClick} />
            {!albums.length && !error && (
              <p className="text-gray-500">No albums found.</p>
            )}
          </>
        )}

        {!loading && activeTab === 'artists' && (
          <>
            <ArtistList artists={artists} onArtistClick={handleArtistClick} />
            {!artists.length && !error && (
              <p className="text-gray-500">No artists found.</p>
            )}
          </>
        )}

        {!loading && activeTab === 'favorites' && (
          <>
            <MusicList
              tracks={favorites}
              onTrackClick={handleTrackClick}
              favorites={favorites}
              setFavorites={setFavorites}
            />
            {!favorites.length && <p className="text-gray-500">No favorites yet.</p>}
          </>
        )}
       {activeTab === 'playlists' && (
  <Playlist
    playlists={playlists}
    setPlaylists={setPlaylists}
    onTrackClick={handleTrackClick} 
  />
)}


        {selectedTrack && (
          <MusicPlayer
            track={selectedTrack}
            favorites={favorites}
            setFavorites={setFavorites}
          />
        )}
      </main>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        {modalContent}
      </Modal>
    </>
  );
}