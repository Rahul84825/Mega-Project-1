const dotenv = require("dotenv");
const mongoose = require("mongoose");

const connectDB = require("../config/db");
const Product = require("../models/Product");

dotenv.config();

async function removeProductDescriptions() {
  try {
    await connectDB();

    const result = await Product.updateMany(
      { description: { $exists: true } },
      { $unset: { description: "" } }
    );

    console.log(`Updated ${result.modifiedCount || 0} products`);
  } catch (error) {
    console.error(`[error] removeProductDescriptions failed: ${error.message}`);
    process.exitCode = 1;
  } finally {
    try {
      await mongoose.connection.close();
    } catch {
      // no-op
    }
  }
}

removeProductDescriptions();