import React, { useEffect, useState } from 'react';
import { CATEGORIES } from '../../constants/contractSchema';

export default function EditContractModal({ contract, categories, onSave, onCancel }) {
  const [form, setForm] = useState({
    title: '',
    provider: '',
    username: '',
    password: '',
    beginDate: '',
    dueDate: '',
    amount: '',
    notes: '',
    category: '',
  });

  useEffect(() => {
    if (contract) {
      setForm({
        title: contract.title || '',
        provider: contract.provider || '',
        username: contract.username || '',
        password: contract.password || '',
        beginDate: contract.beginDate || '',
        dueDate: contract.dueDate || '',
        amount: contract.amount || '',
        notes: contract.notes || '',
        category: contract.category || '',
      });
    }
  }, [contract]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.category) {
      alert('Title and Type are required');
      return;
    }
    try {
      await onSave(contract.id, form);
    } catch (err) {
      console.error(err);
    }
  };

  if (!contract) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-card edit-modal" onClick={(e) => e.stopPropagation()}>
        <h3 style={{ marginTop: 0, marginBottom: 16 }}>Edit Contract</h3>

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

          {/* End Date / Due Date */}
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', color: '#9ca3af', fontSize: '0.85rem', marginBottom: 4 }}>
              End Date / Due Date
            </label>
            <input
              className="vault-input"
              type="date"
              value={form.dueDate}
              onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
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
            <button type="button" className="btn" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}