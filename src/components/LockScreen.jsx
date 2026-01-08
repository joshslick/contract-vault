import React, { useState, useEffect } from "react";
import store from "../storage/contractsStore";

export default function LockScreen({ onUnlock }) {
  const [mode, setMode] = useState("existing"); // 'existing' | 'new'
  const [existingPw, setExistingPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [error, setError] = useState("");
  const [hasPassword, setHasPassword] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    setHasPassword(store.hasPasswordSet());
  }, []);

  const passwordsMatch = newPw === confirmPw && newPw.length > 0;

  async function submitExisting() {
    if (!existingPw) return;

    if (!hasPassword) {
      setError("Password not found. Please create a new password first.");
      return;
    }

    const isValid = await store.validatePassword(existingPw);
    if (!isValid) {
      setError("Incorrect password");
      return;
    }

    setError("");
    onUnlock(existingPw);
    setExistingPw("");
  }

  async function submitNew() {
    if (!passwordsMatch) return;

    try {
      // Store encrypted validation token instead of password
      await store.setPasswordValidation(newPw);
      setError("");
      onUnlock(newPw);
      setNewPw("");
      setConfirmPw("");
    } catch (err) {
      console.error(err);
      setError("Failed to set password");
    }
  }

  return (
    <div className="lock-wrapper">
      <div className="lock-card">
        <h2 style={{ marginTop: 20 }}>Welcome to Contract Vault</h2>
        <p
          style={{
            marginTop: 8,
            marginBottom: 8,
            fontSize: 13,
            color: "#d1d5db",
          }}
        >
          Contract Vault is a local-first, encrypted dashboard for all your
          contracts, subscriptions, bills, and important accounts — kept
          securely on your device, not in the cloud.
        </p>

        <div
          className="tab-buttons"
          style={{ marginBottom: 12, display: "flex", gap: 24 }}
        >
          <button
            className={`tab-button ${mode === "existing" ? "is-active" : ""}`}
            onClick={() => {
              setMode("existing");
              setError("");
            }}
          >
            Use Existing Password
          </button>
          <button
            className={`tab-button ${mode === "new" ? "is-active" : ""}`}
            onClick={() => {
              setMode("new");
              setError("");
            }}
          >
            Create New Password
          </button>
        </div>

        {mode === "existing" ? (
          <div>
            <label style={{ display: "block", marginBottom: 6 }}>
              Master Password
            </label>
            <input
              className="vault-input"
              type="password"
              value={existingPw}
              onChange={(e) => setExistingPw(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submitExisting()}
              autoFocus
            />
            <button
              className="btn"
              onClick={submitExisting}
              disabled={!existingPw}
            >
              Unlock
            </button>
          </div>
        ) : (
          <div>
            <label style={{ display: "block", marginBottom: 6 }}>
              Create Master Password
            </label>
            <input
              className="vault-input"
              type="password"
              value={newPw}
              onChange={(e) => setNewPw(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submitNew()}
              autoFocus
              placeholder="New Password"
            />
            <input
              className="vault-input"
              type="password"
              value={confirmPw}
              onChange={(e) => setConfirmPw(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submitNew()}
              placeholder="Confirm Password"
            />
            {!passwordsMatch && (newPw.length > 0 || confirmPw.length > 0) && (
              <div className="error-text">Passwords do not match</div>
            )}
            <button
              className="btn"
              onClick={submitNew}
              disabled={!passwordsMatch}
            >
              Set Password &amp; Unlock
            </button>
          </div>
        )}

        {error && (
          <div className="error-text" style={{ marginTop: 8 }}>
            {error}
          </div>
        )}

        {mode === "new" && (
          <>
            <p style={{ color: "#fca5a5", fontSize: 12, marginTop: 8 }}>
              ⚠️ Important: Your master password cannot be reset. If you forget
              it, your data cannot be recovered. Be sure to store it in a secure
              place.
            </p>
            <p style={{ color: "#666", fontSize: 12, marginTop: 12 }}>
              Note: If you already have saved contracts encrypted with a
              different password, they won't appear until you unlock with that
              old password or re-encrypt them via export/import.
            </p>
          </>
        )}
        <div className="info-toggle" style={{ marginBottom: 12 }}>
          <button type="button" className="btn" onClick={() => setShowInfo(v => !v)}>
            {showInfo ? 'Hide Info ▲' : 'How Contract Vault Works ▼'}
          </button>
        </div>

        {showInfo && (
          <div className="info-card">
            <h3>How Contract Vault Works</h3>

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
      </div>
    </div>
  );
}
