// utils/emailService.js
const nodemailer = require("nodemailer");
require("dotenv").config();

const sendOTPEmail = async (toEmail, otpCode) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: toEmail,
      subject: "Your OTP Code",
      text: `Your OTP is: ${otpCode}. It will expire in 10 minutes.`,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ OTP sent successfully to ${toEmail}`);
  } catch (error) {
    console.error("❌ Error sending OTP:", error.message);
  }
};

module.exports = { sendOTPEmail };
