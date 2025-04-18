// page.js (or page.jsx)
"use client"; // if using Next.js App Router
import React, { useEffect, useState, useRef } from "react";

const clientId = "f3aff07e68d2429e914df9e06efda677";
const redirectUri = "http://localhost:3000"; // or your deployed URL
const scopes = ["user-read-private", "user-read-email"];

const getAuthUrl = () => {
  return `https://accounts.spotify.com/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&scope=${encodeURIComponent(scopes.join(" "))}&response_type=token&show_dialog=true`;
};

const getTokenFromUrl = () => {
  return window.location.hash
    .substring(1)
    .split("&")
    .reduce((initial, item) => {
      let parts = item.split("=");
      initial[parts[0]] = decodeURIComponent(parts[1]);
      return initial;
    }, {});
};

const Page = () => {
  const [token, setToken] = useState("");
  const [tracks, setTracks] = useState([]);
  const [currentTrack, setCurrentTrack] = useState(null);
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const hash = getTokenFromUrl();
    window.location.hash = "";
    const _token = hash.access_token;
    if (_token) setToken(_token);
  }, []);

  useEffect(() => {
    if (!token) return;

    fetch("https://api.spotify.com/v1/search?q=weeknd&type=track", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const previewable = data.tracks.items.filter((t) => t.preview_url);
        setTracks(previewable.slice(0, 5));
        setCurrentTrack(previewable[0]);
      });
  }, [token]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    audio.addEventListener("timeupdate", updateTime);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const formatTime = (sec) =>
    `${Math.floor(sec / 60)}:${("0" + Math.floor(sec % 60)).slice(-2)}`;

  if (!token) {
    return (
      <div style={{ padding: "2rem" }}>
        <h2>🎧 Login to Spotify</h2>
        <a href={getAuthUrl()}>Login with Spotify</a>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem", background: "#121212", color: "white" }}>
      <h1>🎵 Spotify Preview Player</h1>

      {currentTrack && (
        <div style={{ marginBottom: "2rem" }}>
          <img
            src={currentTrack.album.images[0]?.url}
            alt="cover"
            width="150"
          />
          <h2>{currentTrack.name}</h2>
          <p>{currentTrack.artists.map((a) => a.name).join(", ")}</p>

          <audio ref={audioRef} src={currentTrack.preview_url} />
          <button onClick={togglePlay}>
            {isPlaying ? "⏸️ Pause" : "▶️ Play"}
          </button>
          <span style={{ marginLeft: "1rem" }}>{formatTime(currentTime)}</span>
        </div>
      )}

      <h3>Tracks</h3>
      <ul>
        {tracks.map((track) => (
          <li
            key={track.id}
            onClick={() => {
              setCurrentTrack(track);
              setIsPlaying(false);
              if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.load();
              }
            }}
            style={{ cursor: "pointer", margin: "0.5rem 0" }}
          >
            🎵 {track.name} – {track.artists[0].name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Page;
