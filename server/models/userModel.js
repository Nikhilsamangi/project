const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your name"],
    },
    mobile: {
      type: String,
      required: [true, "Please enter your mobile number"],
    },
    company: {
      type: String,
      required: [true, "Please enter your company"],
    },
    email: {
      type: String,
      required: [true, "Please enter your email"],
      unique: [true, "Email is already taken"],
    },
    username: {
      type: String,
      required: [true, "Please enter your username"],
      unique: [true, "Username is already taken"],
    },
    password: {
      type: String,
      required: [true, "Please enter your password"],
    },
    role: {
      type: String,
      required: [true, "Please enter your role"],
      enum: ["employee", "admin"], // Assuming role is either 'employee' or 'admin'
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", UserSchema);
