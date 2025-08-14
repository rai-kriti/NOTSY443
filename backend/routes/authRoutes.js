
const { sendOTPEmail } = require("../utils/emailService.js"); // adjust path if needed

const express = require("express");
const router = express.Router();
const OTP = require("../otpstore");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

// SEND OTP
router.post("/send-otp", async (req, res) => {
  const { email } = req.body;

  try {
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    await OTP.create({ email, otp: otpCode });

   // console.log("OTP sent:", otpCode);  🔐 Replace with email service in prod
    await sendOTPEmail(email, otpCode);


    res.json({ message: "OTP sent successfully" });
  } catch (err) {
    console.error("Send OTP error:", err.message);
    res.status(500).json({ message: "Server error while sending OTP" });
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
    const otpAge = (now - validOtp.createdAt) / (1000 * 60);

    if (otpAge > 10) {
      await OTP.deleteMany({ email });
      return res.status(400).json({ message: "OTP expired. Request a new one." });
    }

    if (validOtp.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // ✅ Register user if not exist
    let user = await User.findOne({ email });

    if (!user) {
      const autoUsername = email.split("@")[0] + "_" + Date.now();
      user = await User.create({ email, username: autoUsername });
    }

    await OTP.deleteMany({ email });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ message: "Login successful", token , user });
  } catch (err) {
    console.error("OTP verify error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
