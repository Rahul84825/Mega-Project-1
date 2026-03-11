import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { CheckCircle2, XCircle, Loader2, Mail } from "lucide-react";
import { api } from "../utils/api";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("loading"); // loading | success | error | resent
  const [message, setMessage] = useState("");
  const [resending, setResending] = useState(false);

  const email = searchParams.get("email") || "";
  const token = searchParams.get("token") || "";

  useEffect(() => {
    if (!token || !email) {
      setStatus("error");
      setMessage("Invalid verification link. Please check your email and try again.");
      return;
    }

    const verify = async () => {
      try {
        const data = await api.get(`/api/auth/verify-email?token=${token}&email=${encodeURIComponent(email)}`);
        setStatus("success");
        setMessage(data.message || "Email verified successfully!");
      } catch (err) {
        setStatus("error");
        setMessage(err.message || "Verification failed. The link may have expired.");
      }
    };

    verify();
  }, [token, email]);

  const handleResend = async () => {
    setResending(true);
    try {
      await api.post("/api/auth/resend-verification", { email });
      setStatus("resent");
      setMessage("A new verification link has been sent to your email.");
    } catch (err) {
      setMessage(err.message || "Failed to resend. Please try again.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-10 w-full max-w-md text-center">

        {/* Loading */}
        {status === "loading" && (
          <>
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-5">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Verifying your email...</h2>
            <p className="text-slate-500 text-sm">Please wait a moment.</p>
          </>
        )}

        {/* Success */}
        {status === "success" && (
          <>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Email Verified!</h2>
            <p className="text-slate-500 text-sm mb-8">{message}</p>
            <Link
              to="/login"
              className="w-full inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-colors"
            >
              Sign In Now →
            </Link>
          </>
        )}

        {/* Error */}
        {status === "error" && (
          <>
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-5">
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Verification Failed</h2>
            <p className="text-slate-500 text-sm mb-8">{message}</p>
            {email && (
              <button
                onClick={handleResend}
                disabled={resending}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-bold py-3 rounded-xl transition-colors mb-3"
              >
                {resending
                  ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</>
                  : <><Mail className="w-4 h-4" /> Resend Verification Email</>
                }
              </button>
            )}
            <Link to="/signup" className="text-sm text-blue-600 hover:underline font-semibold">
              Back to Sign Up
            </Link>
          </>
        )}

        {/* Resent */}
        {status === "resent" && (
          <>
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-5">
              <Mail className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Check Your Email</h2>
            <p className="text-slate-500 text-sm mb-8">{message}</p>
            <Link to="/login" className="text-sm text-blue-600 hover:underline font-semibold">
              Back to Login
            </Link>
          </>
        )}

      </div>
    </div>
  );
};

export default VerifyEmail;