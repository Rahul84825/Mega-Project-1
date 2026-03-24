import { memo, useState } from "react";
import { Eye, Heart, ShoppingCart, Star, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useProducts } from "../context/ProductContext";
import { getCategoryLabel } from "../utils/category";

const ProductCard = ({ product, onQuickView, compact = false }) => {
  const [addedToCart, setAdded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { categories, wishlist, toggleWishlist } = useProducts();

  const productId = String(product._id || product.id);
  const isWishlisted = wishlist.includes(productId);

  const mrp = product.mrp || product.originalPrice || 0;
  const primaryImage = (Array.isArray(product.images) ? product.images[0] : "") || product.image || "";
  const discount = mrp > product.price
    ? Math.round(((mrp - product.price) / mrp) * 100)
    : 0;

  const badges = [];
  if (product.has_variants && product.variants?.length > 0) badges.push({ label: `${product.variants.length} Sizes`, tone: "blue" });
  if (discount > 0) badges.push({ label: `${discount}% OFF`, tone: "rose" });
  if (!product.inStock) badges.push({ label: "Sold Out", tone: "slate" });

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (!product.inStock) return;
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
    addToCart(product);
  };

  const categoryLabel = getCategoryLabel(product.category, categories);
  const hasRealImage = primaryImage && primaryImage.startsWith("http") && !imgError;
  const hasRating = product.rating > 0;
  const cardPadding = compact ? "p-4" : "p-6";

  const badgeClass = {
    blue: "bg-blue-100 text-blue-700",
    rose: "bg-red-100 text-red-600",
    slate: "bg-slate-200 text-slate-600",
  };

  return (
    <div
      onClick={() => navigate(`/products/${productId}`)}
      className="group cursor-pointer flex flex-col relative overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200/70 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-200/70"
    >
      <div className="relative aspect-square w-full shrink-0 overflow-hidden bg-gray-50">
        {hasRealImage ? (
          <img
            src={primaryImage} alt={product.name}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100/80 text-6xl transition-transform duration-500 ease-out group-hover:scale-105">
            {primaryImage && !primaryImage.startsWith("http")
              ? primaryImage
              : "📦"
            }
          </div>
        )}

        <div className="absolute left-3 top-3 z-10 flex items-start gap-1.5">
          {badges.slice(0, 2).map((badge) => (
            <span
              key={badge.label}
              className={`rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-wide ${badgeClass[badge.tone]}`}
            >
              {badge.label}
            </span>
          ))}
        </div>

        <div className="absolute right-3 top-3 z-10 flex items-center gap-1.5">
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(productId);
            }}
            aria-label="Toggle wishlist"
            className={`h-8 w-8 rounded-full border bg-white/95 transition-all ${isWishlisted ? "border-red-200 text-red-500" : "border-slate-200 text-slate-400 hover:text-red-500"}`}
          >
            <Heart className={`mx-auto h-3.5 w-3.5 ${isWishlisted ? "fill-red-500" : ""}`} />
          </button>
          {onQuickView && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onQuickView(product);
              }}
              aria-label="Quick view"
              className="h-8 w-8 rounded-full border border-slate-200 bg-white/95 text-slate-400 hover:text-slate-600"
            >
              <Eye className="mx-auto h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      <div className={`${cardPadding} flex flex-col flex-1`}>
        {categoryLabel && <p className="mb-2 text-[11px] font-medium text-slate-400">{categoryLabel}</p>}
        
        <h3 className="mb-2 line-clamp-2 text-[15px] font-medium leading-snug text-slate-800 transition-colors group-hover:text-slate-900 sm:text-base">
          {product.name}
        </h3>

        {product.brand && (
          <p className="mb-3 text-xs font-medium text-slate-400">{product.brand}</p>
        )}

        {hasRating && (
          <div className={`flex items-center gap-1.5 ${compact ? "mb-3" : "mb-4"}`}>
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star 
                  key={s} 
                  className={`h-3 w-3 ${s <= Math.floor(product.rating) ? "fill-amber-400 text-amber-400" : "fill-slate-100 text-slate-200"}`} 
                />
              ))}
            </div>
            {product.reviews > 0 && (
              <span className="text-[11px] font-medium text-slate-400">({product.reviews})</span>
            )}
          </div>
        )}

        <div className={`mt-auto flex items-end gap-2 ${compact ? "mb-4" : "mb-5"}`}>
          <span className="text-xl font-bold tracking-tight text-slate-900 sm:text-[1.3rem]">
            ₹{product.price.toLocaleString("en-IN")}
          </span>
          {mrp > product.price && (
            <span className="mb-0.5 text-sm font-medium text-slate-400 line-through">
              ₹{mrp.toLocaleString("en-IN")}
            </span>
          )}
          {discount > 0 && (
            <span className="ml-auto rounded-md bg-emerald-50 px-2 py-1 text-[10px] font-semibold text-emerald-700">
              Save ₹{Math.round(mrp - product.price).toLocaleString("en-IN")}
            </span>
          )}
        </div>

        <button
          onClick={handleAddToCart}
          disabled={!product.inStock}
          className={`w-full flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition-all duration-300
            ${addedToCart 
              ? "bg-emerald-500 text-white shadow-sm"
              : product.inStock 
                ? "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md"
                : "cursor-not-allowed bg-slate-100 text-slate-400"
            }`}
        >
          {addedToCart ? (
            <>
              <Check className="h-4 w-4" /> Added to Cart
            </>
          ) : product.inStock ? (
            <>
              <ShoppingCart className="h-4 w-4" /> Add to Cart
            </>
          ) : (
            "Out of Stock"
          )}
        </button>
      </div>
    </div>
  );
};

export default memo(ProductCard);