import { createContext, useContext, useState, useEffect } from "react";
import { api } from "../utils/api";

// ── Kept for offline/fallback use ─────────────────────────────────
const FALLBACK_OFFERS = [
  { id: "o1", title: "Stainless Steel Fest",  subtitle: "Up to 40% off on all SS cookware",       badge: "Limited Time",   discount: "40% OFF", category: "steel",      active: true, bg: "from-slate-800 to-slate-600",   accent: "bg-slate-500",  icon: "🥘" },
  { id: "o2", title: "Copper Wellness Sale",  subtitle: "Ayurvedic copper vessels at best price", badge: "Health Special", discount: "25% OFF", category: "copper",     active: true, bg: "from-orange-700 to-orange-500", accent: "bg-orange-400", icon: "🏺" },
  { id: "o3", title: "Pooja Essentials",      subtitle: "Brass & copper spiritual items",         badge: "Festive Deal",   discount: "30% OFF", category: "pooja",      active: true, bg: "from-red-800 to-red-600",       accent: "bg-red-500",    icon: "🪔" },
];

const ProductContext = createContext(null);

export const ProductProvider = ({ children }) => {
  const [products,   setProducts]   = useState([]);
  const [offers,     setOffers]     = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders,     setOrders]     = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(null);

  const token = () => localStorage.getItem("token");

  // ── Initial data fetch ────────────────────────────────────────────
  useEffect(() => {
    fetchAll();
  }, []);

  async function fetchAll() {
    setLoading(true);
    setError(null);
    try {
      const [prodRes, catRes, offerRes] = await Promise.allSettled([
        api.get("/api/products?limit=100"),
        api.get("/api/categories"),
        api.get("/api/offers"),
      ]);

      if (prodRes.status === "fulfilled") {
        const data = prodRes.value;
        setProducts(data.products || data.data || data || []);
      }
      if (catRes.status === "fulfilled") {
        const data = catRes.value;
        setCategories(data.categories || data.data || data || []);
      }
      if (offerRes.status === "fulfilled") {
        const data = offerRes.value;
        const fetched = data.offers || data.data || data || [];
        const merged = fetched.map((o, i) => ({
          ...FALLBACK_OFFERS[i % FALLBACK_OFFERS.length],
          ...o,
          id: o._id || o.id,
        }));
        setOffers(merged.length ? merged : FALLBACK_OFFERS);
      } else {
        setOffers(FALLBACK_OFFERS);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // ── Product CRUD ──────────────────────────────────────────────────
  const addProduct = async (product) => {
    const data = await api.post("/api/products", product, token());
    const newProduct = data.product || data;
    setProducts((prev) => [newProduct, ...prev]);
    return newProduct;
  };

  const updateProduct = async (id, updates) => {
    const data = await api.put(`/api/products/${id}`, updates, token());
    const updated = data.product || data;
    setProducts((prev) => prev.map((p) => (p._id || p.id) === id ? updated : p));
    return updated;
  };

  const deleteProduct = async (id) => {
    await api.delete(`/api/products/${id}`, token());
    setProducts((prev) => prev.filter((p) => (p._id || p.id) !== id));
  };

  const toggleStock = async (id) => {
    const data = await api.patch(`/api/products/${id}/stock`, {}, token());
    const updated = data.product || data;
    setProducts((prev) => prev.map((p) => (p._id || p.id) === id ? { ...p, ...updated } : p));
  };

  // ── Offer CRUD ────────────────────────────────────────────────────
  const addOffer = async (offer) => {
    const data = await api.post("/api/offers", offer, token());
    const newOffer = { ...FALLBACK_OFFERS[offers.length % FALLBACK_OFFERS.length], ...(data.offer || data), id: (data.offer || data)._id };
    setOffers((prev) => [...prev, newOffer]);
    return newOffer;
  };

  const updateOffer = async (id, updates) => {
    const data = await api.put(`/api/offers/${id}`, updates, token());
    const updated = data.offer || data;
    setOffers((prev) => prev.map((o) => (o._id || o.id) === id ? { ...o, ...updated } : o));
  };

  const deleteOffer = async (id) => {
    await api.delete(`/api/offers/${id}`, token());
    setOffers((prev) => prev.filter((o) => (o._id || o.id) !== id));
  };

  const toggleOffer = async (id) => {
    const data = await api.patch(`/api/offers/${id}/toggle`, {}, token());
    const updated = data.offer || data;
    setOffers((prev) => prev.map((o) => (o._id || o.id) === id ? { ...o, ...updated } : o));
  };

  // ── Category CRUD ─────────────────────────────────────────────────
  const addCategory = async (category) => {
    const data = await api.post("/api/categories", category, token());
    const newCat = data.category || data;
    setCategories((prev) => [...prev, newCat]);
    return newCat;
  };

  const updateCategory = async (id, updates) => {
    const data = await api.put(`/api/categories/${id}`, updates, token());
    const updated = data.category || data;
    setCategories((prev) => prev.map((c) => c.id === id ? updated : c));
  };

  const deleteCategory = async (id) => {
    await api.delete(`/api/categories/${id}`, token());
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  // ── Orders ────────────────────────────────────────────────────────
  const fetchOrders = async () => {
    try {
      const data = await api.get("/api/orders", token());
      setOrders(Array.isArray(data) ? data : data.orders || data.data || []);
    } catch {
      // silently ignore — non-admin users will get 401/403
    }
  };

  const placeOrder = async ({ cartItems, address, paymentMethod, upiId }) => {
    const subtotal  = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);
    const delivery  = subtotal >= 999 ? 0 : 79;
    const codFee    = paymentMethod === "cod" ? 50 : 0;
    const total     = subtotal + delivery + codFee;
    const itemCount = cartItems.reduce((s, i) => s + i.quantity, 0);

    const payload = {
      customer: {
        name:  address.name,
        phone: address.phone,
        email: address.email,
      },
      address: {
        line1:   address.address1,
        line2:   address.address2 || "",
        city:    address.city,
        pincode: address.pincode,
        state:   address.state,
        country: address.country || "India",
      },
      items: cartItems.map((i) => ({
        productId: i._id || i.id,
        name:      i.name,
        image:     i.image,
        category:  typeof i.category === "object" ? i.category?.id || i.category?._id : i.category,
        price:     i.price,
        quantity:  i.quantity,
      })),
      paymentMethod,
      upiId: paymentMethod === "upi" ? upiId : null,
      subtotal,
      delivery,
      total,
      itemCount,
    };

    const data = await api.post("/api/orders", payload, token());
    const newOrder = data.order || data;
    setOrders((prev) => [newOrder, ...prev]);
    return newOrder;
  };

  // ── Mark order as delivered ───────────────────────────────────────
  const markOrderDelivered = async (id) => {
    const data = await api.patch(`/api/orders/${id}/deliver`, {}, token());
    const updated = data.order || data;
    setOrders((prev) =>
      prev.map((o) => (o._id || o.id) === id ? { ...o, ...updated } : o)
    );
    return updated;
  };

  // ── Refresh helper ────────────────────────────────────────────────
  const refresh = () => fetchAll();

  return (
    <ProductContext.Provider value={{
      products, offers, categories, orders,
      loading, error, refresh,
      addProduct, updateProduct, deleteProduct, toggleStock,
      addOffer,   updateOffer,  deleteOffer,  toggleOffer,
      addCategory, updateCategory, deleteCategory,
      fetchOrders, placeOrder, markOrderDelivered,
    }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const ctx = useContext(ProductContext);
  if (!ctx) throw new Error("useProducts must be used inside ProductProvider");
  return ctx;
};