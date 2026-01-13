import React, { useState } from 'react';
import { CATEGORIES } from '../../constants/contractSchema';

export default function AddContractModal({ onClose, onSave }) {
  const [form, setForm] = useState({
    title: '',
    provider: '',
    username: '',
    password: '',
    beginDate: '',
    endDate: '',
    amount: '',
    notes: '',
    category: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title || !form.category) {
      alert('Title and Type are required');
      return;
    }
    onSave(form);
    // Reset form
    setForm({
      title: '',
      provider: '',
      username: '',
      password: '',
      beginDate: '',
      endDate: '',
      amount: '',
      notes: '',
      category: '',
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card add-contract-modal" onClick={(e) => e.stopPropagation()}>
        <h3 style={{ marginTop: 0, marginBottom: 16 }}>Add Contract</h3>

        <form onSubmit={handleSubmit}>
          {/* Contract Type Dropdown */}
          <select
            className="vault-input"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            required
            style={{ marginBottom: 12 }}
          >
            <option value="">Select Contract Type *</option>
            {CATEGORIES.filter((c) => c !== 'All').map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          {/* Title */}
          <input
            className="vault-input"
            placeholder="Title *"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
            style={{ marginBottom: 12 }}
          />

          {/* Contact Info */}
          <input
            className="vault-input"
            placeholder="Contact Info / Provider"
            value={form.provider}
            onChange={(e) => setForm({ ...form, provider: e.target.value })}
            style={{ marginBottom: 12 }}
          />

          {/* Username */}
          <input
            className="vault-input"
            placeholder="Username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            style={{ marginBottom: 12 }}
          />

          {/* Password */}
          <input
            className="vault-input"
            placeholder="Password"
            type="text"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            style={{ marginBottom: 12 }}
          />

          {/* Beginning Date */}
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', color: '#9ca3af', fontSize: '0.85rem', marginBottom: 4 }}>
              Beginning Date
            </label>
            <input
              className="vault-input"
              type="date"
              value={form.beginDate}
              onChange={(e) => setForm({ ...form, beginDate: e.target.value })}
            />
          </div>

          {/* End Date */}
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', color: '#9ca3af', fontSize: '0.85rem', marginBottom: 4 }}>
              End Date / Due Date
            </label>
            <input
              className="vault-input"
              type="date"
              value={form.endDate}
              onChange={(e) => setForm({ ...form, endDate: e.target.value })}
            />
          </div>

          {/* Amount */}
          <input
            className="vault-input"
            placeholder="Amount"
            type="number"
            step="0.01"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            style={{ marginBottom: 12 }}
          />

          {/* Notes */}
          <textarea
            className="vault-input"
            placeholder="Notes"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            rows={3}
            style={{ marginBottom: 12 }}
          />

          {/* Actions */}
          <div className="modal-actions">
            <button
              type="button"
              className="btn"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
            >
              Save Contract
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}