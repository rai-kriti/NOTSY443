// const nodemailer = require('nodemailer');

const createTransporter = () => {
  return nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS // App password
    },
    // Add timeout settings
    socketTimeout: 30000, // 30 seconds
    connectionTimeout: 30000,
    pool: true,
    maxConnections: 1,
    rateDelta: 1000,
    rateLimit: 1
  });
};

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

module.exports = { sendOTPEmail };
