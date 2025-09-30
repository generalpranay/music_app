'use client';

import { useEffect, useState } from 'react';
import ScrollRow from '@/components/ScrollRow';
import PlaylistCard from '@/components/PlaylistCard';
import AvatarBelt from '@/components/AvatarBelt';
import Sidebar from '@/components/Sidebar';
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
        const img = d?.picture_xl || d?.picture_big || d?.picture_medium || '/placeholder.svg';
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
          image: a.picture_xl || a.picture_big || a.picture_medium || '/placeholder.svg',
        }));
        setTopArtists(shuffleArray(artists));
      })
      .catch(() => setTopArtists([]));
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar className="hidden md:flex flex-col w-64 bg-white shadow-lg" />

      {/* Main */}
      <div className="flex-1 px-8 py-12 overflow-x-hidden">
        {/* Hero */}
        <section className="w-full mb-12">
          <div className="w-full max-w-[1400px] mx-auto flex flex-col md:flex-row items-center gap-10 bg-gradient-to-r from-[#4facfe] to-[#00f2fe] p-14 rounded-[2rem] shadow-xl text-white">
            <div className="flex-1 max-w-xl">
              <p className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1 text-sm backdrop-blur">
                <Sparkles className="h-4 w-4" /> Discover new vibes
              </p>
              <h1 className="mt-4 text-4xl md:text-6xl font-extrabold leading-tight">
                Your next favorite track is a search away
              </h1>
              <p className="mt-3 text-white/90 text-lg">
                Search artists, albums, and tracks. Preview instantly. Save your favorites.
              </p>

              <div className="mt-6 flex flex-wrap gap-4">
                {chips.map(({ label, href, icon: Icon }) => (
                  <Link key={label} href={href}
                    className="group inline-flex items-center gap-2 rounded-full bg-white/90 px-5 py-2 text-[#0b69b7] hover:bg-white transition shadow-md">
                    <Icon className="h-5 w-5 opacity-80" />
                    <span>{label}</span>
                    <ArrowRight className="h-5 w-5 translate-x-0 group-hover:translate-x-1 transition" />
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex-1 h-96 w-full relative">
              <img src="/hero-music.png" alt="Hero Banner" className="w-full h-full object-cover rounded-[2rem] shadow-lg" />
            </div>
          </div>
        </section>

        {/* Playlists */}
        <section className="w-full mb-16">
          <ScrollRow title="Browse Playlists" className="px-0">
            {featured.map((p) => (
              <PlaylistCard
                key={p.id ?? p.title}
                title={p.title}
                subtitle={p.sub}
                image={p.image || '/placeholder.svg'}
                href={p.id ? `/playlist/${p.id}?back=${encodeURIComponent('/')}` : `/?q=${encodeURIComponent(p.title)}&tab=tracks`}
                className="rounded-xl shadow-md hover:shadow-xl transition w-[220px] md:w-[280px]"
              />
            ))}
          </ScrollRow>
        </section>

        {/* Artists */}
        <section className="w-full">
          <AvatarBelt title="Explore Artists" items={topArtists} cardWidth="w-32 md:w-40" />
        </section>
      </div>
    </div>
  );
}
