'use client';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function ArtistList({ artists }) {
  const sp = useSearchParams();
  const q = sp.get('q') || '';
  const unique = Array.from(new Map(artists.map(a => [a.id, a])).values());

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {unique.map((artist) => {
        const params = new URLSearchParams();
        if (q) params.set('q', q);
        params.set('tab', 'artists');
        if (artist.picture_medium) params.set('picture', artist.picture_medium);
        if (artist.name) params.set('name', artist.name);

        return (
          <Link
            key={artist.id}
            href={`/artist/${artist.id}?${params.toString()}`}
            className="bg-white rounded shadow p-4 text-center hover:bg-gray-100 block"
          >
            <img
              src={artist.picture_medium || '/placeholder.svg'}
              alt={artist.name || 'Artist'}
              className="rounded-full mx-auto mb-2 w-24 h-24 object-cover"
              onError={(e) => { e.currentTarget.src = '/placeholder.svg'; }}
            />
            <h3 className="font-semibold text-black">{artist.name || 'Artist'}</h3>
          </Link>
        );
      })}
    </div>
  );
}
