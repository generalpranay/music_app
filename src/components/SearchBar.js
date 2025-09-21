'use client';
import { useEffect, useState } from 'react';

export default function SearchBar({
  onSearch,
  initialQuery = '',
  placeholder = 'Search for music…',
  inputId,
  // layout controls
  unstyled = false,           
  className = '',
  inputClassName = '',
  buttonClassName = '',
  showButton,                 
}) {
  const [query, setQuery] = useState(initialQuery);
  useEffect(() => { setQuery(initialQuery); }, [initialQuery]);

  const handleSubmit = (e) => {
    e?.preventDefault?.();
    const q = (query || '').trim();
    if (onSearch) onSearch(q);
  };

  const renderButton = (showButton ?? !unstyled);

  if (unstyled) {
    // Minimal markup for embedding inside custom wrappers (e.g., header pill with icon)
    return (
      <form
        onSubmit={(e) => { e.preventDefault(); handleSubmit(e); }}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
        className={className}
      >
        <input
          id={inputId}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className={`w-full bg-transparent outline-none ${inputClassName}`}
          autoComplete="off"
        />
        {renderButton && (
          <button type="button" onClick={handleSubmit} className={buttonClassName}>
            Search
          </button>
        )}
      </form>
    );
  }

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); handleSubmit(e); }}
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => e.stopPropagation()}
      className={`mb-6 flex w-full ${className}`}
    >
      {/* Full search bar with input and button */}
      <input
        id={inputId}
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className={`flex-1 w-full p-2 border rounded-l text-gray-900 placeholder-gray-500
                    focus:outline-none focus:ring-2 focus:ring-blue-400 ${inputClassName}`}
      />
      {renderButton && (
        <button
          type="button" onClick={handleSubmit}
          className={`bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600 transition ${buttonClassName}`}
        >
          Search
        </button>
      )}
    </form>
  );
}
