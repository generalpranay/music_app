// app/loading.js
// Route-level loading UI (server component)

export default function Loading() {
  return (
    <div className="p-6 space-y-8">
      {/* page title / heading */}
      <div className="h-7 w-56 rounded bg-slate-200 animate-pulse" />

      {/* chips row */}
      <div className="flex flex-wrap gap-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="h-9 w-28 rounded-full bg-slate-200 animate-pulse"
          />
        ))}
      </div>

      {/* card grid (e.g., playlists/albums/artists) */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-slate-200 bg-white p-3"
          >
            <div className="mb-3 h-36 w-full rounded-lg bg-slate-200 animate-pulse" />
            <div className="mb-2 h-3 w-3/5 rounded bg-slate-200 animate-pulse" />
            <div className="h-3 w-2/5 rounded bg-slate-200 animate-pulse" />
          </div>
        ))}
      </div>

      {/* track list skeleton */}
      <ul className="space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <li
            key={i}
            className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4"
          >
            <div className="h-16 w-16 rounded bg-slate-200 animate-pulse" />
            <div className="flex-1">
              <div className="mb-2 h-3 w-1/3 rounded bg-slate-200 animate-pulse" />
              <div className="h-3 w-1/5 rounded bg-slate-200 animate-pulse" />
            </div>
            <div className="hidden sm:block h-3 w-16 rounded bg-slate-200 animate-pulse" />
            <div className="flex gap-2">
              <div className="h-9 w-9 rounded-full bg-slate-200 animate-pulse" />
              <div className="h-9 w-9 rounded-full bg-slate-200 animate-pulse" />
            </div>
          </li>
        ))}
      </ul>

      {/* subtle spinner footer (accessibility cue) */}
      <div className="flex items-center justify-center py-4 text-slate-600">
        <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" aria-hidden="true">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4A4 4 0 004 12z" />
        </svg>
        <span className="ml-2 text-sm">Loading…</span>
      </div>
    </div>
  );
}
