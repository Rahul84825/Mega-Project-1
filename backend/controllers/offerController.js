const asyncHandler = require("express-async-handler");
const Offer        = require("../models/Offer");

const getOffers    = asyncHandler(async (req, res) => {
  const offers = await Offer.find()
    .sort({ isActive: -1, priority: -1, createdAt: -1 })
    .populate("targetProduct", "name image price mrp category");
  res.json(offers);
});

const createOffer  = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    subtitle,
    badge,
    image,
    discount,
    discountPercent,
    offerType,
    targetProduct,
    targetCategory,
    category,
    priority,
    isActive,
    active,
    icon,
    bg,
    accent,
  } = req.body;

  if (!title) { res.status(400); throw new Error("title is required"); }

  const normalizedType = offerType || (targetProduct ? "product" : targetCategory || category ? "category" : "banner");
  const normalizedCategory = targetCategory || category || "";

  const offer = await Offer.create({
    title,
    description: description || subtitle || "",
    subtitle,
    badge,
    image,
    discount,
    discountPercent: Number(discountPercent) || 0,
    offerType: normalizedType,
    targetProduct: targetProduct || null,
    targetCategory: normalizedCategory,
    category: normalizedCategory,
    priority: Number(priority) || 0,
    isActive: isActive !== undefined ? !!isActive : active !== undefined ? !!active : true,
    active: isActive !== undefined ? !!isActive : active !== undefined ? !!active : true,
    icon,
    bg,
    accent,
  });
  res.status(201).json(offer);
});

const updateOffer  = asyncHandler(async (req, res) => {
  const offer = await Offer.findById(req.params.id);
  if (!offer) { res.status(404); throw new Error("Offer not found"); }

  const fields = [
    "title", "description", "subtitle", "badge", "image", "discount", "discountPercent",
    "offerType", "targetProduct", "targetCategory", "category", "priority", "isActive",
    "icon", "bg", "accent"
  ];
  fields.forEach((f) => { if (req.body[f] !== undefined) offer[f] = req.body[f]; });
  if (req.body.active !== undefined) offer.isActive = !!req.body.active;
  if (req.body.targetCategory !== undefined && req.body.category === undefined) {
    offer.category = req.body.targetCategory || "";
  }
  offer.active = offer.isActive;

  const updated = await offer.save();
  res.json(updated);
});

const deleteOffer  = asyncHandler(async (req, res) => {
  const offer = await Offer.findById(req.params.id);
  if (!offer) { res.status(404); throw new Error("Offer not found"); }
  await offer.deleteOne();
  res.json({ message: "Offer deleted" });
});

const toggleOffer  = asyncHandler(async (req, res) => {
  const offer = await Offer.findById(req.params.id);
  if (!offer) { res.status(404); throw new Error("Offer not found"); }
  offer.isActive = !offer.isActive;
  offer.active = offer.isActive;
  await offer.save();
  res.json({ active: offer.active, isActive: offer.isActive });
});

module.exports = { getOffers, createOffer, updateOffer, deleteOffer, toggleOffer };
