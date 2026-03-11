const express = require("express");
const router  = express.Router();
const { uploadImage, deleteImage } = require("../controllers/uploadController");
const { upload }    = require("../config/cloudinary");
const { protect, isAdmin } = require("../middleware/authMiddleware");

router.post("/",          protect, isAdmin, upload.single("image"), uploadImage);
router.delete("/:public_id", protect, isAdmin, deleteImage);

module.exports = router;
