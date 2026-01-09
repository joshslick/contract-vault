import store from '../storage/contractsStore';

function chunk(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

class RecordsService {
  async loadAllDecrypted(sessionPassword, onProgress) {
  const encrypted = await store.getAllEncryptedRecords();
  const decrypted = [];
  const CONCURRENCY = 5;
  let done = 0;

  for (const group of chunk(encrypted, CONCURRENCY)) {
    const results = await Promise.allSettled(
      group.map(async (record) => {
        const plainData = await store.decryptRecord(record, sessionPassword);
        return { id: record.id, ...plainData };
      })
    );

    for (const r of results) if (r.status === 'fulfilled') decrypted.push(r.value);

    done += group.length;
    onProgress?.(done, encrypted.length);
  }

  return decrypted;
}


  async encryptAndSave(contractObj, password) {
    return store.encryptAndSave(contractObj, password);
  }

  async updateRecord(id, contractObj, password) {
    // Keep same id by overwriting the record instead of delete+new id
    const plaintext = JSON.stringify(contractObj);
    const envelope = await store.cryptoEncryptForUpdate(plaintext, password); // <-- see note below
    await store.saveEncryptedRecord(id, envelope);
    return id;
  }

  async deleteRecord(id) {
    return store.deleteRecord(id);
  }

  async exportRecords(sessionPassword, exportPassword) {
    return store.exportAllEncrypted(sessionPassword, exportPassword);
  }

  async importRecords(archiveStr, importPassword, sessionPassword) {
    return store.importEncryptedArchive(archiveStr, importPassword, sessionPassword);
  }
}

export default new RecordsService();
