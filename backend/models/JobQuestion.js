const mongoose = require("mongoose");

const jobQuestionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please add a question title"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Please add a question description"],
    },
    answer: {
      type: String,
      required: [true, "Please add an answer"],
    },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      default: "Medium",
    },
    askedIn: {
      type: String, // e.g. "Google", "Facebook", "Generic"
      default: "",
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "JobCategory",
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      enum: ["Draft", "Published"],
      default: "Published",
    },
    tags: [
      {
        type: String,
      },
    ],
    leetcodeUrl: {
      type: String,
      default: "",
    },
    companies: [
      {
        name: { type: String, default: "" },
        logoUrl: { type: String, default: "" },
      },
    ],
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("JobQuestion", jobQuestionSchema);
