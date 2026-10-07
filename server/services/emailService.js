class EmailService {
  constructor() {
    this.resendApiKey = process.env.RESEND_API_KEY || '';
    this.sendgridApiKey = process.env.SENDGRID_API_KEY || '';
    this.fromEmail = process.env.EMAIL_FROM || 'VAYORA Concierge <concierge@vayora.com>';
  }

  async sendEmail({ to, subject, html }) {
    if (this.resendApiKey) {
      try {
        const res = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.resendApiKey}`,
          },
          body: JSON.stringify({
            from: this.fromEmail,
            to: [to],
            subject,
            html,
          }),
        });
        if (res.ok) {
          console.log(`[EmailService] Resend email dispatched to ${to}`);
          return { success: true };
        }
      } catch (err) {
        console.warn(`[EmailService] Resend error: ${err.message}`);
      }
    }

    // In development / demo mode, print structured transaction log to stdout
    console.log(`\n======================================================`);
    console.log(`✉️  [TRANSACTIONAL EMAIL DISPATCHED]`);
    console.log(`To:      ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Time:    ${new Date().toISOString()}`);
    console.log(`======================================================\n`);
    return { success: true, simulated: true };
  }

  /**
   * Welcome & Email Verification
   */
  async sendWelcomeVerification({ to, name, verificationUrl }) {
    const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0;">
        <div style="background: #0B192C; padding: 36px 32px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 28px; letter-spacing: 2px;">VAYORA</h1>
          <p style="color: #00B4D8; margin: 6px 0 0; font-size: 13px; text-transform: uppercase; letter-spacing: 1px;">Travel beyond the ordinary</p>
        </div>
        <div style="padding: 36px 32px;">
          <h2 style="color: #0B192C; font-size: 20px; margin-top: 0;">Welcome, ${name}!</h2>
          <p style="color: #4a5568; line-height: 1.6; font-size: 15px;">
            Thank you for joining VAYORA. You are now part of an exclusive community dedicated to discovering extraordinary travel destinations, luxury stays, and curated itineraries.
          </p>
          <div style="margin: 32px 0; text-align: center;">
            <a href="${verificationUrl}" style="background: #0284C7; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 12px; font-weight: bold; font-size: 14px; display: inline-block;">
              Verify Your Email Address
            </a>
          </div>
          <p style="color: #718096; font-size: 13px; line-height: 1.5;">
            Or copy and paste this link in your browser:<br/>
            <a href="${verificationUrl}" style="color: #0284C7; word-break: break-all;">${verificationUrl}</a>
          </p>
          <hr style="border: none; border-top: 1px solid #edf2f7; margin: 30px 0;" />
          <p style="color: #a0aec0; font-size: 12px; text-align: center;">
            © 2026 VAYORA Travel Technologies Pvt Ltd. All rights reserved.
          </p>
        </div>
      </div>
    `;
    return this.sendEmail({ to, subject: 'Welcome to VAYORA — Verify Your Account', html });
  }

  /**
   * Password Reset Email
   */
  async sendPasswordReset({ to, name, resetUrl }) {
    const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0;">
        <div style="background: #0B192C; padding: 36px 32px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 28px; letter-spacing: 2px;">VAYORA</h1>
        </div>
        <div style="padding: 36px 32px;">
          <h2 style="color: #0B192C; font-size: 20px; margin-top: 0;">Password Reset Request</h2>
          <p style="color: #4a5568; line-height: 1.6; font-size: 15px;">
            Hello ${name}, we received a request to reset your password for your VAYORA account. Click below to choose a new password. This link is valid for 1 hour.
          </p>
          <div style="margin: 32px 0; text-align: center;">
            <a href="${resetUrl}" style="background: #E63946; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 12px; font-weight: bold; font-size: 14px; display: inline-block;">
              Reset Password
            </a>
          </div>
          <p style="color: #718096; font-size: 13px;">If you did not request this, please disregard this email.</p>
        </div>
      </div>
    `;
    return this.sendEmail({ to, subject: 'VAYORA — Password Reset Request', html });
  }

  /**
   * Booking Confirmation & E-ticket
   */
  async sendBookingConfirmation({ to, booking }) {
    const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0;">
        <div style="background: #0B192C; padding: 32px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 26px; letter-spacing: 2px;">VAYORA</h1>
          <p style="color: #10B981; margin: 6px 0 0; font-size: 13px; font-weight: bold; text-transform: uppercase;">Booking Confirmed</p>
        </div>
        <div style="padding: 32px;">
          <h2 style="color: #0B192C; font-size: 18px; margin: 0 0 16px;">Booking Voucher: ${booking.bookingId}</h2>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 14px;">
            <tr style="border-bottom: 1px solid #edf2f7;">
              <td style="padding: 10px 0; color: #718096;">Experience / Item:</td>
              <td style="padding: 10px 0; font-weight: bold; text-align: right; color: #0B192C;">${booking.itemName}</td>
            </tr>
            <tr style="border-bottom: 1px solid #edf2f7;">
              <td style="padding: 10px 0; color: #718096;">Destination:</td>
              <td style="padding: 10px 0; font-weight: bold; text-align: right; color: #0B192C;">${booking.destination || 'India'}</td>
            </tr>
            <tr style="border-bottom: 1px solid #edf2f7;">
              <td style="padding: 10px 0; color: #718096;">Travel Date:</td>
              <td style="padding: 10px 0; font-weight: bold; text-align: right; color: #0B192C;">
                ${booking.travelDate ? new Date(booking.travelDate).toLocaleDateString('en-US', { dateStyle: 'medium' }) : 'Flexible'}
              </td>
            </tr>
            <tr style="border-bottom: 1px solid #edf2f7;">
              <td style="padding: 10px 0; color: #718096;">Travelers / Guests:</td>
              <td style="padding: 10px 0; font-weight: bold; text-align: right; color: #0B192C;">${booking.travelers || booking.guests}</td>
            </tr>
            <tr style="border-bottom: 1px solid #edf2f7;">
              <td style="padding: 10px 0; color: #718096;">Payment Status:</td>
              <td style="padding: 10px 0; font-weight: bold; text-align: right; color: #10B981;">PAID</td>
            </tr>
            <tr>
              <td style="padding: 14px 0; font-size: 16px; font-weight: bold; color: #0B192C;">Total Paid:</td>
              <td style="padding: 14px 0; font-size: 18px; font-weight: bold; text-align: right; color: #0284C7;">₹${Number(booking.totalAmount).toLocaleString('en-IN')}</td>
            </tr>
          </table>
          <p style="color: #4a5568; font-size: 13px; line-height: 1.6;">
            A printable invoice is available in your <a href="http://localhost:5173/dashboard/bookings" style="color: #0284C7; font-weight: bold;">User Dashboard</a>. Please present this booking reference upon arrival.
          </p>
        </div>
      </div>
    `;
    return this.sendEmail({ to, subject: `Booking Confirmed: ${booking.itemName} (${booking.bookingId})`, html });
  }

  /**
   * Cancellation Notice
   */
  async sendCancellationNotice({ to, booking }) {
    const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0;">
        <div style="background: #0B192C; padding: 32px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 26px; letter-spacing: 2px;">VAYORA</h1>
          <p style="color: #EF4444; margin: 6px 0 0; font-size: 13px; font-weight: bold;">Booking Cancelled</p>
        </div>
        <div style="padding: 32px;">
          <h2 style="color: #0B192C; font-size: 18px;">Booking Cancellation: ${booking.bookingId}</h2>
          <p style="color: #4a5568; line-height: 1.6; font-size: 14px;">
            Your booking for <strong>${booking.itemName}</strong> has been cancelled as requested.
            ${booking.refundAmount > 0 ? `<br/><br/>A refund of <strong>₹${Number(booking.refundAmount).toLocaleString('en-IN')}</strong> has been initiated to your original payment method.` : ''}
          </p>
        </div>
      </div>
    `;
    return this.sendEmail({ to, subject: `Booking Cancelled: ${booking.bookingId}`, html });
  }
}

export default new EmailService();
