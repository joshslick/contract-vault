import React, { useState } from 'react';
import { useAuthContext } from '../context';

import ModeTabs from './lock/ModeTabs';
import ExistingPasswordForm from './lock/ExistingPasswordForm';
import NewPasswordForm from './lock/NewPasswordForm';
import HowItWorks from './lock/HowItWorks';

export default function LockScreen({ onUnlock }) {
  const { setPassword, unlock, hasPassword } = useAuthContext();

  const [mode, setMode] = useState(hasPassword ? 'existing' : 'new');
  const [existingPw, setExistingPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  const passwordsMatch = newPw === confirmPw && newPw.length > 0;

  function changeMode(next) {
    setMode(next);
    setError('');
  }

  async function submitExisting() {
    if (!existingPw) return;

    setIsLoading(true);
    const ok = await unlock(existingPw);
    setIsLoading(false);

    if (ok) {
      setError('');
      onUnlock(existingPw);
      setExistingPw('');
    } else {
      setError('Incorrect password');
    }
  }

  async function submitNew() {
    if (!passwordsMatch) return;

    try {
      setIsLoading(true);
      const ok = await setPassword(newPw);
      setIsLoading(false);

      if (ok) {
        setError('');
        onUnlock(newPw);
        setNewPw('');
        setConfirmPw('');
      } else {
        setError('Failed to set password');
      }
    } catch (err) {
      console.error(err);
      setIsLoading(false);
      setError('Failed to set password');
    }
  }

  return (
    <div className="lock-wrapper">
      <div className="lock-card">
        <h2 style={{ marginTop: 20 }}>Welcome to Contract Lock</h2>
        <p style={{ marginTop: 8, marginBottom: 8, fontSize: 13, color: '#d1d5db' }}>
          Contract Lock is a local-first, encrypted dashboard for all your contracts,
          subscriptions, bills, and important accounts — kept securely on your device,
          not in the cloud.
        </p>

        <ModeTabs mode={mode} onChangeMode={changeMode} />

        {mode === 'existing' ? (
          <ExistingPasswordForm
            value={existingPw}
            setValue={setExistingPw}
            onSubmit={submitExisting}
            isLoading={isLoading}
          />
        ) : (
          <NewPasswordForm
            newPw={newPw}
            confirmPw={confirmPw}
            setNewPw={setNewPw}
            setConfirmPw={setConfirmPw}
            passwordsMatch={passwordsMatch}
            onSubmit={submitNew}
            isLoading={isLoading}
          />
        )}

        {error && (
          <div className="error-text" style={{ marginTop: 8 }}>
            {error}
          </div>
        )}

        {mode === 'new' && (
          <>
            <p style={{ color: '#fca5a5', fontSize: 12, marginTop: 8 }}>
              ⚠️ Important: Your master password cannot be reset. If you forget it,
              your data cannot be recovered. Be sure to store it in a secure place.
            </p>
            <p style={{ color: '#666', fontSize: 12, marginTop: 12 }}>
              Note: If you already have saved contracts encrypted with a different password,
              they won't appear until you unlock with that old password or re-encrypt them via export/import.
            </p>
          </>
        )}

        <HowItWorks open={showInfo} onToggle={() => setShowInfo(v => !v)} />
      </div>
    </div>
  );
}
