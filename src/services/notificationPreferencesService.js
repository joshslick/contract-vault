import { supabase, isSupabaseConfigured } from './supabaseClient';

/**
 * Notification Preferences Service
 * Handles storing/retrieving email preferences from Supabase or localStorage
 */

const STORAGE_KEY = 'notification_email';

class NotificationPreferencesService {
  /**
   * Get or create unique identifier for this device/user
   * @private
   */
  _getUserIdentifier() {
    let id = localStorage.getItem('device_id');
    if (!id) {
      id = `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('device_id', id);
    }
    return id;
  }

  /**
   * Get notification email preference
   * @returns {Promise<string|null>}
   */
  async getEmail() {
    if (!isSupabaseConfigured()) {
      // Fallback to localStorage
      return localStorage.getItem(STORAGE_KEY);
    }

    try {
      const userId = this._getUserIdentifier();
      const { data, error } = await supabase
        .from('notification_preferences')
        .select('email, enabled')
        .eq('user_identifier', userId)
        .single();

      if (error) {
        // Record doesn't exist yet, fallback to localStorage
        return localStorage.getItem(STORAGE_KEY);
      }

      return data.enabled ? data.email : null;
    } catch (err) {
      console.error('Error fetching email preference:', err);
      // Fallback to localStorage
      return localStorage.getItem(STORAGE_KEY);
    }
  }

  /**
   * Save notification email preference
   * @param {string} email
   * @returns {Promise<boolean>}
   */
  async saveEmail(email) {
    // Always save to localStorage as backup
    if (email) {
      localStorage.setItem(STORAGE_KEY, email);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }

    if (!isSupabaseConfigured()) {
      return true; // localStorage save succeeded
    }

    try {
      const userId = this._getUserIdentifier();

      // Upsert (insert or update) the preference
      const { error } = await supabase
        .from('notification_preferences')
        .upsert(
          {
            user_identifier: userId,
            email: email || '',
            enabled: Boolean(email),
            updated_at: new Date().toISOString(),
          },
          {
            onConflict: 'user_identifier',
          }
        );

      if (error) throw error;

      console.log('✅ Email preference saved to Supabase');
      return true;
    } catch (err) {
      console.error('❌ Error saving email preference to Supabase:', err);
      // localStorage save still succeeded
      return true;
    }
  }

  /**
   * Clear notification email preference
   * @returns {Promise<boolean>}
   */
  async clearEmail() {
    return this.saveEmail(null);
  }
}

export default new NotificationPreferencesService();
