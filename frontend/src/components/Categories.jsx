import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft, ChevronRight, ArrowRight, AlertCircle,
  Utensils, Droplets, Sparkles, FlameKindling, Plug,
  Package, ShoppingBag, Star, Zap, Home, LayoutGrid
} from "lucide-react";
import { useProducts } from "../context/ProductContext";

// ── Icon + style map keyed by category `id` field ──
const CATEGORY_STYLES = {
  steel:       { icon: Utensils,      pillColor: "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50",    iconColor: "text-slate-500",   activePill: "bg-slate-800 border-slate-800 text-white shadow-lg shadow-slate-200" },
  copper:      { icon: Droplets,      pillColor: "bg-white border-orange-200 hover:border-orange-300 hover:bg-orange-50", iconColor: "text-orange-500",  activePill: "bg-orange-600 border-orange-600 text-white shadow-lg shadow-orange-200" },
  brass:       { icon: Sparkles,      pillColor: "bg-white border-amber-200 hover:border-amber-300 hover:bg-amber-50",    iconColor: "text-amber-500",   activePill: "bg-amber-500 border-amber-500 text-white shadow-lg shadow-amber-200" },
  pital:       { icon: Sparkles,      pillColor: "bg-white border-amber-200 hover:border-amber-300 hover:bg-amber-50",    iconColor: "text-amber-500",   activePill: "bg-amber-500 border-amber-500 text-white shadow-lg shadow-amber-200" },
  pooja:       { icon: FlameKindling, pillColor: "bg-white border-rose-200 hover:border-rose-300 hover:bg-rose-50",       iconColor: "text-rose-500",    activePill: "bg-rose-600 border-rose-600 text-white shadow-lg shadow-rose-200" },
  appliances:  { icon: Plug,          pillColor: "bg-white border-blue-200 hover:border-blue-300 hover:bg-blue-50",       iconColor: "text-blue-500",    activePill: "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200" },
  cookware:    { icon: Utensils,      pillColor: "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50",    iconColor: "text-slate-500",   activePill: "bg-slate-800 border-slate-800 text-white shadow-lg shadow-slate-200" },
  "kitchen-tools": { icon: Utensils,  pillColor: "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50",    iconColor: "text-slate-500",   activePill: "bg-slate-800 border-slate-800 text-white shadow-lg shadow-slate-200" },
  storage:     { icon: Package,       pillColor: "bg-white border-amber-200 hover:border-amber-300 hover:bg-amber-50",    iconColor: "text-amber-500",   activePill: "bg-amber-500 border-amber-500 text-white shadow-lg shadow-amber-200" },
  dining:      { icon: Utensils,      pillColor: "bg-white border-orange-200 hover:border-orange-300 hover:bg-orange-50", iconColor: "text-orange-500",  activePill: "bg-orange-600 border-orange-600 text-white shadow-lg shadow-orange-200" },
  cleaning:    { icon: Droplets,      pillColor: "bg-white border-cyan-200 hover:border-cyan-300 hover:bg-cyan-50",       iconColor: "text-cyan-500",    activePill: "bg-cyan-600 border-cyan-600 text-white shadow-lg shadow-cyan-200" },
  home:        { icon: Home,          pillColor: "bg-white border-emerald-200 hover:border-emerald-300 hover:bg-emerald-50", iconColor: "text-emerald-500", activePill: "bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-200" },
  kitchen:     { icon: Utensils,      pillColor: "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50",    iconColor: "text-slate-500",   activePill: "bg-slate-800 border-slate-800 text-white shadow-lg shadow-slate-200" },
  default:     { icon: ShoppingBag,   pillColor: "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50",    iconColor: "text-slate-400",   activePill: "bg-slate-800 border-slate-800 text-white shadow-lg shadow-slate-200" },
};

const getStyle = (catId) => CATEGORY_STYLES[catId] || CATEGORY_STYLES.default;

const PillSkeleton = () => (
  <div className="flex-shrink-0 h-[46px] w-36 rounded-full bg-slate-200/60 animate-pulse border border-slate-100" />
);

