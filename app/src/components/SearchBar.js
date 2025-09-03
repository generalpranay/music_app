import { useState } from 'react';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query) {
      onSearch(query);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 flex w-half">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for music..."
        className="flex-1 p-2 border rounded-l w-full text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600 transition"
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar;
