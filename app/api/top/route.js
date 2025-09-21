// For ex. top 100 charts
import { NextResponse } from 'next/server';

const DZ = 'https://api.deezer.com';

// Supported: type=tracks|albums|artists|playlists
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const type   = searchParams.get('type')   || 'tracks';
  const limit  = Number(searchParams.get('limit') || 50);
  // country editorial id: 0 = global; try 2=France, 13=USA, 168=Canada, etc.
  const editor = searchParams.get('editorial') || '0';

  // Build Deezer endpoint:
  // Global:    /chart/0/tracks?limit=100
  // Country:   /chart/{editorial}/tracks
  const path = `chart/${editor}/${type}?limit=${limit}`;

  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), 8000);
  try {
    const r = await fetch(`${DZ}/${path}`, { cache: 'no-store', signal: controller.signal });
    clearTimeout(t);
    if (!r.ok) {
      return NextResponse.json({ ok: false, data: [], error: `Deezer ${r.status}` }, { status: 502 });
    }
    const json = await r.json(); // { data: [...] }
    return NextResponse.json({ ok: true, data: json.data }, { status: 200 });
  } catch (e) {
    clearTimeout(t);
    const aborted = e?.name === 'AbortError';
    return NextResponse.json(
      { ok: false, data: [], error: aborted ? 'Upstream timeout' : 'Server error' },
      { status: aborted ? 504 : 500 }
    );
  }
}
