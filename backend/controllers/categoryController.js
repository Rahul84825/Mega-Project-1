const asyncHandler = require("express-async-handler");
const Category     = require("../models/Category");

// GET /api/categories
const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find().sort({ createdAt: 1 });
  res.json(categories);
});

// POST /api/categories (admin)
const createCategory = asyncHandler(async (req, res) => {
  const { id, label, icon, description } = req.body;
  if (!id || !label) { res.status(400); throw new Error("id and label are required"); }

  const exists = await Category.findOne({ id });
  if (exists) { res.status(400); throw new Error("Category ID already exists"); }

  const category = await Category.create({ id, label, icon, description });
  res.status(201).json(category);
});

// PUT /api/categories/:id (admin)
const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findOne({ id: req.params.id });
  if (!category) { res.status(404); throw new Error("Category not found"); }

  category.label       = req.body.label       || category.label;
  category.icon        = req.body.icon        || category.icon;
  category.description = req.body.description !== undefined ? req.body.description : category.description;

  const updated = await category.save();
  res.json(updated);
});

// DELETE /api/categories/:id (admin)
const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findOne({ id: req.params.id });
  if (!category) { res.status(404); throw new Error("Category not found"); }
  await category.deleteOne();
  res.json({ message: "Category deleted" });
});

module.exports = { getCategories, createCategory, updateCategory, deleteCategory };
