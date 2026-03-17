const asyncHandler = require("express-async-handler");
const User = require("../models/User");

// GET /api/wishlist — return current user's wishlist product IDs
const getWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("wishlist");
  res.json({ wishlist: user.wishlist.map((id) => String(id)) });
});

// POST /api/wishlist/:productId — add product to wishlist
const addToWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  await User.findByIdAndUpdate(
    req.user._id,
    { $addToSet: { wishlist: productId } },
    { new: true }
  );
  res.json({ success: true, action: "added", productId });
});

// DELETE /api/wishlist/:productId — remove product from wishlist
const removeFromWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  await User.findByIdAndUpdate(
    req.user._id,
    { $pull: { wishlist: productId } },
    { new: true }
  );
  res.json({ success: true, action: "removed", productId });
});

module.exports = { getWishlist, addToWishlist, removeFromWishlist };
