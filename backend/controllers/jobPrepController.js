const JobCategory = require("../models/JobCategory");
const JobQuestion = require("../models/JobQuestion");
const User = require("../models/User");

// @desc    Create new Job Category
// @route   POST /api/job/category
// @access  Private/Admin
const createJobCategory = async (req, res) => {
  const { name, slug, isActive } = req.body;

  if (!name || !slug) {
    return res.status(400).json({ message: "Please add name and slug" });
  }

  try {
    const category = await JobCategory.create({
      name,
      slug,
      department: req.body.department || "CSE",
      isActive: isActive !== undefined ? isActive : true,
    });
    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all Job Categories
// @route   GET /api/job/category
// @access  Public
const getJobCategories = async (req, res) => {
  try {
    const { department } = req.query;
    console.log(req.query);
    const query = { isActive: true };
    if (department) {
      query.department = department;
    }

    const categories = await JobCategory.find(query).sort({
      createdAt: -1,
    });
    res.status(200).json(categories);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update Job Category
// @route   PUT /api/job/category/:id
// @access  Private/Admin
const updateJobCategory = async (req, res) => {
  try {
    const category = await JobCategory.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    const { name, slug, isActive, department } = req.body;
    category.name = name || category.name;
    category.slug = slug || category.slug;
    category.department = department || category.department;
    if (isActive !== undefined) category.isActive = isActive;

    await category.save();
    res.status(200).json(category);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete Job Category
// @route   DELETE /api/job/category/:id
// @access  Private/Admin
const deleteJobCategory = async (req, res) => {
  try {
    const category = await JobCategory.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    await category.deleteOne();
    res.status(200).json({ message: "Category removed" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Create new Job Question
// @route   POST /api/job/question
// @access  Private/Admin
const createJobQuestion = async (req, res) => {
  const {
    title,
    description,
    answer,
    difficulty,
    askedIn,
    companies,
    categoryId,
    isActive,
    status,
    tags,
    leetcodeUrl,
  } = req.body;

  if (!title || !description || !answer || !categoryId) {
    return res.status(400).json({ message: "Please add all required fields" });
  }

  try {
    const question = await JobQuestion.create({
      title,
      description,
      answer,
      difficulty,
      askedIn,
      companies: companies || [],
      categoryId,
      isActive: isActive !== undefined ? isActive : true,
      status: status || "Published",
      tags: tags || [],
      leetcodeUrl,
    });
    res.status(201).json(question);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get Job Questions by Category
// @route   GET /api/job/question/list/:categoryId
// @access  Public
const getJobQuestionsByCategory = async (req, res) => {
  try {
    const questions = await JobQuestion.find({
      categoryId: req.params.categoryId,
      isActive: true,
    })
      .select("-answer -description") // Hide detailed content in list view
      .sort({ createdAt: -1 });

    // Normalize: ensure every question has a companies array
    // (for backward compat with old questions that only have askedIn string)
    const normalized = questions.map((q) => {
      const obj = q.toObject();
      if (!obj.companies || obj.companies.length === 0) {
        if (obj.askedIn) {
          obj.companies = obj.askedIn
            .split(",")
            .map((name) => ({ name: name.trim(), logoUrl: "" }))
            .filter((c) => c.name);
        } else {
          obj.companies = [];
        }
      }
      return obj;
    });

    res.status(200).json(normalized);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get Job Question Detail (with Access Control)
// @route   GET /api/job/question/:id
// @access  Public (Check limits if user exists)
const getJobQuestionDetail = async (req, res) => {
  try {
    const question = await JobQuestion.findById(req.params.id).populate(
      "categoryId",
      "name department",
    );
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    // Fetch questions from the same company (if available)
    let companyQuestions = [];
    if (question.askedIn) {
      // Split by comma in case multiple companies are listed, take the first one or search for any
      // For simplicity, we'll search for the exact string or regex match if multiple
      companyQuestions = await JobQuestion.find({
        askedIn: {
          $regex: question.askedIn.split(",")[0].trim(),
          $options: "i",
        },
        _id: { $ne: question._id },
        isActive: true,
      })
        .select("title difficulty askedIn userViews")
        .limit(10);
    }

    // Fetch other questions from the same category
    const categoryQuestions = await JobQuestion.find({
      categoryId: question.categoryId._id,
      _id: { $ne: question._id },
      isActive: true,
    })
      .select("title difficulty askedIn")
      .limit(12);

    // Identify user (May be undefined if auth removed)
    const user = req.user;

    // Response object builder
    const responseData = {
      ...question.toObject(),
      leetcodeUrl: question.leetcodeUrl,
      companyQuestions,
      categoryQuestions,
    };

    if (!user) {
      return res.status(200).json(responseData);
    }

    // 1. If Admin, allow
    if (user.role === "admin") {
      return res.status(200).json(responseData);
    }

    // 2. Determine Track based on Question Department
    const dept = question.categoryId.department;
    let track = "";
    if (dept === "CSE") track = "cse_job";
    else if (dept === "Mechanical") track = "me";
    else if (dept === "ECE") track = "ece";
    else track = "cse_job"; // Default fallback

    // Initialize usage if missing
    if (!user.usage) user.usage = {};
    if (!user.usage[track]) user.usage[track] = [];

    // 3. Check Premium Status
    // Global Premium or Section-specific? User said "Premium users should have unlimited access".
    // Usually means Global Premium.
    if (user.isPremiumUser) {
      return res.status(200).json(responseData);
    }

    // 4. Check Limits
    const isUnlocked = user.usage[track].some(
      (id) => id.toString() === question._id.toString(),
    );

    if (isUnlocked) {
      return res.status(200).json(responseData);
    } else {
      // Check count
      if (user.usage[track].length < 3) {
        user.usage[track].push(question._id);
        await user.save();
        return res.status(200).json(responseData);
      } else {
        return res.status(403).json({
          message: "Free limit reached (3 Questions). Upgrade to Premium.",
          limitReached: true,
        });
      }
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update Job Question
// @route   PUT /api/job/question/:id
// @access  Private/Admin
const updateJobQuestion = async (req, res) => {
  try {
    const question = await JobQuestion.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    const updated = await JobQuestion.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    );
    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete Job Question
// @route   DELETE /api/job/question/:id
// @access  Private/Admin
const deleteJobQuestion = async (req, res) => {
  try {
    const question = await JobQuestion.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    await question.deleteOne();
    res.status(200).json({ message: "Question removed" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get Job Prep tracking stats (Total vs Solved) for ME/EE/CSE-Job
// @route   GET /api/job/track/stats
// @access  Private
const getJobTrackStats = async (req, res) => {
  try {
    const { categoryId, department } = req.query;
    const user = req.user;

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Determine the usage track key based on department
    let trackKey = "cse_job";
    if (department === "Mechanical") trackKey = "me";
    else if (department === "ECE") trackKey = "ece";
    else if (department === "CSE") trackKey = "cse_job";

    const solvedIds = user.usage?.[trackKey] || [];

    let totalQuestions = 0;
    let totalSolved = 0;

    if (!categoryId || categoryId === "all") {
      // Count all active questions for this department
      const allCats = await JobCategory.find({ department }).select("_id");
      const catIds = allCats.map((c) => c._id);
      totalQuestions = await JobQuestion.countDocuments({
        categoryId: { $in: catIds },
        isActive: true,
      });
      totalSolved = solvedIds.length;
    } else {
      // Count questions for specific category
      totalQuestions = await JobQuestion.countDocuments({
        categoryId,
        isActive: true,
      });
      totalSolved = await JobQuestion.countDocuments({
        _id: { $in: solvedIds },
        categoryId,
      });
    }

    res.status(200).json({
      totalSolved,
      totalQuestions,
      remaining: Math.max(0, totalQuestions - totalSolved),
    });
  } catch (error) {
    console.error("Error in getJobTrackStats:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @route   GET /api/job/admin/stats
// @access  Private/Admin
const getJobAdminStats = async (req, res) => {
  try {
    const totalCategories = await JobCategory.countDocuments({});
    const totalQuestions = await JobQuestion.countDocuments({});
    const totalUsers = await User.countDocuments({});

    // Calculate engagement: Users who have viewed at least one question
    const engagedUsersCount = await User.countDocuments({
      jobQuestionsViewed: { $exists: true, $not: { $size: 0 } },
    });

    // Engagement percentage (avoid division by zero)
    const engagementRate =
      totalUsers > 0 ? Math.round((engagedUsersCount / totalUsers) * 100) : 0;

    // Section-wise stats
    const sectionStats = await JobQuestion.aggregate([
      {
        $lookup: {
          from: "jobcategories",
          localField: "categoryId",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: "$category" },
      {
        $group: {
          _id: "$category.department",
          count: { $sum: 1 },
        },
      },
    ]);

    const formattedStats = {
      CSE: 0,
      Mechanical: 0,
      ECE: 0,
    };

    sectionStats.forEach((stat) => {
      if (stat._id && stat._id !== "Civil")
        formattedStats[stat._id] = stat.count;
    });

    res.status(200).json({
      totalCategories,
      totalQuestions,
      activeUsers: totalUsers, // Using total users as active users for now
      engagement: `${engagementRate > 0 ? "+" : ""}${engagementRate}%`,
      sectionStats: formattedStats,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
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
};
