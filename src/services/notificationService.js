/**
 * Notification Service
 * Checks for contract expiration dates and triggers email notifications
 * Notification thresholds: 7 days, 2 days, 1 day, and day of expiration
 */

import EmailNotificationService from './emailNotificationService';
import NotificationStateStore from '../storage/notificationStateStore';

const NOTIFICATION_THRESHOLDS = {
  'seven-days': 7,
  'two-days': 2,
  'one-day': 1,
  'today': 0,
};

class NotificationService {
  constructor() {
    this.isProcessing = false;
    this.userEmail = null;
  }

  /**
   * Set user email for notifications
   * @param {string} email - User's email address
   */
  setUserEmail(email) {
    this.userEmail = email;
  }

  /**
   * Get user email (from localStorage if not set)
   */
  getUserEmail() {
    if (this.userEmail) return this.userEmail;
    
    try {
      return localStorage.getItem('contract_vault_user_email') || null;
    } catch {
      return null;
    }
  }

  /**
   * Save user email to localStorage
   */
  saveUserEmail(email) {
    this.userEmail = email;
    try {
      localStorage.setItem('contract_vault_user_email', email);
    } catch (err) {
      console.error('Error saving user email:', err);
    }
  }

  /**
   * Check all contracts for expiration and send notifications
   * @param {Array} contracts - List of contracts to check
   * @returns {Promise<Object>} - Summary of notifications sent
   */
  async checkAndNotifyExpiring(contracts) {
    if (this.isProcessing || !contracts || contracts.length === 0) {
      return { sent: 0, skipped: 0 };
    }

    this.isProcessing = true;
    const summary = { sent: 0, skipped: 0, errors: [] };

    try {
      for (const contract of contracts) {
        if (!contract.dueDate || !contract.id) {
          summary.skipped++;
          continue;
        }

        const daysUntilDue = this._calculateDaysUntilDue(contract.dueDate);
        const notifications = await this._checkThresholds(contract, daysUntilDue);
        
        summary.sent += notifications.length;
      }
    } catch (err) {
      console.error('Error in checkAndNotifyExpiring:', err);
      summary.errors.push(err.message);
    } finally {
      this.isProcessing = false;
    }

    return summary;
  }

  /**
   * Calculate days until due date
   * @private
   */
  _calculateDaysUntilDue(dueDate) {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const due = new Date(dueDate);
      due.setHours(0, 0, 0, 0);
      
      const diffTime = due - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      return diffDays;
    } catch (err) {
      console.error('Error calculating days until due:', err);
      return null;
    }
  }

  /**
   * Check which notification thresholds have been reached
   * @private
   */
  async _checkThresholds(contract, daysUntilDue) {
    const notifications = [];
    const userEmail = this.getUserEmail();

    // Only send notifications if we have a user email
    if (!userEmail) {
      console.warn('No user email configured for notifications');
      return notifications;
    }

    // Skip if date has passed (too old)
    if (daysUntilDue < -30) {
      NotificationStateStore.clearNotificationState(contract.id);
      return notifications;
    }

    for (const [thresholdName, thresholdDays] of Object.entries(NOTIFICATION_THRESHOLDS)) {
      const shouldNotify = daysUntilDue >= 0 ? daysUntilDue <= thresholdDays : false;

      // Don't notify for past dates
      if (daysUntilDue < 0 && thresholdName === 'today') {
        // Still notify on the day if just past (for all-day notifications)
        if (daysUntilDue < -1) continue;
      }

      if (shouldNotify) {
        // Check if we've already sent this notification
        if (!NotificationStateStore.hasNotificationBeenSent(contract.id, thresholdName)) {
          const sent = await this._sendNotification(contract, daysUntilDue, thresholdName, userEmail);
          
          if (sent) {
            NotificationStateStore.setNotificationState(contract.id, thresholdName);
            notifications.push(thresholdName);
          }
        }
      }
    }

    return notifications;
  }

  /**
   * Send individual notification
   * @private
   */
  async _sendNotification(contract, daysUntilDue, thresholdName, userEmail) {
    try {
      const notificationMessages = {
        'seven-days': '7 days until expiration',
        'two-days': '2 days until expiration',
        'one-day': '1 day until expiration',
        'today': 'Expires today',
      };

      const emailData = {
        contractId: contract.id,
        title: contract.title || '(Untitled)',
        provider: contract.provider || '(No provider)',
        daysUntilDue: Math.max(0, daysUntilDue),
        notificationType: thresholdName,
        notificationMessage: notificationMessages[thresholdName],
        userEmail: userEmail,
      };

      const sent = await EmailNotificationService.sendEmail(emailData);
      return sent;
    } catch (err) {
      console.error(`Error sending ${thresholdName} notification:`, err);
      return false;
    }
  }

  /**
   * Manually trigger notification for a contract
   * Useful for testing or manual triggers
   */
  async notifyContract(contract, daysUntilDue, thresholdName = 'manual') {
    const userEmail = this.getUserEmail();
    if (!userEmail) {
      console.warn('No user email configured');
      return false;
    }

    return this._sendNotification(contract, daysUntilDue, thresholdName, userEmail);
  }

  /**
   * Clear notification history for a contract (called when contract is updated)
   */
  clearNotifications(contractId) {
    NotificationStateStore.clearNotificationState(contractId);
  }

  /**
   * Get notification summary for debugging
   */
  getNotificationSummary(contracts) {
    const summary = {
      userEmail: this.getUserEmail(),
      totalContracts: contracts.length,
      contracts: [],
    };

    for (const contract of contracts) {
      if (!contract.dueDate) continue;

      const daysUntilDue = this._calculateDaysUntilDue(contract.dueDate);
      const notificationState = NotificationStateStore.getNotificationState(contract.id);

      summary.contracts.push({
        id: contract.id,
        title: contract.title,
        dueDate: contract.dueDate,
        daysUntilDue,
        notificationsSent: Object.keys(notificationState),
        needsNotification: daysUntilDue >= 0 && daysUntilDue <= 7,
      });
    }

    return summary;
  }
}

export default new NotificationService();
