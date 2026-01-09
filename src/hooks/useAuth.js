import { useState } from 'react';
import authService from '../services/authService';

/**
 * Custom hook for managing authentication state
 * Handles password setup, validation, and lock/unlock logic
 */
export function useAuth() {
	const [isLocked, setIsLocked] = useState(!authService.hasPasswordSet());
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);

	const setPassword = async (password) => {
		try {
			setIsLoading(true);
			setError(null);
			await authService.setPassword(password);
			setIsLocked(false);
			return true;
		} catch (err) {
			setError(err.message);
			return false;
		} finally {
			setIsLoading(false);
		}
	};

	const unlock = async (password) => {
		try {
			setIsLoading(true);
			setError(null);
			const isValid = await authService.validatePassword(password);
			if (isValid) {
				setIsLocked(false);
				return true;
			} else {
				setError('Invalid password');
				return false;
			}
		} catch (err) {
			setError('Error validating password');
			return false;
		} finally {
			setIsLoading(false);
		}
	};

	const lock = () => {
		setIsLocked(true);
		setError(null);
	};

	return {
		isLocked,
		isLoading,
		error,
		setPassword,
		unlock,
		lock,
		hasPassword: authService.hasPasswordSet(),
	};
}

export default useAuth;
