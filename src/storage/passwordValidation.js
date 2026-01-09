import crypto from './crypto';

const VALIDATION_KEY = 'vault-validation-token';
const VALIDATION_PAYLOAD = 'valid-password';

export async function setPasswordValidation(password) {
  const token = await crypto.encrypt(VALIDATION_PAYLOAD, password);
  localStorage.setItem(VALIDATION_KEY, token);
}

export async function validatePassword(password) {
  const token = localStorage.getItem(VALIDATION_KEY);
  if (!token) return false;

  try {
    const payload = await crypto.decrypt(token, password);
    return payload === VALIDATION_PAYLOAD;
  } catch {
    return false;
  }
}

export function hasPasswordSet() {
  return !!localStorage.getItem(VALIDATION_KEY);
}
