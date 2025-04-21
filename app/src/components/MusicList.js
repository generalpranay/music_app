'use client';

export default function MusicList({ tracks, onTrackClick, favorites = [], setFavorites }) {
  const toggleFavorite = (track) => {
    const isFav = favorites.find((fav) => fav.id === track.id);
    if (isFav) {
      const updated = favorites.filter((fav) => fav.id !== track.id);
      setFavorites(updated);
      localStorage.setItem('favorites', JSON.stringify(updated));
    } else {
      const updated = [...favorites, track];
      setFavorites(updated);
      localStorage.setItem('favorites', JSON.stringify(updated));
    }
  };

  const isFavorite = (id) => favorites.some((fav) => fav.id === id);

  return (
    <div className="space-y-4">
      {tracks.map((track) => (
        <div
          key={track.id}
          className="border p-4 rounded cursor-pointer hover:bg-gray-100 transition flex items-center gap-4"
          onClick={() => onTrackClick(track)}
        >
          <img
            src={track.album.cover_medium || '/placeholder.png'}
            alt="Album Art"
            className="w-16 h-16 rounded object-cover"
          />
          <div className="flex-1">
            <h3 className="font-semibold">{track.title}</h3>
            <p>{track.artist.name}</p>
            <p className="text-sm text-gray-500">{track.album.title}</p>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(track);
            }}
            className={`text-4xl transition ${
              isFavorite(track.id)
                ? 'text-yellow-500'
                : 'text-black/50 hover:text-yellow-500'
            }`}
          >
            {isFavorite(track.id) ? '★' : '☆'}
          </button>
        </div>
      ))}
    </div>
  );
}
