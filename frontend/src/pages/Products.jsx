import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { ChevronRight, Home, Search as SearchIcon } from "lucide-react";
import ProductGrid, { DEFAULT_FILTERS } from "../components/ProductGrid";
import { useProducts } from "../context/ProductContext";

const Products = () => {
  const [searchParams]    = useSearchParams();
  const { categories }    = useProducts();

  const urlCategory = searchParams.get("category") || "all";
  const urlSort     = searchParams.get("sortBy")   || "default";
  const urlSearch   = searchParams.get("search")   || "";

  const [initialFilters, setInitialFilters] = useState({
    ...DEFAULT_FILTERS,
    category: urlCategory,
    sortBy:   urlSort,
    search:   urlSearch,
  });

  useEffect(() => {
    setInitialFilters({
      ...DEFAULT_FILTERS,
      category: searchParams.get("category") || "all",
      sortBy:   searchParams.get("sortBy")   || "default",
      search:   searchParams.get("search")   || "",
    });
  }, [searchParams]);

  // ✅ Resolve category display name dynamically from context
  const getCategoryName = (id) => {
    if (!id || id === "all") return null;
    const found = categories?.find((c) => (c._id || c.id) === id || c.slug === id);
    return found ? (found.label || found.name) : id;
  };

  const categoryName = getCategoryName(urlCategory);

  return (
    <main className="bg-slate-50 min-h-screen flex flex-col">
      {/* ── Page Header ── */}
      <div className="bg-white border-b border-slate-200/80 relative overflow-hidden pt-6 pb-8 sm:pt-10 sm:pb-12">
        {/* Subtle decorative background blob */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-50/50 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* ── Interactive Breadcrumbs ── */}
          <nav className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-400 mb-4 sm:mb-6 font-medium" aria-label="Breadcrumb">
            <Link to="/" className="flex items-center gap-1.5 hover:text-blue-600 transition-colors group">
              <Home className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
              <span>Home</span>
            </Link>
            
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            
            <Link to="/products" className={`hover:text-blue-600 transition-colors ${!categoryName && !urlSearch ? 'text-blue-600 font-bold pointer-events-none' : ''}`}>
              Products
            </Link>
            
            {categoryName && !urlSearch && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                <span className="text-slate-700 font-bold truncate max-w-[120px] sm:max-w-none">
                  {categoryName}
                </span>
              </>
            )}

            {urlSearch && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                <span className="text-slate-700 font-bold truncate max-w-[150px] sm:max-w-none">
                  Search Results
                </span>
              </>
            )}
          </nav>

          {/* ── Page Titles ── */}
          <div className="flex flex-col gap-2">
            {urlSearch ? (
              <>
                <div className="flex items-center gap-3 text-slate-900">
                  <SearchIcon className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
                    Results for "<span className="text-blue-600">{urlSearch}</span>"
                  </h1>
                </div>
                <p className="text-sm sm:text-base text-slate-500 max-w-2xl mt-1">
                  Showing matches for your search query. Try adjusting your filters if you can't find what you're looking for.
                </p>
              </>
            ) : (
              <>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight capitalize">
                  {urlCategory === "all" ? "All Products" : categoryName || "Products"}
                </h1>
                <p className="text-sm sm:text-base text-slate-500 max-w-2xl mt-2 leading-relaxed">
                  {urlCategory === "all" 
                    ? "Browse our complete collection of premium kitchenware, elegant pooja essentials, and reliable home appliances."
                    : `Explore our handpicked selection of premium ${categoryName?.toLowerCase() || 'products'} for your home.`}
                </p>
              </>
            )}
          </div>

        </div>
      </div>

      {/* ── Product Grid Injection ── */}
      <div className="flex-1 w-full">
        <ProductGrid initialFilters={initialFilters} />
      </div>
    </main>
  );
};

export default Products;