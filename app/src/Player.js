// src/Player.js
import React, { useRef, useState, useEffect } from "react";

const Player = ({ previewUrl }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);

    audio.addEventListener("timeupdate", updateTime);
    return () => audio.removeEventListener("timeupdate", updateTime);
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const formatTime = (sec) =>
    `${Math.floor(sec / 60)}:${("0" + Math.floor(sec % 60)).slice(-2)}`;

  return (
    <div className="player">
      <audio ref={audioRef} src={previewUrl} />
      <button onClick={togglePlay}>{isPlaying ? "⏸️" : "▶️"}</button>
      <span>{formatTime(currentTime)}</span>
    </div>
  );
};

export default Player;
