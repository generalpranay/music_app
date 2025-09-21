'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

export default function AddToPlaylistButton({ track, className = '' }) {
  const [open, setOpen] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [myPlaylists, setMyPlaylists] = useLocalStorage('userPlaylists', { 'My Mix': [] });
  const lists = Object.keys(myPlaylists || {});

  const addToList = (name) => {
    const listName = (name || '').trim();
    if (!listName || !track) return;
    setMyPlaylists((prev = {}) => {
      const copy = { ...prev };
      copy[listName] = copy[listName] || [];
      if (!copy[listName].some((x) => String(x.id) === String(track.id))) {
        copy[listName].push(track);
      }
      return copy;
    });
  };

  const confirmCreate = () => {
    const name = (newListName || '').trim() || 'My Mix';
    addToList(name);
    setNewListName('');
    setOpen(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setOpen(true); }}
        className={`inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-700 hover:bg-slate-100 ${className}`}
        title="Add to playlist"
      >
        <Plus className="h-4 w-4" />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white p-4 shadow-xl ring-1 ring-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold">Add to playlist</h3>

            {lists.length > 0 && (
              <div className="mt-3 grid grid-cols-2 gap-2">
                {lists.map((name) => (
                  <button
                    key={name}
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); addToList(name); setOpen(false); }}
                    className="rounded-lg border border-slate-200 px-3 py-2 text-left hover:bg-slate-50"
                  >
                    {name}{' '}
                    <span className="text-xs text-slate-500">
                      ({(myPlaylists?.[name] || []).length})
                    </span>
                  </button>
                ))}
              </div>
            )}

            <div className="mt-4">
              <label className="block text-sm text-slate-600">New playlist name</label>
              <input
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                placeholder="e.g. Road Trip"
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setOpen(false); }}
                className="rounded-lg border border-slate-200 px-4 py-2 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); confirmCreate(); }}
                className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
