'use client';

import Link from 'next/link';
import { useState, useRef } from 'react';
import { Menu, Search, User } from 'lucide-react';
import SearchBar from '@/components/SearchBar';

export default function AppHeaderBlue({
  title = '🎶 DucMix',
  onSearch,
  initialQuery = '',
  onMenuClick,
}) {
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const wrapRef = useRef(null);

  return (
    <header
      className="
        sticky top-0 z-40 w-full
        bg-gradient-to-r from-[#b5e2ff] via-[#8fd3fe] to-[#6ac5fe]
        shadow-[0_12px_30px_-12px_rgba(69,182,254,0.55)]
        border-b border-white/40 backdrop-blur
      "
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* make it 'fat' */}
        <div className="grid h-20 grid-cols-[auto_1fr_auto] items-center gap-4">
          {/* Left: menu (mobile) + brand */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onMenuClick}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl
                         hover:bg-white/30 active:scale-[0.98] lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6 text-slate-800/90" />
            </button>

            <Link
              href="/"
              onClick={() => onSearch?.('')}
              className="rounded-lg px-2 text-2xl font-extrabold tracking-tight
                         text-[#0b69b7] hover:bg-white/30"
              aria-label="Go to home"
            >
              {title}
            </Link>
          </div>

          {/* Center: BIG rounded search pill */}
          <div className="min-w-0">
            <div className="mx-auto w-full max-w-2xl" ref={wrapRef}>
              <div
                className="
                  relative rounded-full bg-white/85 ring-1 ring-white/70
                  shadow-sm hover:shadow-md transition backdrop-blur
                "
              >
                <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">
                  <Search className="h-5 w-5 text-slate-500" />
                </div>

                <SearchBar
                  unstyled
                  onSearch={onSearch}
                  initialQuery={initialQuery}
                  inputId="global-search-input"
                  className="w-full"
                  inputClassName="
                    text-slate-900 placeholder:text-slate-500
                    pl-12 pr-5 py-3 text-base
                  "
                />
              </div>
            </div>
          </div>

          {/* Right: profile placeholder */}
          <div className="flex items-center justify-end">
            <button
              type="button"
              className="
                inline-flex h-10 w-10 items-center justify-center overflow-hidden
                rounded-full bg-white/85 ring-1 ring-white/70 hover:ring-white transition
                backdrop-blur
              "
              aria-label="Profile"
            >
              <User className="h-5 w-5 text-slate-700" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile search drawer */}
      <div className={`lg:hidden ${mobileSearchOpen ? 'block' : 'hidden'} border-t border-white/40`}>
        <div className="mx-auto max-w-6xl px-4 py-3">
          <div className="relative rounded-full bg-white/90 ring-1 ring-white/70 shadow">
            <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">
              <Search className="h-5 w-5 text-slate-500" />
            </div>
            <SearchBar
              unstyled
              onSearch={(q) => { onSearch?.(q); setMobileSearchOpen(false); }}
              initialQuery={initialQuery}
              inputId="global-search-input"
              className="w-full"
              inputClassName="text-slate-900 placeholder:text-slate-500 pl-12 pr-5 py-3"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
