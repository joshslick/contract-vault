import React, { useState } from 'react';
import { CATEGORIES } from '../../constants/contractSchema';

export default function FilterMenu({ selectedCategory, onCategoryChange, dateRangeFilter, onDateRangeChange }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="filter-menu-container">
      <button
        type="button"
        className={`btn filter-menu-toggle ${isOpen ? 'is-active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        ⚙ Filters {selectedCategory !== 'All' && `(${selectedCategory})`}
      </button>

      {isOpen && (
        <div className="filter-menu-panel">
          <div className="filter-section">
            <h4>Category</h4>
            <div className="filter-options">
              {CATEGORIES.map((cat) => (
                <label key={cat} className="filter-option">
                  <input
                    type="radio"
                    name="category"
                    value={cat}
                    checked={selectedCategory === cat}
                    onChange={(e) => {
                      onCategoryChange(e.target.value);
                    }}
                  />
                  <span>{cat}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="filter-section">
            <h4>Due Date Range</h4>
            <div className="filter-options">
              <label className="filter-option">
                <input
                  type="radio"
                  name="dateRange"
                  value="all"
                  checked={dateRangeFilter === 'all'}
                  onChange={(e) => onDateRangeChange(e.target.value)}
                />
                <span>All dates</span>
              </label>
              <label className="filter-option">
                <input
                  type="radio"
                  name="dateRange"
                  value="overdue"
                  checked={dateRangeFilter === 'overdue'}
                  onChange={(e) => onDateRangeChange(e.target.value)}
                />
                <span>Overdue</span>
              </label>
              <label className="filter-option">
                <input
                  type="radio"
                  name="dateRange"
                  value="due-soon"
                  checked={dateRangeFilter === 'due-soon'}
                  onChange={(e) => onDateRangeChange(e.target.value)}
                />
                <span>Due soon (7 days)</span>
              </label>
              <label className="filter-option">
                <input
                  type="radio"
                  name="dateRange"
                  value="due-week"
                  checked={dateRangeFilter === 'due-week'}
                  onChange={(e) => onDateRangeChange(e.target.value)}
                />
                <span>Due this week</span>
              </label>
              <label className="filter-option">
                <input
                  type="radio"
                  name="dateRange"
                  value="due-month"
                  checked={dateRangeFilter === 'due-month'}
                  onChange={(e) => onDateRangeChange(e.target.value)}
                />
                <span>Due this month</span>
              </label>
              <label className="filter-option">
                <input
                  type="radio"
                  name="dateRange"
                  value="no-date"
                  checked={dateRangeFilter === 'no-date'}
                  onChange={(e) => onDateRangeChange(e.target.value)}
                />
                <span>No due date</span>
              </label>
            </div>
          </div>

          <div className="filter-actions">
            <button type="button" className="btn btn-sm" onClick={() => setIsOpen(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
