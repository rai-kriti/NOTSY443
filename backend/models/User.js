// const mongoose = require('mongoose');

// const userSchema = new mongoose.Schema({
//   username: {
//     type: String,
//     //required: true,
//     unique: true,
//   },
//   password: {
//     type: String,
//    // required: true,
//   },
// }, { timestamps: true });

// module.exports = mongoose.model('User', userSchema);


const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, unique: true }, // Auto-generate
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("User", userSchema);

