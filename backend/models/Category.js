const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    id:          { type: String, required: true, unique: true, lowercase: true },
    label:       { type: String, required: true, trim: true },
    icon:        { type: String, default: "🥘" },
    description: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", categorySchema);
