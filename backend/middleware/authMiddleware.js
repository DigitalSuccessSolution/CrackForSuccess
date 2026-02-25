const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];
      // console.log("Auth Middleware - Token:", token);

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // console.log("Auth Middleware - Decoded:", decoded);

      // Handle Env Admin (Bypass DB)
      if (decoded.id === "admin_env_id") {
        req.user = {
          _id: "admin_env_id",
          name: "Super Admin",
          email: process.env.ADMIN_EMAIL,
          role: "admin",
          isPremiumUser: true, // Super admin is premium
          sections: ["CSE", "Mechanical", "ECE"], // Access all
        };
      } else {
        // Get user from the token (DB)
        req.user = await User.findById(decoded.id).select("-password");
      }

      console.log(
        "Auth Middleware - User:",
        req.user ? req.user.email : "Not Found",
      );

      next();
    } catch (error) {
      console.error("Auth Middleware Error:", error.message);
      res.status(401).json({ message: "Not authorized" });
    }
  }

  if (!token) {
    console.log("Auth Middleware - No Token");
    res.status(401).json({ message: "Not authorized, no token" });
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(401).json({ message: "Not authorized as an admin" });
  }
};

module.exports = { protect, admin };
