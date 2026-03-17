const express  = require("express");
const router   = express.Router();
const asyncHandler = require("express-async-handler");
const { protect, isAdmin } = require("../middleware/authMiddleware");
const User    = require("../models/User");
const Product = require("../models/Product");
const Order   = require("../models/Order");

// GET /api/admin/stats — high-level store metrics for dashboard
router.get("/stats", protect, isAdmin, asyncHandler(async (_req, res) => {
  const [totalUsers, totalProducts, totalOrders, revenueAgg] = await Promise.all([
    User.countDocuments({}),
    Product.countDocuments({}),
    Order.countDocuments({}),
    Order.aggregate([{ $group: { _id: null, total: { $sum: "$total" } } }]),
  ]);

  res.json({
    totalUsers,
    totalProducts,
    totalOrders,
    totalRevenue: revenueAgg[0]?.total || 0,
  });
}));

module.exports = router;
