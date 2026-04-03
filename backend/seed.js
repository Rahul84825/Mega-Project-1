const mongoose = require("mongoose");
const bcrypt   = require("bcryptjs");
const dotenv   = require("dotenv");
dotenv.config();

const User     = require("./models/User");
const Product  = require("./models/Product");
const Category = require("./models/Category");
const Offer    = require("./models/Offer");

const CATEGORIES = [
  { name: "Stainless Steel",  image: "🥘", is_active: true, legacyKey: "steel" },
  { name: "Copper Utensils",  image: "🏺", is_active: true, legacyKey: "copper" },
  { name: "Pital (Brass)",    image: "✨", is_active: true, legacyKey: "brass" },
  { name: "Pooja Essentials", image: "🪔", is_active: true, legacyKey: "pooja" },
  { name: "Home Appliances",  image: "🔌", is_active: true, legacyKey: "appliances" },
];

const PRODUCTS = [
  { name: "Stainless Steel Kadai",       category: "steel",      original_price: 1199, discount_percentage: 25, inStock: true,  image: "🥘" },
  { name: "Copper Water Jug 1L",         category: "copper",     original_price: 850,  discount_percentage: 24, inStock: true,  image: "🏺" },
  { name: "Brass Puja Thali Set",        category: "pooja",      original_price: 1699, discount_percentage: 24, inStock: true,  image: "🪔" },
  { name: "Prestige Mixer Grinder 750W", category: "appliances", original_price: 4499, discount_percentage: 22, inStock: true,  image: "🔌" },
  { name: "Brass Lota Kalash 500ml",     category: "brass",      original_price: 550,  discount_percentage: 24, inStock: false, image: "✨" },
  { name: "SS Tiffin Box 3 Layer",       category: "steel",      original_price: 699,  discount_percentage: 29, inStock: true,  image: "🥘" },
  { name: "Copper Bottle 1.5L",          category: "copper",     original_price: 999,  discount_percentage: 20, inStock: true,  image: "🏺" },
  { name: "Gas Stove 3 Burner ISI",      category: "appliances", original_price: 3299, discount_percentage: 15, inStock: true,  image: "🔌" },
  { name: "Brass Diya Set of 6",         category: "pooja",      original_price: 499,  discount_percentage: 30, inStock: true,  image: "🪔" },
  { name: "SS Pressure Cooker 5L",       category: "steel",      original_price: 1599, discount_percentage: 25, inStock: false, image: "🥘" },
  { name: "Pital Kadai 2L",             category: "brass",      original_price: 1200, discount_percentage: 21, inStock: true,  image: "✨" },
  { name: "Electric Pressure Cooker 6L", category: "appliances", original_price: 5499, discount_percentage: 22, inStock: true,  image: "🔌" },
];

const OFFERS = [
  { title: "Stainless Steel Fest",  subtitle: "Up to 40% off on all SS cookware",       badge: "Limited Time",   discount: "40% OFF", category: "steel",      active: true, bg: "from-slate-800 to-slate-600",   accent: "bg-slate-500",  icon: "🥘" },
  { title: "Copper Wellness Sale",  subtitle: "Ayurvedic copper vessels at best price", badge: "Health Special", discount: "25% OFF", category: "copper",     active: true, bg: "from-orange-700 to-orange-500", accent: "bg-orange-400", icon: "🏺" },
  { title: "Pooja Essentials",      subtitle: "Brass & copper spiritual items",         badge: "Festive Deal",   discount: "30% OFF", category: "pooja",      active: true, bg: "from-red-800 to-red-600",       accent: "bg-red-500",    icon: "🪔" },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected");

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Product.deleteMany({}),
      Category.deleteMany({}),
      Offer.deleteMany({}),
    ]);
    console.log("🗑️  Cleared existing data");

    // Create admin user
    await User.create({
      name:     "Admin",
      email:    "admin@mahalaxmisteels.com",
      password: "Admin@123",
      role:     "admin",
      phone:    "+91 98765 43210",
    });
    console.log("👤 Admin user created → admin@mahalaxmisteels.com / Admin@123");

    // Seed categories, products, offers
    const insertedCategories = await Category.insertMany(
      CATEGORIES.map((c) => ({ name: c.name, image: c.image, is_active: c.is_active }))
    );
    console.log(`📂 ${CATEGORIES.length} categories seeded`);

    const categoryIdMap = insertedCategories.reduce((acc, cat) => {
      const key = CATEGORIES.find((item) => item.name === cat.name)?.legacyKey;
      if (key) acc[key] = cat._id;
      return acc;
    }, {});

    const seededProducts = PRODUCTS.map((p) => {
      const { category, ...rest } = p;
      const resolvedCategoryId = categoryIdMap[category];
      if (!resolvedCategoryId) {
        throw new Error(`Missing category mapping for product "${p.name}" (category: ${category})`);
      }

      return {
        ...rest,
        category_id: resolvedCategoryId,
        rating: +(Math.random() * 2 + 3).toFixed(1),
        reviews: Math.floor(Math.random() * 200 + 10),
      };
    });

    await Product.insertMany(seededProducts);
    console.log(`📦 ${PRODUCTS.length} products seeded`);

    await Offer.insertMany(OFFERS);
    console.log(`🏷️  ${OFFERS.length} offers seeded`);

    console.log("\n✅ Database seeded successfully!");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("Admin login → mahalxmisteels08@gmail.com");
    console.log("Password   → Rahulbhai@123");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seed error:", error.message);
    process.exit(1);
  }
};

seed();