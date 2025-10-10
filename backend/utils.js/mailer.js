// utils/mailer.js
// const nodemailer = require('nodemailer');

// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// module.exports = transporter;


// utils/emailService.js
const { Resend } = require('resend');
require('dotenv').config();

const resend = new Resend(process.env.RESEND_API_KEY);

const sendOTPEmail = async (toEmail, otpCode) => {
  try {
    const response = await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to: toEmail,
      subject: "Your OTP Code",
      html: `<p>Your OTP is: <strong>${otpCode}</strong></p>
             <p>It will expire in 10 minutes.</p>`,
    });

    console.log("✅ Email sent successfully:", response);
  } catch (error) {
    console.error("❌ Error sending email via Resend:", error);
    throw error;
  }
};

module.exports = { sendOTPEmail };
