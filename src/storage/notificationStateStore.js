/**
 * Notification State Storage
 * Tracks which notification emails have been sent to prevent duplicates
 * Stores: { contractId: { '7days': timestamp, '2days': timestamp, '1day': timestamp, 'today': timestamp } }
 */

const NOTIFICATION_STATE_KEY = 'contract_vault_notification_state';

export class NotificationStateStore {
  static getNotificationState(contractId) {
    try {
      const state = localStorage.getItem(NOTIFICATION_STATE_KEY);
      const allState = state ? JSON.parse(state) : {};
      return allState[contractId] || {};
    } catch (err) {
      console.error('Error reading notification state:', err);
      return {};
    }
  }

  static setNotificationState(contractId, notificationType, timestamp = Date.now()) {
    try {
      const state = localStorage.getItem(NOTIFICATION_STATE_KEY);
      const allState = state ? JSON.parse(state) : {};
      
      if (!allState[contractId]) {
        allState[contractId] = {};
      }
      
      allState[contractId][notificationType] = timestamp;
      localStorage.setItem(NOTIFICATION_STATE_KEY, JSON.stringify(allState));
    } catch (err) {
      console.error('Error saving notification state:', err);
    }
  }

  static clearNotificationState(contractId) {
    try {
      const state = localStorage.getItem(NOTIFICATION_STATE_KEY);
      const allState = state ? JSON.parse(state) : {};
      
      if (allState[contractId]) {
        delete allState[contractId];
        localStorage.setItem(NOTIFICATION_STATE_KEY, JSON.stringify(allState));
      }
    } catch (err) {
      console.error('Error clearing notification state:', err);
    }
  }

  static hasNotificationBeenSent(contractId, notificationType) {
    const state = this.getNotificationState(contractId);
    return !!state[notificationType];
  }

  static clearAllNotifications() {
    try {
      localStorage.removeItem(NOTIFICATION_STATE_KEY);
    } catch (err) {
      console.error('Error clearing all notifications:', err);
    }
  }
}

export default NotificationStateStore;
