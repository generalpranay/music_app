// app/page.js  (SERVER component)
import HomeClient from './HomeClient';
import { fetchMusicDataServer, fetchTopTracksServer } from '@/lib/musicAPI';

export const revalidate = 0; // always fresh on nav/refresh

export default async function Page(props) {
  // In async route API, searchParams is a Promise — await it
  const sp = await props.searchParams;
  const q = sp?.q || '';
  const tab = sp?.tab || 'tracks';
  const chart = sp?.chart || '';  // 'global' | 'us' | 'ca' 

  // initial fetch on the server to avoid flicker
  let initialData = { tracks: [], albums: [], artists: [] };
  if (q) {
    initialData = await fetchMusicDataServer(q);
  } else if (chart) {
    const editorialMap = { global: '0', us: '13', ca: '168' }; 
    const editorial = editorialMap[chart] ?? '0';
    initialData = await fetchTopTracksServer(100, editorial);
  }

  // Hydrate into the client shell
  return (
    <HomeClient
      initialData={initialData}
      initialQuery={q}
      initialTab={tab}
      initialChart={chart}
    />
  );
}
