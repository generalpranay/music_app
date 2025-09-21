'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function AvatarBelt({ title = 'More Like …', items = [] }) {
  return (
    <section>
      <h2 className="mb-3 text-lg font-semibold text-slate-900">{title}</h2>
      <div className="scrollbar-none flex gap-4 overflow-x-auto pb-1">
        {items.map((it) => (
          <Link
            key={it.name}
            href={`/?q=${encodeURIComponent(it.name)}&tab=artists`}
            className="group grid w-[92px] shrink-0 justify-items-center"
          >
            <div className="relative h-20 w-20 overflow-hidden rounded-full ring-1 ring-slate-200 group-hover:ring-[#b5e2ff] transition">
              <Image src={it.image || '/placeholder.svg'} alt={it.name} fill unoptimized className="object-cover" />
            </div>
            <p className="mt-2 line-clamp-1 text-center text-xs text-slate-700">{it.name}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
