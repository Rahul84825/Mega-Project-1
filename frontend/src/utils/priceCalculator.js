/**
 * Variant-based Price Calculation Utility (Frontend)
 * Single source of truth for all pricing logic
 */

const toFiniteNumber = (value, fallback = 0) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
};

const roundMoney = (value) => Math.round((toFiniteNumber(value, 0) + Number.EPSILON) * 100) / 100;
const inrFormatter = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });

/**
 * Calculate final price based on original price and discount percentage
 * @param {number} originalPrice - The original/list price
 * @param {number} discountPercent - Discount percentage (0-100)
 * @returns {number} Final price after discount
 */
export const calculateFinalPrice = (originalPrice, discountPercent = 0) => {
  const original = Math.max(0, toFiniteNumber(originalPrice, 0));
  const discount = Math.max(0, Math.min(toFiniteNumber(discountPercent, 0), 100));
  const finalPrice = original - (original * discount / 100);
  return roundMoney(Math.max(0, finalPrice));
};

/**
 * Calculate savings amount and percentage
 * @param {number} originalPrice - The original/list price
 * @param {number} finalPrice - The final price after discount
 * @returns {object} { savingsAmount, savingsPercent }
 */
export const calculateSavings = (originalPrice, finalPrice) => {
  const original = Math.max(0, toFiniteNumber(originalPrice, 0));
  const final = Math.max(0, toFiniteNumber(finalPrice, 0));
  
  if (original <= final) {
    return { savingsAmount: 0, savingsPercent: 0 };
  }
  
  const savingsAmount = roundMoney(original - final);
  const savingsPercent = Math.round((savingsAmount / original) * 100);
  
  return { savingsAmount, savingsPercent };
};

/**
 * Format price for Indian Rupees
 * @param {number} price - Price to format
 * @returns {string} Formatted price string
 */
export const formatPrice = (price) => {
  const num = Math.max(0, toFiniteNumber(price, 0));
  return `₹${inrFormatter.format(Math.round(num))}`;
};

/**
 * Normalize variant pricing data for display
 * @param {object} variant - The variant object
 * @returns {object} Normalized variant with all price fields
 */
export const normalizeVariantPrice = (variant) => {
  if (!variant) return null;
  
  const originalPrice = Math.max(0, toFiniteNumber(variant.originalPrice, 0));
  const discountPercent = Math.max(0, Math.min(toFiniteNumber(variant.discountPercent, 0), 100));
  const finalPrice = calculateFinalPrice(originalPrice, discountPercent);
  const { savingsAmount, savingsPercent } = calculateSavings(originalPrice, finalPrice);
  
  return {
    ...variant,
    originalPrice,
    discountPercent,
    finalPrice,
    savingsAmount,
    savingsPercent: savingsPercent || discountPercent,
  };
};

const firstFinitePositive = (...values) => {
  for (const value of values) {
    const n = toFiniteNumber(value, NaN);
    if (Number.isFinite(n) && n > 0) return n;
  }
  return 0;
};

/**
 * Normalize product pricing across legacy and variant-based product records.
 * Returns a safe shape for card/list rendering.
 */
export const resolveProductPricing = (product = {}) => {
  const variant = Array.isArray(product.variants) && product.variants.length > 0
    ? product.variants[0] || {}
    : {};

  let originalPrice = firstFinitePositive(
    variant.originalPrice,
    variant.mrp,
    product.originalPrice,
    product.mrp
  );

  let finalPrice = firstFinitePositive(
    variant.finalPrice,
    product.finalPrice,
    variant.price,
    product.price
  );

  let discountPercent = Math.max(0, Math.min(toFiniteNumber(
    variant.discountPercent ?? product.discountPercent ?? product.discount,
    0
  ), 100));

  let discountAmount = Math.max(0, toFiniteNumber(
    variant.discountAmount ?? product.discountAmount,
    0
  ));

  if (originalPrice > 0 && finalPrice > 0) {
    if (originalPrice > finalPrice) {
      // trusted explicit old/new pair
    } else if (discountPercent > 0) {
      finalPrice = calculateFinalPrice(originalPrice, discountPercent);
    } else if (discountAmount > 0 && originalPrice > discountAmount) {
      finalPrice = roundMoney(originalPrice - discountAmount);
    } else {
      originalPrice = finalPrice;
    }
  } else if (originalPrice > 0 && finalPrice <= 0) {
    if (discountPercent > 0) {
      finalPrice = calculateFinalPrice(originalPrice, discountPercent);
    } else if (discountAmount > 0) {
      finalPrice = roundMoney(Math.max(0, originalPrice - discountAmount));
    } else {
      finalPrice = originalPrice;
    }
  } else if (finalPrice > 0 && originalPrice <= 0) {
    if (discountPercent > 0 && discountPercent < 100) {
      originalPrice = roundMoney(finalPrice / (1 - (discountPercent / 100)));
    } else if (discountAmount > 0) {
      originalPrice = roundMoney(finalPrice + discountAmount);
    } else {
      originalPrice = finalPrice;
    }
  }

  originalPrice = roundMoney(Math.max(0, originalPrice));
  finalPrice = roundMoney(Math.max(0, finalPrice));

  const { savingsAmount, savingsPercent } = calculateSavings(originalPrice, finalPrice);
  if (savingsAmount <= 0) {
    discountAmount = 0;
    discountPercent = 0;
    originalPrice = finalPrice;
  } else {
    discountAmount = savingsAmount;
    discountPercent = discountPercent > 0 ? Math.round(discountPercent) : Math.round(savingsPercent);
  }

  return {
    originalPrice,
    finalPrice,
    discountPercent,
    savingsAmount: discountAmount,
    hasDiscount: discountAmount > 0,
  };
};

/**
 * Calculate cart total based on cart items
 * @param {array} cartItems - Array of cart items with finalPrice and quantity
 * @returns {object} { subtotal, total, itemCount, formattedTotal }
 */
export const calculateCartTotal = (cartItems = []) => {
  if (!Array.isArray(cartItems)) {
    return { subtotal: 0, total: 0, itemCount: 0, formattedTotal: formatPrice(0) };
  }
  
  let subtotal = 0;
  let itemCount = 0;
  
  cartItems.forEach((item) => {
    const finalPrice = Math.max(0, toFiniteNumber(item.finalPrice ?? item.price, 0));
    const quantity = Math.max(1, Math.floor(toFiniteNumber(item.quantity, 1)));
    subtotal += finalPrice * quantity;
    itemCount += quantity;
  });
  
  const total = roundMoney(subtotal);
  
  return {
    subtotal: total,
    total,
    itemCount,
    formattedTotal: formatPrice(total),
  };
};
