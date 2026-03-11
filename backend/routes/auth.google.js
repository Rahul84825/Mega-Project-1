// backend/routes/auth.google.js
// Add this route to your existing backend/routes/auth.js file
// 
// SETUP STEPS:
// 1. Go to https://console.cloud.google.com → APIs & Services → Credentials
// 2. Create OAuth 2.0 Client ID (Web application)
// 3. Add Authorised JavaScript origins: http://localhost:5173
// 4. Add Authorised redirect URIs: http://localhost:5000/api/auth/google
// 5. Copy Client ID to:
//    - backend/.env  → GOOGLE_CLIENT_ID=xxx
//    - frontend/.env → VITE_GOOGLE_CLIENT_ID=xxx
// 6. npm install google-auth-library  (in backend/)

const { OAuth2Client } = require("google-auth-library");
const jwt              = require("jsonwebtoken");
const User             = require("../models/User");  // adjust path if needed

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// POST /api/auth/google
// Body: { credential: "<Google ID token>" }
const googleAuth = async (req, res) => {
  try {
    const { credential } = req.body;
    if (!credential) return res.status(400).json({ message: "Google credential required" });

    // Verify the Google ID token
    const ticket = await googleClient.verifyIdToken({
      idToken:  credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { email, name, picture, sub: googleId } = payload;

    // Find or create user
    let user = await User.findOne({ email });

    if (user) {
      // Existing user — update Google ID if not set
      if (!user.googleId) {
        user.googleId = googleId;
        user.avatar   = user.avatar || picture;
        await user.save();
      }
    } else {
      // New user via Google
      user = await User.create({
        name,
        email,
        googleId,
        avatar:   picture,
        password: Math.random().toString(36).slice(-12), // random unusable password
        role:     "user",
      });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    res.json({
      token,
      user: {
        _id:    user._id,
        name:   user.name,
        email:  user.email,
        role:   user.role,
        avatar: user.avatar,
      },
    });
  } catch (err) {
    console.error("Google auth error:", err);
    res.status(401).json({ message: "Google authentication failed" });
  }
};

module.exports = googleAuth;

// ─────────────────────────────────────────────────────────────────────────────
// In your backend/routes/auth.js, add:
//
//   const googleAuth = require("./auth.google");   // or wherever you place this
//   router.post("/google", googleAuth);
//
// Also add googleId and avatar fields to your User model if not present:
//
//   googleId: { type: String, sparse: true },
//   avatar:   { type: String },
// ─────────────────────────────────────────────────────────────────────────────