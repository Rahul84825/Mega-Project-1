const mongoose = require("mongoose");
const bcrypt   = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name:     { type: String, required: true, trim: true },
    email:    { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, minlength: 6 },   // not required — Google users have no password
    phone:    { type: String, default: "" },
    role:     { type: String, enum: ["user", "admin"], default: "user" },
    googleId: { type: String, sparse: true },
    avatar:   { type: String, default: "" },

    // ── Email verification ────────────────────────────────────────
    isVerified:        { type: Boolean, default: false },
    verifyToken:       { type: String },
    verifyTokenExpiry: { type: Date },

    addresses: [
      {
        label:   String,
        line1:   String,
        line2:   String,
        city:    String,
        pincode: String,
        state:   String,
        country: { type: String, default: "India" },
      },
    ],

    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  },
  { timestamps: true }
);

// Hash password before save (skip if no password — Google login)
userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare entered password with hashed
userSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password) return false;
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);