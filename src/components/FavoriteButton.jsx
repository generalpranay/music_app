'use client';

import { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';

export default function FavoriteButton({
  track,
  favorites = [],
  setFavorites,
  className = '',
}) {
  // Hydration guard so SSR doesn't render filled heart
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const isFav = (t) => (favorites || []).some((f) => String(f.id) === String(t.id));

  const toggleFav = () => {
    if (!setFavorites) return;
    setFavorites((prev = []) =>
      (prev).some((f) => String(f.id) === String(track.id))
        ? prev.filter((f) => String(f.id) !== String(track.id))
        : [{ ...track }, ...prev]
    );
  };

  const fav = mounted ? isFav(track) : false;

  return (
    <button
      type="button"
      aria-pressed={fav}
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleFav(); }}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-full border transition
        ${fav ? 'border-pink-300 bg-pink-50 text-pink-600' : 'border-slate-200 text-slate-700 hover:bg-slate-100'}
        ${className}`}
      title={fav ? 'Remove from favorites' : 'Add to favorites'}
    >
      <Heart className={`h-4 w-4 ${fav ? 'fill-pink-500 stroke-pink-600' : ''}`} />
    </button>
  );
}
