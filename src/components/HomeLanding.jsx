'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ScrollRow from '@/components/ScrollRow';
import PlaylistCard from '@/components/PlaylistCard';
import AvatarBelt from '@/components/AvatarBelt';
import { Music2, Disc3, UserRound, Flame, Sparkles, ArrowRight } from 'lucide-react';

const FEATURED_PLAYLISTS = [
  { title: 'Anime',          id: 5206929684, sub: '25,201 Followers' },
  { title: 'Pop Hits',       id: 2098157264, sub: '1,366,777 Followers' },
  { title: 'Hip Hop',        id: 1996494362, sub: '1,085,527 Followers' },
  { title: 'Chill Hits',     id: 1976454162, sub: '421,392 Followers' },
  { title: 'Sad Feeling',    id: 1910358422, sub: '122,138 Followers' },
  { title: "Friday's Love",  id: 3440376962, sub: '173,100 Followers' },
];

const chips = [
  { label: 'Top 100', href: '/?tab=tracks&chart=global', icon: Flame },
  { label: 'The Weeknd', href: '/?q=The%20Weeknd&tab=tracks', icon: UserRound },
  { label: 'Drake', href: '/?q=Drake&tab=tracks', icon: UserRound },
  { label: 'Lo-Fi', href: '/?q=Lo-Fi&tab=tracks', icon: Music2 },
  { label: 'Chill', href: '/?q=Chill&tab=tracks', icon: Music2 },
];

export default function HomeLanding() {
  // NEW: fetched images/state
  const [featured, setFeatured] = useState(FEATURED_PLAYLISTS);
  const [topArtists, setTopArtists] = useState([]);

  useEffect(() => {
    // fetch each playlist once via your proxy route
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

      setFeatured(FEATURED_PLAYLISTS.map(p => {
        const d = p.id ? byId.get(String(p.id)) : null;
        const img = d?.picture_xl || d?.picture_big || d?.picture_medium || '/placeholder.svg';
        const subtitle =
          p.sub ??
          (d?.nb_tracks ? `${d.nb_tracks} ${d.nb_tracks === 1 ? 'track' : 'tracks'}` :
           (d?.fans || d?.nb_fans) ? `${(d.fans || d.nb_fans).toLocaleString()} Followers` : '');

        return { ...p, image: img, sub: subtitle };
      }));
    });

    // fill artist avatars from Deezer's chart
    fetch('/api/top?type=artists&limit=12', { cache: 'no-store' })
      .then(r => r.json())
      .then(j => {
        const items = Array.isArray(j.data) ? j.data : [];
        setTopArtists(
          items.map(a => ({
            name: a.name,
            image: a.picture_xl || a.picture_big || a.picture_medium || '/placeholder.svg',
          }))
        );
      })
      .catch(() => setTopArtists([]));
  }, []);

  return (
    <div className="min-h-[calc(100vh-72px)] bg-white">
      {/* HERO */}
      <section className="mx-auto max-w-6xl px-6 pt-10 pb-8">
        <div className="relative overflow-hidden rounded-3xl p-8 md:p-12 bg-gradient-to-r from-[#6ac5fe] to-[#45b6fe] shadow-lg ring-1 ring-white/30 text-white">
          <div className="max-w-xl">
            <p className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-sm backdrop-blur">
              <Sparkles className="h-4 w-4" /> Discover new vibes
            </p>
            <h1 className="mt-4 text-3xl md:text-5xl font-extrabold leading-tight">Your next favorite track is a search away</h1>
            <p className="mt-3 text-white/90">Search artists, albums, and tracks. Preview instantly. Save your favorites.</p>

            <div className="mt-6 flex flex-wrap gap-3">
              {chips.map(({ label, href, icon: Icon }) => (
                <Link key={label} href={href}
                  className="group inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-[#0b69b7] hover:bg-white transition shadow">
                  <Icon className="h-4 w-4 opacity-80" />
                  <span>{label}</span>
                  <ArrowRight className="h-4 w-4 translate-x-0 group-hover:translate-x-0.5 transition" />
                </Link>
              ))}
            </div>
          </div>
          <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-white/20 blur-2xl" />
        </div>
      </section>

      {/* CONTENT */}
      <section>
        <div className="mx-auto max-w-6xl px-6 py-8 bg-white">
          {/* Browse Playlists with real covers */}
          <ScrollRow title="Browse Playlists">
            {featured.map((p) => (
              <PlaylistCard
                key={p.id ?? p.title}
                title={p.title}
                subtitle={p.sub}
                image={p.image || '/placeholder.svg'}
                href={p.id ? `/playlist/${p.id}?back=${encodeURIComponent('/')}` : `/?q=${encodeURIComponent(p.title)}&tab=tracks`}
              />
            ))}
          </ScrollRow>

          {/* Explore Artists with real avatars */}
          <div className="mt-8">
            <AvatarBelt title="Explore Artists" items={topArtists} />
          </div>
        </div>
      </section>
    </div>
  );
}
