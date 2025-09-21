const BASE = '/api';

async function apiFetch(path, init) {
  const res = await fetch(`${BASE}${path}`, { ...init, cache: 'no-store' });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Request failed: ${res.status} ${text || res.statusText}`);
  }
  return res.json();
}

export const Deezer = {
  search(query) {
    return apiFetch(`/deezer?query=${encodeURIComponent(query)}`);
  },
  album(id) {
    return apiFetch(`/album?id=${id}`);
  },
  artistTop(id) {
    return apiFetch(`/artist?id=${id}`);
  },
};
