



const { sendOTPEmail } = require("../utils/emailService.js");
const express = require("express");
const router = express.Router();
const OTP = require("../otpStore");
const User = require("../models/User");
const jwt = require("jsonwebtoken");


// TEMPORARY DEBUG ENDPOINT - REMOVE IN PRODUCTION
// router.post("/send-otp-debug", async (req, res) => {
//   const { email } = req.body;

//   try {
//     const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    
//     // Save OTP to DB
//     await OTP.create({ email, otp: otpCode });
//     console.log(`🔧 DEBUG OTP for ${email}: ${otpCode}`);

//     res.json({ 
//       message: "OTP generated (debug mode)", 
//       otp: otpCode,
//       note: "Use this OTP to test the verify-otp endpoint while we fix email service" 
//     });
//   } catch (err) {
//     console.error("Debug OTP error:", err);
//     res.status(500).json({ error: err.message });
//   }
// });





// SEND OTP
// SEND OTP - Smart version with fallback
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
        console.log("✅ Email sent successfully via Resend");
        res.json({ 
          message: "OTP sent successfully to your email"
        });
      } catch (emailError) {
        console.error("❌ Resend failed:", emailError.message);
        // Even for verified email, fallback to returning OTP
        res.json({ 
          message: "OTP generated", 
          otp: otpCode,
          note: "Email service temporarily unavailable. Use this OTP.",
          debug: true
        });
      }
    } else {
      // For other emails, return OTP in response with a friendly message
      res.json({ 
        message: "OTP generated successfully", 
        otp: otpCode,
        note: "Demo mode: OTP shown here. In production, this would be sent via email.",
        debug: true
      });
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
