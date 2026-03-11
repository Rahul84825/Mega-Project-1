const jwt        = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User       = require("../models/User");

// ── Protect: verify JWT ───────────────────────────────────────────────────────
const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch {
      res.status(401);
      throw new Error("Not authorised — invalid token");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorised — no token");
  }
});

// ── isAdmin: must be admin role ───────────────────────────────────────────────
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403);
    throw new Error("Not authorised — admin only");
  }
};

module.exports = { protect, isAdmin };
