import React from 'react';

export default function ModeTabs({ mode, onChangeMode }) {
  return (
    <div className="tab-buttons" style={{ marginBottom: 12, display: 'flex', gap: 24 }}>
      <button
        type="button"
        className={`tab-button ${mode === 'existing' ? 'is-active' : ''}`}
        onClick={() => onChangeMode('existing')}
      >
        Use Existing Password
      </button>
      <button
        type="button"
        className={`tab-button ${mode === 'new' ? 'is-active' : ''}`}
        onClick={() => onChangeMode('new')}
      >
        Create New Password
      </button>
    </div>
  );
}
