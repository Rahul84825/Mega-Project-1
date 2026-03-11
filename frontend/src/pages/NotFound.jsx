import { useNavigate, Link } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "404 — Page Not Found | Mahalaxmi Steels";
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">

        {/* 404 */}
        <div className="relative mb-6">
          <p className="text-[120px] font-black text-blue-600 leading-none select-none">
            404
          </p>
          <span className="absolute inset-0 flex items-center justify-center text-6xl pointer-events-none">
            🍳
          </span>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-3">Page not found</h1>
        <p className="text-gray-500 text-sm leading-relaxed mb-8">
          Looks like this page went missing — just like a lid without a kadai.
          Let's get you back to something useful.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white
                       px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
          >
            Go Home
          </Link>
          <Link
            to="/products"
            className="inline-flex items-center justify-center gap-2 border border-gray-200
                       text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
          >
            Browse Products
          </Link>
        </div>

        <button
          onClick={() => navigate(-1)}
          className="mt-4 text-sm text-gray-400 hover:text-blue-600 transition-colors"
        >
          ← Go back
        </button>

      </div>
    </div>
  );
};

export default NotFound;