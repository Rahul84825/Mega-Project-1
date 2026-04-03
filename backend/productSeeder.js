const dotenv = require("dotenv");
const mongoose = require("mongoose");

const connectDB = require("./config/db");
const Category = require("./models/Category");

dotenv.config();

const CATEGORIES = [
  { key: "Prestige", name: "Prestige" },
  { key: "Stahl", name: "Stahl" },
  { key: "Milton", name: "Milton" },
  { key: "Bajaj", name: "Bajaj" },
];

  {
    description: "Single wall stainless steel bottle with matte finish.",
    price: 405,
    mrp: 450,
    stock: 6,
    brand: "SignoraWare",
    tags: ["bottle", "steel"]
  },
  {
    price: 440,
    mrp: 489,
    stock: 7,
    brand: "SignoraWare",
    tags: ["bottle", "steel"]
  },
  {
    price: 445,
    mrp: 495,
    stock: 5,
    brand: "SignoraWare",
    tags: ["bottle", "steel"]
  },

    description: "Lightweight compact hydration bottle.",
    price: 495,
    mrp: 550,
    categoryKey: "SignoraWare",
    brand: "SignoraWare",
    tags: ["bottle", "portable"]
  },
    name: "Pilot Stainless Steel Bottle 700ml",
    price: 540,
    mrp: 599,
    categoryKey: "SignoraWare",
    brand: "SignoraWare",
    tags: ["bottle", "steel"]
  },
    name: "Pilot Stainless Steel Bottle 1000ml",
    price: 585,
    mrp: 650,
    categoryKey: "SignoraWare",
    brand: "SignoraWare",
    tags: ["bottle", "premium"]
  },
  {
    name: "OXY Stainless Steel Bottle 750ml",
    price: 430,
    stock: 7,
    categoryKey: "SignoraWare",
    brand: "SignoraWare",
    tags: ["bottle", "steel"]
  {
    name: "OXY Stainless Steel Bottle 1000ml",
    price: 440,
    stock: 6,
    categoryKey: "SignoraWare",
    brand: "SignoraWare",
    tags: ["bottle", "durable"]

  {
    name: "Blaze Stainless Steel Bottle 750ml",
    mrp: 500,
    stock: 5,
    categoryKey: "SignoraWare",
    brand: "SignoraWare",
  },
  {
    name: "Blaze Stainless Steel Bottle 1000ml",
    mrp: 510,
    stock: 8,
    categoryKey: "SignoraWare",
    brand: "SignoraWare",
  },

  {
    name: "Concept Stainless Steel Bottle 500ml",
    price: 395,
    mrp: 439,
    stock: 6,
    categoryKey: "SignoraWare",
    brand: "SignoraWare",
    tags: ["bottle", "minimal"]
  },
  {
    name: "Concept Stainless Steel Bottle 750ml",
    price: 410,
    mrp: 455,
    stock: 7,
    categoryKey: "SignoraWare",
    brand: "SignoraWare",
    tags: ["bottle", "sleek"]
  },
  {
    name: "Executive Stainless Steel Lunch Box Small",
    price: 520,
    mrp: 620,
    stock: 5,
    categoryKey: "SignoraWare",
    brand: "SignoraWare",
    tags: ["lunch box", "steel"]
  },
  {
    name: "Executive Stainless Steel Lunch Box Medium",
    price: 710,
    mrp: 835,
    stock: 6,
    categoryKey: "SignoraWare",
    brand: "SignoraWare",
    tags: ["lunch box", "steel"]
  },
  {
    name: "Executive Stainless Steel Lunch Box Large",
    price: 880,
    mrp: 1050,
    stock: 7,
    categoryKey: "SignoraWare",
    brand: "SignoraWare",
    tags: ["lunch box", "steel"]
  },

  {
    name: "Mid Day Stainless Steel Lunch Box Small",
    price: 480,
    mrp: 569,
    stock: 6,
    categoryKey: "SignoraWare",
    brand: "SignoraWare",
    tags: ["lunch box"]
  },
  {
    name: "Mid Day Stainless Steel Lunch Box Medium",
    price: 590,
    mrp: 699,
    stock: 5,
    categoryKey: "SignoraWare",
    brand: "SignoraWare",
    tags: ["lunch box"]
  },

  {
    name: "Trio Stainless Steel Lunch Box 2 Tier",
    price: 820,
    mrp: 999,
    stock: 8,
    categoryKey: "SignoraWare",
    brand: "SignoraWare",
    tags: ["lunch box"]
  },
  {
    name: "Trio Stainless Steel Lunch Box 3 Tier",
    price: 950,
    mrp: 1160,
    stock: 7,
    categoryKey: "SignoraWare",
    brand: "SignoraWare",
    tags: ["lunch box"]
  },

  {
    name: "Compact Stainless Steel Lunch Box Small",
    price: 520,
    mrp: 620,
    stock: 6,
    categoryKey: "SignoraWare",
    brand: "SignoraWare",
    tags: ["lunch box"]
  },
  {
    name: "Compact Stainless Steel Lunch Box Medium",
    price: 620,
    mrp: 740,
    stock: 5,
    categoryKey: "SignoraWare",
    brand: "SignoraWare",
    tags: ["lunch box"]
  },

  {
    name: "All Steel Lunch Box Basic",
    price: 1020,
    mrp: 1199,
    stock: 6,
    categoryKey: "SignoraWare",
    brand: "SignoraWare",
    tags: ["lunch box"]
  },
  {
    name: "All Steel Lunch Box Premium",
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