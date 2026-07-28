import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Loader2, Wand2, Download, AlertCircle, Layout, ArrowLeft } from "lucide-react";
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
      setResume(data.resume || data);
      if (data.resume?.template) setSelectedTemplate(data.resume.template);
    } catch {
      toast.error("Failed to load resume details");
      navigate("/dashboard");
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
        {},
        { withCredentials: true }
      );
      toast.success("Resume rewritten successfully with AI!", { id: "rewrite-toast" });
      setResume(data.resume);
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

  const handleExportPDF = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center text-white">
        <Loader2 className="w-10 h-10 text-red-500 animate-spin mb-4" />
        <p className="text-gray-400 text-sm font-medium">Loading Builder Interface...</p>
      </div>
    );
  }

  if (!resume) return null;

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
            {hasRewrittenData && (
              <button
                onClick={handleExportPDF}
                className="px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10 text-white text-xs font-semibold rounded-xl flex items-center gap-2 transition cursor-pointer"
              >
                <Download className="w-4 h-4 text-gray-400" />
                Export PDF / Print
              </button>
            )}

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
            {hasRewrittenData ? (
              <div className="space-y-6">

                {/* Score & Template Bar */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  
                  {/* ATS Score Ring */}
                  <div className="sm:col-span-1">
                    <ATSScoreRing score={resume.atsScore || 0} />
                  </div>

                  {/* Template Selection */}
                  <div className="sm:col-span-2 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-2xl flex flex-col justify-between">
                    <div>
                      <h3 className="text-gray-300 font-semibold uppercase tracking-wider text-xs mb-3 flex items-center gap-1.5">
                        <Layout className="w-4 h-4 text-red-400" />
                        Select Template
                      </h3>
                      <div className="grid grid-cols-3 gap-2">
                        {["classic", "modern", "minimal"].map((tpl) => (
                          <button
                            key={tpl}
                            onClick={() => handleTemplateChange(tpl)}
                            className={`py-2.5 px-2 rounded-xl text-xs font-semibold border transition-all flex flex-col items-center gap-1 cursor-pointer ${
                              selectedTemplate === tpl
                                ? "border-red-500 bg-red-500/10 text-white"
                                : "border-white/10 bg-black/40 text-gray-400 hover:border-white/20"
                            }`}
                          >
                            <span className="capitalize">{tpl}</span>
                            {tpl !== "classic" && User?.subscription !== "pro" && (
                              <span className="text-[9px] uppercase bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded border border-red-500/20">
                                Pro
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                    <p className="text-[11px] text-gray-500 mt-4 text-center">
                      Pro templates require a PRO membership.
                    </p>
                  </div>

                </div>

                {/* Resume Editor Preview */}
                <ResumeEditor data={resume.rewrittenData} template={selectedTemplate} onTemplateChange={handleTemplateChange} />

              </div>
            ) : (
              <div className="h-full min-h-[450px] border-2 border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center p-10 text-center relative overflow-hidden bg-white/5 backdrop-blur-2xl">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500/20 to-orange-500/10 border border-red-500/20 flex items-center justify-center mb-4 shadow-lg">
                  <Wand2 className="w-8 h-8 text-red-400" />
                </div>
                <h2 className="text-lg font-bold text-white mb-2">AI Resume Preview</h2>
                <p className="text-gray-400 text-xs max-w-sm leading-relaxed">
                  Provide your current resume data and a target job description on the left. AI will analyze the match gap and generate your tailored resume here.
                </p>
              </div>
            )}
          </div>

        </div>

      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default BuilderPage;
