'use client';

import Link from 'next/link';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import {
  House,
  Music2,
  Disc3,
  UserRound,
  Heart,
  ListMusic,
  ChevronLeft
} from 'lucide-react';
import { useMemo } from 'react';

const Section = ({ title, children }) => (
  <div className="space-y-2">
    <p className="px-3 text-xs font-semibold uppercase tracking-wide text-slate-500">{title}</p>
    <div className="space-y-1">{children}</div>
  </div>
);

function NavItem({ href, icon: Icon, label, active, onClick }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition
        ${active ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-200'}
      `}
    >
      <Icon className="h-4 w-4" />
      <span className="truncate">{label}</span>
    </Link>
  );
}

/**
 * Props:
 * - activeTab?: 'tracks'|'albums'|'artists'|'favorites'|'playlists'
 * - setActiveTab?: (tab:string)=>void 
 * - currentQuery?: string  (so we preserve q when switching Browse tabs)
 * - chartParam?: string    (so we preserve chart when switching Browse tabs)
 */
export default function Sidebar({
  activeTab,
  setActiveTab,
  currentQuery = '',
  chartParam = '',
}) {
  const pathname = usePathname();
  const sp = useSearchParams();
  const router = useRouter();

  // Are we on a playlist detail page?
  const onPlaylistDetail = pathname.startsWith('/playlist/');

  const q = currentQuery || sp.get('q') || '';
  const chart = chartParam || sp.get('chart') || '';

  // Build href for browse tabs while keeping context (q || chart)
  const hrefForTab = (tab) => {
    if (q) return `/?q=${encodeURIComponent(q)}&tab=${tab}`;
    if (chart) return `/?tab=${tab}&chart=${encodeURIComponent(chart)}`;
    return `/?tab=${tab}`;
  };

  // Determine "active" state via URL first; fallback to activeTab prop
  const activeFromUrl = useMemo(() => {
    if (pathname === '/' && !sp.get('tab') && !sp.get('q') && !sp.get('chart')) return 'home';
    const tab = sp.get('tab');
    if (tab) return tab;
    if (onPlaylistDetail) return 'playlists';
    return null;
  }, [pathname, sp, onPlaylistDetail]);

  const isActive = (tab) => {
    const base = activeFromUrl || activeTab;
    return base === tab;
  };

  // Back to playlists handler from detail page (works even if JS disabled due to <Link/>)
  const backToPlaylistsHref = '/?tab=playlists';

  return (
    <aside className="w-64 bg-gray-100 border-r p-4 space-y-6">
      {/* HOME */}
      <Section title="Home">
        <NavItem
          href="/"
          icon={House}
          label="Home"
          active={pathname === '/' && !sp.get('tab')}
        />
      </Section>

      {/* BROWSE */}
      <Section title="Browse">
        <NavItem
          href={hrefForTab('tracks')}
          icon={Music2}
          label="Tracks"
          active={isActive('tracks')}
        />
        <NavItem
          href={hrefForTab('albums')}
          icon={Disc3}
          label="Albums"
          active={isActive('albums')}
        />
        <NavItem
          href={hrefForTab('artists')}
          icon={UserRound}
          label="Artists"
          active={isActive('artists')}
        />
      </Section>

      {/* LIBRARY */}
      <Section title="Library">
        <NavItem
          href="/?tab=favorites"
          icon={Heart}
          label="Favorites"
          active={isActive('favorites')}
        />
        <NavItem
          href="/?tab=playlists"
          icon={ListMusic}
          label="Playlists"
          active={isActive('playlists') && !onPlaylistDetail}
        />
        {onPlaylistDetail && (
          <div className="mt-1 space-y-1">
            <p className="px-3 text-xs text-slate-500">You’re viewing a playlist</p>
            <Link
              href={backToPlaylistsHref}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-200"
              title="Back to Playlists"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Back to Playlists</span>
            </Link>
          </div>
        )}
      </Section>
    </aside>
  );
}
