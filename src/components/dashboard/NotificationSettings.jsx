import React, { useState, useEffect } from 'react';
import notificationPreferencesService from '../../services/notificationPreferencesService';
import { isSupabaseConfigured } from '../../services/supabaseClient';

export default function NotificationSettings({ userEmail, onEmailChange }) {
  const [email, setEmail] = useState(userEmail || '');
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setEmail(userEmail || '');
  }, [userEmail]);

  const handleSave = async () => {
    if (email && email.includes('@')) {
      setIsLoading(true);
      const success = await notificationPreferencesService.saveEmail(email);
      setIsLoading(false);
      
      if (success) {
        onEmailChange(email);
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
      }
    }
  };

  const handleChange = (e) => {
    setEmail(e.target.value);
    setIsSaved(false);
  };

  return (
    <div className="notification-settings card">
      <h4 style={{ marginTop: 0, marginBottom: 12 }}>📧 Email Notifications</h4>
      
      <p style={{ marginBottom: 12, color: '#9ca3af', fontSize: '0.9rem' }}>
        Enable email notifications for contract expiration reminders. You'll receive notifications at:
        7 days, 2 days, 1 day before, and on the expiration date.
      </p>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
        <input
          type="email"
          className="vault-input"
          placeholder="your@email.com"
          value={email}
          onChange={handleChange}
          style={{ flex: 1, marginBottom: 0 }}
        />
        <button
          type="button"
          className="btn"
          onClick={handleSave}
          disabled={isLoading || !email || !email.includes('@')}
          style={{
            background: email && email.includes('@') ? '#2563eb' : '#666',
            borderColor: email && email.includes('@') ? '#2563eb' : '#666',
            padding: '8px 16px',
            opacity: isLoading ? 0.7 : 1,
          }}
        >
          {isLoading ? '...' : isSaved ? '✓' : 'Save'}
        </button>
      </div>

      {!email && (
        <p style={{ color: '#fca5a5', fontSize: '0.85rem', margin: 0 }}>
          ⚠ Email not configured. Notifications will not be sent.
        </p>
      )}

      {email && email.includes('@') && (
        <p style={{ color: '#5cb85c', fontSize: '0.85rem', margin: 0 }}>
          ✓ Notifications enabled for: <strong>{email}</strong>
          {isSupabaseConfigured() && <span> (synced)</span>}
        </p>
      )}

      <details style={{ marginTop: '12px', color: '#9ca3af', fontSize: '0.85rem' }}>
        <summary style={{ cursor: 'pointer', color: '#d1d5db' }}>How to set up email notifications</summary>
        <div style={{ marginTop: '8px', padding: '8px 0', borderTop: '1px solid #2a2a2a' }}>
          <p>1. Enter your email address above</p>
          <p>2. Click "Save" to enable notifications</p>
          <p>3. You'll receive notifications via email when contracts are expiring</p>
          <p style={{ color: '#fca5a5', marginTop: '8px' }}>
            Note: Email notifications require backend configuration. In development mode, 
            notifications are logged to the console.
          </p>
        </div>
      </details>
    </div>
  );
}
