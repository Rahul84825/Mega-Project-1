const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name:          { type: String, required: true, trim: true },
    description:   { type: String, default: "" },
    category:      { type: String, required: true },
    price:         { type: Number, required: true, min: 0 },
    originalPrice: { type: Number, min: 0 },   // kept for backward compat
    mrp:           { type: Number, min: 0 },   // alias — form sends this
    image:         { type: String, default: "" },
    images:        [{ type: String }],
    inStock:       { type: Boolean, default: true },
    featured:      { type: Boolean, default: false },
    isNew:         { type: Boolean, default: false },
    brand:         { type: String, default: "" },
    stock:         { type: Number, default: 0 },
    tags:          [{ type: String }],
    rating:        { type: Number, default: 0, min: 0, max: 5 },
    reviews:       { type: Number, default: 0 },
    specifications: { type: Map, of: String },
  },
  { timestamps: true }
);

// Before save: keep mrp and originalPrice in sync
productSchema.pre("save", function (next) {
  if (this.mrp && !this.originalPrice) this.originalPrice = this.mrp;
  if (this.originalPrice && !this.mrp) this.mrp = this.originalPrice;
  next();
});

// Virtual: discount percentage
productSchema.virtual("discount").get(function () {
  const base = this.mrp || this.originalPrice;
  if (!base || base <= this.price) return 0;
  return Math.round(((base - this.price) / base) * 100);
});

productSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Product", productSchema);