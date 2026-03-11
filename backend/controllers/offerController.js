const asyncHandler = require("express-async-handler");
const Offer        = require("../models/Offer");

const getOffers    = asyncHandler(async (req, res) => {
  const offers = await Offer.find().sort({ createdAt: -1 });
  res.json(offers);
});

const createOffer  = asyncHandler(async (req, res) => {
  const { title, subtitle, badge, discount, category, icon, active, bg, accent } = req.body;
  if (!title || !category) { res.status(400); throw new Error("title and category required"); }
  const offer = await Offer.create({ title, subtitle, badge, discount, category, icon, active, bg, accent });
  res.status(201).json(offer);
});

const updateOffer  = asyncHandler(async (req, res) => {
  const offer = await Offer.findById(req.params.id);
  if (!offer) { res.status(404); throw new Error("Offer not found"); }
  const fields = ["title","subtitle","badge","discount","category","icon","active","bg","accent"];
  fields.forEach((f) => { if (req.body[f] !== undefined) offer[f] = req.body[f]; });
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
  offer.active = !offer.active;
  await offer.save();
  res.json({ active: offer.active });
});

module.exports = { getOffers, createOffer, updateOffer, deleteOffer, toggleOffer };
