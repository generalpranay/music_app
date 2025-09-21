'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import AppHeader from '@/components/AppHeader';
import Sidebar from '@/components/Sidebar';
import MusicPlayer from '@/components/MusicPlayer';
import FavoriteButton from '@/components/FavoriteButton';
import AddToPlaylistButton from '@/components/AddToPlaylistButton';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Play, Pause, ListMusic, Ban } from 'lucide-react';

function ms(t) {
  const m = Math.floor((t || 0) / 60);
  const s = String((t || 0) % 60).padStart(2, '0');
  return `${m}:${s}`;
}

export default function PlaylistClient({ playlist, back = '/' }) {
  const tracks = useMemo(() => playlist?.tracks?.data ?? [], [playlist]);

  // local storage state kept here, passed down to FavoriteButton
  const [favorites, setFavorites] = useLocalStorage('favorites', []);
  const [selectedTrack, setSelectedTrack] = useState(null);

  const startPlay = (t) => { if (t?.preview) setSelectedTrack(t); };
  const stopPlay  = () => setSelectedTrack(null);

  const anyPreview = tracks.some((t) => !!t.preview);

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header — hide search to avoid accidental submits here */}
      <AppHeader title="🎶 DucMix" showSearch={false} />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          activeTab="playlists"
          setActiveTab={(tab) => {
            const href = tab === 'playlists' ? '/?tab=playlists' : `/?tab=${tab}`;
            window.location.href = href;
          }}
        />

        {/* Content */}
        <main className="flex-1 overflow-y-auto pb-24 scroll-pb-24">
          {/* Hero */}
          <div className="relative mx-6 mt-6 rounded-2xl bg-white ring-1 ring-slate-200 shadow-sm">
            <div className="flex flex-col gap-5 p-5 md:flex-row md:items-center">
              <div className="relative h-36 w-36 overflow-hidden rounded-xl ring-1 ring-black/10">
                <Image
                  src={playlist.picture_xl || playlist.picture_big || playlist.picture_medium || '/placeholder.svg'}
                  alt={playlist.title || 'Playlist'}
                  fill
                  unoptimized
                  className="object-cover"
                />
              </div>
              <div className="min-w-0">
                <p className="text-sm uppercase tracking-wide text-slate-500">Playlist</p>
                <h1 className="truncate text-3xl font-extrabold text-slate-900">{playlist.title}</h1>
                <p className="mt-1 text-sm text-slate-600">
                  by {playlist.creator?.name ?? 'Unknown'} · {playlist.nb_tracks}{' '}
                  {playlist.nb_tracks === 1 ? 'track' : 'tracks'}
                </p>

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
                    {anyPreview ? <Play className="h-4 w-4" /> : <Ban className="h-4 w-4" />}
                    Play
                  </button>

                  <Link
                    href={back}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-slate-700 hover:bg-slate-50"
                  >
                    <ListMusic className="h-4 w-4" />
                    Browse
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Tracks table */}
          <div className="mx-6 my-6 overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200 shadow-sm">
            <div className="grid grid-cols-[auto_1fr_1fr_auto_auto] items-center gap-3 border-b border-slate-200 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <span>#</span>
              <span>Title</span>
              <span>Artist</span>
              <span>Time</span>
              <span className="text-right">Actions</span>
            </div>

            <ul className="divide-y divide-slate-200">
              {tracks.map((t, idx) => {
                const playing  = selectedTrack && String(selectedTrack.id) === String(t.id);
                const playable = !!t.preview;

                return (
                  <li
                    key={t.id}
                    className="grid grid-cols-[auto_1fr_1fr_auto_auto] items-center gap-3 px-4 py-3 hover:bg-slate-50"
                  >
                    {/* play/pause */}
                    <button
                      type="button"
                      onClick={() => { if (playable) { playing ? stopPlay() : startPlay(t); } }}
                      className={`grid h-8 w-8 place-items-center rounded-full border ${
                        playable
                          ? 'border-slate-200 hover:bg-slate-100'
                          : 'border-slate-200 opacity-50 cursor-not-allowed'
                      }`}
                      title={playable ? (playing ? 'Pause' : 'Play preview') : 'No preview available'}
                    >
                      {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </button>

                    {/* title */}
                    <div className="min-w-0">
                      <p className="truncate font-medium text-slate-900">{t.title}</p>
                      <p className="truncate text-xs text-slate-500">{t.album?.title}</p>
                    </div>

                    {/* artist */}
                    <div className="min-w-0">
                      <p className="truncate text-slate-700">{t.artist?.name}</p>
                    </div>

                    {/* time */}
                    <span className="text-sm tabular-nums text-slate-600">{ms(t.duration)}</span>

                    {/* actions (now using components) */}
                    <div className="flex items-center justify-end gap-2">
                      <FavoriteButton track={t} favorites={favorites} setFavorites={setFavorites} />
                      <AddToPlaylistButton track={t} />
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </main>
      </div>

      {/* Footer player */}
      {selectedTrack && (
        <footer className="sticky bottom-0 z-40 w-full bg-white shadow-inner p-4">
          <MusicPlayer track={selectedTrack} favorites={favorites} setFavorites={setFavorites} />
        </footer>
      )}
    </div>
  );
}
