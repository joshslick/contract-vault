import crypto from './crypto';
import { getAllEncryptedRecords, saveEncryptedRecord } from './recordsDb';
import { decryptRecord } from './contractVault';

function importId(i) {
  return `${Date.now()}-${i}-${Math.floor(Math.random() * 1e9)}`;
}

export async function exportAllEncrypted(sessionPassword, exportPassword) {
  const all = await getAllEncryptedRecords();

  // Decrypt each contract with session password first
  const decrypted = [];
  for (const rec of all) {
    try {
      const plainData = await decryptRecord(rec, sessionPassword);
      decrypted.push(plainData);
    } catch {
      // skip records that fail to decrypt
    }
  }

  // Encrypt the plain array with export password
  const payload = JSON.stringify(decrypted);
  return crypto.encrypt(payload, exportPassword);
}

export async function importEncryptedArchive(archiveStr, importPassword, sessionPassword) {
  // Decrypt archive with import password
  const payload = await crypto.decrypt(archiveStr, importPassword);
  const items = JSON.parse(payload);

  // Legacy support: if the archive payload is an array of {id,envelope}
  const isOldFormat = Array.isArray(items) && items.length > 0 && items[0]?.envelope;

  for (let i = 0; i < items.length; i++) {
    let contractData;

    if (isOldFormat) {
      // Old format: decrypt per item with importPassword
      const plain = await crypto.decrypt(items[i].envelope, importPassword);
      contractData = JSON.parse(plain);
    } else {
      // New format: plain contract object
      contractData = items[i];
    }

    // Encrypt with current session password and save
    const id = importId(i);
    const plaintext = JSON.stringify(contractData);
    const newEnvelope = await crypto.encrypt(plaintext, sessionPassword);
    await saveEncryptedRecord(id, newEnvelope);

    // small delay to help uniqueness in edge cases
    await new Promise((r) => setTimeout(r, 2));
  }
}
