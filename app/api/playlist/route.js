import { NextResponse } from 'next/server';
const DZ = 'https://api.deezer.com';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ ok:false, error:'Missing id' }, { status:400 });

  const r = await fetch(`${DZ}/playlist/${id}`, { cache: 'no-store' });
  if (!r.ok) return NextResponse.json({ ok:false, error:`Deezer ${r.status}` }, { status:502 });

  const json = await r.json(); // includes tracks.data
  return NextResponse.json({ ok:true, data: json }, { status:200 });
}
