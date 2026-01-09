import crypto from './crypto';
import { saveEncryptedRecord } from './recordsDb';

function newId() {
  return `${Date.now()}-${Math.floor(Math.random() * 1e9)}`;
}

export async function encryptAndSave(contractObj, password) {
  const plaintext = JSON.stringify(contractObj);
  const envelope = await crypto.encrypt(plaintext, password);
  const id = newId();
  await saveEncryptedRecord(id, envelope);
  return id;
}

export async function decryptRecord(record, password) {
  const plain = await crypto.decrypt(record.envelope, password);
  return JSON.parse(plain);
}
