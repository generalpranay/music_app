// src/SpotifyAuth.js
export const authEndpoint = "https://accounts.spotify.com/authorize";

const clientId = "f3aff07e68d2429e914df9e06efda677";
const redirectUri = "http://localhost:3000";
const scopes = ["user-read-private", "user-read-email"];

export const getAuthUrl = () => {
  return `${authEndpoint}?client_id=${clientId}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&scope=${encodeURIComponent(scopes.join(" "))}&response_type=token&show_dialog=true`;
};
