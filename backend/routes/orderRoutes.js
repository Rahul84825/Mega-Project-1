const express = require("express");
const router  = express.Router();
const { createOrder, getOrders, getOrderById, getMyOrders, markDelivered, markAsPaid, submitUpiTransaction } = require("../controllers/orderController");
const { protect, isAdmin } = require("../middleware/authMiddleware");

router.post("/",              createOrder);                         // guest or logged-in
router.get("/",               protect, isAdmin, getOrders);         // admin: all orders
router.get("/my",             protect, getMyOrders);                // user: their orders
router.get("/:id",            protect, isAdmin, getOrderById);      // admin: single order
router.patch("/:id/deliver",  protect, isAdmin, markDelivered);     // admin: mark delivered
router.patch("/:id/mark-paid", protect, isAdmin, markAsPaid);       // admin: mark as paid
router.patch("/:id/upi-txn",  protect, submitUpiTransaction);      // customer: submit UPI txn ID

module.exports = router;