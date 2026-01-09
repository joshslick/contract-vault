import React, { createContext, useCallback, useState } from 'react';

/**
 * Toast Context
 * Provides toast notification state across the app
 */
export const ToastContext = createContext();

export function ToastProvider({ children }) {
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

	const value = {
		toasts,
		addToast,
		removeToast,
		success,
		error,
		info,
	};

	return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
}

export function useToastContext() {
	const context = React.useContext(ToastContext);
	if (!context) {
		throw new Error('useToastContext must be used within ToastProvider');
	}
	return context;
}
