const express = require("express");
const router  = express.Router();
const { createOrder, getOrders, getOrderById, getMyOrders, markDelivered } = require("../controllers/orderController");
const { protect, isAdmin } = require("../middleware/authMiddleware");

router.post("/",             createOrder);                     // guest or logged-in
router.get("/",              protect, isAdmin, getOrders);     // admin: all orders
router.get("/my",            protect, getMyOrders);            // user: their orders
router.get("/:id",           protect, isAdmin, getOrderById);  // admin: single order
router.patch("/:id/deliver", protect, isAdmin, markDelivered); // admin: mark delivered

module.exports = router;