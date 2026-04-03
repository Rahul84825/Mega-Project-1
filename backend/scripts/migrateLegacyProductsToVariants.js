const dotenv = require("dotenv");

dotenv.config();

const connectDB = require("../config/db");
const Product = require("../models/Product");

const toFiniteNumber = (value, fallback = NaN) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
};

const toNonNegativeInt = (value, fallback = 0) => {
  const n = toFiniteNumber(value, fallback);
  return Math.max(0, Math.floor(n));
};

const toMoney = (value, fallback = NaN) => {
  const n = toFiniteNumber(value, fallback);
  if (!Number.isFinite(n)) return fallback;
  return Math.round((n + Number.EPSILON) * 100) / 100;
};

const createVariantId = (index = 0) =>
  `legacy_${Date.now().toString(36)}_${index.toString(36)}_${Math.random().toString(36).slice(2, 7)}`;

async function migrateLegacyProductsToVariants() {
  const dryRun = String(process.env.DRY_RUN || "false").toLowerCase() === "true";
  const cleanLegacyFields = String(process.env.CLEAN_LEGACY_FIELDS || "false").toLowerCase() === "true";

  const rawProducts = await Product.collection.find({}).toArray();

  let migrated = 0;
  let alreadyVariantBased = 0;
  let correctedMissingPrice = 0;
  let failed = 0;

  for (const rawProduct of rawProducts) {
    const hasVariants = Array.isArray(rawProduct.variants) && rawProduct.variants.length > 0;
    if (hasVariants) {
      alreadyVariantBased += 1;
      continue;
    }

    const legacyPrice = toMoney(
      rawProduct.price ?? rawProduct.originalPrice ?? rawProduct.mrp,
      NaN
    );

    // Guarantee every migrated product gets a defined usable price.
    const normalizedPrice = Number.isFinite(legacyPrice) && legacyPrice > 0 ? legacyPrice : 1;
    if (!(Number.isFinite(legacyPrice) && legacyPrice > 0)) {
      correctedMissingPrice += 1;
    }

    const normalizedStock = toNonNegativeInt(rawProduct.stock, 0);

    const variant = {
      id: createVariantId(migrated),
      label: "Default",
      originalPrice: normalizedPrice,
      discountPercent: 0,
      stock: normalizedStock,
      // Backward compatible fields
      price: normalizedPrice,
      mrp: normalizedPrice,
    };

    const updateDoc = {
      $set: {
        variants: [variant],
        has_variants: true,
        stock: normalizedStock,
        inStock: normalizedStock > 0,
      },
    };

    if (cleanLegacyFields) {
      updateDoc.$unset = {
        price: "",
        originalPrice: "",
        mrp: "",
      };
    }

    try {
      if (!dryRun) {
        await Product.collection.updateOne({ _id: rawProduct._id }, updateDoc);
      }
      migrated += 1;
    } catch (err) {
      failed += 1;
      console.error("Failed to migrate product", {
        productId: String(rawProduct._id),
        name: rawProduct.name,
        message: err.message,
      });
    }
  }

  console.log("Legacy product -> variants migration summary");
  console.log(`Dry run: ${dryRun}`);
  console.log(`Clean legacy fields: ${cleanLegacyFields}`);
  console.log(`Migrated: ${migrated}`);
  console.log(`Already variant-based: ${alreadyVariantBased}`);
  console.log(`Corrected missing/invalid legacy price: ${correctedMissingPrice}`);
  console.log(`Failed: ${failed}`);
}

async function run() {
  try {
    await connectDB();
    await migrateLegacyProductsToVariants();
    console.log("Variant migration completed.");
    process.exit(0);
  } catch (error) {
    console.error("Variant migration failed:", error.message);
    process.exit(1);
  }
}

run();
