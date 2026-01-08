
import React, { useEffect, useState } from 'react';
import store from '../storage/contractsStore';
import PasswordModal from './PasswordModal';
import Toast from './Toast';

export default function Dashboard({ password, onLock }) {
  const [records, setRecords] = useState([]);
  const CATEGORIES = ['All', 'Financial', 'Insurance', 'Credit/Debit Cards', 'Media', 'Bills', 'Property', 'Medical', 'Wills', 'Travel', 'Subscriptions'];
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [form, setForm] = useState({ title: '', provider: '', dueDate: '', notes: '', category: '' });
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState(null); // 'export' | 'import'
  const [pendingImportText, setPendingImportText] = useState(null);
  const [toasts, setToasts] = useState([]);

  function addToast(message, type = 'info', ttl = 4000) {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), ttl);
  }

  async function load() {
    const recs = await store.getAllEncryptedRecords();
    const decrypted = [];
    for (const r of recs) {
      try {
        const obj = await store.decryptRecord(r, password);
        decrypted.push({ id: r.id, ...obj });
      } catch (e) {
        // skip records that fail to decrypt with this password
      }
    }
    setRecords(decrypted);
  }

  useEffect(() => { load(); }, []);
  async function handleDelete(id) {
    const ok = window.confirm('Delete this contract?');
    if (!ok) return;
    try {
      await store.deleteRecord(id);
      await load();
      addToast('Contract deleted', 'success');
    } catch (err) {
      console.error(err);
      addToast('Delete failed', 'error');
    }
  }

  // Category-specific field schema
  const CATEGORY_FIELDS = {
    'Financial': [
      { key: 'institution', label: 'Institution', type: 'text', required: true },
      { key: 'accountNumber', label: 'Account Number', type: 'text' },
      { key: 'amount', label: 'Amount', type: 'number' },
      { key: 'frequency', label: 'Frequency', type: 'text' }
    ],
    'Insurance': [
      { key: 'insurer', label: 'Insurer', type: 'text', required: true },
      { key: 'policyNumber', label: 'Policy Number', type: 'text' },
      { key: 'coverageType', label: 'Coverage Type', type: 'text' },
      { key: 'premium', label: 'Premium', type: 'number' },
      { key: 'renewalDate', label: 'Renewal Date', type: 'date', hint: 'renewal date' }
    ],
    'Credit/Debit Cards': [
      { key: 'issuer', label: 'Card Issuer', type: 'text', required: true },
      { key: 'last4', label: 'Last 4 Digits', type: 'text' },
      { key: 'limit', label: 'Credit Limit', type: 'number' },
      { key: 'apr', label: 'APR %', type: 'number' },
      { key: 'expirationDate', label: 'Expiration Date', type: 'date', hint: 'expiration date' }
    ],
    'Media': [
      { key: 'serviceName', label: 'Service Name', type: 'text', required: true },
      { key: 'plan', label: 'Plan', type: 'text' },
      { key: 'accountEmail', label: 'Account Email', type: 'text' },
      { key: 'renewalDate', label: 'Renewal Date', type: 'date', hint: 'renewal date' }
    ],
    'Bills': [
      { key: 'biller', label: 'Biller', type: 'text', required: true },
      { key: 'accountNumber', label: 'Account Number', type: 'text' },
      { key: 'amount', label: 'Amount', type: 'number' },
      { key: 'autopay', label: 'Autopay', type: 'text' }
    ],
    'Property': [
      { key: 'address', label: 'Address', type: 'text', required: true },
      { key: 'landlord', label: 'Landlord', type: 'text' },
      { key: 'rent', label: 'Rent', type: 'number' },
      { key: 'leaseEnd', label: 'Lease End', type: 'date', hint: 'lease end date' }
    ],
    'Medical': [
      { key: 'providerName', label: 'Provider', type: 'text', required: true },
      { key: 'appointmentDate', label: 'Appointment Date', type: 'date', hint: 'appointment date' },
      { key: 'policyNumber', label: 'Insurance Policy', type: 'text' }
    ],
    'Wills': [
      { key: 'attorney', label: 'Attorney', type: 'text' },
      { key: 'executor', label: 'Executor', type: 'text' },
      { key: 'documentDate', label: 'Document Date', type: 'date', hint: 'document date' }
    ],
    'Travel': [
      { key: 'destination', label: 'Destination', type: 'text', required: true },
      { key: 'startDate', label: 'Start Date', type: 'date', hint: 'start date' },
      { key: 'endDate', label: 'End Date', type: 'date', hint: 'end date' },
      { key: 'bookingRef', label: 'Booking Ref', type: 'text' }
    ],
    'Subscriptions': [
      { key: 'serviceName', label: 'Service Name', type: 'text', required: true },
      { key: 'plan', label: 'Plan', type: 'text' },
      { key: 'cost', label: 'Cost', type: 'number' },
      { key: 'renewalDate', label: 'Renewal Date', type: 'date', hint: 'renewal date' },
      { key: 'cancelBy', label: 'Cancel By', type: 'date', hint: 'last date to cancel' }
    ]
  };

  const dynamicFields = CATEGORY_FIELDS[form.category] || [];

  async function handleSave(e) {
    e.preventDefault();
    await store.encryptAndSave(form, password);
    setForm({ title: '', provider: '', dueDate: '', notes: '', category: '' });
    await load();
  }

  async function handleExport() {
    // Ask user for a backup password (modal). Use provided session password as default.
    setModalMode('export');
    setModalVisible(true);
  }

  function handleImportClick() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.cvb,application/json';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const text = await file.text();
      setPendingImportText(text);
      setModalMode('import');
      setModalVisible(true);
    };
    input.click();
  }

  async function onModalConfirm(pw) {
    setModalVisible(false);
    if (modalMode === 'export') {
      try {
        const exportPw = pw || password;
        if (!exportPw) {
          addToast('Export cancelled: no password', 'error');
          return;
        }
        const archive = await store.exportAllEncrypted(password, exportPw);
        if (!archive || typeof archive !== 'string') {
          throw new Error('Export failed: empty archive');
        }
        const blob = new Blob([archive], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `contract-vault-backup-${Date.now()}.cvb`;
        a.click();
        URL.revokeObjectURL(url);
        addToast('Export complete — downloaded backup', 'success');
      } catch (err) {
        console.error(err);
        addToast('Export failed — see console for details', 'error');
      }
    } else if (modalMode === 'import') {
      const text = pendingImportText;
      try {
        await store.importEncryptedArchive(text, pw, password);
        await load();
        addToast('Import successful', 'success');
      } catch (err) {
        console.error(err);
        addToast('Import failed: wrong password or corrupted file', 'error');
      } finally {
        setPendingImportText(null);
      }
    }
    setModalMode(null);
  }

  function onModalCancel() {
    setModalVisible(false);
    setModalMode(null);
    setPendingImportText(null);
  }

  return (
  <div className="dashboard">
    {/* Top bar */}
    <div className="topbar">
      <div>
        <h2 style={{ margin: 0 }}>Contract Dashboard</h2>
        <p style={{ margin: '4px 0 0', fontSize: 13 }}>Secure, offline overview of your contracts and subscriptions.</p>
      </div>

      <div className="topbar-actions">
        <button type="button" className="btn" onClick={handleExport}>Export Backup</button>
        <button type="button" className="btn" onClick={handleImportClick}>Import Backup</button>
        <button type="button" className="btn" onClick={onLock}>Lock</button>
      </div>
    </div>

    {/* Category chips */}
    <div className="category-menu">
      <span className="category-label">View:</span>
      {CATEGORIES.map((cat) => (
        <button
          type="button"
          key={cat}
          onClick={() => setSelectedCategory(cat)}
          className={`category-button ${selectedCategory === cat ? 'is-active' : ''}`}
        >
          {cat}
        </button>
      ))}
    </div>

    {/* Grid layout (form + list) */}
    <div>
      {/* Add Contract card */}
      <div className="card">
        <h3 style={{ marginTop: 0, marginBottom: 12 }}>Add Contract</h3>

        <form onSubmit={handleSave}>
          <input
            className="vault-input"
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />

          <input
            className="vault-input"
            placeholder="Provider"
            value={form.provider}
            onChange={(e) => setForm({ ...form, provider: e.target.value })}
          />

          <input
            className="vault-input"
            type="date"
            value={form.dueDate}
            onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
          />

          <select
            className="vault-input"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            required
          >
            <option value="">Select Type</option>
            {CATEGORIES.filter((c) => c !== 'All').map((c) => (
              <option value={c} key={c}>
                {c}
              </option>
            ))}
          </select>

          {/* Dynamic fields */}
          {dynamicFields.length > 0 && (
            <div>
              {dynamicFields.map((f) => {
                const isDate = f.type === 'date';
                const placeholder = isDate && f.hint ? `mm/dd/yyyy ${f.hint}` : f.label;
                return (
                  <input
                    key={f.key}
                    className="vault-input"
                    type={isDate ? 'text' : f.type}
                    placeholder={placeholder}
                    value={form[f.key] || ''}
                    onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                    required={!!f.required}
                  />
                );
              })}
            </div>
          )}

          <textarea
            className="vault-input"
            placeholder="Notes"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
          />

          <button className="btn" type="submit">Save</button>
        </form>
      </div>

      {/* Contract list card */}
      <div className="card">
        <h3 style={{ marginTop: 0, marginBottom: 12 }}>Your Contracts</h3>

        <Toast toasts={toasts} />

        {records.length === 0 ? (
          <p>No contracts saved yet. Add one using the form above.</p>
        ) : (
          <ul className="list-unstyled">
            {(selectedCategory === 'All'
              ? records
              : records.filter((r) => r.category === selectedCategory)
            ).map((r) => (
              <li key={r.id} className="record-item">
                <strong>{r.title || '(no title)'}</strong>
                {' '}
                <span>
                  — {r.provider || '(no provider)'} — {r.dueDate || '(no date)'}
                </span>

                <div className="record-meta">Type: {r.category || '(none)'}</div>
                <div className="record-notes">{r.notes || '(no notes)'}</div>

                <div style={{ marginTop: 4 }}>
                  {(() => {
                    const skip = new Set(['id','title','provider','dueDate','notes','category']);
                    const entries = Object.entries(r).filter(([k, v]) => !skip.has(k) && v);
                    return entries.length > 0 ? (
                      <div>
                        {entries.map(([k, v]) => (
                          <div key={k}><span style={{ color: '#777' }}>{k}:</span> {String(v)}</div>
                        ))}
                      </div>
                    ) : null;
                  })()}
                </div>

                

                <div className="toolbar" style={{ marginTop: 8 }}>
                  <button type="button" className="btn" onClick={() => handleDelete(r.id)}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>

    <PasswordModal
      visible={modalVisible}
      title={
        modalMode === 'export'
          ? 'Password to encrypt backup'
          : 'Password to decrypt backup'
      }
      requireConfirm={modalMode === 'export'}
      onConfirm={onModalConfirm}
      onCancel={onModalCancel}
    />
  </div>
);

}
