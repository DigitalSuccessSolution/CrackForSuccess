const mongoose = require("mongoose");

const jobCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a category name"],
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "Please add a slug"],
      unique: true,
      lowercase: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    department: {
      type: String,
      enum: ["CSE", "Mechanical", "ECE"],
      default: "CSE",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("JobCategory", jobCategorySchema);
