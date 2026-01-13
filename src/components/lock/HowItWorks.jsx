import React from 'react';

export default function HowItWorks({ open, onToggle }) {
  return (
    <>
      <div className="info-toggle" style={{ marginBottom: 12 }}>
        <button type="button" className="btn" onClick={onToggle}>
          {open ? 'Hide Info ▲' : 'How Contract Lock Works ▼'}
        </button>
      </div>

      {open && (
        <div className="info-card">
          <h3>How Contract Lock Works</h3>

          <h4>🔐 Security & Storage</h4>
          <ul>
            <li>Your data is stored locally on this device — it is never uploaded to a server.</li>
            <li>All records are encrypted using your master password before being saved.</li>
            <li>The password is not stored anywhere, so it cannot be reset or recovered.</li>
          </ul>

          <h4>📁 Records & Organization</h4>
          <ul>
            <li>Create records for contracts, subscriptions, bills, accounts, and more.</li>
            <li>Organize items by category (Finance, Insurance, Property, Travel, etc.).</li>
            <li>Save provider name, due dates, notes, and other details.</li>
          </ul>

          <h4>💾 Backup & Portability</h4>
          <ul>
            <li>You can export your data as an encrypted backup file.</li>
            <li>You can import that file on the same device or another device.</li>
            <li>Backups can only be opened with the same master password used to encrypt them.</li>
          </ul>

          <h4>⚠️ Password Rules</h4>
          <ul>
            <li>Your master password cannot be changed after data is encrypted.</li>
            <li>If you forget the password, your data cannot be recovered.</li>
            <li>Write your password down or store it in a secure password manager.</li>
          </ul>

          <h4>🚫 Things Contract Vault Does Not Do</h4>
          <ul>
            <li>No online syncing or cloud storage.</li>
            <li>No password recovery or account reset.</li>
            <li>No automated bill payments or financial connections.</li>
          </ul>

          <h4>🛡️ Privacy</h4>
          <ul>
            <li>Your data never leaves your device unless you intentionally export it.</li>
          </ul>
        </div>
      )}
    </>
  );
}
