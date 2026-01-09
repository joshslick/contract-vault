import React from 'react';
import Toast from '../Toast';

function RecordMeta({ record }) {
  const skip = new Set(['id', 'title', 'provider', 'dueDate', 'notes', 'category']);
  const entries = Object.entries(record).filter(([k, v]) => !skip.has(k) && v);

  if (entries.length === 0) return null;

  return (
    <div style={{ marginTop: 4 }}>
      {entries.map(([k, v]) => (
        <div key={k}>
          <span style={{ color: '#777' }}>{k}:</span> {String(v)}
        </div>
      ))}
    </div>
  );
}

function RecordItem({ record, onDelete }) {
  return (
    <li className="record-item">
      <strong>{record.title || '(no title)'}</strong>{' '}
      <span>
        — {record.provider || '(no provider)'} — {record.dueDate || '(no date)'}
      </span>

      <div className="record-meta">Type: {record.category || '(none)'}</div>
      <div className="record-notes">{record.notes || '(no notes)'}</div>

      <RecordMeta record={record} />

      <div className="toolbar" style={{ marginTop: 8 }}>
        <button type="button" className="btn" onClick={() => onDelete(record.id)}>
          Delete
        </button>
      </div>
    </li>
  );
}

export default function ContractsCard({ records, selectedCategory, onDelete }) {
  const filtered =
    selectedCategory === 'All'
      ? records
      : records.filter((r) => r.category === selectedCategory);

  return (
    <div className="card">
      <h3 style={{ marginTop: 0, marginBottom: 12 }}>Your Contracts</h3>

      {/* If your Toast context renders toasts globally, you can remove this */}
      <Toast />

      {records.length === 0 ? (
        <p>No contracts saved yet. Add one using the form above.</p>
      ) : (
        <ul className="list-unstyled">
          {filtered.map((r) => (
            <RecordItem key={r.id} record={r} onDelete={onDelete} />
          ))}
        </ul>
      )}
    </div>
  );
}
