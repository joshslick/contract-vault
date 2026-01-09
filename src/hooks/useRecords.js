import { useState, useCallback } from 'react';
import recordsService from '../services/recordsService';

/**
 * Custom hook for managing contract records
 * Handles loading, saving, deleting, and searching contracts
 */
export function useRecords(sessionPassword) {
	const [records, setRecords] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);

	const loadRecords = useCallback(async () => {
		try {
			setIsLoading(true);
			setError(null);
			const decrypted = await recordsService.loadAllDecrypted(sessionPassword);
			setRecords(decrypted);
			return decrypted;
		} catch (err) {
			setError(err.message);
			return [];
		} finally {
			setIsLoading(false);
		}
	}, [sessionPassword]);

	const addRecord = useCallback(async (contractObj) => {
		try {
			setError(null);
			const id = await recordsService.encryptAndSave(contractObj, sessionPassword);
			const newRecords = await recordsService.loadAllDecrypted(sessionPassword);
			setRecords(newRecords);
			return id;
		} catch (err) {
			setError(err.message);
			throw err;
		}
	}, [sessionPassword]);

	const updateRecord = useCallback(async (id, contractObj) => {
		try {
			setError(null);
			await recordsService.updateRecord(id, contractObj, sessionPassword);
			const newRecords = await recordsService.loadAllDecrypted(sessionPassword);
			setRecords(newRecords);
		} catch (err) {
			setError(err.message);
			throw err;
		}
	}, [sessionPassword]);

	const deleteRecord = useCallback(async (id) => {
		try {
			setError(null);
			await recordsService.deleteRecord(id);
			const newRecords = await recordsService.loadAllDecrypted(sessionPassword);
			setRecords(newRecords);
		} catch (err) {
			setError(err.message);
			throw err;
		}
	}, [sessionPassword]);

	const searchRecords = useCallback((query) => {
		if (!query.trim()) return records;
		const lowerQuery = query.toLowerCase();
		return records.filter(
			(record) =>
				record.name?.toLowerCase().includes(lowerQuery) ||
				record.category?.toLowerCase().includes(lowerQuery) ||
				record.url?.toLowerCase().includes(lowerQuery)
		);
	}, [records]);

	return {
		records,
		isLoading,
		error,
		loadRecords,
		addRecord,
		updateRecord,
		deleteRecord,
		searchRecords,
	};
}

export default useRecords;
