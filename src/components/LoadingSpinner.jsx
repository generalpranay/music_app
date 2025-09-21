'use client';

export default function LoadingSpinner({ label = 'Loading' }) {
  return (
    <div className="flex items-center justify-center py-8">
      <span className="relative inline-flex items-center gap-3 text-slate-600">
        <svg className="h-6 w-6 animate-spin" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
          <path className="opacity-75" fill="currentColor"
            d="M4 12a8 8 0 018-8v4A4 4 0 004 12z"/>
        </svg>
        <span className="text-sm">{label}…</span>
      </span>
    </div>
  );
}
