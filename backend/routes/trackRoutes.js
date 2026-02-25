const express = require("express");
const router = express.Router();
const {
  solveQuestion,
  getTrackStats,
} = require("../controllers/trackController");
const { protect } = require("../middleware/authMiddleware");

router.post("/solve", protect, solveQuestion);
router.get("/stats", protect, getTrackStats);

module.exports = router;
