import React, { useEffect, useState } from 'react';
import { useRecords } from '../hooks';
import { useAuthContext, useToastContext } from '../context';
import PasswordModal from './PasswordModal';
import { CATEGORIES, CATEGORY_CONTRACT_FIELDS } from '../constants/contractSchema';

import AddContractCard from './dashboard/AddContractCard';
import ContractsCard from './dashboard/ContractCard';
import useBackupFlow from '../hooks/useBackupFlow';

export default function Dashboard({ password, onLock }) {
  const { records, isLoading, loadRecords, addRecord, deleteRecord } = useRecords(password);
  const { success, error: addError } = useToastContext();
  const { sessionPassword } = useAuthContext();

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [form, setForm] = useState({
    title: '',
    provider: '',
    dueDate: '',
    notes: '',
    category: '',
  });

  const dynamicFields = CATEGORY_CONTRACT_FIELDS[form.category] || [];

  useEffect(() => {
    loadRecords();
  }, [loadRecords]);

  async function handleSave(e) {
    e.preventDefault();
    try {
      await addRecord(form);
      setForm({ title: '', provider: '', dueDate: '', notes: '', category: '' });
      success('Contract saved');
    } catch (err) {
      console.error(err);
      addError('Save failed');
    }
  }

  async function handleDelete(id) {
    const ok = window.confirm('Delete this contract?');
    if (!ok) return;
    try {
      await deleteRecord(id);
      success('Contract deleted');
    } catch (err) {
      console.error(err);
      addError('Delete failed');
    }
  }

  const backup = useBackupFlow({
    password,
    sessionPassword,
    loadRecords,
    success,
    addError,
  });

  return (
    <div className="dashboard">
      {isLoading && (
      <div className="loading-overlay">
        <div className="loading-card">
          <div className="spinner" />
          <div style={{ marginTop: 10, fontSize: 30 }}>Decrypting contracts…</div>
        </div>
      </div>
    )}
      {/* Top bar */}
      <div className="topbar">
        <div>
          <h2 style={{ margin: 0 }}>Contract Dashboard</h2>
          <p style={{ margin: '4px 0 0', fontSize: 13 }}>
            Secure, offline overview of your contracts and subscriptions.
          </p>
        </div>

        
        <div className="topbar-actions">
          <button type="button" className="btn" onClick={backup.openExportModal}>
            Export Backup
          </button>
          <button type="button" className="btn" onClick={backup.openImportPicker}>
            Import Backup
          </button>
          <button type="button" className="btn" onClick={onLock}>
            Lock
          </button>
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

      {/* Grid layout */}
      <div>
        <AddContractCard
          form={form}
          setForm={setForm}
          dynamicFields={dynamicFields}
          categories={CATEGORIES}
          onSave={handleSave}
        />

        <ContractsCard
          records={records}
          selectedCategory={selectedCategory}
          onDelete={handleDelete}
        />
      </div>

      <PasswordModal {...backup.modalProps} />
    </div>
  );
}
