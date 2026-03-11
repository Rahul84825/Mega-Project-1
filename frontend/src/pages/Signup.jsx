import { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User, Phone, Loader2, UserPlus, AlertCircle, ShieldCheck, CheckCircle2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Signup = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { register, user, loading: authLoading } = useAuth();

  const from = new URLSearchParams(location.search).get("redirect") || null;

  useEffect(() => {
    if (!authLoading && user) {
      navigate(from || "/", { replace: true });
    }
  }, [user, authLoading, navigate, from]);

  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirmPassword: "" });
  const [errors, setErrors]           = useState({});
  const [loading, setLoading]         = useState(false);
  const [showPass, setShowPass]       = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [registered, setRegistered]   = useState(false); // show "check email" screen
  const [registeredEmail, setRegisteredEmail] = useState("");

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Full name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email address";
    if (form.phone && !/^[6-9]\d{9}$/.test(form.phone)) e.phone = "Enter a valid 10-digit mobile number";
    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 6) e.password = "Password must be at least 6 characters";
    if (!form.confirmPassword) e.confirmPassword = "Please confirm your password";
    else if (form.password !== form.confirmPassword) e.confirmPassword = "Passwords do not match";
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const getStrength = (pass) => {
    if (!pass) return { level: 0, label: "", color: "" };
    let score = 0;
    if (pass.length >= 6)  score++;
    if (pass.length >= 10) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    if (score <= 2) return { level: score, label: "Weak",   color: "bg-rose-400"   };
    if (score <= 3) return { level: score, label: "Fair",   color: "bg-amber-400"  };
    if (score <= 4) return { level: score, label: "Good",   color: "bg-blue-400"   };
    return               { level: score, label: "Strong", color: "bg-emerald-500" };
  };

  const strength = getStrength(form.password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) { setErrors(validationErrors); return; }

    setLoading(true);
    try {
      await register(form.name, form.email, form.password, form.phone ? `+91${form.phone}` : "");
      // Don't navigate — show "check your email" screen
      setRegisteredEmail(form.email);
      setRegistered(true);
    } catch (err) {
      setErrors({ submit: err.message || "Something went wrong. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (hasError) =>
    `w-full px-4 py-3 rounded-xl border text-sm font-medium transition-all duration-300 outline-none
     ${hasError
        ? "bg-rose-50 border-rose-300 text-rose-900 focus:ring-4 focus:ring-rose-100 placeholder:text-rose-300"
        : "bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:border-blue-300 focus:ring-4 focus:ring-blue-50 placeholder:text-slate-400 hover:border-slate-300 shadow-inner"
     }`;

  // ── "Check your email" screen ─────────────────────────────────────
  if (registered) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
        <div className="bg-white rounded-[2rem] shadow-2xl shadow-slate-200/50 border border-slate-100 p-10 w-full max-w-md text-center">
          <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="w-10 h-10 text-blue-600" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 mb-3">Check Your Email</h1>
          <p className="text-slate-500 text-sm mb-2">
            We've sent a verification link to:
          </p>
          <p className="font-bold text-blue-600 text-base mb-6">{registeredEmail}</p>
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-8 text-left space-y-2">
            {[
              "Open your email inbox",
              "Click the verification link",
              "Come back and sign in",
            ].map((step, i) => (
              <div key={i} className="flex items-center gap-3 text-sm text-blue-800">
                <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                  {i + 1}
                </div>
                {step}
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-400 mb-4">
            Didn't receive it? Check your spam folder or{" "}
            <NavLink
              to={`/signup`}
              onClick={() => setRegistered(false)}
              className="text-blue-600 font-bold hover:underline"
            >
              try again
            </NavLink>
            .
          </p>
          <NavLink
            to="/login"
            className="inline-flex items-center justify-center gap-2 text-sm font-bold text-slate-700 hover:text-blue-600 transition-colors"
          >
            <CheckCircle2 className="w-4 h-4" /> Already verified? Sign in
          </NavLink>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12 relative overflow-hidden">
      <div className="absolute bottom-0 right-0 w-full h-[500px] bg-blue-500/10 rounded-full blur-[120px] translate-y-1/2 pointer-events-none" />

      <div className="bg-white rounded-[2rem] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden w-full max-w-5xl flex flex-col md:flex-row relative z-10">

        {/* ── LEFT: Branding Panel ── */}
        <div className="hidden md:flex md:w-5/12 bg-gradient-to-br from-blue-600 to-blue-900 relative items-center justify-center p-12 text-white flex-col overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/30 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
          <div className="relative z-10 text-center flex flex-col items-center">
            <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center mb-8 backdrop-blur-md border border-white/20 shadow-2xl shadow-black/10">
              <span className="text-4xl drop-shadow-md">🥘</span>
            </div>
            <h2 className="text-3xl font-extrabold mb-2 tracking-tight">Mahalaxmi Steels</h2>
            <p className="text-blue-200 text-sm font-medium uppercase tracking-widest mb-10">& Home Appliance</p>
            <div className="w-full border-t border-white/10 pt-8 space-y-5 text-left">
              {["Premium Quality Products", "Free Delivery above ₹999", "Easy 7-Day Returns", "Trusted Since 1995"].map((text) => (
                <div key={text} className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ring-1 ring-white/20 backdrop-blur-sm">
                    <span className="text-sm font-bold text-blue-300">✓</span>
                  </div>
                  <span className="text-sm font-bold text-white leading-tight mt-1.5">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── RIGHT: Form Panel ── */}
        <div className="w-full md:w-7/12 p-8 sm:p-14 flex flex-col justify-center bg-white">
          <div className="mb-7">
            <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-2 flex items-center gap-1.5">
              <span className="w-4 h-[2px] bg-blue-600 rounded-full"></span> Get Started
            </p>
            <h1 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">Create your account</h1>
            <p className="text-sm text-slate-500 font-medium">
              Already have an account?{" "}
              <NavLink to="/login" className="text-blue-600 font-bold hover:text-blue-700 hover:underline transition-colors">
                Sign in here
              </NavLink>
            </p>
          </div>

          {errors.submit && (
            <div className="mb-6 px-4 py-3 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
              {errors.submit}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div>
              <label className="flex items-center gap-1.5 text-[13px] font-bold text-slate-700 mb-2">
                <User className="w-3.5 h-3.5 text-blue-600" /> Full Name <span className="text-rose-500">*</span>
              </label>
              <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Rahul Sharma" className={inputClass(errors.name)} />
              {errors.name && <p className="mt-1.5 text-[11px] font-bold text-rose-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.name}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-1.5 text-[13px] font-bold text-slate-700 mb-2">
                  <Mail className="w-3.5 h-3.5 text-blue-600" /> Email Address <span className="text-rose-500">*</span>
                </label>
                <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="rahul@example.com" className={inputClass(errors.email)} />
                {errors.email && <p className="mt-1.5 text-[11px] font-bold text-rose-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.email}</p>}
              </div>
              <div>
                <label className="flex items-center gap-1.5 text-[13px] font-bold text-slate-700 mb-2">
                  <Phone className="w-3.5 h-3.5 text-blue-600" /> Phone <span className="text-slate-400 font-medium text-[10px] ml-1 uppercase">(optional)</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-500 font-bold select-none">+91</span>
                  <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="98765 43210" maxLength={10} className={`${inputClass(errors.phone)} pl-12`} />
                </div>
                {errors.phone && <p className="mt-1.5 text-[11px] font-bold text-rose-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.phone}</p>}
              </div>
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-[13px] font-bold text-slate-700 mb-2">
                <Lock className="w-3.5 h-3.5 text-blue-600" /> Password <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input type={showPass ? "text" : "password"} name="password" value={form.password} onChange={handleChange} placeholder="Create a strong password" className={`${inputClass(errors.password)} pr-11 tracking-widest placeholder:tracking-normal`} />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {form.password && (
                <div className="mt-2.5">
                  <div className="flex gap-1.5 mb-1.5">
                    {[1,2,3,4,5].map((i) => (
                      <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${i <= strength.level ? strength.color : "bg-slate-100"}`} />
                    ))}
                  </div>
                  <div className="flex justify-between items-center">
                    <p className={`text-[10px] font-bold uppercase tracking-wider ${strength.label === "Weak" ? "text-rose-500" : strength.label === "Fair" ? "text-amber-500" : strength.label === "Good" ? "text-blue-500" : "text-emerald-600"}`}>
                      {strength.label} password
                    </p>
                    {errors.password && <p className="text-[11px] font-bold text-rose-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.password}</p>}
                  </div>
                </div>
              )}
              {!form.password && errors.password && (
                <p className="mt-1.5 text-[11px] font-bold text-rose-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.password}</p>
              )}
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-[13px] font-bold text-slate-700 mb-2">
                <Lock className="w-3.5 h-3.5 text-blue-600" /> Confirm Password <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input type={showConfirm ? "text" : "password"} name="confirmPassword" value={form.confirmPassword} onChange={handleChange} placeholder="Re-enter your password" className={`${inputClass(errors.confirmPassword)} pr-11 tracking-widest placeholder:tracking-normal`} />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="mt-1.5 text-[11px] font-bold text-rose-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.confirmPassword}</p>}
            </div>

            <div className="flex items-start gap-2.5 pt-2">
              <input id="terms" type="checkbox" required className="w-4 h-4 mt-0.5 text-blue-600 border-slate-300 rounded focus:ring-blue-500 cursor-pointer flex-shrink-0" />
              <label htmlFor="terms" className="text-[13px] font-medium text-slate-600 cursor-pointer leading-snug">
                I agree to the <a href="#" className="text-blue-600 hover:underline font-bold">Terms of Service</a> and <a href="#" className="text-blue-600 hover:underline font-bold">Privacy Policy</a>
              </label>
            </div>

            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 mt-4 bg-slate-900 hover:bg-blue-600 disabled:bg-slate-300 text-white font-bold py-3.5 rounded-xl transition-all duration-300 shadow-lg shadow-slate-900/10 hover:shadow-blue-600/20 disabled:cursor-not-allowed hover:-translate-y-0.5 disabled:translate-y-0">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating account...</> : <><UserPlus className="w-4 h-4" /> Create Account</>}
            </button>
          </form>

          <p className="mt-6 text-[11px] font-medium text-center text-slate-400 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" /> Your information is safe with us. We never share your data.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;