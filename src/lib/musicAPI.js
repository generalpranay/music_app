// Normalize Deezer search results

function normalizeDeezerSearch(json) {
  const tracks = json.data?.map((t) => ({
    id: t.id,
    title: t.title,
    preview: t.preview,
    artist: {
      id: t.artist?.id,
      name: t.artist?.name,
      picture: t.artist?.picture ?? null,
      picture_small: t.artist?.picture_small ?? null,
      picture_medium: t.artist?.picture_medium ?? null,
      picture_big: t.artist?.picture_big ?? null,
      picture_xl: t.artist?.picture_xl ?? null,
    },
    album: {
      id: t.album?.id,
      title: t.album?.title,
      cover: t.album?.cover ?? null,
      cover_small: t.album?.cover_small ?? null,
      cover_medium: t.album?.cover_medium ?? null,
      cover_big: t.album?.cover_big ?? null,
      cover_xl: t.album?.cover_xl ?? null,
    },
  })) ?? [];

  // Build unique albums/artists from tracks
  const albumMap = new Map();
  const artistMap = new Map();

  for (const t of tracks) {
    const a = t.album;
    if (a?.id && !albumMap.has(a.id)) albumMap.set(a.id, { ...a, artist: t.artist });

    const ar = t.artist;
    if (ar?.id && !artistMap.has(ar.id)) {
      artistMap.set(ar.id, ar); // 
    }
  }

  return {
    tracks,
    albums: Array.from(albumMap.values()),
    artists: Array.from(artistMap.values()),
  };
}

// Client helper
export async function fetchMusicData(query) {
  const res = await fetch(`/api/deezer?query=${encodeURIComponent(query)}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Search failed');
  const json = await res.json();
  return normalizeDeezerSearch(json);
}

// Server helper
export async function fetchMusicDataServer(query) {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL
      ?? (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

  const res = await fetch(`${base}/api/deezer?query=${encodeURIComponent(query)}`, {
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Search failed');
  const json = await res.json();
  return normalizeDeezerSearch(json);
}

// Fetch top tracks (for landing page)
export async function fetchTopTracks(limit = 50, editorial = '0') {
  const r = await fetch(`/api/top?type=tracks&limit=${limit}&editorial=${editorial}`, { cache: 'no-store' });
  if (!r.ok) throw new Error('Top tracks failed');
  const json = await r.json();         
  return normalizeDeezerSearch({ data: json.data || [] });
}

// Server version (for landing page)
export async function fetchTopTracksServer(limit = 50, editorial = '0') {
  const base = process.env.NEXT_PUBLIC_SITE_URL
    ?? (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
  const r = await fetch(`${base}/api/top?type=tracks&limit=${limit}&editorial=${editorial}`, { cache: 'no-store' });
  if (!r.ok) throw new Error('Top tracks failed');
  const json = await r.json();
  return normalizeDeezerSearch({ data: json.data || [] });
}

