const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middleware/authMiddleware");

const {
  addQuestion,
  createCategory,
  getCategories,
  getQuestionById,
  getQuestionsByCategory,
  getDashboardStats,
  updateCategory,
  deleteCategory,
  updateQuestion,
  deleteQuestion,
  getAllUsers,
  toggleUserPremium,
  deleteUser,
} = require("../controllers/adminController");

router.post("/category", protect, admin, createCategory);
router.get("/category", getCategories); // Public to fetch list

router.post("/question", protect, admin, addQuestion);
router.get("/question/:categoryId", getQuestionsByCategory); // Public
router.get("/question/detail/:id", protect, getQuestionById); // Protected User Route now

router.put("/category/:id", protect, admin, updateCategory);
router.delete("/category/:id", protect, admin, deleteCategory);

router.put("/question/:id", protect, admin, updateQuestion);
router.delete("/question/:id", protect, admin, deleteQuestion);

router.get("/stats", protect, admin, getDashboardStats);

// User Management
router.get("/users", protect, admin, getAllUsers);
router.put("/user/:id/premium", protect, admin, toggleUserPremium);
router.delete("/user/:id", protect, admin, deleteUser);

module.exports = router;
