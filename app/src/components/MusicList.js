'use client';

export default function MusicList({ tracks, onTrackClick }) {
  return (
    <div className="space-y-4">
      {tracks.map((track) => (
        <div
          key={track.id}
          className="border p-4 rounded cursor-pointer hover:bg-gray-100 transition"
          onClick={() => onTrackClick(track)}
        >
          <h3 className="font-semibold">{track.name}</h3>
          <p>{track.artists.map((a) => a.name).join(', ')}</p>
          <p className="text-sm text-gray-500">{track.album.name}</p>
        </div>
      ))}
    </div>
  );
}
