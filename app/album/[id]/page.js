import AlbumClient from './AlbumClient';

export const revalidate = 0;
export const dynamic = 'force-dynamic';

export default async function Page({ params, searchParams }) {
  const { id } = await params;                 
  const sp = await searchParams;               
  const back = sp?.get?.('back') ?? '/?tab=albums';

  const res = await fetch(`https://api.deezer.com/album/${id}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch album');
  const album = await res.json();

  return <AlbumClient album={album} back={back} />;
}
