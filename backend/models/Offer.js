const mongoose = require("mongoose");

const offerSchema = new mongoose.Schema(
  {
    title:          { type: String, required: true, trim: true },
    description:    { type: String, default: "" },
    subtitle:       { type: String, default: "" },
    badge:          { type: String, default: "" },
    image:          { type: String, default: "" },
    discount:       { type: String, default: "" },
    discountPercent:{ type: Number, min: 0, max: 100, default: 0 },
    offerType:      { type: String, enum: ["banner", "category", "product"], default: "banner" },
    targetProduct:  { type: mongoose.Schema.Types.ObjectId, ref: "Product", default: null },
    targetCategory: { type: String, default: "" },
    category:       { type: String, default: "" },
    priority:       { type: Number, default: 0 },
    isActive:       { type: Boolean, default: true },
    active:         { type: Boolean, default: true },
    icon:           { type: String, default: "🥘" },
    bg:             { type: String, default: "from-slate-800 to-slate-600" },
    accent:         { type: String, default: "bg-slate-500" },
  },
  { timestamps: true }
);

offerSchema.pre("save", function (next) {
  this.active = this.isActive;
  if (this.offerType === "category" && this.targetCategory && !this.category) {
    this.category = this.targetCategory;
  }
  next();
});

module.exports = mongoose.model("Offer", offerSchema);
