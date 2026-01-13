import React from 'react';

export default function ViewContractModal({ contract, onClose }) {
  if (!contract) return null;

  const formatDate = (date) => {
    if (!date) return 'Not set';
    try {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return date;
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card view-modal" onClick={(e) => e.stopPropagation()}>
        <h3 style={{ marginTop: 0, marginBottom: 16 }}>Contract Details</h3>

        <div className="view-contract-grid">
          <div className="view-field">
            <label>Type</label>
            <div className="view-value">{contract.category || 'Not specified'}</div>
          </div>

          <div className="view-field">
            <label>Title</label>
            <div className="view-value">{contract.title || 'Not specified'}</div>
          </div>

          <div className="view-field">
            <label>Contact Info / Provider</label>
            <div className="view-value">{contract.provider || 'Not specified'}</div>
          </div>

          <div className="view-field">
            <label>Username</label>
            <div className="view-value">{contract.username || 'Not specified'}</div>
          </div>

          <div className="view-field">
            <label>Password</label>
            <div className="view-value">
              {contract.password || 'Not specified'}
            </div>
          </div>

          <div className="view-field">
            <label>Beginning Date</label>
            <div className="view-value">{formatDate(contract.beginDate)}</div>
          </div>

          <div className="view-field">
            <label>End Date / Due Date</label>
            <div className="view-value">{formatDate(contract.dueDate)}</div>
          </div>

          <div className="view-field">
            <label>Amount</label>
            <div className="view-value">
              {contract.amount ? `$${parseFloat(contract.amount).toFixed(2)}` : 'Not specified'}
            </div>
          </div>

          <div className="view-field full-width">
            <label>Notes</label>
            <div className="view-value" style={{ whiteSpace: 'pre-wrap' }}>
              {contract.notes || 'No notes'}
            </div>
          </div>
        </div>

        <div className="modal-actions" style={{ marginTop: 20 }}>
          <button type="button" className="btn btn-primary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
