import axios from 'axios';

const CLIENT_ID = 'f3aff07e68d2429e914df9e06efda677';
const CLIENT_SECRET = 'bea3872fe3db4f73b34d37a78141251a';

export const getSpotifyToken = async () => {
  const response = await axios.post(
    'https://accounts.spotify.com/api/token',
    new URLSearchParams({ grant_type: 'client_credentials' }),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: 'Basic ' + btoa(`${CLIENT_ID}:${CLIENT_SECRET}`),
      },
    }
  );
  return response.data.access_token;
};

export const fetchMusicData = async (token, query) => {
  const response = await axios.get(
    `https://api.spotify.com/v1/search?q=${query}&type=track&limit=10`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};
