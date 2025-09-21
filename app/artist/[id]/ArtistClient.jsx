'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import AppHeader from '@/components/AppHeader';
import Sidebar from '@/components/Sidebar';
import MusicPlayer from '@/components/MusicPlayer';
import MusicList from '@/components/MusicList';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Play, Pause, ListMusic, Users } from 'lucide-react';

export default function ArtistClient({ artist, top, back = '/?tab=artists' }) {
  // Top tracks already have album covers and preview links
  const tracks = useMemo(() => top?.data ?? [], [top]);
  const anyPreview = tracks.some((t) => !!t.preview);

  const [favorites, setFavorites] = useLocalStorage('favorites', []);
  const [selectedTrack, setSelectedTrack] = useState(null);

  const startPlay = (t) => { if (t?.preview) setSelectedTrack(t); };
  const stopPlay  = () => setSelectedTrack(null);

  // followers might be in artist.nb_fan
  const fans = artist?.nb_fan ? Intl.NumberFormat().format(artist.nb_fan) : null;

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <AppHeader title="🎶 DucMix" showSearch={false} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar activeTab="artists" />

        <main className="flex-1 overflow-y-auto pb-24 scroll-pb-24">
          {/* Hero */}
          <div className="relative mx-6 mt-6 rounded-2xl bg-white ring-1 ring-slate-200 shadow-sm">
            <div className="flex flex-col gap-5 p-5 md:flex-row md:items-center">
              <div className="relative h-36 w-36 overflow-hidden rounded-full ring-1 ring-black/10">
                <Image
                  src={artist?.picture_xl || artist?.picture_big || artist?.picture_medium || '/placeholder.svg'}
                  alt={artist?.name || 'Artist'}
                  fill
                  unoptimized
                  className="object-cover"
                />
              </div>
              <div className="min-w-0">
                <p className="text-sm uppercase tracking-wide text-slate-500">Artist</p>
                <h1 className="truncate text-3xl font-extrabold text-slate-900">{artist?.name}</h1>
                {fans && (
                  <p className="mt-1 text-sm text-slate-600 inline-flex items-center gap-1">
                    <Users className="h-4 w-4" /> {fans} fans
                  </p>
                )}

                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const firstPlayable = tracks.find((t) => !!t.preview);
                      if (firstPlayable) setSelectedTrack(firstPlayable);
                    }}
                    className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
                    disabled={!anyPreview}
                    title={anyPreview ? 'Play first preview' : 'No previews available'}
                  >
                    {anyPreview ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4 opacity-30" />}
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

          {/* Top tracks (playable + favorite + add-to-playlist) */}
          <div className="mx-6 my-6">
            <MusicList
              tracks={tracks}
              onTrackClick={(t) => {
                if (selectedTrack && String(selectedTrack.id) === String(t.id)) {
                  setSelectedTrack(null);
                } else {
                  startPlay(t);
                }
              }}
              onPause={() => setSelectedTrack(null)}
              currentTrack={selectedTrack}
              favorites={favorites}
              setFavorites={setFavorites}
            />
          </div>
        </main>
      </div>

      {selectedTrack && (
        <footer className="sticky bottom-0 z-40 w-full bg-white shadow-inner p-4">
          <MusicPlayer track={selectedTrack} favorites={favorites} setFavorites={setFavorites} />
        </footer>
      )}
    </div>
  );
}
