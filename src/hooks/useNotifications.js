import { useEffect, useCallback, useState } from 'react';
import NotificationService from '../services/notificationService';
import notificationPreferencesService from '../services/notificationPreferencesService';

/**
 * Hook for managing contract expiration notifications
 */
export function useNotifications(records) {
  const [userEmail, setUserEmail] = useState(null);
  const [isCheckingNotifications, setIsCheckingNotifications] = useState(false);
  const [notificationSummary, setNotificationSummary] = useState(null);

  // Load email on mount
  useEffect(() => {
    const loadEmail = async () => {
      const email = await notificationPreferencesService.getEmail();
      setUserEmail(email);
    };
    loadEmail();
  }, []);

  // Set user email
  const setEmail = useCallback(async (email) => {
    if (email) {
      await notificationPreferencesService.saveEmail(email);
      NotificationService.saveUserEmail(email);
      setUserEmail(email);
    }
  }, []);

  // Check for expiring contracts periodically
  useEffect(() => {
    if (!records || records.length === 0 || !userEmail) {
      return;
    }

    const checkNotifications = async () => {
      setIsCheckingNotifications(true);
      try {
        const summary = await NotificationService.checkAndNotifyExpiring(records);
        setNotificationSummary(summary);
      } catch (err) {
        console.error('Error checking notifications:', err);
      } finally {
        setIsCheckingNotifications(false);
      }
    };

    // Check on mount
    checkNotifications();

    // Check every 60 minutes
    const interval = setInterval(checkNotifications, 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, [records, userEmail]);

  // Clear notifications when a record is updated
  const clearNotificationsForRecord = useCallback((contractId) => {
    NotificationService.clearNotifications(contractId);
  }, []);

  // Get summary for debugging/UI
  const getSummary = useCallback(() => {
    return NotificationService.getNotificationSummary(records || []);
  }, [records]);

  return {
    userEmail,
    setEmail,
    isCheckingNotifications,
    notificationSummary,
    clearNotificationsForRecord,
    getSummary,
  };
}
