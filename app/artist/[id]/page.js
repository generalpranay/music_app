import ArtistClient from './ArtistClient';

export const revalidate = 0;
export const dynamic = 'force-dynamic';

export default async function Page({ params, searchParams }) {
  // await both dynamic props
  const { id } = await params;
  const sp = await searchParams;
  const back = sp?.get?.('back') ?? '/?tab=artists';

  const [infoRes, topRes] = await Promise.all([
    fetch(`https://api.deezer.com/artist/${id}`, { cache: 'no-store' }),
    fetch(`https://api.deezer.com/artist/${id}/top?limit=50`, { cache: 'no-store' }),
  ]);

  if (!infoRes.ok) throw new Error('Failed to fetch artist');
  if (!topRes.ok) throw new Error('Failed to fetch artist tracks');

  const artist = await infoRes.json();
  const top = await topRes.json();

  return <ArtistClient artist={artist} top={top} back={back} />;
}
