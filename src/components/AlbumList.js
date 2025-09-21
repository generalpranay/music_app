'use client';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function AlbumList({ albums }) {
  const sp = useSearchParams();
  const q = sp.get('q') || '';
  const hrefWith = (id) =>
    q ? `/album/${id}?q=${encodeURIComponent(q)}&tab=albums`
      : `/album/${id}?tab=albums`;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {albums.map((album, index) => (
        <Link
          key={`${album.id}-${index}`}
          href={hrefWith(album.id)}
          className="bg-white rounded shadow p-4 hover:bg-gray-100 block"
        >
          <img src={album.cover_medium} alt={album.title} className="rounded mb-2" />
          <h3 className="font-semibold text-black">{album.title}</h3>
          <p className="text-xs text-gray-600">{album.artist?.name || 'Unknown Artist'}</p>
        </Link>
      ))}
    </div>
  );
}

