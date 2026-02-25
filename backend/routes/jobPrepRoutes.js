const express = require("express");
const router = express.Router();
const {
  createJobCategory,
  getJobCategories,
  updateJobCategory,
  deleteJobCategory,
  createJobQuestion,
  getJobQuestionsByCategory,
  getJobQuestionDetail,
  updateJobQuestion,
  deleteJobQuestion,
  getJobAdminStats,
  getJobTrackStats,
} = require("../controllers/jobPrepController");
const { protect, admin } = require("../middleware/authMiddleware");

// Public routes (or semi-public)
router.get("/category", getJobCategories);
router.get("/question/list/:categoryId", getJobQuestionsByCategory);
router.get("/question/:id", protect, getJobQuestionDetail);

// Admin routes (Protected)
router.post("/category", protect, admin, createJobCategory);
router.put("/category/:id", protect, admin, updateJobCategory);
router.delete("/category/:id", protect, admin, deleteJobCategory);

router.post("/question", protect, admin, createJobQuestion);
router.put("/question/:id", protect, admin, updateJobQuestion);
router.delete("/question/:id", protect, admin, deleteJobQuestion);

router.get("/admin/stats", protect, admin, getJobAdminStats);
router.get("/track/stats", protect, getJobTrackStats);

module.exports = router;
