import React from 'react';

export default function SearchBar({ searchQuery, onSearchChange, placeholder = 'Search contracts...' }) {
  return (
    <div className="search-bar-container">
      <input
        type="text"
        className="vault-input search-input"
        placeholder={placeholder}
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      {searchQuery && (
        <button
          type="button"
          className="btn btn-sm clear-search-btn"
          onClick={() => onSearchChange('')}
          title="Clear search"
        >
          ✕
        </button>
      )}
    </div>
  );
}
