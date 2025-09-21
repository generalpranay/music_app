'use client';

import { useEffect, useState } from 'react';
import MusicList from '@/components/MusicList';
import AlbumList from '@/components/AlbumList';
import ArtistList from '@/components/ArtistList';
import Playlist from '@/components/Playlist';
import LoadingSpinner from '@/components/LoadingSpinner';
import { TrackSkeleton, CardSkeleton } from '@/components/Skeletons';

export default function ResultsPanel({
  activeTab,
  loading,
  error,
  tracks,
  albums,
  artists,
  favorites,
  setFavorites,
  onTrackClick,
  currentQuery,
  chartParam,
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  return (
    <main className="flex-1 p-6 overflow-y-auto pb-[140px] scroll-pb-[140px]">
      {error && <div className="text-red-500 mb-4">{error}</div>}

      {/* Loading states (tab-aware) */}
      {loading && (
        <div className="mb-4">
          {activeTab === 'tracks' && <TrackSkeleton count={8} />}
          {activeTab === 'artists' && <CardSkeleton count={8} />}
          {activeTab === 'albums' && <CardSkeleton count={8} />}
          {activeTab === 'favorites' && <TrackSkeleton count={6} />}
          {activeTab === 'playlists' && <LoadingSpinner label="Loading playlists" />}
        </div>
      )}

      {/* TRACKS */}
      {!loading && activeTab === 'tracks' && (
        <>
          <MusicList
            tracks={tracks}
            onTrackClick={onTrackClick}
            favorites={favorites}
            setFavorites={setFavorites}
          />
          {!tracks?.length && !error && (
            (currentQuery || chartParam) ? (
              <p className="text-gray-500">No tracks found.</p>
            ) : (
              <div className="mt-4 rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm">
                <h2 className="text-lg font-semibold text-slate-900">No tracks yet</h2>
                <p className="mt-1 text-slate-600">
                  Try a search, or jump to{' '}
                  <a className="text-blue-600 underline" href="/?tab=tracks&chart=global">
                    Top 100
                  </a>.
                </p>
              </div>
            )
          )}
        </>
      )}

      {/* ALBUMS */}
      {!loading && activeTab === 'albums' && (
        <>
          <AlbumList albums={albums} />
          {!albums?.length && !error && <p className="text-gray-500">No albums found.</p>}
        </>
      )}

      {/* ARTISTS */}
      {!loading && activeTab === 'artists' && (
        <>
          <ArtistList artists={artists} />
          {!artists?.length && !error && <p className="text-gray-500">No artists found.</p>}
        </>
      )}

      {/* FAVORITES */}
      {!loading && activeTab === 'favorites' && (
        mounted ? (
          <>
            <MusicList
              tracks={favorites}
              onTrackClick={onTrackClick}
              favorites={favorites}
              setFavorites={setFavorites}
            />
            {!favorites?.length && <p className="text-gray-500">No favorites yet.</p>}
          </>
        ) : (
          <TrackSkeleton count={6} />
        )
      )}

      {/* PLAYLISTS */}
      {activeTab === 'playlists' && !loading && <Playlist onTrackClick={onTrackClick} />}
    </main>
  );
}
