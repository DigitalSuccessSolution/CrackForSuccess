const mongoose = require("mongoose");

const categorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a category name"],
      unique: true,
    },
    section: {
      type: String,
      required: [true, "Please select a section (CSE/ECE/ML)"],
      enum: ["CSE", "ECE", "Mechanical"],
      default: "CSE",
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Category", categorySchema);
