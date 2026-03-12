import { useState } from "react";
import { ShoppingCart, Star, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useProducts } from "../context/ProductContext";

const ProductCard = ({ product }) => {
  const [addedToCart, setAdded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { categories } = useProducts();

  const mrp = product.mrp || product.originalPrice || 0;
  const discount = mrp > product.price
    ? Math.round(((mrp - product.price) / mrp) * 100)
    : 0;

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (!product.inStock) return;
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
    addToCart(product);
  };

  // Resolve category name from populated object, slug, or _id lookup
  const getCategoryLabel = (cat) => {
    if (!cat) return "";
    if (typeof cat === "object") return cat.name || cat.label || "";
    const SLUG_MAP = { steel: "Stainless Steel", copper: "Copper", brass: "Pital · Brass", pooja: "Pooja Essentials", appliances: "Home Appliances" };
    if (SLUG_MAP[cat]) return SLUG_MAP[cat];
    // Raw _id — look up in context
    const found = categories?.find((c) => c._id === cat || c.id === cat);
    return found?.name || found?.label || "";
  };

  const categoryLabel = getCategoryLabel(product.category);
  const hasRealImage = product.image && product.image.startsWith("http") && !imgError;
  const hasRating = product.rating > 0;

  return (
    <div
      onClick={() => navigate(`/products/${product._id || product.id}`)}
      className="bg-white rounded-[1.5rem] border border-slate-100 overflow-hidden group cursor-pointer hover:border-slate-200 hover:shadow-2xl hover:shadow-slate-200/50 hover:-translate-y-1 transition-all duration-300 flex flex-col relative"
    >
      {/* ── Image Section ── */}
      <div className="relative bg-slate-50 overflow-hidden aspect-square w-full flex-shrink-0">
        {hasRealImage ? (
          <img
            src={product.image} alt={product.name}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-6xl group-hover:scale-110 transition-transform duration-700 ease-out bg-slate-100/50">
            {product.image && !product.image.startsWith("http")
              ? product.image
              : "📦"
            }
          </div>
        )}

        {/* ── Badges ── */}
        <div className="absolute top-3 left-3 flex flex-col gap-2 z-10 items-start">
          {(product.isNew || product.featured) && (
            <span className="bg-blue-600/95 backdrop-blur-sm text-white text-[10px] font-extrabold px-3 py-1.5 rounded-full tracking-wider uppercase shadow-sm">
              {product.isNew ? "New Arrival" : "Featured"}
            </span>
          )}
          {discount > 0 && (
            <span className="bg-rose-500/95 backdrop-blur-sm text-white text-[10px] font-extrabold px-3 py-1.5 rounded-full tracking-wider shadow-sm">
              -{discount}% OFF
            </span>
          )}
          {!product.inStock && (
            <span className="bg-slate-800/95 backdrop-blur-sm text-white text-[10px] font-extrabold px-3 py-1.5 rounded-full tracking-wider shadow-sm">
              Sold Out
            </span>
          )}
        </div>
      </div>

      {/* ── Content Section ── */}
      <div className="p-5 flex flex-col flex-1">
        {categoryLabel && (
          <p className="text-[10px] font-extrabold text-blue-600 uppercase tracking-widest mb-2">
            {categoryLabel}
          </p>
        )}
        
        <h3 className="text-base font-bold text-slate-900 leading-snug line-clamp-2 mb-3 group-hover:text-blue-600 transition-colors">
          {product.name}
        </h3>

        {/* ── Ratings ── */}
        {hasRating && (
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star 
                  key={s} 
                  className={`w-3.5 h-3.5 ${s <= Math.floor(product.rating) ? "fill-amber-400 text-amber-400" : "fill-slate-100 text-slate-200"}`} 
                />
              ))}
            </div>
            {product.reviews > 0 && (
              <span className="text-xs font-medium text-slate-400">({product.reviews})</span>
            )}
          </div>
        )}

        {/* ── Price Area ── */}
        <div className="flex flex-wrap items-end gap-2 mt-auto mb-5">
          <span className="text-xl font-black text-slate-900 tracking-tight">
            ₹{product.price.toLocaleString("en-IN")}
          </span>
          {mrp > product.price && (
            <span className="text-sm font-medium text-slate-400 line-through mb-0.5">
              ₹{mrp.toLocaleString("en-IN")}
            </span>
          )}
          {discount > 0 && (
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md ml-auto border border-emerald-100">
              Save ₹{(mrp - product.price).toLocaleString("en-IN")}
            </span>
          )}
        </div>

        {/* ── Action Button ── */}
        <button
          onClick={handleAddToCart}
          disabled={!product.inStock}
          className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all duration-300
            ${addedToCart 
              ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 scale-[0.98]"
              : product.inStock 
                ? "bg-slate-900 text-white hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-600/20 active:scale-95"
                : "bg-slate-100 text-slate-400 cursor-not-allowed"
            }`}
        >
          {addedToCart ? (
            <>
              <Check className="w-4 h-4" /> Added to Cart
            </>
          ) : product.inStock ? (
            <>
              <ShoppingCart className="w-4 h-4" /> Add to Cart
            </>
          ) : (
            "Out of Stock"
          )}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;