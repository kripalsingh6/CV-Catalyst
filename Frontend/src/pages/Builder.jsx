import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Loader2, Wand2, Download, AlertCircle, Layout, ArrowLeft, Sparkles } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { useAuth } from "../context/authContext";

import Header from "./header";
import { Footer } from "./footer";
import ResumeUploader from "../components/resume/ResumeUploader";
import JDInput from "../components/resume/JDInput";
import KeywordBadges from "../components/resume/KeywordBadges";
import ResumeEditor from "../components/resume/ResumeEditor";
import ATSScoreRing from "../components/resume/ATSScoreRing";

const API_BASE = "http://localhost:3000";

export function BuilderPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { User } = useAuth();

  const [resume, setResume] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRewriting, setIsRewriting] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState("classic");

  const fetchResume = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.get(`${API_BASE}/api/resume/${id}`, {
        withCredentials: true,
      });
      if (data.resume || data) {
        setResume(data.resume || data);
        if (data.resume?.template) setSelectedTemplate(data.resume.template);
      }
    } catch {
      // If requested resume ID is invalid or deleted, automatically redirect to latest valid resume or create draft
      try {
        const listRes = await axios.get(`${API_BASE}/api/resume`, { withCredentials: true });
        const list = listRes.data.resumes || [];
        if (list.length > 0 && list[0]._id) {
          navigate(`/builder/${list[0]._id}`, { replace: true });
        } else {
          const createRes = await axios.post(
            `${API_BASE}/api/resume`,
            { title: "My Master Resume", rawText: "" },
            { withCredentials: true }
          );
          if (createRes.data.resume?._id) {
            navigate(`/builder/${createRes.data.resume._id}`, { replace: true });
          } else {
            navigate("/dashboard");
          }
        }
      } catch {
        navigate("/dashboard");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchResume();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleRewrite = async () => {
    if (User?.subscription !== "pro" && resume?.status === "rewritten") {
      toast.error("Free plan allows limited rewrites per resume. Upgrade to Pro for unlimited AI edits.");
      return navigate("/pricing");
    }

    setIsRewriting(true);
    try {
      toast.loading("AI is optimizing your resume...", { id: "rewrite-toast" });
      const { data } = await axios.post(
        `${API_BASE}/api/resume/${id}/rewrite`,
        { template: selectedTemplate },
        { withCredentials: true }
      );
      toast.success("Resume rewritten successfully with AI!", { id: "rewrite-toast" });
      setResume(data.resume);
      if (data.resume?.template) setSelectedTemplate(data.resume.template);
    } catch (error) {
      toast.error(error.response?.data?.message || "AI rewrite failed", { id: "rewrite-toast" });
    } finally {
      setIsRewriting(false);
    }
  };

  const handleTemplateChange = (template) => {
    if (template !== "classic" && User?.subscription !== "pro") {
      toast.error("Modern and Minimal templates require a Pro subscription.");
      return navigate("/pricing");
    }
    setSelectedTemplate(template);
    setResume((prev) => ({ ...prev, template }));
    toast.success(`Selected ${template} template`);
  };

  const handleExportPDF = async () => {
    try {
      toast.loading(`Generating ${selectedTemplate.toUpperCase()} single-page PDF...`, { id: "pdf-toast" });
      const response = await axios.post(
        `${API_BASE}/api/resume/${id}/export-pdf?template=${selectedTemplate}`,
        { template: selectedTemplate },
        { responseType: "blob", withCredentials: true }
      );
      const url = window.URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${(resume.title || "Resume").replace(/\s+/g, "_")}_${selectedTemplate}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("Single-page PDF downloaded successfully!", { id: "pdf-toast" });
    } catch (err) {
      console.error("PDF Export error:", err);
      toast.error("Puppeteer PDF generation failed. Printing current layout...", { id: "pdf-toast" });
      window.print();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center text-white">
        <Loader2 className="w-10 h-10 text-red-500 animate-spin mb-4" />
        <p className="text-gray-400 text-sm font-medium">Loading Builder Interface...</p>
      </div>
    );
  }

  if (!resume) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col items-center justify-center p-6 text-center">
        <Toaster position="top-right" />
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center max-w-md py-12">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4 text-red-400 shadow-xl">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Resume Not Found</h2>
          <p className="text-gray-400 text-xs mb-6 leading-relaxed">
            The requested resume details could not be found or the ID format is invalid. Return to your dashboard to select or create a resume.
          </p>
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-red-600 to-orange-500 text-white font-semibold text-xs rounded-xl shadow-lg hover:opacity-90 transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  const hasRawText = !!resume?.rawText;
  const hasJdAnalysis = !!resume?.jdAnalysis?.keywords?.length;
  const hasRewrittenData = !!resume?.rewrittenData && Object.keys(resume.rewrittenData).length > 0;
  const canRewrite = hasRawText && hasJdAnalysis;

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col relative overflow-hidden">
      <Toaster position="top-right" />

      {/* Ambient background glow */}
      <div className="absolute w-[600px] h-[600px] bg-red-600/10 blur-[160px] rounded-full top-[-100px] left-[-100px] pointer-events-none" />
      <div className="absolute w-[600px] h-[600px] bg-orange-600/10 blur-[160px] rounded-full bottom-[-100px] right-[-100px] pointer-events-none" />

      {/* Header */}
      <Header />

      {/* Main Content Container */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full z-10">
        
        {/* Top Header & Actions Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-white/10 pb-6">
          <div>
            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white mb-2 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Dashboard
            </button>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {resume.title || "Untitled Resume"}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-gray-400">Status:</span>
              <span className="uppercase text-[11px] font-bold text-red-400 bg-red-500/10 px-2.5 py-0.5 rounded-full border border-red-500/20">
                {resume.status || "draft"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExportPDF}
              className="px-4 py-2.5 bg-white/5 border border-white/10 hover:bg-white/10 text-white text-xs font-semibold rounded-xl flex items-center gap-2 transition cursor-pointer shadow-sm"
            >
              <Download className="w-4 h-4 text-gray-300" />
              Export PDF / Print
            </button>

            <button
              onClick={handleRewrite}
              disabled={!canRewrite || isRewriting}
              className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-orange-500 hover:opacity-90 text-white text-xs font-bold rounded-xl flex items-center gap-2 transition disabled:opacity-50 shadow-lg shadow-red-500/20 cursor-pointer"
            >
              {isRewriting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Wand2 className="w-4 h-4" />
              )}
              {hasRewrittenData ? "Rewrite Again" : "AI Rewrite & Optimize"}
            </button>
          </div>
        </div>

        {/* Builder Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Left Column: Editor Flow */}
          <div className="lg:col-span-6 space-y-6">
            
            <ResumeUploader
              resumeId={id}
              initialText={resume.rawText}
              onUploadSuccess={(text) => {
                setResume((prev) => ({
                  ...prev,
                  rawText: text,
                  status: prev.status === "new" ? "draft" : prev.status,
                }));
              }}
            />

            {hasRawText && (
              <JDInput
                resumeId={id}
                initialJd={resume.jobDescription}
                onAnalysisComplete={(analysis) => {
                  setResume((prev) => ({
                    ...prev,
                    jdAnalysis: analysis,
                    status: "analyzed",
                  }));
                }}
              />
            )}

            {hasJdAnalysis && (
              <KeywordBadges analysis={resume.jdAnalysis} />
            )}

            {!canRewrite && (
              <div className="bg-rose-500/10 border border-rose-500/20 text-rose-300 p-4 rounded-2xl flex items-start text-xs leading-relaxed">
                <AlertCircle className="w-4 h-4 mr-2.5 flex-shrink-0 mt-0.5 text-rose-400" />
                <p>Complete Step 1 (Upload Resume Text) and Step 2 (Paste Job Description) to unlock the AI Rewrite button.</p>
              </div>
            )}

          </div>

          {/* Right Column: Results & Preview */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-6">

              {/* Top Download Option Bar in Rewrite / Preview Section */}
              {hasRewrittenData && (
                <div className="bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-blue-500/10 border border-emerald-500/20 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg animate-in fade-in duration-300">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">AI Rewritten Resume Ready</h4>
                      <p className="text-[11px] text-gray-400">Generated using <span className="capitalize text-emerald-400 font-bold">{selectedTemplate}</span> template format</p>
                    </div>
                  </div>
                  <button
                    onClick={handleExportPDF}
                    className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-500 hover:opacity-90 text-white text-xs font-bold rounded-xl flex items-center gap-2 transition shadow-md shadow-emerald-500/20 cursor-pointer active:scale-95 whitespace-nowrap"
                  >
                    <Download className="w-4 h-4" />
                    Download {selectedTemplate.toUpperCase()} PDF
                  </button>
                </div>
              )}

              {/* Score & Template Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                
                {/* ATS Score Ring */}
                <div className="sm:col-span-1">
                  <ATSScoreRing score={resume.atsScore || 0} />
                </div>

                {/* Template Selection Cards */}
                <div className="sm:col-span-2 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-5 shadow-2xl flex flex-col justify-between">
                  <div>
                    <h3 className="text-gray-300 font-semibold uppercase tracking-wider text-xs mb-3 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Layout className="w-4 h-4 text-red-400" />
                        Select Template
                      </span>
                      <span className="text-[10px] font-normal text-gray-400 capitalize">Active: {selectedTemplate}</span>
                    </h3>
                    
                    <div className="grid grid-cols-3 gap-2.5">
                      {/* CLASSIC MINI CARD */}
                      <button
                        type="button"
                        onClick={() => handleTemplateChange("classic")}
                        className={`p-2 rounded-xl text-xs font-semibold border transition-all flex flex-col items-center justify-between gap-1.5 cursor-pointer text-left ${
                          selectedTemplate === "classic"
                            ? "border-red-500 bg-red-500/10 text-white ring-1 ring-red-500/50 shadow-lg shadow-red-500/10"
                            : "border-white/10 bg-black/40 text-gray-400 hover:border-white/20 hover:text-white"
                        }`}
                      >
                        {/* Mini Visual Diagram for Classic */}
                        <div className="w-full bg-white text-black p-1.5 rounded-md border border-gray-300 flex flex-col gap-1 select-none pointer-events-none shadow-sm">
                          <div className="flex flex-col items-center gap-0.5 border-b border-black pb-1">
                            <div className="w-8 h-1 bg-black rounded-full" />
                            <div className="w-12 h-0.5 bg-gray-600 rounded-full" />
                          </div>
                          <div className="flex flex-col gap-0.5 pt-0.5">
                            <div className="w-10 h-0.5 bg-black font-bold" />
                            <div className="w-full h-0.5 bg-gray-400" />
                            <div className="w-full h-0.5 bg-gray-400" />
                            <div className="w-8 h-0.5 bg-black mt-0.5" />
                            <div className="w-full h-0.5 bg-gray-400" />
                          </div>
                        </div>
                        <div className="flex items-center justify-between w-full mt-1">
                          <span className="capitalize text-[11px] font-bold">Classic</span>
                          <span className="text-[8px] bg-emerald-500/20 text-emerald-400 px-1 py-0.5 rounded font-bold uppercase">Free</span>
                        </div>
                      </button>

                      {/* MODERN MINI CARD */}
                      <button
                        type="button"
                        onClick={() => handleTemplateChange("modern")}
                        className={`p-2 rounded-xl text-xs font-semibold border transition-all flex flex-col items-center justify-between gap-1.5 cursor-pointer text-left ${
                          selectedTemplate === "modern"
                            ? "border-red-500 bg-red-500/10 text-white ring-1 ring-red-500/50 shadow-lg shadow-red-500/10"
                            : "border-white/10 bg-black/40 text-gray-400 hover:border-white/20 hover:text-white"
                        }`}
                      >
                        {/* Mini Visual Diagram for Modern (Split Sidebar) */}
                        <div className="w-full bg-white text-black p-1 rounded-md border border-gray-300 grid grid-cols-12 gap-1 select-none pointer-events-none shadow-sm">
                          <div className="col-span-4 bg-slate-900 rounded p-1 flex flex-col gap-0.5">
                            <div className="w-4 h-1 bg-orange-400 rounded-full" />
                            <div className="w-5 h-0.5 bg-slate-400 rounded-full mt-1" />
                            <div className="w-4 h-0.5 bg-slate-500 rounded-full" />
                          </div>
                          <div className="col-span-8 p-0.5 flex flex-col gap-0.5">
                            <div className="w-8 h-0.5 bg-black font-bold" />
                            <div className="w-full h-0.5 bg-gray-400" />
                            <div className="w-full h-0.5 bg-gray-400" />
                            <div className="w-6 h-0.5 bg-black mt-0.5" />
                            <div className="w-full h-0.5 bg-gray-400" />
                          </div>
                        </div>
                        <div className="flex items-center justify-between w-full mt-1">
                          <span className="capitalize text-[11px] font-bold">Modern</span>
                          <span className="text-[8px] bg-red-500/20 text-red-400 px-1 py-0.5 rounded font-bold uppercase">Pro</span>
                        </div>
                      </button>

                      {/* MINIMAL MINI CARD */}
                      <button
                        type="button"
                        onClick={() => handleTemplateChange("minimal")}
                        className={`p-2 rounded-xl text-xs font-semibold border transition-all flex flex-col items-center justify-between gap-1.5 cursor-pointer text-left ${
                          selectedTemplate === "minimal"
                            ? "border-red-500 bg-red-500/10 text-white ring-1 ring-red-500/50 shadow-lg shadow-red-500/10"
                            : "border-white/10 bg-black/40 text-gray-400 hover:border-white/20 hover:text-white"
                        }`}
                      >
                        {/* Mini Visual Diagram for Minimal */}
                        <div className="w-full bg-slate-50 text-black p-1.5 rounded-md border border-gray-300 flex flex-col gap-1 select-none pointer-events-none shadow-sm">
                          <div className="flex justify-between items-center border-l-2 border-red-500 pl-1">
                            <div className="w-7 h-1 bg-black rounded-full" />
                            <div className="w-4 h-0.5 bg-gray-500" />
                          </div>
                          <div className="flex flex-col gap-0.5 pt-0.5">
                            <div className="w-8 h-0.5 bg-red-600" />
                            <div className="w-full h-0.5 bg-gray-400" />
                            <div className="w-full h-0.5 bg-gray-400" />
                          </div>
                        </div>
                        <div className="flex items-center justify-between w-full mt-1">
                          <span className="capitalize text-[11px] font-bold">Minimal</span>
                          <span className="text-[8px] bg-red-500/20 text-red-400 px-1 py-0.5 rounded font-bold uppercase">Pro</span>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>

              </div>

              {/* Resume Editor Preview */}
              <ResumeEditor
                data={resume.rewrittenData || { name: User?.name || "Applicant Name", rawText: resume.rawText }}
                template={selectedTemplate}
                onTemplateChange={handleTemplateChange}
              />

            </div>
          </div>

        </div>

      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export function BuilderRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLatestAndRedirect = async () => {
      try {
        const { data } = await axios.get(`${API_BASE}/api/resume`, {
          withCredentials: true,
        });
        const list = data.resumes || [];
        if (list.length > 0 && list[0]._id) {
          navigate(`/builder/${list[0]._id}`, { replace: true });
        } else {
          // Create default resume draft if none exists
          const createRes = await axios.post(
            `${API_BASE}/api/resume`,
            { title: "My Master Resume", rawText: "" },
            { withCredentials: true }
          );
          if (createRes.data.resume?._id) {
            navigate(`/builder/${createRes.data.resume._id}`, { replace: true });
          } else {
            navigate("/dashboard");
          }
        }
      } catch (err) {
        console.error("Builder redirect error:", err);
        navigate("/dashboard");
      }
    };

    fetchLatestAndRedirect();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center text-white">
      <Loader2 className="w-10 h-10 text-red-500 animate-spin mb-4" />
      <p className="text-gray-400 text-sm font-medium">Opening Builder Workspace...</p>
    </div>
  );
}

export default BuilderPage;
