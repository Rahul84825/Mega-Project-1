const express    = require("express");
const router     = express.Router();
const { register, login, getMe, updateProfile, verifyEmail, resendVerification } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const googleAuth  = require("./auth.google");

router.post("/register",             register);
router.post("/login",                login);
router.post("/google",               googleAuth);
router.get("/verify-email",          verifyEmail);
router.post("/resend-verification",  resendVerification);
router.get("/me",                    protect, getMe);
router.put("/profile",               protect, updateProfile);

module.exports = router;