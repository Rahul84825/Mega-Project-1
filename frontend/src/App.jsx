import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate, useLocation } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { DeliveryBanner } from "./components/DeliveryNotice";

// Pages
const Home = lazy(() => import("./pages/Home"));
const Products = lazy(() => import("./pages/Products"));
const ProductDetails = lazy(() => import("./pages/ProductDetails"));
const Cart = lazy(() => import("./pages/Cart"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Checkout = lazy(() => import("./pages/Checkout"));
const VerifyEmail = lazy(() => import("./pages/VerifyEmail"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Policy Pages
const ShippingPolicy = lazy(() => import("./pages/policies/ShippingPolicy"));
const ReturnsExchange = lazy(() => import("./pages/policies/ReturnsExchange"));
const PrivacyPolicy = lazy(() => import("./pages/policies/PrivacyPolicy"));
const TermsConditions = lazy(() => import("./pages/policies/TermsConditions"));

// Admin
const AdminLayout = lazy(() => import("./admin/AdminLayout"));
const AdminDashboard = lazy(() => import("./admin/AdminDashboard"));
const AdminProducts = lazy(() => import("./admin/AdminProducts"));
const AdminProductForm = lazy(() => import("./admin/AdminProductForm"));
const AdminOffers = lazy(() => import("./admin/AdminOffers"));
const AdminOrders = lazy(() => import("./admin/AdminOrders"));
const AdminCategories = lazy(() => import("./admin/AdminCategories"));

// Contexts
import { useAuth } from "./context/AuthContext";
import { useCart } from "./context/CartContext";

// ── Pages where footer should NOT appear ─────────────────────────────────────
const NO_FOOTER_ROUTES = ["/cart", "/checkout", "/login", "/signup"];

const AppLoader = () => (
  <div className="min-h-[60vh] flex items-center justify-center bg-slate-50">
    <div className="flex items-center gap-3 text-slate-600">
      <span className="w-8 h-8 rounded-full border-2 border-blue-200 border-t-blue-600 animate-spin" />
      <span className="text-sm font-semibold">Loading store view...</span>
    </div>
  </div>
);

// ── AdminGuard ────────────────────────────────────────────────────────────────
const AdminGuard = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
      </div>
    );
  }
  if (!user || user.role !== "admin") return <Navigate to="/login" replace />;
  return children;
};

// ── Storefront layout — conditionally renders Footer ─────────────────────────
const StorefrontLayout = () => {
  const { cartCount } = useCart();
  const location      = useLocation();

  // Hide footer on cart, checkout, login, signup
  const showFooter = !NO_FOOTER_ROUTES.includes(location.pathname);

  return (
    <>
      <DeliveryBanner />
      <Navbar cartCount={cartCount} />
      <Outlet />
      {showFooter && <Footer />}
    </>
  );
};

// ── App ───────────────────────────────────────────────────────────────────────
const App = () => (
  <Router>
    <ScrollToTop />
    <Suspense fallback={<AppLoader />}>
      <Routes>

      {/* Admin — protected, no Navbar/Footer */}
      <Route path="/admin" element={<AdminGuard><AdminLayout /></AdminGuard>}>
        <Route index                    element={<AdminDashboard />} />
        <Route path="products"          element={<AdminProducts />} />
        <Route path="products/add"      element={<AdminProductForm mode="add" />} />
        <Route path="products/edit/:id" element={<AdminProductForm mode="edit" />} />
        <Route path="orders"            element={<AdminOrders />} />
        <Route path="categories"        element={<AdminCategories />} />
        <Route path="offers"            element={<AdminOffers />} />
      </Route>

      {/* Storefront */}
      <Route element={<StorefrontLayout />}>
        <Route path="/"             element={<Home />} />
        <Route path="/products"     element={<Products />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/cart"         element={<Cart />} />
        <Route path="/checkout"     element={<Checkout />} />
        <Route path="/login"        element={<Login />} />
        <Route path="/signup"       element={<Signup />} />
        <Route path="/about"        element={<About />} />
        <Route path="/contact"      element={<Contact />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/shipping-policy"   element={<ShippingPolicy />} />
        <Route path="/returns-exchanges"  element={<ReturnsExchange />} />
        <Route path="/privacy-policy"     element={<PrivacyPolicy />} />
        <Route path="/terms-conditions"   element={<TermsConditions />} />
        <Route path="*"             element={<NotFound />} />
      </Route>

      </Routes>
    </Suspense>
  </Router>
);

export default App;