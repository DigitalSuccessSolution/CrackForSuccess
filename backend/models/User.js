const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
    },
    email: {
      type: String,
      required: [true, "Please add an email"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    isPremiumUser: {
      type: Boolean,
      default: false,
    },
    // Unified Usage Tracking for Free Limits
    usage: {
      // CSE - MAANG (Coding Questions - Question Model)
      cse_maang: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Question",
        },
      ],
      // CSE - Job Prep (Theory/Interview - JobQuestion Model)
      cse_job: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "JobQuestion",
        },
      ],
      // Mechanical (Theory/Interview - JobQuestion Model)
      me: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "JobQuestion",
        },
      ],
      // ECE (Theory/Interview - JobQuestion Model)
      ece: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "JobQuestion",
        },
      ],
    },
  },
  {
    timestamps: true,
  },
);

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
