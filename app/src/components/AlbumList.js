'use client';

export default function AlbumList({ albums, onAlbumClick }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {albums.map((album, index) => (
        <div
          key={`${album.id}-${index}`}
          className="bg-white rounded shadow p-4 cursor-pointer hover:bg-gray-100"
          onClick={() => onAlbumClick(album)}
        >
          <img
            src={album.cover_medium}
            alt={album.title}
            className="rounded mb-2"
          />
          <h3 className="font-semibold text-sm">{album.title}</h3>
          <p className="text-xs text-gray-600">{album.artist?.name || 'Unknown Artist'}</p>
        </div>
      ))}
    </div>
  );
}




