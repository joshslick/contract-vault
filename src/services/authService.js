import store from '../storage/contractsStore';

/**
 * Authentication service
 * Handles password validation and storage
 */
class AuthService {
	async setPassword(password) {
		await store.setPasswordValidation(password);
	}

	async validatePassword(password) {
		return await store.validatePassword(password);
	}

	hasPasswordSet() {
		return store.hasPasswordSet();
	}
}

export default new AuthService();
