const mongoose = require("mongoose");

const offerSchema = new mongoose.Schema(
  {
    title:    { type: String, required: true, trim: true },
    subtitle: { type: String, default: "" },
    badge:    { type: String, default: "" },
    discount: { type: String, default: "" },
    category: { type: String, required: true },
    icon:     { type: String, default: "🥘" },
    active:   { type: Boolean, default: true },
    bg:       { type: String, default: "from-slate-800 to-slate-600" },
    accent:   { type: String, default: "bg-slate-500" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Offer", offerSchema);
