/*Global error component for the app*/
'use client';

export default function Error({ error, reset }) {
  return (
    <div className="p-6 text-red-600">
      <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
      <p className="mb-4">{error?.message ?? 'Please try again.'}</p>
      <button onClick={() => reset()} className="bg-blue-600 text-white px-4 py-2 rounded">
        Try again
      </button>
    </div>
  );
}
