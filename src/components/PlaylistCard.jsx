'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Play, Heart } from 'lucide-react';

export default function PlaylistCard({
  title,
  subtitle,         // e.g., "4,223,172 Followers" or "56 Songs"
  image = '/placeholder.svg',
  href = '/',
  badge,            // e.g., "Today's Top Hits"
  liked,            // boolean
}) {
  return (
    <Link
      href={href}
      className="group relative w-[180px] shrink-0 overflow-hidden rounded-xl bg-white ring-1 ring-slate-200 hover:ring-[#b5e2ff] shadow-sm hover:shadow-md transition"
    >
      <div className="relative h-[120px] w-full overflow-hidden">
        <Image src={image} alt={title} fill unoptimized className="object-cover" />
        {badge && (
          <span className="absolute left-2 top-2 rounded-md bg-black/60 px-2 py-0.5 text-xs text-white backdrop-blur">
            {badge}
          </span>
        )}

        {/* Hover controls */}
        <div className="absolute inset-0 hidden items-center justify-center gap-2 bg-black/25 backdrop-blur-sm group-hover:flex">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-white text-slate-900 shadow">
            <Play className="h-4 w-4" />
          </span>
          <span className="grid h-9 w-9 place-items-center rounded-full bg-white text-slate-900 shadow">
            <Heart className={`h-4 w-4 ${liked ? 'fill-red-500 text-red-500' : ''}`} />
          </span>
        </div>
      </div>

      <div className="p-3">
        <p className="line-clamp-1 font-medium text-slate-900">{title}</p>
        {subtitle && <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>}
      </div>
    </Link>
  );
}
