import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle, Pencil, Trash2, Search, ToggleLeft, ToggleRight, Package, Star, Sparkles, BadgeCheck } from "lucide-react";
import { useProducts } from "../context/ProductContext";

const AdminProducts = () => {
  const { products, categories, deleteProduct, toggleStock, toggleFeatured, toggleBestseller, toggleIsNew } = useProducts();
  const navigate = useNavigate();
  const [search, setSearch]               = useState("");
  const [filterCat, setFilterCat]         = useState("all");
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Helper: resolve category name from id (handles populated object OR raw _id string)
  const getCategoryName = (cat) => {
    if (!cat) return "—";
    // If already populated as object
    if (typeof cat === "object" && cat.name) return cat.name;
    // Look up by _id in context categories list
    const found = categories?.find((c) => (c._id || c.id) === cat);
    return found ? (found.name || found.label) : cat;
  };

  const filtered = products
    .filter((p) => {
      if (filterCat === "all") return true;
      // category can be a populated object or a raw _id string
      const catId = typeof p.category === "object" ? (p.category?._id || p.category?.id) : p.category;
      return catId === filterCat;
    })
    .filter((p) => p.name?.toLowerCase().includes(search.toLowerCase()));

  const handleDelete = (id) => {
    deleteProduct(id);
    setDeleteConfirm(null);
  };

  // Safely get the product id (MongoDB uses _id)
  const pid = (p) => p._id || p.id;

  return (
    <div className="animate-in fade-in duration-500">
      
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Products</h2>
          <p className="text-sm font-medium text-slate-500 mt-1">Manage your inventory and pricing ({products.length} total)</p>
        </div>
        <button
          onClick={() => navigate("/admin/products/add")}
          className="flex items-center justify-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-blue-600 transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5"
        >
          <PlusCircle className="w-4 h-4" />
          Add Product
        </button>
      </div>

      {/* ── Control Bar ── */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px] group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
          <input
            type="text"
            placeholder="Search products by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 text-sm font-medium bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-blue-300 focus:ring-4 focus:ring-blue-50 transition-all shadow-sm placeholder:text-slate-400"
          />
        </div>

        {/* Category Filter */}
        <select
          value={filterCat}
          onChange={(e) => setFilterCat(e.target.value)}
          className="px-4 py-3 text-sm font-medium bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-blue-300 focus:ring-4 focus:ring-blue-50 transition-all shadow-sm text-slate-700 min-w-[200px]"
        >
          <option value="all">All Categories</option>
          {(categories || []).map((c) => (
            <option key={c._id || c.id} value={c._id || c.id}>
              {c.name || c.label}
            </option>
          ))}
        </select>
      </div>

      {/* ── Data Table ── */}
      <div className="bg-white rounded-[1.5rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Product</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Category</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Price</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">MRP</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Stock Status</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Labels</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7}>
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <Package className="w-10 h-10 text-slate-300 mb-3" />
                      <p className="text-sm font-bold text-slate-700 mb-1">No products found</p>
                      <p className="text-xs text-slate-500">Try adjusting your search or filters.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((product) => {
                  const mrp = product.mrp || product.originalPrice || product.price;
                  return (
                    <tr key={pid(product)} className="hover:bg-blue-50/50 transition-colors group">
                      
                      {/* Product Name & Image */}
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                            {product.image && product.image.startsWith("http") ? (
                              <img src={product.image} alt={product.name} className="w-full h-full object-cover mix-blend-multiply" />
                            ) : (
                              <span className="text-xl opacity-70">{product.image || "📦"}</span>
                            )}
                          </div>
                          <span className="font-bold text-slate-900 max-w-[200px] truncate" title={product.name}>
                            {product.name}
                          </span>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-6 py-3">
                        <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-md uppercase tracking-wider border border-slate-200/60">
                          {getCategoryName(product.category)}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="px-6 py-3 font-black text-slate-900">
                        ₹{(product.price || 0).toLocaleString("en-IN")}
                      </td>

                      {/* MRP */}
                      <td className="px-6 py-3 text-slate-400 line-through font-medium">
                        ₹{(mrp || 0).toLocaleString("en-IN")}
                      </td>

                      {/* Stock Toggle */}
                      <td className="px-6 py-3">
                        <button
                          onClick={() => toggleStock(pid(product))}
                          className={`flex items-center gap-1.5 text-[10px] font-bold px-3 py-1.5 rounded-lg uppercase tracking-wide transition-all border shadow-sm
                            ${product.inStock
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                              : "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100"
                            }`}
                        >
                          {product.inStock
                            ? <><ToggleRight className="w-4 h-4" /> In Stock</>
                            : <><ToggleLeft className="w-4 h-4" /> Out of Stock</>
                          }
                        </button>
                      </td>

                      {/* Badges */}
                      <td className="px-6 py-3">
                        <div className="flex gap-2 flex-wrap">
                          {product.featured && (
                            <span className="px-2.5 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold uppercase tracking-widest rounded-md">
                              Featured
                            </span>
                          )}
                          {product.isNew && (
                            <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold uppercase tracking-widest rounded-md">
                              New
                            </span>
                          )}
                          {!product.featured && !product.isNew && <span className="text-slate-400">—</span>}
                                              {/* Labels — clickable toggles */}
                                              <td className="px-6 py-3">
                                                <div className="flex gap-1.5 flex-wrap">
                                                  <button
                                                    onClick={() => toggleFeatured(pid(product))}
                                                    title="Toggle Featured"
                                                    className={`flex items-center gap-1 px-2 py-0.5 border text-[10px] font-bold rounded-md uppercase tracking-wider transition-colors
                                                      ${product.featured
                                                        ? "bg-amber-50 text-amber-700 border-amber-300 hover:bg-amber-100"
                                                        : "bg-white text-slate-400 border-slate-200 hover:border-amber-300 hover:text-amber-600"
                                                      }`}
                                                  >
                                                    <Star className="w-2.5 h-2.5" />
                                                    Featured
                                                  </button>
                                                  <button
                                                    onClick={() => toggleBestseller(pid(product))}
                                                    title="Toggle Bestseller"
                                                    className={`flex items-center gap-1 px-2 py-0.5 border text-[10px] font-bold rounded-md uppercase tracking-wider transition-colors
                                                      ${product.bestseller
                                                        ? "bg-orange-50 text-orange-700 border-orange-300 hover:bg-orange-100"
                                                        : "bg-white text-slate-400 border-slate-200 hover:border-orange-300 hover:text-orange-600"
                                                      }`}
                                                  >
                                                    <BadgeCheck className="w-2.5 h-2.5" />
                                                    Best
                                                  </button>
                                                  <button
                                                    onClick={() => toggleIsNew(pid(product))}
                                                    title="Toggle New"
                                                    className={`flex items-center gap-1 px-2 py-0.5 border text-[10px] font-bold rounded-md uppercase tracking-wider transition-colors
                                                      ${product.isNew
                                                        ? "bg-blue-50 text-blue-700 border-blue-300 hover:bg-blue-100"
                                                        : "bg-white text-slate-400 border-slate-200 hover:border-blue-300 hover:text-blue-600"
                                                      }`}
                                                  >
                                                    <Sparkles className="w-2.5 h-2.5" />
                                                    New
                                                  </button>
                                                </div>
                                              </td>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-3 text-right">
                        <div className="flex items-center justify-end gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <button
                            onClick={() => navigate(`/admin/products/edit/${pid(product)}`)}
                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-white border border-transparent hover:border-slate-200 rounded-lg transition-all shadow-none hover:shadow-sm"
                            title="Edit Product"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(pid(product))}
                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-white border border-transparent hover:border-slate-200 rounded-lg transition-all shadow-none hover:shadow-sm"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Delete Confirm Modal ── */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm px-4 transition-opacity">
          <div className="bg-white rounded-[1.5rem] shadow-2xl shadow-slate-900/20 p-6 sm:p-8 max-w-sm w-full animate-in zoom-in-95 duration-200 text-center">
            <div className="w-14 h-14 bg-rose-50 border border-rose-100 rounded-full flex items-center justify-center mx-auto mb-5">
              <Trash2 className="w-6 h-6 text-rose-500" />
            </div>
            
            <h3 className="text-lg font-extrabold text-slate-900 mb-2">
              Delete Product?
            </h3>
            <p className="text-sm text-slate-500 mb-6 leading-relaxed">
              Are you sure you want to permanently delete this product? This action cannot be undone.
            </p>
            
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-bold transition-colors">
                Cancel
              </button>
              <button onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 px-4 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-sm font-bold transition-colors shadow-md shadow-rose-600/20">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminProducts;