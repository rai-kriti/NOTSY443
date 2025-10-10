const { sendOTPEmail } = require("./utils/emailService");

sendOTPEmail("raikriti628@gmail.com", "123456")
  .then(() => console.log("✅ OTP sent successfully"))
  .catch((err) => console.error("❌ Error sending mail:", err));
