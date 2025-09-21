'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { useEffect } from 'react';

export default function CoolBackButton({
  href,                // optional: if provided, uses <Link>; else router.back()
  label = 'Back',
  className = '',
  preserveQuery = false, // if true and href provided, append current ?q&tab
  onClick,
}) {
  const router = useRouter();
  const sp = useSearchParams();

  // Keyboard shortcut: ESC to go back
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') router.back(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [router]);

  const computedHref = (() => {
    if (!href) return undefined;
    if (!preserveQuery) return href;
    const qs = sp?.toString();
    return qs ? `${href}?${qs}` : href;
  })();

  // Unified button inner (gradient pill + micro-interactions)
  const Inner = (
    <span
      className="relative inline-flex items-center gap-2 rounded-full
                 px-3.5 py-2 text-sm font-medium
                 text-blue-700 dark:text-blue-100
                 bg-gradient-to-r from-blue-50 to-indigo-50
                 dark:from-slate-800/60 dark:to-slate-800/30
                 ring-1 ring-blue-200/60 dark:ring-slate-700
                 shadow-[inset_0_0_0_1px_rgba(255,255,255,.6)]
                 transition-all duration-200
                 group-hover:-translate-x-0.5
                 group-active:scale-[0.98]
                 backdrop-blur
                 before:absolute before:inset-0 before:rounded-full
                 before:bg-gradient-to-r before:from-white/60 before:to-transparent
                 before:opacity-0 group-hover:before:opacity-100 before:transition
                 after:absolute after:-inset-px after:rounded-full
                 after:ring-1 after:ring-inset after:ring-white/60 dark:after:ring-white/5"
    >
      <ArrowLeft className="h-4 w-4 opacity-80 group-hover:opacity-100 transition" />
      <span>{label}</span>
    </span>
  );

  const rootClasses =
    "group inline-flex select-none items-center " +
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/70 " +
    className;

  if (computedHref) {
    return (
      <Link href={computedHref} className={rootClasses} onClick={onClick} aria-label={label}>
        {Inner}
      </Link>
    );
  }

  return (
    <button
      type="button"
      aria-label={label}
      onClick={(e) => { onClick?.(e); router.back(); }}
      className={rootClasses}
    >
      {Inner}
    </button>
  );
}