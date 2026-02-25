const mongoose = require("mongoose");

const questionSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please add a title"],
    },
    problemStatement: {
      type: String,
      required: [true, "Please add a problem statement"],
    },
    difficulty: {
      type: String,
      required: [true, "Please select difficulty"],
      enum: ["Easy", "Medium", "Hard"],
    },
    companies: [
      {
        name: { type: String, default: "" },
        logoUrl: { type: String, default: "" },
      },
    ],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    leetcodeUrl: {
      type: String,
      required: [false, "Please add a LeetCode URL"], // Optional for now to avoid breaking legacy if any
    },
    isPremium: {
      type: Boolean,
      default: false,
    },
    examples: [
      {
        input: String,
        output: String,
        explanation: String,
      },
    ],
    constraints: [
      {
        type: String,
      },
    ],
    starterCode: {
      cpp: String,
      java: String,
      python: String,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Question", questionSchema);
