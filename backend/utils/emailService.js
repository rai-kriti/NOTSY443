// utils/emailService.js
const nodemailer = require("nodemailer");
require("dotenv").config();


const sendOTPEmail = async (toEmail, otpCode) => {
  const transporter = nodemailer.createTransport({
    service: "gmail", // or "hotmail", "yahoo", etc.
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
};

module.exports = { sendOTPEmail };
