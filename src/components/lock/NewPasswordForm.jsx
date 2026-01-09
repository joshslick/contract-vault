import React from 'react';

export default function NewPasswordForm({
  newPw,
  confirmPw,
  setNewPw,
  setConfirmPw,
  passwordsMatch,
  onSubmit,
  isLoading,
}) {
  return (
    <div>
      <label style={{ display: 'block', marginBottom: 6 }}>Create Master Password</label>

      <input
        className="vault-input"
        type="password"
        value={newPw}
        onChange={(e) => setNewPw(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && onSubmit()}
        autoFocus
        placeholder="New Password"
      />

      <input
        className="vault-input"
        type="password"
        value={confirmPw}
        onChange={(e) => setConfirmPw(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && onSubmit()}
        placeholder="Confirm Password"
      />

      {!passwordsMatch && (newPw.length > 0 || confirmPw.length > 0) && (
        <div className="error-text">Passwords do not match</div>
      )}

      <button className="btn" type="button" onClick={onSubmit} disabled={!passwordsMatch || isLoading}>
        {isLoading ? 'Setting…' : 'Set Password & Unlock'}
      </button>
    </div>
  );
}
