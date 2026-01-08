import React from 'react';

export default function Toast({ toasts }) {
  if (!toasts || toasts.length === 0) return null;
  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast toast--${t.type || 'info'}`}>
          {t.message}
        </div>
      ))}
    </div>
  );
}
