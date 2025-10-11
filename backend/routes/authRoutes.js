const { sendOTPEmail } = require("../utils/emailService.js");
const express = require("express");
const router = express.Router();
const OTP = require("../otpStore");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

// SEND OTP
router.post("/send-otp", async (req, res) => {
  const { email } = req.body;

  try {
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Save OTP to DB
    await OTP.create({ email, otp: otpCode });

    // Send OTP via Gmail (App Password)
    await sendOTPEmail(email, otpCode);

    res.json({ message: "OTP sent successfully" });
  } catch (err) {
    console.error("Send OTP error:", err);
    res.status(500).json({ message: "Error sending OTP", error: err.message });
  }
});

// VERIFY OTP & LOGIN/REGISTER USER
router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;

  try {
    const validOtp = await OTP.findOne({ email }).sort({ createdAt: -1 });

    if (!validOtp) {
      return res.status(400).json({ message: "OTP not found. Please request a new one." });
    }

    const now = new Date();
    const otpAge = (now - validOtp.createdAt) / (1000 * 60); // in minutes

    if (otpAge > 10) {
      await OTP.deleteMany({ email });
      return res.status(400).json({ message: "OTP expired. Request a new one." });
    }

    if (validOtp.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    let user = await User.findOne({ email });

    if (!user) {
      const autoUsername = email.split("@")[0] + "_" + Date.now();
      user = await User.create({ email, username: autoUsername });
    }

    await OTP.deleteMany({ email });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ message: "Login successful", token, user });
  } catch (err) {
    console.error("OTP verify error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
