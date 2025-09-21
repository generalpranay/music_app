import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('query');
  if (!query) {
    return NextResponse.json({ ok: false, data: [], error: 'Missing query' }, { status: 400 });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const dzRes = await fetch(
      `https://api.deezer.com/search?q=${encodeURIComponent(query)}`,
      { signal: controller.signal, cache: 'no-store' }
    );
    clearTimeout(timeout);

    if (!dzRes.ok) {
      return NextResponse.json(
        { ok: false, data: [], error: `Deezer error ${dzRes.status}` },
        { status: 502 }
      );
    }

    const json = await dzRes.json();                // Deezer returns { data: [...] }
    return NextResponse.json(json, { status: 200 }); // keep shape for your normalizer
  } catch (e) {
    clearTimeout(timeout);
    const aborted = e?.name === 'AbortError';
    return NextResponse.json(
      { ok: false, data: [], error: aborted ? 'Upstream timeout' : 'Server error' },
      { status: aborted ? 504 : 500 }
    );
  }
}
