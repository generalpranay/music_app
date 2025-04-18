// src/App.js
import React, { useEffect, useState } from "react";
import { getTokenFromUrl } from "./utils";
import { getAuthUrl } from "./SpotifyAuth";
import Player from "./player";

const App = () => {
  const [token, setToken] = useState("");
  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    const hash = getTokenFromUrl();
    window.location.hash = "";
    const _token = hash.access_token;
    if (_token) setToken(_token);
  }, []);

  useEffect(() => {
    if (!token) return;
    fetch("https://api.spotify.com/v1/search?q=weeknd&type=track", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        const previewable = data.tracks.items.filter((t) => t.preview_url);
        setTracks(previewable.slice(0, 5));
      });
  }, [token]);

  if (!token) {
    return (
      <div className="auth">
        <h2>🎧 Login to Spotify</h2>
        <a href={getAuthUrl()}>Login with Spotify</a>
      </div>
    );
  }

  return (
    <div className="app">
      <h1>🎵 Spotify Preview Player</h1>
      {tracks.map((track) => (
        <div key={track.id} className="track">
          <img src={track.album.images[0]?.url} alt="cover" width="100" />
          <h3>{track.name}</h3>
          <p>{track.artists.map((a) => a.name).join(", ")}</p>
          <Player previewUrl={track.preview_url} />
        </div>
      ))}
    </div>
  );
};

export default App;
