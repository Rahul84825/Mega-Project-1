import { BadgeCheck, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useProducts } from "../context/ProductContext";

const BRAND_FALLBACK_BACKGROUNDS = [
  "linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)",
  "linear-gradient(135deg, #0b132b 0%, #155e75 100%)",
  "linear-gradient(135deg, #1e1b4b 0%, #1d4ed8 100%)",
  "linear-gradient(135deg, #111827 0%, #334155 100%)",
];

const BrandsSection = () => {
  const navigate = useNavigate();
  const { brands, loading } = useProducts();

  const featuredBrands = (brands || []).filter((brand) => brand.isFeatured ?? brand.showInNavbar);
  const displayBrands = featuredBrands.length ? featuredBrands : brands || [];

  return (
    <section className="section-shell bg-slate-50/60 border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10">
          <div>
            <p className="eyebrow mb-2">
              <BadgeCheck className="w-4 h-4" />
              Brands
            </p>
            <h2 className="section-title">Shop by Brand</h2>
            <p className="section-subtitle mt-2">Find your favorite trusted brands in one place with a clean visual catalog.</p>
          </div>

          <button
            onClick={() => navigate("/products")}
            className="btn-secondary inline-flex items-center gap-2 px-5 py-2.5 text-sm"
          >
            Browse Products
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-24 sm:h-28 rounded-2xl bg-slate-200/70 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {displayBrands.map((brand) => {
              const id = brand._id || brand.id;
              const label = brand.name || "Brand";
              const image = String(brand.image || "").trim();
              const fallbackBackground = BRAND_FALLBACK_BACKGROUNDS[id ? String(id).length % BRAND_FALLBACK_BACKGROUNDS.length : 0];

              return (
                <button
                  key={id}
                  onClick={() => navigate(`/products?search=${encodeURIComponent(label)}`)}
                  className="group relative h-32 sm:h-36 lg:h-40 rounded-2xl overflow-hidden border border-slate-200 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-100/40 hover:-translate-y-0.5 transition-all duration-300"
                >
                  <div
                    className="absolute inset-0 bg-center bg-cover transition-transform duration-500 ease-out group-hover:scale-110"
                    style={image ? { backgroundImage: `url(${image})` } : { background: fallbackBackground }}
                  />

                  {/* Dark overlay keeps text readable over bright images. */}
                  <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-slate-900/35 to-slate-900/15" />

                  <div className="relative z-10 h-full w-full flex flex-col justify-end p-4 sm:p-5 text-left">
                    <p className="text-white text-base sm:text-lg font-extrabold leading-tight truncate drop-shadow-sm">{label}</p>
                    <p className="text-blue-100/90 text-xs sm:text-sm font-semibold mt-1">Explore Collection</p>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default BrandsSection;