const Categories = ({ activeCategory = "all", onCategoryChange }) => {
  const { categories, loading, error } = useProducts();
  const [selected, setSelected]           = useState(activeCategory);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const scrollRef = useRef(null);
  const navigate  = useNavigate();

  const updateScrollButtons = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 8);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateScrollButtons();
    el.addEventListener("scroll", updateScrollButtons, { passive: true });
    window.addEventListener("resize", updateScrollButtons);
    return () => {
      el.removeEventListener("scroll", updateScrollButtons);
      window.removeEventListener("resize", updateScrollButtons);
    };
  }, [categories]);

  const scroll = (dir) =>
    scrollRef.current?.scrollBy({ left: dir === "left" ? -300 : 300, behavior: "smooth" });

  const handleSelect = (catId) => {
    setSelected(catId);
    if (onCategoryChange) {
      onCategoryChange(catId);
    } else {
      navigate(catId === "all" ? "/products" : `/products?category=${catId}`);
    }
  };

  return (
    <section className="py-12 bg-slate-50 border-y border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Header ── */}
        <div className="flex items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-blue-100/50 border border-blue-200/50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase mb-3">
              <LayoutGrid className="w-3.5 h-3.5" />
              Browse
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Shop by Category</h2>
          </div>
          <button onClick={() => navigate("/products")}
            className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 hover:border-blue-300 hover:bg-blue-50 text-slate-700 hover:text-blue-700 text-sm font-bold rounded-full transition-all duration-300 group">
            View All
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* ── Error Banner ── */}
        {error && (
          <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 text-rose-700 text-sm font-medium px-4 py-3 rounded-xl mb-6 shadow-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-500" />
            Could not load categories from server. Please try refreshing the page.
          </div>
        )}

        {/* ── Scroll Container with Edge Controls ── */}
        <div className="relative group/scroll -mx-4 sm:mx-0">
          
          {/* Left Gradient & Arrow */}
          <div className={`absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-slate-50 to-transparent z-10 pointer-events-none transition-opacity duration-300 ${canScrollLeft ? "opacity-100" : "opacity-0"}`} />
          {canScrollLeft && (
            <button onClick={() => scroll("left")}
              className="absolute left-2 sm:-left-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 bg-white/90 backdrop-blur-sm border border-slate-200 rounded-full shadow-md flex items-center justify-center text-slate-600 hover:text-blue-600 hover:border-blue-300 hover:scale-110 opacity-0 group-hover/scroll:opacity-100 transition-all duration-300">
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          <div ref={scrollRef}
            className="flex items-center gap-3 sm:gap-4 overflow-x-auto scroll-smooth px-4 sm:px-1 py-2"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>

            {/* "All Products" pill */}
            {!loading && (
              <button onClick={() => handleSelect("all")}
                className={`flex-shrink-0 flex items-center gap-2.5 px-6 py-2.5 rounded-full border text-sm font-bold transition-all duration-300 whitespace-nowrap hover:-translate-y-0.5 ${
                  selected === "all"
                    ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/20"
                    : "bg-white border-slate-200 text-slate-700 hover:border-blue-300 hover:text-blue-700 hover:bg-blue-50 hover:shadow-sm"
                }`}>
                <span className="text-lg drop-shadow-sm">🏪</span>
                All Products
              </button>
            )}

            {/* Category pills */}
            {loading
              ? Array.from({ length: 6 }).map((_, i) => <PillSkeleton key={i} />)
              : categories?.map((cat) => {
                  const catId    = cat.id || cat._id;
                  const style    = getStyle(catId);
                  const Icon     = style.icon;
                  const isActive = selected === catId;
                  const displayName = cat.label || cat.name || catId;
                  const hasEmoji = cat.icon && /\p{Emoji}/u.test(cat.icon);

                  return (
                    <button
                      key={cat._id || cat.id}
                      onClick={() => handleSelect(catId)}
                      className={`flex-shrink-0 flex items-center gap-2.5 px-6 py-2.5 rounded-full border text-sm font-bold transition-all duration-300 whitespace-nowrap group hover:-translate-y-0.5 ${
                        isActive
                          ? `${style.activePill}`
                          : `${style.pillColor} text-slate-700 hover:shadow-sm`
                      }`}
                      aria-pressed={isActive}
                    >
                      {hasEmoji ? (
                        <span className="text-lg leading-none drop-shadow-sm group-hover:scale-110 transition-transform">{cat.icon}</span>
                      ) : (
                        <span className={`transition-all duration-300 group-hover:scale-110 ${isActive ? "text-white" : style.iconColor}`}>
                          <Icon className="w-4 h-4" />
                        </span>
                      )}
                      <span>{displayName}</span>
                    </button>
                  );
                })
            }
          </div>

          {/* Right Gradient & Arrow */}
          <div className={`absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none transition-opacity duration-300 ${canScrollRight ? "opacity-100" : "opacity-0"}`} />
          {canScrollRight && (
            <button onClick={() => scroll("right")}
              className="absolute right-2 sm:-right-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 bg-white/90 backdrop-blur-sm border border-slate-200 rounded-full shadow-md flex items-center justify-center text-slate-600 hover:text-blue-600 hover:border-blue-300 hover:scale-110 opacity-0 group-hover/scroll:opacity-100 transition-all duration-300">
              <ChevronRight className="w-6 h-6" />
            </button>
          )}
        </div>

        {/* ── Mobile View All ── */}
        <div className="flex sm:hidden justify-center mt-6">
          <button onClick={() => navigate("/products")}
            className="flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 group transition-colors px-6 py-3 bg-white border border-slate-200 rounded-full shadow-sm w-full justify-center">
            View All Products
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

      </div>
    </section>
  );
};

export default Categories;