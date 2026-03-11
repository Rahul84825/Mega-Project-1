import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import ErrorBoundary from "./components/ErrorBoundary";
import { AuthProvider } from "./context/AuthContext";
import { ProductProvider } from "./context/ProductContext";
import { CartProvider } from "./context/CartContext";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        <ProductProvider>
          <CartProvider>
            <App />
          </CartProvider>
        </ProductProvider>
      </AuthProvider>
    </ErrorBoundary>
  </React.StrictMode>
);