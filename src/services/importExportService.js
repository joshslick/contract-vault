import recordsService from './recordsService';

/**
 * Import/Export service
 * Handles backup and restore of encrypted contracts
 */
class ImportExportService {
	async exportAllRecords(sessionPassword, exportPassword) {
		try {
			const archive = await recordsService.exportRecords(sessionPassword, exportPassword);
			return archive;
		} catch (err) {
			throw new Error(`Export failed: ${err.message}`);
		}
	}

	async importRecords(archiveStr, importPassword, sessionPassword) {
		try {
			await recordsService.importRecords(archiveStr, importPassword, sessionPassword);
		} catch (err) {
			throw new Error(`Import failed: ${err.message}`);
		}
	}

	generateFilename() {
		const now = new Date();
		const timestamp = now.toISOString().slice(0, 10);
		return `contract-vault-backup-${timestamp}.json`;
	}

	async createBackupFile(sessionPassword, exportPassword) {
		const archive = await this.exportAllRecords(sessionPassword, exportPassword);
		const filename = this.generateFilename();
		return { archive, filename };
	}
}

export default new ImportExportService();
