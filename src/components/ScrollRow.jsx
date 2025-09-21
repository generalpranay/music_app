'use client';

import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function ScrollRow({ title, children, className = '' }) {
  const ref = useRef(null);

  const scrollBy = (px) => {
    const el = ref.current;
    if (!el) return;
    el.scrollTo({ left: el.scrollLeft + px, behavior: 'smooth' });
  };

  return (
    <section className={`relative ${className}`}>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
        <div className="hidden gap-1 md:flex">
          <button
            className="rounded-md p-1.5 ring-1 ring-slate-200 hover:bg-slate-50"
            onClick={() => scrollBy(-520)}
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            className="rounded-md p-1.5 ring-1 ring-slate-200 hover:bg-slate-50"
            onClick={() => scrollBy(520)}
            aria-label="Scroll right"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="relative">
        {/* edge fades */}
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-10 bg-gradient-to-r from-white" />
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-10 bg-gradient-to-l from-white" />

        <div
          ref={ref}
          className="scrollbar-none flex gap-4 overflow-x-auto pb-1 pr-4"
        >
          {children}
        </div>
      </div>
    </section>
  );
}
