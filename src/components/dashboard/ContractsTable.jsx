import React, { useState } from 'react';

function ContractsTable({ records, onDelete, onEdit, onView, selectedCategory }) {
  const [sortConfig, setSortConfig] = useState({ key: 'dueDate', direction: 'asc' });

  // Filter by category
  const filtered =
    selectedCategory === 'All'
      ? records
      : records.filter((r) => r.category === selectedCategory);

  // Sort records
  const sorted = [...filtered].sort((a, b) => {
    const aVal = a[sortConfig.key] || '';
    const bVal = b[sortConfig.key] || '';

    if (typeof aVal === 'string') {
      const comparison = aVal.localeCompare(bVal);
      return sortConfig.direction === 'asc' ? comparison : -comparison;
    }

    if (sortConfig.direction === 'asc') {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const formatDate = (date) => {
    if (!date) return '';
    try {
      return new Date(date).toLocaleDateString('en-US', {
        year: '2-digit',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return date;
    }
  };

  const getDaysUntilDue = (dueDate) => {
    if (!dueDate) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);
    const diff = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const getExpirationStatus = (daysLeft) => {
    if (daysLeft === null) return '';
    if (daysLeft < 0) return 'expired';
    if (daysLeft === 0) return 'due-today';
    if (daysLeft === 1) return 'due-tomorrow';
    if (daysLeft <= 7) return 'due-soon';
    return '';
  };

  const SortHeader = ({ label, sortKey }) => (
    <th onClick={() => handleSort(sortKey)} style={{ cursor: 'pointer', userSelect: 'none' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        {label}
        {sortConfig.key === sortKey && (
          <span style={{ fontSize: '0.8em' }}>{sortConfig.direction === 'asc' ? '▲' : '▼'}</span>
        )}
      </div>
    </th>
  );

  if (records.length === 0) {
    return (
      <div className="contracts-table-container">
        <p>No contracts saved yet. Add one using the form above.</p>
      </div>
    );
  }

  return (
    <div className="contracts-table-container">
      <table className="contracts-table">
        <thead>
          <tr>
            <SortHeader label="Title" sortKey="title" />
            <SortHeader label="Provider" sortKey="provider" />
            <SortHeader label="Category" sortKey="category" />
            <SortHeader label="Due Date" sortKey="dueDate" />
            <SortHeader label="Notes" sortKey="notes" />
            <th style={{ width: '180px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((record) => {
            const daysLeft = getDaysUntilDue(record.dueDate);
            const status = getExpirationStatus(daysLeft);
            const statusLabel =
              daysLeft === null
                ? ''
                : daysLeft < 0
                  ? `${Math.abs(daysLeft)} days overdue`
                  : daysLeft === 0
                    ? 'Due today'
                    : daysLeft === 1
                      ? 'Due tomorrow'
                      : `${daysLeft} days left`;

            return (
              <tr key={record.id} className={`record-row ${status}`}>
                <td className="cell-title">
                  <strong>{record.title || '(no title)'}</strong>
                </td>
                <td className="cell-provider">{record.provider || '(no provider)'}</td>
                <td className="cell-category">{record.category || '(none)'}</td>
                <td className="cell-date">
                  <div className={`date-cell ${status}`}>
                    {formatDate(record.dueDate)}
                    {statusLabel && <div className="status-label">{statusLabel}</div>}
                  </div>
                </td>
                <td className="cell-notes">{record.notes || ''}</td>
                <td className="cell-actions">
                  <button
                    type="button"
                    className="btn btn-sm btn-view"
                    onClick={() => onView(record)}
                    title="View"
                  >
                    View
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-edit"
                    onClick={() => onEdit(record)}
                    title="Edit"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-delete"
                    onClick={() => {
                      const ok = window.confirm(`Delete "${record.title}"?`);
                      if (ok) onDelete(record.id);
                    }}
                    title="Delete"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="table-footer">
        {sorted.length} contract{sorted.length !== 1 ? 's' : ''}
      </div>
    </div>
  );
}

export default ContractsTable;
