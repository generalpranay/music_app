/*route specific error component for artist page*/
'use client';
export default function Error({ error, reset }) {
  return (
    <div className="p-6">
      <p className="text-red-600">Failed to load artist: {error?.message}</p>
      <button onClick={() => reset()} className="mt-3 px-3 py-1 bg-blue-600 text-white rounded">
        Try again
      </button>
    </div>
  );
}