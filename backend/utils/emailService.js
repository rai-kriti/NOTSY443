const resendEmails = require('resend');
const nodemailer = require('nodemailer');

// Resend setup
const resend = new resendEmails.Resend(process.env.RESEND_API_KEY);

// Resend function for verified emails
const sendOTPEmail = async (email, otp) => {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Your App <onboarding@resend.dev>',
      to: [email],
      subject: 'Your OTP Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">
          <h2 style="color: #333;">Your OTP Code</h2>
          <p>Use the following OTP to login to your account:</p>
          <div style="background: #f4f4f4; padding: 15px; text-align: center; margin: 20px 0; border-radius: 8px;">
            <h1 style="color: #2563eb; margin: 0; font-size: 32px; letter-spacing: 5px;">${otp}</h1>
          </div>
          <p style="color: #666; font-size: 12px;">This OTP will expire in 10 minutes.</p>
        </div>
      `,
    });

    if (error) {
      throw new Error(error.message);
    }

    console.log(`✅ OTP email sent to ${email} via Resend`);
    return true;
  } catch (error) {
    console.error('❌ Resend error:', error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

// Simple Gmail fallback for any email
const sendOTPEmailFallback = async (email, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER, // Your personal Gmail
        pass: process.env.GMAIL_APP_PASSWORD // Gmail App Password
      }
    });

    const mailOptions = {
      from: `"Note App Demo" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: 'Your OTP Code - Demo',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">
          <h2 style="color: #333;">Your OTP Code</h2>
          <p>Use the following OTP to login to your Note App:</p>
          <div style="background: #f4f4f4; padding: 15px; text-align: center; margin: 20px 0; border-radius: 8px;">
            <h1 style="color: #2563eb; margin: 0; font-size: 32px; letter-spacing: 5px;">${otp}</h1>
          </div>
          <p style="color: #666; font-size: 12px;">This OTP will expire in 10 minutes.</p>
          <p style="color: #999; font-size: 10px; margin-top: 20px;">Demo email from Note App Presentation</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Demo email sent to ${email} via Gmail`);
    return true;
  } catch (error) {
    console.error('❌ Gmail fallback failed:', error);
    throw new Error(`Gmail fallback failed: ${error.message}`);
  }
};

module.exports = { sendOTPEmail, sendOTPEmailFallback };