'use client';

export default function MusicList({ tracks, onTrackClick }) {
  return (
    <div className="space-y-4">
      {tracks.map((track) => (
        <div
          key={track.id}
          className="border p-4 rounded cursor-pointer hover:bg-gray-100 transition flex items-center gap-4"
          onClick={() => onTrackClick(track)}
        >
          {/* Album Art */}
          <img
            src={track.album.cover_medium}
            alt="Album Art"
            className="w-16 h-16 rounded object-cover"
          />

          {/* Track Info */}
          <div>
            <h3 className="font-semibold">{track.title}</h3>
            <p>{track.artist.name}</p>
            <p className="text-sm text-gray-500">{track.album.title}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

