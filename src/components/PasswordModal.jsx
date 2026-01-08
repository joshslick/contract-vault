import React, { useState, useEffect } from 'react';

export default function PasswordModal({ visible, title = 'Enter Password', requireConfirm = false, onConfirm, onCancel }) {
  const [pw, setPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (visible) {
      setPw('');
      setConfirmPw('');
      setError('');
    }
  }, [visible]);

  

  const valid = pw.length > 0 && (!requireConfirm || pw === confirmPw);

  useEffect(() => {
    if (requireConfirm) {
      if (pw.length === 0 && confirmPw.length === 0) {
        setError('');
      } else if (pw !== confirmPw) {
        setError('Passwords do not match');
      } else {
        setError('');
      }
    }
  }, [pw, confirmPw, requireConfirm]);

  if (!visible) return null;
  function handleSubmit() {
    if (!valid) return;
    onConfirm && onConfirm(pw);
  }

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <h3 style={{ marginTop: 0 }}>{title}</h3>
        <input
          className="vault-input"
          type='password'
          value={pw}
          onChange={e => setPw(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          autoFocus
          placeholder='Password'
        />
        {requireConfirm && (
          <>
            <input
              className="vault-input"
              type='password'
              value={confirmPw}
              onChange={e => setConfirmPw(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              placeholder='Confirm Password'
            />
            {error && (
              <div className="error-text">{error}</div>
            )}
          </>
        )}
        <div className="modal-actions">
          <button type="button" className="btn" onClick={onCancel}>Cancel</button>
          <button type="button" className="btn" onClick={handleSubmit} disabled={!valid}>OK</button>
        </div>
      </div>
    </div>
  );
}
