import { useState, useCallback } from 'react';

/**
 * Custom hook for managing toast notifications
 * Handles showing/hiding toast messages with auto-dismiss
 */
export function useToast() {
	const [toasts, setToasts] = useState([]);

	const addToast = useCallback((message, type = 'info', duration = 3000) => {
		const id = Date.now();
		const toast = { id, message, type };

		setToasts((prev) => [...prev, toast]);

		if (duration > 0) {
			setTimeout(() => {
				removeToast(id);
			}, duration);
		}

		return id;
	}, []);

	const removeToast = useCallback((id) => {
		setToasts((prev) => prev.filter((t) => t.id !== id));
	}, []);

	const success = useCallback((message, duration = 3000) => {
		return addToast(message, 'success', duration);
	}, [addToast]);

	const error = useCallback((message, duration = 5000) => {
		return addToast(message, 'error', duration);
	}, [addToast]);

	const info = useCallback((message, duration = 3000) => {
		return addToast(message, 'info', duration);
	}, [addToast]);

	return {
		toasts,
		addToast,
		removeToast,
		success,
		error,
		info,
	};
}

export default useToast;
