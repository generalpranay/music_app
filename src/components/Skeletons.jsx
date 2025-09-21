//Skeleton for loading states
'use client';

function cn(...cls) { return cls.filter(Boolean).join(' '); }

export function TrackSkeleton({ count = 8 }) {
  return (
    <ul className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <li key={i} className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4">
          <div className="h-16 w-16 animate-pulse rounded bg-slate-200" />
          <div className="flex-1">
            <div className="mb-2 h-3 w-1/3 animate-pulse rounded bg-slate-200" />
            <div className="h-3 w-1/5 animate-pulse rounded bg-slate-200" />
          </div>
          <div className="hidden sm:block h-3 w-16 animate-pulse rounded bg-slate-200" />
          <div className="flex gap-2">
            <div className="h-9 w-9 animate-pulse rounded-full bg-slate-200" />
            <div className="h-9 w-9 animate-pulse rounded-full bg-slate-200" />
          </div>
        </li>
      ))}
    </ul>
  );
}

export function CardSkeleton({ count = 6 }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-xl border border-slate-200 bg-white p-3">
          <div className="mb-3 h-36 w-full animate-pulse rounded-lg bg-slate-200" />
          <div className="mb-2 h-3 w-2/3 animate-pulse rounded bg-slate-200" />
          <div className="h-3 w-1/3 animate-pulse rounded bg-slate-200" />
        </div>
      ))}
    </div>
  );
}

export function ChipSkeletonRow({ count = 10 }) {
  return (
    <div className="flex flex-wrap gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="h-8 w-24 animate-pulse rounded-full bg-slate-200" />
      ))}
    </div>
  );
}
