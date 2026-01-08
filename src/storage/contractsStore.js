import crypto from './crypto';

const DB_NAME = 'contract-vault-db';
const STORE_NAME = 'records';

function openDB() {
	return new Promise((resolve, reject) => {
		const req = indexedDB.open(DB_NAME, 1);
		req.onupgradeneeded = () => {
			const db = req.result;
			if (!db.objectStoreNames.contains(STORE_NAME)) {
				db.createObjectStore(STORE_NAME, { keyPath: 'id' });
			}
		};
		req.onsuccess = () => resolve(req.result);
		req.onerror = () => reject(req.error);
	});
}

export async function saveEncryptedRecord(id, envelope) {
	const db = await openDB();
	return new Promise((resolve, reject) => {
		const tx = db.transaction(STORE_NAME, 'readwrite');
		const store = tx.objectStore(STORE_NAME);
		store.put({ id, envelope });
		tx.oncomplete = () => resolve();
		tx.onerror = () => reject(tx.error);
	});
}

export async function getAllEncryptedRecords() {
	const db = await openDB();
	return new Promise((resolve, reject) => {
		const tx = db.transaction(STORE_NAME, 'readonly');
		const store = tx.objectStore(STORE_NAME);
		const req = store.getAll();
		req.onsuccess = () => resolve(req.result || []);
		req.onerror = () => reject(req.error);
	});
}

export async function deleteRecord(id) {
	const db = await openDB();
	return new Promise((resolve, reject) => {
		const tx = db.transaction(STORE_NAME, 'readwrite');
		const store = tx.objectStore(STORE_NAME);
		store.delete(id);
		tx.oncomplete = () => resolve();
		tx.onerror = () => reject(tx.error);
	});
}

export async function encryptAndSave(contractObj, password) {
	const plaintext = JSON.stringify(contractObj);
	const envelope = await crypto.encrypt(plaintext, password);
	const id = `${Date.now()}-${Math.floor(Math.random() * 1e9)}`;
	await saveEncryptedRecord(id, envelope);
	return id;
}

export async function decryptRecord(record, password) {
	const plain = await crypto.decrypt(record.envelope, password);
	return JSON.parse(plain);
}

// Validation token to verify password without storing it
const VALIDATION_KEY = 'vault-validation-token';
const VALIDATION_PAYLOAD = 'valid-password';

export async function setPasswordValidation(password) {
	const token = await crypto.encrypt(VALIDATION_PAYLOAD, password);
	localStorage.setItem(VALIDATION_KEY, token);
}

export async function validatePassword(password) {
	const token = localStorage.getItem(VALIDATION_KEY);
	if (!token) return false; // No password set yet
	try {
		const payload = await crypto.decrypt(token, password);
		return payload === VALIDATION_PAYLOAD;
	} catch (e) {
		return false; // Wrong password
	}
}

export function hasPasswordSet() {
	return !!localStorage.getItem(VALIDATION_KEY);
}

export default { 
	saveEncryptedRecord, 
	getAllEncryptedRecords, 
	deleteRecord, 
	encryptAndSave, 
	decryptRecord,
	exportAllEncrypted,
	importEncryptedArchive,
	setPasswordValidation,
	validatePassword,
	hasPasswordSet
};

export async function exportAllEncrypted(sessionPassword, exportPassword) {
	const all = await getAllEncryptedRecords();
	// Decrypt each contract with session password first
	const decrypted = [];
	for (const rec of all) {
		try {
			const plainData = await decryptRecord(rec, sessionPassword);
			decrypted.push(plainData);
		} catch (e) {
			// skip records that fail to decrypt
		}
	}
	// Now encrypt the plain array with export password
	const payload = JSON.stringify(decrypted);
	const archive = await crypto.encrypt(payload, exportPassword);
	return archive;
}

export async function importEncryptedArchive(archiveStr, importPassword, sessionPassword) {
  // Decrypt archive with import password
  const payload = await crypto.decrypt(archiveStr, importPassword);
  const items = JSON.parse(payload);
  
  // Support both old format (encrypted records) and new format (plain contracts)
  const isOldFormat = items.length > 0 && items[0].envelope;
  
  for (let i = 0; i < items.length; i++) {
    let contractData;
    
    if (isOldFormat) {
      // Old format: {id, envelope} - need to decrypt envelope
      contractData = await decryptRecord(items[i], importPassword);
    } else {
      // New format: plain contract object
      contractData = items[i];
    }
    
    // Encrypt with current session password and save with unique ID
    const id = `${Date.now()}-${i}-${Math.floor(Math.random() * 1e9)}`;
    const plaintext = JSON.stringify(contractData);
    const newEnvelope = await crypto.encrypt(plaintext, sessionPassword);
    await saveEncryptedRecord(id, newEnvelope);
    // Small delay to ensure unique IDs
    await new Promise(r => setTimeout(r, 2));
	}
}
