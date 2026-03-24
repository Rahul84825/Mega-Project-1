const dotenv = require("dotenv");
const mongoose = require("mongoose");

const connectDB = require("./config/db");
const Category = require("./models/Category");
const Product = require("./models/Product");

dotenv.config();

const CATEGORIES = [
  { key: "Hawkins", name: "Hawkins" },
  { key: "Prestige", name: "Prestige" },
  { key: "Stahl", name: "Stahl" },
  { key: "Milton", name: "Milton" },
  { key: "Bajaj", name: "Bajaj" },
  { key: "SignoraWare", name: "SignoraWare" }
];

const PRODUCTS = [
  {
    name: "Cola Stainless Steel Bottle 500ml",
    description: "Single wall stainless steel bottle with matte finish.",
    price: 405,
    mrp: 450,
    stock: 6,
    categoryKey: "SignoraWare",
    brand: "SignoraWare",
    tags: ["bottle", "steel"]
  },
  {
    name: "Cola Stainless Steel Bottle 750ml",
    description: "Medium capacity stainless steel bottle.",
    price: 440,
    mrp: 489,
    stock: 7,
    categoryKey: "SignoraWare",
    brand: "SignoraWare",
    tags: ["bottle", "steel"]
  },
  {
    name: "Cola Stainless Steel Bottle 1000ml",
    description: "Premium matte finish stainless steel bottle.",
    price: 445,
    mrp: 495,
    stock: 5,
    categoryKey: "SignoraWare",
    brand: "SignoraWare",
    tags: ["bottle", "steel"]
  },

  {
    name: "Pilot Stainless Steel Bottle 500ml",
    description: "Lightweight compact hydration bottle.",
    price: 495,
    mrp: 550,
    stock: 8,
    categoryKey: "SignoraWare",
    brand: "SignoraWare",
    tags: ["bottle", "portable"]
  },
  {
    name: "Pilot Stainless Steel Bottle 700ml",
    description: "Portable stainless steel bottle for office use.",
    price: 540,
    mrp: 599,
    stock: 6,
    categoryKey: "SignoraWare",
    brand: "SignoraWare",
    tags: ["bottle", "steel"]
  },
  {
    name: "Pilot Stainless Steel Bottle 1000ml",
    description: "Large capacity sleek steel bottle.",
    price: 585,
    mrp: 650,
    stock: 9,
    categoryKey: "SignoraWare",
    brand: "SignoraWare",
    tags: ["bottle", "premium"]
  },

  {
    name: "OXY Stainless Steel Bottle 750ml",
    description: "Mirror finish stainless steel bottle.",
    price: 430,
    mrp: 479,
    stock: 7,
    categoryKey: "SignoraWare",
    brand: "SignoraWare",
    tags: ["bottle", "steel"]
  },
  {
    name: "OXY Stainless Steel Bottle 1000ml",
    description: "Durable everyday steel bottle.",
    price: 440,
    mrp: 489,
    stock: 6,
    categoryKey: "SignoraWare",
    brand: "SignoraWare",
    tags: ["bottle", "durable"]
  },

  {
    name: "Blaze Stainless Steel Bottle 750ml",
    description: "Premium finish stylish steel bottle.",
    price: 450,
    mrp: 500,
    stock: 5,
    categoryKey: "SignoraWare",
    brand: "SignoraWare",
    tags: ["bottle", "premium"]
  },
  {
    name: "Blaze Stainless Steel Bottle 1000ml",
    description: "High quality stainless steel bottle.",
    price: 459,
    mrp: 510,
    stock: 8,
    categoryKey: "SignoraWare",
    brand: "SignoraWare",
    tags: ["bottle", "steel"]
  },

  {
    name: "Concept Stainless Steel Bottle 500ml",
    description: "Minimal design compact bottle.",
    price: 395,
    mrp: 439,
    stock: 6,
    categoryKey: "SignoraWare",
    brand: "SignoraWare",
    tags: ["bottle", "minimal"]
  },
  {
    name: "Concept Stainless Steel Bottle 750ml",
    description: "Slim and elegant steel bottle.",
    price: 410,
    mrp: 455,
    stock: 7,
    categoryKey: "SignoraWare",
    brand: "SignoraWare",
    tags: ["bottle", "sleek"]
  },
  {
    name: "Executive Stainless Steel Lunch Box Small",
    description: "Compact multi-container lunch box.",
    price: 520,
    mrp: 620,
    stock: 5,
    categoryKey: "SignoraWare",
    brand: "SignoraWare",
    tags: ["lunch box", "steel"]
  },
  {
    name: "Executive Stainless Steel Lunch Box Medium",
    description: "Multi-tier lunch box with carry bag.",
    price: 710,
    mrp: 835,
    stock: 6,
    categoryKey: "SignoraWare",
    brand: "SignoraWare",
    tags: ["lunch box", "steel"]
  },
  {
    name: "Executive Stainless Steel Lunch Box Large",
    description: "Large capacity steel lunch carrier.",
    price: 880,
    mrp: 1050,
    stock: 7,
    categoryKey: "SignoraWare",
    brand: "SignoraWare",
    tags: ["lunch box", "steel"]
  },

  {
    name: "Mid Day Stainless Steel Lunch Box Small",
    description: "Daily use compact lunch box.",
    price: 480,
    mrp: 569,
    stock: 6,
    categoryKey: "SignoraWare",
    brand: "SignoraWare",
    tags: ["lunch box"]
  },
  {
    name: "Mid Day Stainless Steel Lunch Box Medium",
    description: "Balanced meal lunch solution.",
    price: 590,
    mrp: 699,
    stock: 5,
    categoryKey: "SignoraWare",
    brand: "SignoraWare",
    tags: ["lunch box"]
  },

  {
    name: "Trio Stainless Steel Lunch Box 2 Tier",
    description: "Two compartment lunch box.",
    price: 820,
    mrp: 999,
    stock: 8,
    categoryKey: "SignoraWare",
    brand: "SignoraWare",
    tags: ["lunch box"]
  },
  {
    name: "Trio Stainless Steel Lunch Box 3 Tier",
    description: "Three tier stainless steel lunch box.",
    price: 950,
    mrp: 1160,
    stock: 7,
    categoryKey: "SignoraWare",
    brand: "SignoraWare",
    tags: ["lunch box"]
  },

  {
    name: "Compact Stainless Steel Lunch Box Small",
    description: "Leak-proof compact lunch box.",
    price: 520,
    mrp: 620,
    stock: 6,
    categoryKey: "SignoraWare",
    brand: "SignoraWare",
    tags: ["lunch box"]
  },
  {
    name: "Compact Stainless Steel Lunch Box Medium",
    description: "Portable travel-friendly lunch box.",
    price: 620,
    mrp: 740,
    stock: 5,
    categoryKey: "SignoraWare",
    brand: "SignoraWare",
    tags: ["lunch box"]
  },

  {
    name: "All Steel Lunch Box Basic",
    description: "100% stainless steel lunch container.",
    price: 1020,
    mrp: 1199,
    stock: 6,
    categoryKey: "SignoraWare",
    brand: "SignoraWare",
    tags: ["lunch box"]
  },
  {
    name: "All Steel Lunch Box Premium",
    description: "Premium airtight steel lunch box.",
    price: 1150,
    mrp: 1399,
    stock: 5,
    categoryKey: "SignoraWare",
    brand: "SignoraWare",
    tags: ["lunch box"]
  }
];

