export const fetchMusicData = async (query) => {
  const res = await fetch(`/api/deezer?query=${encodeURIComponent(query)}`);
  const data = await res.json();

  return {
    tracks: data.data,
    albums: data.data.map((t) => ({
      ...t.album,
      artist: t.artist, 
    })),    
    artists: data.data.map((t) => t.artist),
  };
};




