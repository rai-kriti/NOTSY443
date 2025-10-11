const { sendOTPEmail, sendOTPEmailFallback } = require("../utils/emailService.js");
const express = require("express");
const router = express.Router();
const OTP = require("../otpStore");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

// SEND OTP - Smart with Gmail fallback
router.post("/send-otp", async (req, res) => {
  const { email } = req.body;
  const VERIFIED_EMAIL = "kritiwork825@gmail.com"; // Your Resend verified email

  try {
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Save OTP to DB
    await OTP.create({ email, otp: otpCode });
    console.log(`📧 OTP generated for ${email}: ${otpCode}`);

    // If it's the verified email, use Resend
    if (email === VERIFIED_EMAIL) {
      try {
        await sendOTPEmail(email, otpCode);
        res.json({ message: "OTP sent successfully to your email" });
      } catch (emailError) {
        // Fallback to Gmail if Resend fails
        await sendOTPEmailFallback(email, otpCode);
        res.json({ message: "OTP sent successfully to your email" });
      }
    } else {
      // For other emails (like teacher's email), use Gmail fallback
      try {
        await sendOTPEmailFallback(email, otpCode);
        res.json({ 
          message: "OTP sent successfully to your email"
        });
      } catch (fallbackError) {
        // If Gmail fails, return OTP in response
        console.error("❌ Email services failed, returning OTP in response");
        res.json({ 
          message: "OTP generated successfully", 
          otp: otpCode,
          note: "Email service unavailable. Use this OTP for verification.",
          debug: true
        });
      }
    }
    
  } catch (err) {
    console.error("❌ Send OTP error:", err);
    res.status(500).json({ 
      message: "Error generating OTP", 
      error: err.message 
    });
  }
});

// VERIFY OTP & LOGIN/REGISTER USER
router.post("/verify-otp", async (req, res) => {
  console.log("🔍 Verify OTP endpoint hit", req.body);
  const { email, otp } = req.body;

  try {
    const validOtp = await OTP.findOne({ email }).sort({ createdAt: -1 });
    console.log("Found OTP record:", validOtp);

    if (!validOtp) {
      return res.status(400).json({ message: "OTP not found. Please request a new one." });
    }

    const now = new Date();
    const otpAge = (now - validOtp.createdAt) / (1000 * 60); // in minutes
    console.log(`OTP age: ${otpAge} minutes`);

    if (otpAge > 10) {
      await OTP.deleteMany({ email });
      return res.status(400).json({ message: "OTP expired. Request a new one." });
    }

    if (validOtp.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    let user = await User.findOne({ email });
    console.log("Found user:", user);

    if (!user) {
      const autoUsername = email.split("@")[0] + "_" + Date.now();
      user = await User.create({ email, username: autoUsername });
      console.log("Created new user:", user);
    }

    await OTP.deleteMany({ email });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ 
      message: "Login successful", 
      token, 
      user: {
        id: user._id,
        email: user.email,
        username: user.username
      }
    });
  } catch (err) {
    console.error("❌ OTP verify error:", err);
    res.status(500).json({ 
      message: "Server error", 
      error: err.message 
    });
  }
});

// Add a test route to verify this router is working
router.get("/test", (req, res) => {
  res.json({ message: "Auth routes are working!" });
});

module.exports = router;
