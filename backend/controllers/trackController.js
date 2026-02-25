const User = require("../models/User");
const Question = require("../models/Question");

// @desc    Mark question as solved / Attempt question
// @route   POST /api/track/solve
// @access  Private
const solveQuestion = async (req, res) => {
  const { questionId } = req.body;

  try {
    // req.user is already populated by authMiddleware
    let user = req.user;

    // If environment admin, they don't have DB entry to save to
    if (user._id === "admin_env_id") {
      return res.status(200).json({
        ...user,
        usage: { cse_maang: [] }, // Mock usage for admin
      });
    }

    // If normal user, ensure we have the mongoose document to save
    // Middleware returns selected fields, so we might need to re-fetch if we need methods or full doc?
    // Middleware uses: User.findById(decoded.id).select("-password")
    // This returns a Mongoose document, so .save() is available.

    // However, if user was deleted between middleware and here:
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Default to 'cse_maang' for standard Coding Questions
    const track = "cse_maang";
    const limit = 3;

    // Initialize usage array if missing
    if (!user.usage) user.usage = {};
    if (!user.usage[track]) user.usage[track] = [];

    // Check if question already accessed
    const alreadyAccessed = user.usage[track].some(
      (id) => id.toString() === questionId,
    );

    if (alreadyAccessed) {
      return res.status(200).json(user);
    }

    // Enforce Limit if NOT Premium
    if (!user.isPremiumUser && user.usage[track].length >= limit) {
      return res.status(403).json({
        message:
          "Free limit reached (3 Questions). Upgrade to Premium for unlimted access.",
        requiresPremium: true,
      });
    }

    // Add question to usage list
    user.usage[track].push(questionId);
    await user.save();

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Get tracking stats (Total vs Solved)
// @route   GET /api/track/stats
// @access  Private
const getTrackStats = async (req, res) => {
  try {
    const { categoryId } = req.query; // Remove 'section' reliance
    const user = req.user;

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Use 'cse_maang' for Coding Questions
    // Handle admin case or missing usage safely
    const solvedIds = user.usage?.cse_maang || [];

    let totalQuestions = 0;
    let totalSolved = 0;

    if (!categoryId || categoryId === "all") {
      // Count all questions
      totalQuestions = await Question.countDocuments({});
      totalSolved = solvedIds.length;
    } else {
      // Count questions for specific category
      totalQuestions = await Question.countDocuments({ category: categoryId });

      // Count solved for this category
      totalSolved = await Question.countDocuments({
        _id: { $in: solvedIds },
        category: categoryId,
      });
    }

    res.status(200).json({
      totalSolved,
      totalQuestions,
      // Calculate remaining
      remaining: totalQuestions - totalSolved,
    });
  } catch (error) {
    console.error("Error in getTrackStats:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  solveQuestion,
  getTrackStats,
};
