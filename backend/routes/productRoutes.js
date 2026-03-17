const express = require("express");
const router  = express.Router();
const {
  getProducts, getProductById, createProduct,
  updateProduct, deleteProduct, toggleStock,
} = require("../controllers/productController");
const { protect, isAdmin } = require("../middleware/authMiddleware");

router.get("/",            getProducts);
router.get("/:id",         getProductById);
router.post("/",           protect, isAdmin, createProduct);
router.put("/:id",         protect, isAdmin, updateProduct);
router.delete("/:id",      protect, isAdmin, deleteProduct);
router.patch("/:id/stock", protect, isAdmin, toggleStock);

module.exports = router;
