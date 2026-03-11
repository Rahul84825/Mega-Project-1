const asyncHandler = require("express-async-handler");
const Product      = require("../models/Product");

// ── GET /api/products ─────────────────────────────────────────────────────────
const getProducts = asyncHandler(async (req, res) => {
  const { category, search, sortBy, inStockOnly, page = 1, limit = 50 } = req.query;

  const filter = {};
  if (category && category !== "all") filter.category = category;
  if (inStockOnly === "true")         filter.inStock   = true;
  if (search) {
    filter.$or = [
      { name:        { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
      { category:    { $regex: search, $options: "i" } },
    ];
  }

  const sortMap = {
    "price-low":  { price: 1 },
    "price-high": { price: -1 },
    "rating":     { rating: -1 },
    "newest":     { createdAt: -1 },
    "default":    { createdAt: -1 },
  };
  const sort = sortMap[sortBy] || sortMap["default"];

  const total    = await Product.countDocuments(filter);
  const products = await Product.find(filter)
    .sort(sort)
    .skip((+page - 1) * +limit)
    .limit(+limit);

  res.json({ products, total, page: +page, pages: Math.ceil(total / +limit) });
});

// ── GET /api/products/:id ─────────────────────────────────────────────────────
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) { res.status(404); throw new Error("Product not found"); }
  res.json(product);
});

// ── POST /api/products (admin) ────────────────────────────────────────────────
const createProduct = asyncHandler(async (req, res) => {
  const { name, description, category, price, originalPrice, inStock, isNew, specifications } = req.body;

  if (!name || !category || !price || !originalPrice) {
    res.status(400);
    throw new Error("Please provide name, category, price and originalPrice");
  }

  const product = await Product.create({
    name, description, category,
    price: +price, originalPrice: +originalPrice,
    mrp:    req.body.mrp    !== undefined ? +req.body.mrp : +originalPrice,
    image:  req.body.image  || "",
    images: req.body.images || [],
    inStock:  inStock  !== undefined ? inStock  : true,
    isNew:    isNew    !== undefined ? isNew    : false,
    featured: req.body.featured !== undefined ? req.body.featured : false,
    brand:    req.body.brand || "",
    stock:    req.body.stock !== undefined ? +req.body.stock : 0,
    tags:     req.body.tags  || [],
    specifications,
  });

  res.status(201).json(product);
});

// ── PUT /api/products/:id (admin) ─────────────────────────────────────────────
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) { res.status(404); throw new Error("Product not found"); }

  const fields = ["name","description","category","price","originalPrice","mrp",
                  "image","images","inStock","isNew","featured","brand","stock","tags","specifications"];
  fields.forEach((f) => { if (req.body[f] !== undefined) product[f] = req.body[f]; });

  const updated = await product.save();
  res.json(updated);
});

// ── DELETE /api/products/:id (admin) ──────────────────────────────────────────
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) { res.status(404); throw new Error("Product not found"); }
  await product.deleteOne();
  res.json({ message: "Product deleted" });
});

// ── PATCH /api/products/:id/stock (admin) ─────────────────────────────────────
const toggleStock = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) { res.status(404); throw new Error("Product not found"); }
  product.inStock = !product.inStock;
  await product.save();
  res.json({ inStock: product.inStock });
});

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct, toggleStock };
