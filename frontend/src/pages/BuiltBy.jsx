import { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { ArrowLeft, Code, Github, Linkedin, ExternalLink, MessageCircle, Phone, Mail } from "lucide-react";

const BuiltBy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Built By Rahul Choudhary | Full Stack Developer";
  }, []);

  return (
    <main className="bg-slate-50 min-h-screen pb-16">
      
      {/* ── Hero Section ── */}
      <section className="bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
          <NavLink to="/" className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-white transition-colors mb-10 group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Store
          </NavLink>
          
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
            Hi, I'm Rahul Choudhary
          </h1>
          <p className="text-blue-400 font-bold tracking-widest uppercase text-sm mb-6">
            Full Stack Developer
          </p>
          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            I build modern ecommerce and business websites for local shops and startups.
          </p>
        </div>
      </section>

      {/* ── Content Grid ── */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* About Section */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 md:col-span-2 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                <Code className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">About Me</h2>
            </div>
            <p className="text-slate-600 text-[15px] leading-relaxed">
              I specialize in building full-stack applications using React, Node.js, and MongoDB. My focus is on creating clean, responsive, and highly functional digital experiences that help businesses grow online and scale their sales reliably.
            </p>
          </div>

          {/* Links Section */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 hover:shadow-md transition-shadow">
            <h2 className="text-[11px] font-bold text-slate-400 mb-5 uppercase tracking-widest">Connect</h2>
            <div className="flex flex-col gap-4">
              <a href="https://github.com/Rahul84825" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm font-semibold text-slate-700 hover:text-slate-900 group">
                <Github className="w-5 h-5 group-hover:scale-110 transition-transform" /> GitHub Profile
              </a>
              <a href="https://www.linkedin.com/in/rahul-choudhary-b597b2395/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm font-semibold text-slate-700 hover:text-blue-600 group">
                <Linkedin className="w-5 h-5 group-hover:scale-110 transition-transform" /> LinkedIn Profile
              </a>
            </div>
          </div>

          {/* Featured Project Section */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl border border-slate-700 shadow-xl p-8 md:col-span-3 text-white flex flex-col sm:flex-row items-center justify-between gap-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-blue-500/20 transition-colors duration-500" />
            
            <div className="relative z-10 flex-1 text-center sm:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-[10px] font-bold text-blue-200 uppercase tracking-widest mb-4">
                <ExternalLink className="w-3 h-3" /> Featured Project
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold mb-3 tracking-tight">Mahalaxmi Steels</h3>
              <p className="text-slate-300 text-sm sm:text-base max-w-xl leading-relaxed mx-auto sm:mx-0">
                This website is a live example of my work. It features a custom frontend, secure admin dashboard, real-time updates, and a fully integrated backend architecture.
              </p>
            </div>
            
            <div className="relative z-10 w-24 h-24 sm:w-32 sm:h-32 bg-white/5 rounded-[2rem] flex items-center justify-center shrink-0 border border-white/10 shadow-inner group-hover:scale-105 transition-transform duration-500">
              <span className="text-5xl sm:text-6xl drop-shadow-md">💻</span>
            </div>
          </div>

          {/* Contact Section */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 md:col-span-3 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mb-2">Need a website like this?</h2>
                <p className="text-slate-500 text-sm">Let's build it 🚀 Reach out to discuss your project.</p>
              </div>
              
              <div className="flex flex-wrap justify-center sm:justify-end gap-3">
                <a href="https://wa.me/9511289914" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-3 rounded-xl text-sm font-bold transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5">
                  <MessageCircle className="w-4 h-4" /> WhatsApp
                </a>
                <a href="tel: 9511289914" className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-3 rounded-xl text-sm font-bold transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5">
                  <Phone className="w-4 h-4" /> Call
                </a>
                <a href="mailto:activegamer789@gmail.com" className="flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 px-5 py-3 rounded-xl text-sm font-bold transition-all shadow-sm hover:-translate-y-0.5">
                  <Mail className="w-4 h-4" /> Email
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
};

export default BuiltBy;