/**
 * Email Notification Service
 * Sends email notifications via Supabase Edge Functions (SMTP)
 * 
 * Setup:
 * 1. Deploy Supabase Edge Function "send-reminder-email"
 * 2. Configure SMTP secrets in Supabase (SMTP_HOST, SMTP_PORT, etc.)
 * 3. Add VITE_SUPABASE_URL to .env.local
 * 4. Without Supabase configured, runs in dev mode (console logs only)
 * 
 * See SUPABASE_SETUP_GUIDE.md for complete setup instructions
 */

class EmailNotificationService {
  constructor() {
    this.supabaseUrl = import.meta.env.VITE_SUPABASE_URL || null;
    this.functionUrl = this.supabaseUrl ? `${this.supabaseUrl}/functions/v1/send-reminder-email` : null;
  }

  /**
   * Send an email notification via Supabase Edge Function
   * @param {Object} emailData - { contractId, title, provider, daysUntilDue, userEmail, notificationType }
   * @returns {Promise<boolean>} - Success status
   */
  async sendEmail(emailData) {
    try {
      if (!this.functionUrl) {
        // Dev mode: no Supabase configured
        console.log('📧 Email Notification (Dev Mode - Supabase not configured):', {
          timestamp: new Date().toISOString(),
          ...emailData,
        });
        return true;
      }

      const response = await fetch(this.functionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: emailData.userEmail,
          subject: this._generateSubject(emailData),
          text: this._generateBody(emailData),
          html: this._generateHtmlBody(emailData),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || `HTTP ${response.status}`);
      }

      const result = await response.json();
      
      if (!result.ok) {
        throw new Error(result.error || 'Email send failed');
      }

      console.log('✅ Email sent via Supabase:', { to: emailData.userEmail });
      return true;
    } catch (err) {
      console.error('❌ Email send failed:', err.message);
      return false;
    }
  }

  /**
   * Generate email subject based on urgency
   * @private
   */
  _generateSubject(emailData) {
    const { title, daysUntilDue, notificationType } = emailData;
    
    if (daysUntilDue < 0) {
      return `⚠️ OVERDUE: ${title} is overdue!`;
    }
    
    if (daysUntilDue === 0) {
      return `🔴 DUE TODAY: ${title}`;
    }
    
    if (daysUntilDue === 1) {
      return `🟠 DUE TOMORROW: ${title}`;
    }
    
    return `📅 Upcoming: ${title} due in ${daysUntilDue} days`;
  }

  /**
   * Generate email body
   * @private
   */
  _generateBody(emailData) {
    const { title, provider, daysUntilDue } = emailData;
    
    if (daysUntilDue < 0) {
      return `Your contract "${title}"${provider ? ` with ${provider}` : ''} is overdue. Please renew or update it as soon as possible.`;
    }
    
    if (daysUntilDue === 0) {
      return `Your contract "${title}"${provider ? ` with ${provider}` : ''} is due today!`;
    }
    
    if (daysUntilDue === 1) {
      return `Your contract "${title}"${provider ? ` with ${provider}` : ''} is due tomorrow.`;
    }
    
    return `Your contract "${title}"${provider ? ` with ${provider}` : ''} will expire in ${daysUntilDue} days.`;
  }

  /**
   * Generate HTML email body
   * @private
   */
  _generateHtmlBody(emailData) {
    const { title, provider, daysUntilDue } = emailData;
    
    const urgencyColor = daysUntilDue <= 1 ? '#dc2626' : daysUntilDue <= 7 ? '#f59e0b' : '#3b82f6';
    const urgencyIcon = daysUntilDue <= 1 ? '🔴' : daysUntilDue <= 7 ? '🟠' : '📅';
    
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: ${urgencyColor}; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
          <h2 style="margin: 0;">${urgencyIcon} Contract Expiration Alert</h2>
        </div>
        <div style="background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
          <p style="margin-top: 0;"><strong>Contract:</strong> ${title}</p>
          ${provider ? `<p><strong>Provider:</strong> ${provider}</p>` : ''}
          <p><strong>Days Until Due:</strong> ${daysUntilDue}</p>
          <p style="margin-bottom: 0;">${this._generateBody(emailData)}</p>
        </div>
        <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center;">
          <p style="font-size: 12px; color: #6b7280; margin: 0;">
            This is an automated reminder from Contract Vault.
          </p>
        </div>
      </div>
    `;
  }
}

export default new EmailNotificationService();
