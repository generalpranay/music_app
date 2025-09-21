'use client';

import { useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import AppHeader from '@/components/AppHeader';
import Sidebar from '@/components/Sidebar';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Play, ListMusic, Calendar } from 'lucide-react';
import MusicList from '@/components/MusicList';
import { usePlayer } from '@/contexts/PlayerContext';

function ms(t = 0) {
  const m = Math.floor(t / 60);
  const s = String(t % 60).padStart(2, '0');
  return `${m}:${s}`;
}

export default function AlbumClient({ album, back = '/?tab=albums' }) {
  const { play } = usePlayer();                          
  const [favorites, setFavorites] = useLocalStorage('favorites', []);

  // Normalize album tracks to your MusicList shape (attach album covers)
  const tracks = useMemo(() => {
    const baseCovers = {
      cover: album?.cover || null,
      cover_small: album?.cover_small || null,
      cover_medium: album?.cover_medium || null,
      cover_big: album?.cover_big || null,
      cover_xl: album?.cover_xl || null,
      title: album?.title || '',
      id: album?.id,
    };
    return (album?.tracks?.data ?? []).map((t) => ({
      ...t,
      album: { ...baseCovers },
    }));
  }, [album]);

  const anyPreview = tracks.some((t) => !!t.preview);

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <AppHeader title="🎶 DucMix" showSearch={false} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar activeTab="albums" />

        <main className="flex-1 overflow-y-auto pb-24 scroll-pb-24">
          {/* Hero */}
          <div className="relative mx-6 mt-6 rounded-2xl bg-white ring-1 ring-slate-200 shadow-sm">
            <div className="flex flex-col gap-5 p-5 md:flex-row md:items-center">
              <div className="relative h-36 w-36 overflow-hidden rounded-xl ring-1 ring-black/10">
                <Image
                  src={album?.cover_xl || album?.cover_big || album?.cover_medium || '/placeholder.svg'}
                  alt={album?.title || 'Album'}
                  fill
                  unoptimized
                  className="object-cover"
                />
              </div>
              <div className="min-w-0">
                <p className="text-sm uppercase tracking-wide text-slate-500">Album</p>
                <h1 className="truncate text-3xl font-extrabold text-slate-900">{album?.title}</h1>
                <p className="mt-1 text-sm text-slate-600">
                  {album?.artist?.name ?? 'Unknown Artist'} · {(album?.tracks?.data ?? []).length}{' '}
                  {(album?.tracks?.data ?? []).length === 1 ? 'track' : 'tracks'}
                </p>
                {album?.release_date && (
                  <p className="mt-1 text-xs text-slate-500 inline-flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" /> Released {album.release_date}
                  </p>
                )}

                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const firstPlayable = tracks.find((t) => !!t.preview);
                      if (firstPlayable) play(firstPlayable, tracks);          
                    }}
                    className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
                    disabled={!anyPreview}
                    title={anyPreview ? 'Play first preview' : 'No previews available'}
                  >
                    <Play className="h-4 w-4" />
                    Play
                  </button>

                  <Link
                    href={back}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-slate-700 hover:bg-slate-50"
                  >
                    <ListMusic className="h-4 w-4" />
                    Back
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Tracks (playable + fav/playlist via MusicList) */}
          <div className="mx-6 my-6">
            <MusicList
              tracks={tracks}
              onTrackClick={(t) => play(t, tracks)}            
              favorites={favorites}
              setFavorites={setFavorites}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
