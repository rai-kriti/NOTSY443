const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    otp: { type: String, required: true },
  },
  { timestamps: true } // for createdAt
);

module.exports = mongoose.model("OTP", otpSchema);
