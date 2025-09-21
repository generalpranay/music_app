// app/album/[id]/loading.js
// Route-specific loading UI for album detail

export default function Loading() {
  return (
    <main className="p-6 space-y-6 pb-[120px]">
      {/* Hero / header */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-5 md:flex-row md:items-center">
          <div className="h-36 w-36 shrink-0 rounded-xl bg-slate-200 animate-pulse" />
          <div className="flex-1 min-w-0 space-y-3">
            <div className="h-4 w-24 rounded bg-slate-200 animate-pulse" />
            <div className="h-8 w-2/3 rounded bg-slate-200 animate-pulse" />
            <div className="h-4 w-1/3 rounded bg-slate-200 animate-pulse" />
            <div className="mt-2 flex gap-2">
              <div className="h-9 w-24 rounded-full bg-slate-200 animate-pulse" />
              <div className="h-9 w-28 rounded-full bg-slate-200 animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      {/* Tracks table header */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="grid grid-cols-[auto_1fr_1fr_auto] gap-3 border-b border-slate-200 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
          <span>#</span>
          <span>Title</span>
          <span>Artist</span>
          <span>Time</span>
        </div>

        {/* Track rows skeleton */}
        <ul className="divide-y divide-slate-200">
          {Array.from({ length: 10 }).map((_, i) => (
            <li key={i} className="grid grid-cols-[auto_1fr_1fr_auto] items-center gap-3 px-4 py-3">
              <div className="h-8 w-8 rounded-full bg-slate-200 animate-pulse" />
              <div className="space-y-2 pr-4">
                <div className="h-3 w-2/3 rounded bg-slate-200 animate-pulse" />
                <div className="h-3 w-1/3 rounded bg-slate-200 animate-pulse" />
              </div>
              <div className="h-3 w-1/2 rounded bg-slate-200 animate-pulse" />
              <div className="h-3 w-10 justify-self-end rounded bg-slate-200 animate-pulse" />
            </li>
          ))}
        </ul>
      </div>

      {/* tiny spinner cue (a11y) */}
      <div className="flex items-center justify-center pt-2 text-slate-600">
        <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" aria-hidden="true">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4A4 4 0 004 12z" />
        </svg>
        <span className="ml-2 text-sm">Loading album…</span>
      </div>
    </main>
  );
}
