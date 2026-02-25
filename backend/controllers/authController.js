const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Please add all fields" });
  }

  // Check if user exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  if (user) {
    res.status(201).json({
      user: {
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        sections: user.sections,
      },
      token: generateToken(user._id),
    });
  } else {
    res.status(400).json({ message: "Invalid user data" });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  console.log("Login Attempt:", { email, password });
  console.log("Env Admin config:", {
    email: process.env.ADMIN_EMAIL,
    hasPass: !!process.env.ADMIN_PASSWORD,
  });

  // 1. Check for Admin via Environment Variables (Hardcoded Admin)
  if (
    process.env.ADMIN_EMAIL &&
    email === process.env.ADMIN_EMAIL &&
    password === process.env.ADMIN_PASSWORD
  ) {
    return res.json({
      user: {
        _id: "admin_env_id",
        name: "Super Admin",
        email: process.env.ADMIN_EMAIL,
        role: "admin",
        isPremiumUser: true,
        sections: ["CSE", "Mechanical", "ECE"],
      },
      token: generateToken("admin_env_id"),
    });
  }

  // 2. Normal Database Check
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        sections: user.sections, // Legacy
        jobQuestionsViewed: user.jobQuestionsViewed || [], // Legacy
        usage: user.usage || {}, // New Usage Tracking
        isPremiumUser: user.isPremiumUser || false,
      },
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json({ message: "Invalid email or password" });
  }
};

// @desc    Get user data
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  res.status(200).json(req.user);
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
};
