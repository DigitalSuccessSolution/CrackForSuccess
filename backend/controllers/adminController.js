const Category = require("../models/Category");
const Question = require("../models/Question");
const User = require("../models/User");

// @desc    Create new category
// @route   POST /api/admin/category
// @access  Private/Admin
const createCategory = async (req, res) => {
  const { name, section, order } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Please add a category name" });
  }

  try {
    const category = await Category.create({
      name,
      section: section || "CSE",
      order: order || 0,
    });
    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all categories
// @route   GET /api/admin/category
// @access  Public
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({}).sort({ order: 1 });
    res.status(200).json(categories);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Add new question
// @route   POST /api/admin/question
// @access  Private/Admin
const addQuestion = async (req, res) => {
  const {
    title,
    problemStatement,
    difficulty,
    companies,
    category,
    leetcodeUrl,
    isPremium,
    examples,
    constraints,
    starterCode,
  } = req.body;

  if (!title || !problemStatement || !difficulty || !category) {
    return res.status(400).json({ message: "Please add all required fields" });
  }

  try {
    const question = await Question.create({
      title,
      problemStatement,
      difficulty,
      companies,
      category,
      leetcodeUrl,
      isPremium,
      examples,
      constraints,
      starterCode,
    });
    res.status(201).json(question);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get questions by category
// @route   GET /api/admin/question/:categoryId
// @access  Public
// @desc    Get questions by category (List View)
// @route   GET /api/admin/question/:categoryId
// @access  Public
const getQuestionsByCategory = async (req, res) => {
  try {
    const query =
      req.params.categoryId === "all"
        ? {}
        : { category: req.params.categoryId };
    // Secure: Don't return full content in list
    const questions = await Question.find(query).select(
      "title difficulty companies isPremium category leetcodeUrl",
    );
    res.status(200).json(questions);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get single question (Detail View - Protected)
// @route   GET /api/admin/question/detail/:id
// @access  Protected
const getQuestionById = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    const user = req.user;

    // 1. Admin Access
    if (user.role === "admin") {
      return res.status(200).json(question);
    }

    // 2. Global Premium Access
    if (user.isPremiumUser) {
      return res.status(200).json(question);
    }

    // 3. Free User Logic (CSE - MAANG)
    // Assuming Question model implies CSE MAANG track
    const track = "cse_maang";

    // Initialize usage
    if (!user.usage) user.usage = {};
    if (!user.usage[track]) user.usage[track] = [];

    const isUnlocked = user.usage[track].some(
      (id) => id.toString() === question._id.toString(),
    );

    if (isUnlocked) {
      return res.status(200).json(question);
    }

    // Check Limit
    if (user.usage[track].length < 3) {
      user.usage[track].push(question._id);
      await user.save();
      return res.status(200).json(question);
    } else {
      return res.status(403).json({
        message: "Free limit reached (3 Questions). Upgrade to Premium.",
        requiresPremium: true,
      });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: "user" });
    const totalQuestions = await Question.countDocuments({});

    // Revenue logic: Count premium users * price (e.g., 499)
    // Adjust query based on your schema structure for premium
    const premiumUsers = await User.countDocuments({
      "sections.CSE.isPremium": true,
    });
    const revenue = premiumUsers * 499;

    res.status(200).json({
      totalUsers,
      totalQuestions,
      revenue,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update category
// @route   PUT /api/admin/category/:id
// @access  Private/Admin
const updateCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    const { name, order } = req.body;
    category.name = name || category.name;
    category.order = order !== undefined ? order : category.order;

    await category.save();
    res.status(200).json(category);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete category
// @route   DELETE /api/admin/category/:id
// @access  Private/Admin
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    await category.deleteOne();
    res.status(200).json({ message: "Category removed" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update question
// @route   PUT /api/admin/question/:id
// @access  Private/Admin
const updateQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    const updatedQuestion = await Question.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    );
    res.status(200).json(updatedQuestion);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete question
// @route   DELETE /api/admin/question/:id
// @access  Private/Admin
const deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    await question.deleteOne();
    res.status(200).json({ message: "Question removed" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({})
      .select("-password")
      .populate("jobQuestionsViewed", "title") // To show which questions they viewed
      .sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Toggle user premium status
// @route   PUT /api/admin/user/:id/premium
// @access  Private/Admin
const toggleUserPremium = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isPremiumUser = req.body.isPremium;
    await user.save();
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/user/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.deleteOne();
    res.status(200).json({ message: "User removed" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createCategory,
  getCategories,
  addQuestion,
  getQuestionsByCategory,
  getQuestionById,
  getDashboardStats,
  updateCategory,
  deleteCategory,
  updateQuestion,
  deleteQuestion,
  getAllUsers,
  toggleUserPremium,
  deleteUser,
};
