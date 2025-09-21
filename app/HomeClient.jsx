// Client component for home page
'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import AppHeader from '@/components/AppHeader';
import Sidebar from '@/components/Sidebar';
import ResultsPanel from '@/components/ResultsPanel';
import MusicPlayer from '@/components/MusicPlayer';
import HomeLanding from '@/components/HomeLanding';
import { fetchMusicData, fetchTopTracks } from '@/lib/musicAPI';
import { useLocalStorage } from '@/hooks/useLocalStorage';

export default function HomeClient({ initialData, initialQuery, initialTab, initialChart }) {
  const router = useRouter();
  const sp = useSearchParams();
  const pathname = usePathname();

  const chartParam = (sp?.get('chart') || initialChart || '').trim();
  const isRoot = pathname === '/' && !sp.get('tab') && !sp.get('q') && !sp.get('chart');

  // seed from server (no flicker)
  const [tracks, setTracks] = useState(initialData.tracks || []);
  const [albums, setAlbums] = useState(initialData.albums || []);
  const [artists, setArtists] = useState(initialData.artists || []);
  const [currentQuery, setCurrentQuery] = useState(initialQuery || '');
  const [activeTab, setActiveTab] = useState(initialTab || 'tracks');

  const [selectedTrack, setSelectedTrack] = useState(null);
  const [favorites, setFavorites] = useLocalStorage('favorites', []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fetchedOnce, setFetchedOnce] = useState(Boolean(initialQuery || chartParam));

  // guards to prevent double fetch / tab-triggered fetch
  const prevKeyRef = useRef(`${initialQuery || ''}|${chartParam || ''}`);
  const isFirstEffect = useRef(true);

  useEffect(() => {
    const q = sp.get('q') || '';
    const tab = sp.get('tab') || 'tracks';
    const chart = (sp.get('chart') || '').trim();

    setCurrentQuery(q);
    setActiveTab(tab);

    // Skip first run (SSR already hydrated)
    if (isFirstEffect.current) {
      isFirstEffect.current = false;
      prevKeyRef.current = `${q}|${chart}`;
      if (q || chart) setFetchedOnce(true);
      return;
    }

    // Only fetch when q or chart actually changes (not on pure tab change)
    const key = `${q}|${chart}`;
    if (key === prevKeyRef.current) return;
    prevKeyRef.current = key;

    (async () => {
      setLoading(true);
      setError(null);
      try {
        if (q) {
          const res = await fetchMusicData(q);
          setTracks(res.tracks || []);
          setAlbums(res.albums || []);
          setArtists(res.artists || []);
          setFetchedOnce(true);
        } else if (chart) {
          const map = { global: '0', us: '13', ca: '168' };
          const editorial = map[chart] ?? '0';
          const res = await fetchTopTracks(100, editorial);
          setTracks(res.tracks || []);
          setAlbums(res.albums || []);
          setArtists(res.artists || []);
          setFetchedOnce(true);
        } else {
          // no query, no chart → clear results; ResultsPanel will show empty state
          setTracks([]); setAlbums([]); setArtists([]);
          setFetchedOnce(false);
        }
      } catch {
        setError('Failed to fetch tracks. Please try again later.');
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sp]);

  const handleSearch = (query) => {
    const q2 = query.trim();
    setCurrentQuery(q2);
    if (q2) { setLoading(true); setError(null); }
    // empty search returns to true landing (/)
    router.push(q2 ? `/?q=${encodeURIComponent(q2)}&tab=${activeTab}` : '/', { scroll: false });
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    const keepChart = chartParam && !currentQuery;
    const href = currentQuery
      ? `/?q=${encodeURIComponent(currentQuery)}&tab=${tab}`
      : keepChart
        ? `/?tab=${tab}&chart=${encodeURIComponent(chartParam)}`
        : `/?tab=${tab}`;
    router.push(href, { scroll: false });
  };

  const handleTrackClick = (track) => setSelectedTrack(track);

  // Show landing ONLY on the true root route
  if (isRoot) {
    return (
      <div className="h-screen flex flex-col bg-gray-50">
        <AppHeader onSearch={handleSearch} title="🎶 DucMix" />
        <HomeLanding onSearch={handleSearch} />
      </div>
    );
  }

  // App shell (tabs/results)
  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <AppHeader onSearch={handleSearch} title="🎶 DucMix" initialQuery={currentQuery} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={handleTabChange}
          currentQuery={currentQuery}
          chartParam={chartParam}
           />
        <ResultsPanel
          activeTab={activeTab}
          loading={loading}
          error={error}
          tracks={tracks}
          albums={albums}
          artists={artists}
          favorites={favorites}
          setFavorites={setFavorites}
          onTrackClick={handleTrackClick}
          fetchedOnce={fetchedOnce}
          currentQuery={currentQuery}
          chartParam={chartParam}
          selectedTrack={selectedTrack}
          onPause={() => setSelectedTrack(null)}
        />
      </div>
      {selectedTrack && (
        <footer className="sticky bottom-0 z-40 w-full bg-white shadow-inner p-4">
          <MusicPlayer track={selectedTrack} favorites={favorites} setFavorites={setFavorites} />
        </footer>
      )}
    </div>
  );
}
