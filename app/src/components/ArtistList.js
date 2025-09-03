'use client';

export default function ArtistList({ artists, onArtistClick }) {
  const uniqueArtists = Array.from(new Map(artists.map(a => [a.id, a])).values());

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {uniqueArtists.map((artist) => (
        <div
          key={artist.id}
          className="bg-white rounded shadow p-4 text-center cursor-pointer hover:bg-gray-100"
          onClick={() => onArtistClick(artist)}
        >
          <img
            src={artist.picture_medium || '/placeholder.png'}
            alt={artist.name}
            className="rounded-full mx-auto mb-2 w-24 h-24 object-cover"
          />
          <h3 className="font-semibold text-black">{artist.name}</h3>
        </div>
      ))}
    </div>
  );
}




