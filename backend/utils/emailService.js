// utils/emailService.js
const { Resend } = require('resend');
require('dotenv').config();

const resend = new Resend(process.env.RESEND_API_KEY);

const sendOTPEmail = async (toEmail, otpCode) => {
  try {
    await resend.emails.send({
      from: process.env.EMAIL_FROM, // verified sender
      to: toEmail,
      subject: 'Your OTP Code',
      html: `<p>Your OTP is: <strong>${otpCode}</strong>. It will expire in 10 minutes.</p>`,
    });
    console.log(`OTP sent to ${toEmail}: ${otpCode}`);
  } catch (err) {
    console.error('Error sending OTP via Resend:', err.message);
    throw err;
  }
};

module.exports = { sendOTPEmail };
