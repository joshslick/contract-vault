import React from 'react';

export default function ExistingPasswordForm({
  value,
  setValue,
  onSubmit,
  isLoading,
}) {
  return (
    <div>
      <label style={{ display: 'block', marginBottom: 6 }}>Master Password</label>

      <input
        className="vault-input"
        type="password"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && onSubmit()}
        autoFocus
      />

      <button className="btn" type="button" onClick={onSubmit} disabled={!value || isLoading}>
        {isLoading ? 'Unlocking…' : 'Unlock'}
      </button>
    </div>
  );
}