async function ensureCategories() {
  const names = CATEGORIES.map((category) => category.name);
  const existing = await Category.find({ name: { $in: names } });
  const byName = new Map(existing.map((category) => [category.name, category]));

  for (const category of CATEGORIES) {
    if (!byName.has(category.name)) {
      const created = await Category.create({
        name: category.name,
        is_active: true,
      });
      byName.set(category.name, created);
      console.log(`[category] Created: ${category.name}`);
    } else {
      console.log(`[category] Reused: ${category.name}`);
    }
  }

  return CATEGORIES.reduce((acc, category) => {
    acc[category.key] = byName.get(category.name)._id;
    return acc;
  }, {});
}

function buildProductPayloads(categoryIdMap) {
  const uniqueByName = new Map();

  for (const product of PRODUCTS) {
    if (!uniqueByName.has(product.name)) {
      uniqueByName.set(product.name, product);
    }
  }

  return Array.from(uniqueByName.values()).map((product) => {
    const categoryId = categoryIdMap[product.categoryKey];
    if (!categoryId) {
      throw new Error(`Missing category mapping for ${product.name}`);
    }

    return {
      name: product.name,
      description: product.description,
      price: product.price,
      mrp: product.mrp,
      stock: product.stock,
      category_id: categoryId,
      brand: product.brand,
      tags: product.tags,
    };
  });
}

async function insertProducts(productPayloads) {
  const operations = productPayloads.map((payload) => ({
    updateOne: {
      filter: { name: payload.name },
      update: { $setOnInsert: payload },
      upsert: true,
    },
  }));

  const result = await Product.bulkWrite(operations, { ordered: false });
  const insertedCount = result.upsertedCount || 0;
  const skippedCount = productPayloads.length - insertedCount;

  console.log(`[product] New products inserted: ${insertedCount}`);
  console.log(`[product] Existing products skipped: ${skippedCount}`);

  return { insertedCount, skippedCount };
}

async function runProductSeeder() {
  try {
    console.log("[start] Connecting to database...");
    await connectDB();

    console.log("[start] Ensuring categories...");
    const categoryIdMap = await ensureCategories();

    console.log("[start] Building products...");
    const payloads = buildProductPayloads(categoryIdMap);

    console.log("[start] Seeding products...");
    await insertProducts(payloads);

    console.log("[done] Product seeding completed successfully");
  } catch (error) {
    console.error(`[error] productSeeder failed: ${error.message}`);
    process.exitCode = 1;
  } finally {
    try {
      await mongoose.connection.close();
    } catch {
      // no-op
    }
  }
}

runProductSeeder();