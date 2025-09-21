// app/playlist/[id]/page.js
import Image from 'next/image';
import PlaylistClient from './PlaylistClient';

export const revalidate = 0;

async function getPlaylist(id) {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

  const res = await fetch(`${base}/api/playlist?id=${id}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to load playlist');
  const { data } = await res.json();
  return data; // Deezer playlist object
}

export default async function Page(props) {
  const p  = await props.params;
  const sp = await props.searchParams;
  const { id } = p;

  const playlist = await getPlaylist(id);
  const back = sp?.back || '/';

  return <PlaylistClient playlist={playlist} back={back} />;
}
