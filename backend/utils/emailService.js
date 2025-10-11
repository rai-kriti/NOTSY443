const nodemailer = require('nodemailer');

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
  let transporter;
  
  try {
    transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your OTP Code',
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2>Your OTP Code</h2>
          <p>Use the following OTP to login:</p>
          <h1 style="color: #2563eb;">${otp}</h1>
          <p>This OTP will expire in 10 minutes.</p>
        </div>
      `
    };

    // Add timeout to the send operation
    const sendPromise = transporter.sendMail(mailOptions);
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Email timeout after 20s')), 20000);
    });

    await Promise.race([sendPromise, timeoutPromise]);
    console.log(`✅ OTP email sent to ${email}`);
    
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    throw new Error(`Email service error: ${error.message}`);
  } finally {
    if (transporter) {
      transporter.close();
    }
  }
};

module.exports = { sendOTPEmail };