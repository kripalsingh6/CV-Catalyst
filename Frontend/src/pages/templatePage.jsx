import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import Header from "./header";
import { Footer } from "./footer";
import toast, { Toaster } from "react-hot-toast";
import {
  Layout,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Crown,
  FileText,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Code,
  GraduationCap,
} from "lucide-react";

export function TemplatesPage() {
  const { User } = useAuth();
  const navigate = useNavigate();
  const [selectedTemplate, setSelectedTemplate] = useState("classic");

  const handleSelectTemplate = (templateId, templateName) => {
    setSelectedTemplate(templateId);
    localStorage.setItem("selectedTemplatePreference", templateId);
    toast.success(`Selected ${templateName} Template!`);

    if (User) {
      navigate("/dashboard", { state: { selectedTemplate: templateId } });
    } else {
      navigate("/signup");
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col relative overflow-hidden">
      <Toaster position="top-right" />

      {/* Ambient background glow */}
      <div className="absolute w-[700px] h-[700px] bg-red-600/10 blur-[160px] rounded-full top-[-100px] left-[-100px] pointer-events-none" />
      <div className="absolute w-[600px] h-[600px] bg-orange-600/10 blur-[160px] rounded-full bottom-[-100px] right-[-100px] pointer-events-none" />

      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full z-10">
        
        {/* Page Hero Title */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ATS-Optimized Resume Designs</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4 leading-tight">
            Choose a Template for Your AI-Tailored Resume
          </h1>
          <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
            Select from our ATS-tested visual layouts. Pick a template to start creating your optimized resume with Gemini AI.
          </p>
        </div>

        {/* Templates Gallery Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          
          {/* TEMPLATE 1: CLASSIC */}
          <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 sm:p-8 flex flex-col justify-between hover:border-red-500/40 transition-all duration-300 shadow-2xl group transform hover:-translate-y-1">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Free Tier
                </span>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Layout 01</span>
              </div>

              <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-red-400 transition-colors">
                Classic Template
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed mb-6">
                Traditional single-column format preferred by corporate recruiters and Fortune 500 ATS screening software.
              </p>

              {/* Visual Mockup Form of Classic Template */}
              <div className="bg-white text-black rounded-xl p-4 mb-6 shadow-inner font-serif text-[10px] space-y-2 border border-gray-200 pointer-events-none select-none">
                <div className="text-center">
                  <div className="font-extrabold text-xs text-black">Kripal Singh Thakur</div>
                  <div className="text-[8px] text-black mt-0.5">
                    Bhopal, MP | +91 8770534091 | thakurkripalsingh6@gmail.com
                  </div>
                  <div className="text-[8px] text-black underline flex justify-center gap-1">
                    <span>LinkedIn</span> | <span>GitHub</span> | <span>LeetCode</span>
                  </div>
                </div>
                <div>
                  <div className="font-bold text-[8px] text-black uppercase border-b border-black pb-0.5 mb-1">
                    PROFESSIONAL SUMMARY
                  </div>
                  <div className="text-[8px] text-black leading-tight">
                    Innovative Full-Stack Engineer with expertise in React.js, Node.js, and AI API integration...
                  </div>
                </div>
                <div>
                  <div className="font-bold text-[8px] text-black uppercase border-b border-black pb-0.5 mb-1">
                    EDUCATION
                  </div>
                  <div className="flex justify-between text-[8px] font-bold text-black">
                    <span>School of Information Technology, RGPV</span>
                    <span>Bhopal, MP</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="flex flex-wrap gap-1.5 mb-6">
                <span className="text-[10px] bg-white/5 border border-white/10 text-gray-300 px-2 py-0.5 rounded-md font-medium">ATS 100% Match</span>
                <span className="text-[10px] bg-white/5 border border-white/10 text-gray-300 px-2 py-0.5 rounded-md font-medium">Single Column</span>
                <span className="text-[10px] bg-white/5 border border-white/10 text-gray-300 px-2 py-0.5 rounded-md font-medium">Corporate</span>
              </div>

              <button
                onClick={() => handleSelectTemplate("classic", "Classic")}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-red-600 to-orange-500 hover:opacity-90 transition font-semibold text-xs text-white shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Select Classic Template</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* TEMPLATE 2: MODERN */}
          <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 sm:p-8 flex flex-col justify-between hover:border-orange-500/40 transition-all duration-300 shadow-2xl group transform hover:-translate-y-1">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center gap-1">
                  <Crown className="w-3.5 h-3.5" />
                  Pro Featured
                </span>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Layout 02</span>
              </div>

              <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-orange-400 transition-colors">
                Modern Split Template
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed mb-6">
                Sleek two-column split layout with dark accent sidebar. Ideal for technology, engineering, and creative positions.
              </p>

              {/* Visual Mockup Form of Modern Template */}
              <div className="bg-white text-gray-900 rounded-xl overflow-hidden mb-6 shadow-inner font-sans text-[10px] grid grid-cols-12 border border-gray-200 pointer-events-none select-none">
                <div className="col-span-5 bg-[#0f172a] text-slate-100 p-3 space-y-2">
                  <div className="font-extrabold text-[11px] text-white leading-tight">ALEX MORGAN</div>
                  <div className="text-[8px] text-orange-400 font-bold uppercase">Tech Lead</div>
                  <div className="text-[8px] text-slate-300 space-y-0.5 pt-1 border-t border-slate-700">
                    <div>alex@domain.com</div>
                    <div>San Francisco, CA</div>
                  </div>
                  <div className="pt-1 border-t border-slate-700">
                    <div className="text-[7px] text-slate-400 font-bold uppercase mb-1">Skills</div>
                    <div className="flex flex-wrap gap-0.5">
                      <span className="bg-slate-800 text-slate-200 px-1 py-0.5 rounded text-[7px]">React</span>
                      <span className="bg-slate-800 text-slate-200 px-1 py-0.5 rounded text-[7px]">Node.js</span>
                    </div>
                  </div>
                </div>

                <div className="col-span-7 p-3 bg-slate-50 space-y-2">
                  <div>
                    <div className="font-bold text-[8px] text-slate-900 uppercase border-b border-slate-200 pb-0.5 mb-1">Summary</div>
                    <div className="text-[8px] text-slate-700 leading-tight">Experienced full stack lead building scalable cloud software...</div>
                  </div>
                  <div>
                    <div className="font-bold text-[8px] text-slate-900 uppercase border-b border-slate-200 pb-0.5 mb-1">Experience</div>
                    <div className="font-bold text-[8px] text-slate-900">Senior Architect</div>
                    <div className="text-[7px] text-slate-600">• Scaled web infrastructure to 2M monthly active users</div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="flex flex-wrap gap-1.5 mb-6">
                <span className="text-[10px] bg-white/5 border border-white/10 text-gray-300 px-2 py-0.5 rounded-md font-medium">Two-Column</span>
                <span className="text-[10px] bg-white/5 border border-white/10 text-gray-300 px-2 py-0.5 rounded-md font-medium">Dark Sidebar</span>
                <span className="text-[10px] bg-white/5 border border-white/10 text-gray-300 px-2 py-0.5 rounded-md font-medium">Tech & Design</span>
              </div>

              <button
                onClick={() => handleSelectTemplate("modern", "Modern")}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:opacity-90 transition font-semibold text-xs text-white shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Select Modern Template</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* TEMPLATE 3: MINIMAL */}
          <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 sm:p-8 flex flex-col justify-between hover:border-amber-500/40 transition-all duration-300 shadow-2xl group transform hover:-translate-y-1">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  Minimalist
                </span>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Layout 03</span>
              </div>

              <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-amber-400 transition-colors">
                Minimal Swiss Template
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed mb-6">
                Clean left-aligned typography with top gradient accent bar. Perfect for startups and high-impact executive roles.
              </p>

              {/* Visual Mockup Form of Minimal Template */}
              <div className="bg-[#fafafa] text-gray-900 rounded-xl p-4 mb-6 shadow-inner font-sans text-[10px] space-y-3 border border-gray-200 relative overflow-hidden pointer-events-none select-none">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 via-orange-500 to-amber-500" />
                <div className="pb-2 border-b border-gray-200">
                  <div className="font-black text-sm text-gray-900">ALEX MORGAN</div>
                  <div className="text-[8px] text-gray-500">alex@domain.com • +1 555 019 2834</div>
                </div>
                <div>
                  <div className="font-bold text-[8px] text-gray-500 uppercase mb-0.5">Experience</div>
                  <div className="border-l border-red-500 pl-2 space-y-0.5">
                    <div className="font-bold text-[9px] text-gray-900">Staff Systems Engineer</div>
                    <div className="text-[8px] text-gray-600">• Architected distributed cloud infrastructure</div>
                  </div>
                </div>
                <div>
                  <div className="font-bold text-[8px] text-gray-500 uppercase mb-1">Skills</div>
                  <div className="flex flex-wrap gap-1">
                    <span className="bg-white border border-gray-300 px-1.5 py-0.5 rounded-full text-[7px] font-medium">Go</span>
                    <span className="bg-white border border-gray-300 px-1.5 py-0.5 rounded-full text-[7px] font-medium">Kubernetes</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="flex flex-wrap gap-1.5 mb-6">
                <span className="text-[10px] bg-white/5 border border-white/10 text-gray-300 px-2 py-0.5 rounded-md font-medium">Swiss Typography</span>
                <span className="text-[10px] bg-white/5 border border-white/10 text-gray-300 px-2 py-0.5 rounded-md font-medium">Top Accent Bar</span>
                <span className="text-[10px] bg-white/5 border border-white/10 text-gray-300 px-2 py-0.5 rounded-md font-medium">Contemporary</span>
              </div>

              <button
                onClick={() => handleSelectTemplate("minimal", "Minimal")}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:opacity-90 transition font-semibold text-xs text-white shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Select Minimal Template</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default TemplatesPage;
