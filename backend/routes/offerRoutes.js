const express = require("express");
const router  = express.Router();
const { getOffers, createOffer, updateOffer, deleteOffer, toggleOffer } = require("../controllers/offerController");
const { protect, isAdmin } = require("../middleware/authMiddleware");

router.get("/",               getOffers);
router.post("/",              protect, isAdmin, createOffer);
router.put("/:id",            protect, isAdmin, updateOffer);
router.delete("/:id",         protect, isAdmin, deleteOffer);
router.patch("/:id/toggle",   protect, isAdmin, toggleOffer);

module.exports = router;
