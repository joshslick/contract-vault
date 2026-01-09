// src/storage/contractsStore.js
// Keep old imports working while using modular internals.

import {
  saveEncryptedRecord,
  getAllEncryptedRecords,
  deleteRecord,
} from './recordsDb';

import {
  encryptAndSave,
  decryptRecord,
} from './contractVault';

import {
  exportAllEncrypted,
  importEncryptedArchive,
} from './backupVault';

import {
  setPasswordValidation,
  validatePassword,
  hasPasswordSet,
} from './passwordValidation';

export {
  saveEncryptedRecord,
  getAllEncryptedRecords,
  deleteRecord,
  encryptAndSave,
  decryptRecord,
  exportAllEncrypted,
  importEncryptedArchive,
  setPasswordValidation,
  validatePassword,
  hasPasswordSet,
};

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
  hasPasswordSet,
};
