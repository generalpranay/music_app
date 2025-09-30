'use client';

import { useEffect, useState } from 'react';
import ScrollRow from '@/components/ScrollRow';
import PlaylistCard from '@/components/PlaylistCard';
import AvatarBelt from '@/components/AvatarBelt';
import Sidebar from '@/components/Sidebar';
import MusicPlayer from '@/components/MusicPlayer';
import { Music2, UserRound, Flame, Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const FEATURED_PLAYLISTS = [
  { title: 'Anime', id: 5206929684, sub: '25,201 Followers' },
  { title: 'Pop Hits', id: 2098157264, sub: '1,366,777 Followers' },
  { title: 'Hip Hop', id: 1996494362, sub: '1,085,527 Followers' },
  { title: 'Chill Hits', id: 1976454162, sub: '421,392 Followers' },
  { title: 'Sad Feeling', id: 1910358422, sub: '122,138 Followers' },
  { title: "Friday's Love", id: 3440376962, sub: '173,100 Followers' },
];

const chips = [
  { label: 'Top 100', href: '/?tab=tracks&chart=global', icon: Flame },
  { label: 'The Weeknd', href: '/?q=The%20Weeknd&tab=tracks', icon: UserRound },
  { label: 'Drake', href: '/?q=Drake&tab=tracks', icon: UserRound },
  { label: 'Lo-Fi', href: '/?q=Lo-Fi&tab=tracks', icon: Music2 },
  { label: 'Chill', href: '/?q=Chill&tab=tracks', icon: Music2 },
];

function shuffleArray(arr) {
  return arr.slice().sort(() => Math.random() - 0.5);
}

export default function HomeLanding() {
  const [featured, setFeatured] = useState([]);
  const [topArtists, setTopArtists] = useState([]);

  useEffect(() => {
    const ids = FEATURED_PLAYLISTS.filter(p => p.id).map(p => String(p.id));
    Promise.all(
      ids.map(id =>
        fetch(`/api/playlist?id=${id}`, { cache: 'no-store' })
          .then(r => r.ok ? r.json() : null)
          .catch(() => null)
      )
    ).then(responses => {
      const byId = new Map();
      responses?.forEach(r => { if (r?.ok && r.data?.id) byId.set(String(r.data.id), r.data); });
      const playlists = FEATURED_PLAYLISTS.map(p => {
        const d = p.id ? byId.get(String(p.id)) : null;
        const img = d?.picture_xl || d?.picture_big || d?.picture_medium || 'https://source.unsplash.com/600x400/?music';
        const subtitle =
          p.sub ??
          (d?.nb_tracks ? `${d.nb_tracks} ${d.nb_tracks === 1 ? 'track' : 'tracks'}` :
           (d?.fans || d?.nb_fans) ? `${(d.fans || d.nb_fans).toLocaleString()} Followers` : '');
        return { ...p, image: img, sub: subtitle };
      });
      setFeatured(shuffleArray(playlists));
    });

    fetch('/api/top?type=artists&limit=12', { cache: 'no-store' })
      .then(r => r.json())
      .then(j => {
        const items = Array.isArray(j.data) ? j.data : [];
        const artists = items.map(a => ({
          name: a.name,
          image: a.picture_xl || a.picture_big || a.picture_medium || 'https://source.unsplash.com/200x200/?artist',
        }));
        setTopArtists(shuffleArray(artists));
      })
      .catch(() => setTopArtists([]));
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar (hidden on mobile) */}
      <Sidebar className="hidden md:flex flex-col w-64 bg-white shadow-lg fixed left-0 top-0 bottom-0 overflow-y-auto" />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto py-12 px-4 sm:px-6 md:px-8 py-8 md:pl-19">
          {/* Hero */}
          <section className="w-full mb-12">
            <div className="w-full max-w-[1400px] mx-auto flex flex-col md:flex-row items-center gap-8 bg-gradient-to-r from-[#4facfe] to-[#00f2fe] p-8 md:p-14 rounded-[2rem] shadow-xl text-white">
              <div className="flex-1 max-w-xl">
                <p className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1 text-sm backdrop-blur">
                  <Sparkles className="h-4 w-4" /> Discover new vibes
                </p>
                <h1 className="mt-4 text-3xl sm:text-4xl md:text-6xl font-extrabold leading-tight">
                  Your next favorite track is a search away
                </h1>
                <p className="mt-3 text-white/90 text-base sm:text-lg">
                  Search artists, albums, and tracks. Preview instantly. Save your favorites.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  {chips.map(({ label, href, icon: Icon }) => (
                    <Link key={label} href={href}
                      className="group inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-[#0b69b7] hover:bg-white transition shadow-md">
                      <Icon className="h-5 w-5 opacity-80" />
                      <span className="text-sm sm:text-base">{label}</span>
                      <ArrowRight className="h-5 w-5 translate-x-0 group-hover:translate-x-1 transition" />
                    </Link>
                  ))}
                </div>
              </div>
              <div className="flex-1 h-64 sm:h-80 md:h-96 w-full relative">
                <img
                  src="https://www.ey.com/adobe/dynamicmedia/deliver/dm-aid--1fcca484-e681-4712-8667-6849a1ae7a33/ey-rear-view-people-enjoying-music-concert.jpg?width=2400&preferwebp=true&quality=85"
                  alt="Hero Banner"
                  className="w-full h-full object-cover rounded-[2rem] shadow-lg"
                />
              </div>
            </div>
          </section>

          {/* Playlists */}
          <section className="w-full mb-12">
            <ScrollRow title="Browse Playlists" className="px-0">
              {featured.map((p) => (
                <PlaylistCard
                  key={p.id ?? p.title}
                  title={p.title}
                  subtitle={p.sub}
                  image={p.image || 'https://source.unsplash.com/600x400/?music'}
                  href={p.id ? `/playlist/${p.id}?back=${encodeURIComponent('/')}` : `/?q=${encodeURIComponent(p.title)}&tab=tracks`}
                  className="rounded-xl shadow-md hover:shadow-xl transition w-[180px] sm:w-[220px] md:w-[280px]"
                />
              ))}
            </ScrollRow>
          </section>

          {/* Artists */}
          <section className="w-full mb-8">
            <AvatarBelt title="Explore Artists" items={topArtists} cardWidth="w-24 sm:w-32 md:w-40" />
          </section>
        </div>

        {/* Music Player fixed at bottom */}
        <div className="w-full h-20 sm:h-24 bg-white shadow-inner flex-shrink-0">
          <MusicPlayer />
        </div>
      </div>
    </div>
  );
}
