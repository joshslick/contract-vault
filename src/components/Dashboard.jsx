import React, { useEffect, useState } from 'react';
import { useRecords, useNotifications } from '../hooks';
import { useAuthContext, useToastContext } from '../context';
import PasswordModal from './PasswordModal';
import { CATEGORIES, CATEGORY_CONTRACT_FIELDS } from '../constants/contractSchema';

import AddContractModal from './dashboard/AddContractModal';
import ContractsTable from './dashboard/ContractsTable';
import SearchBar from './dashboard/SearchBar';
import FilterMenu from './dashboard/FilterMenu';
import EditContractModal from './dashboard/EditContractModal';
import ViewContractModal from './dashboard/ViewContractModal';
import NotificationSettings from './dashboard/NotificationSettings';
import useBackupFlow from '../hooks/UseBackupFlow';

export default function Dashboard({ password, onLock }) {
  const { records, isLoading, loadRecords, addRecord, deleteRecord, updateRecord } = useRecords(password);
  const { success, error: addError } = useToastContext();
  const { sessionPassword } = useAuthContext();
  const { userEmail, setEmail: setNotificationEmail, clearNotificationsForRecord } = useNotifications(records);

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRangeFilter, setDateRangeFilter] = useState('all');
  const [editingContract, setEditingContract] = useState(null);
  const [viewingContract, setViewingContract] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  useEffect(() => {
    loadRecords();
  }, [loadRecords]);

  async function handleAddContractSave(form) {
    try {
      const contract = {
        title: form.title,
        provider: form.provider,
        dueDate: form.endDate,
        notes: form.notes,
        category: form.category,
        username: form.username,
        password: form.password,
        beginDate: form.beginDate,
        amount: form.amount,
      };
      await addRecord(contract);
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

  async function handleEditSave(id, updatedForm) {
    try {
      await updateRecord(id, updatedForm);
      // Clear notification state when contract is updated
      clearNotificationsForRecord(id);
      setEditingContract(null);
      setIsEditModalOpen(false);
      success('Contract updated');
    } catch (err) {
      console.error(err);
      addError('Update failed');
    }
  }

  // Filter and search records
  const getFilteredRecords = () => {
    let filtered = records;

    // Apply search
    if (searchQuery.trim()) {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.title?.toLowerCase().includes(lowerQuery) ||
          r.provider?.toLowerCase().includes(lowerQuery) ||
          r.category?.toLowerCase().includes(lowerQuery) ||
          r.notes?.toLowerCase().includes(lowerQuery)
      );
    }

    // Apply category filter
    if (selectedCategory !== 'All') {
      filtered = filtered.filter((r) => r.category === selectedCategory);
    }

    // Apply date range filter
    if (dateRangeFilter !== 'all') {
      filtered = filtered.filter((r) => {
        if (!r.dueDate) {
          return dateRangeFilter === 'no-date';
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const dueDate = new Date(r.dueDate);
        dueDate.setHours(0, 0, 0, 0);
        const daysLeft = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));

        switch (dateRangeFilter) {
          case 'overdue':
            return daysLeft < 0;
          case 'due-soon':
            return daysLeft >= 0 && daysLeft <= 7;
          case 'due-week':
            return daysLeft >= 0 && daysLeft <= 7;
          case 'due-month':
            return daysLeft >= 0 && daysLeft <= 30;
          case 'no-date':
            return false;
          default:
            return true;
        }
      });
    }

    return filtered;
  };

  const onEditStart = (contract) => {
    setEditingContract(contract);
    setIsEditModalOpen(true);
  };

  const onViewStart = (contract) => {
    setViewingContract(contract);
    setIsViewModalOpen(true);
  };

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
      <div className="dashboard-controls">
        <div className="controls-row">
          <SearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
          <FilterMenu
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            dateRangeFilter={dateRangeFilter}
            onDateRangeChange={setDateRangeFilter}
          />
          <button 
            className="btn-add-contract" 
            onClick={() => setIsAddModalOpen(true)}
          >
            + Add Contract
          </button>
        </div>
      </div>

      {/* Grid layout */}
      <div>
        <NotificationSettings
          userEmail={userEmail}
          onEmailChange={setNotificationEmail}
        />

        <ContractsTable
          records={getFilteredRecords()}
          selectedCategory={selectedCategory}
          onDelete={handleDelete}
          onEdit={onEditStart}
          onView={onViewStart}
        />
      </div>

      {isEditModalOpen && editingContract && (
        <EditContractModal
          contract={editingContract}
          categories={CATEGORIES}
          onSave={handleEditSave}
          onCancel={() => {
            setEditingContract(null);
            setIsEditModalOpen(false);
          }}
        />
      )}

      {isViewModalOpen && viewingContract && (
        <ViewContractModal
          contract={viewingContract}
          onClose={() => {
            setViewingContract(null);
            setIsViewModalOpen(false);
          }}
        />
      )}

      {isAddModalOpen && (
        <AddContractModal
          onSave={handleAddContractSave}
          onClose={() => setIsAddModalOpen(false)}
        />
      )}

      <PasswordModal {...backup.modalProps} />
    </div>
  );
}
