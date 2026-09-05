import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/authContext";
import Header from "./header";
import { Footer } from "./footer";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import {
  FileText,
  Plus,
  Sparkles,
  Trash2,
  Eye,
  Target,
  RefreshCw,
  Award,
  Crown,
  Loader2,
  X,
  Check,
  CheckCircle2,
  BarChart3,
  Calendar,
  Download,
  Search,
  Filter,
  Layers,
  Layout,
  Edit3,
  ExternalLink,
  UploadCloud,
  FileUp,
  Upload,
  Image as ImageIcon,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import ATSScoreRing from "../components/resume/ATSScoreRing";
import KeywordBadges from "../components/resume/KeywordBadges";
import ResumeEditor from "../components/resume/ResumeEditor";
import { API_BASE } from "../lib/axios";


export function DashboardPage() {
  const { User } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [resumes, setResumes] = useState([]);
  const [loadingResumes, setLoadingResumes] = useState(true);

  // Interactive Filter & Search states
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all"); // "all" | "rewritten" | "analyzed" | "draft"

  // Modals & Create state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newRawText, setNewRawText] = useState("");
  const [newJdText, setNewJdText] = useState("");
  const [createSelectedTemplate, setCreateSelectedTemplate] = useState(
    location.state?.selectedTemplate || localStorage.getItem("selectedTemplatePreference") || "classic"
  );

  useEffect(() => {
    if (location.state?.selectedTemplate) {
      setCreateSelectedTemplate(location.state.selectedTemplate);
      localStorage.setItem("selectedTemplatePreference", location.state.selectedTemplate);
    }
  }, [location.state]);
  const [isSubmittingCreate, setIsSubmittingCreate] = useState(false);
  const [isExtractingFile, setIsExtractingFile] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  // + Button file & image attachment state
  const [attachedFileName, setAttachedFileName] = useState("");
  const [attachedFileType, setAttachedFileType] = useState("");
  const [isPlusMenuOpen, setIsPlusMenuOpen] = useState(false);
  const [showDetailsSection, setShowDetailsSection] = useState(true);

  // Selected Resume for Preview / Analyze
  const [activeResume, setActiveResume] = useState(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  // Analyze JD Modal State
  const [isJdModalOpen, setIsJdModalOpen] = useState(false);
  const [jdText, setJdText] = useState("");
  const [isAnalyzingJd, setIsAnalyzingJd] = useState(false);

  // Rewrite Loading State per Resume ID
  const [rewritingId, setRewritingId] = useState(null);

  // Handle local resume file text extraction (PDF, Image, Word)
  const handleExtractFileText = async (file) => {
    if (!file) return;

    const allowedTypes = ["pdf"];
    const ext = file.name.split(".").pop().toLowerCase();
    if (!allowedTypes.includes(ext)) {
      toast.error("Only PDF files (.pdf) are supported");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB");
      return;
    }

    setAttachedFileName(file.name);
    setAttachedFileType(["png", "jpg", "jpeg", "webp"].includes(ext) ? "image" : "document");
    setIsPlusMenuOpen(false);

    const formData = new FormData();
    formData.append("file", file);

    try {
      setIsExtractingFile(true);
      toast.loading("Extracting text from local file using AI OCR...", { id: "extract-toast" });
      const { data } = await axios.post(`${API_BASE}/api/resume/extract-text`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      if (data.text) {
        setNewRawText(data.text);
        if (!newTitle.trim() && data.fileName) {
          const autoTitle = data.fileName.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
          setNewTitle(autoTitle.charAt(0).toUpperCase() + autoTitle.slice(1));
        }
        toast.success("Resume text extracted successfully!", { id: "extract-toast" });
      } else {
        toast.error("Could not extract text from file", { id: "extract-toast" });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to extract text from file", { id: "extract-toast" });
    } finally {
      setIsExtractingFile(false);
    }
  };

  // Fetch all resumes
  const fetchResumes = async () => {
    try {
      setLoadingResumes(true);
      const { data } = await axios.get(`${API_BASE}/api/resume`, {
        withCredentials: true,
      });
      setResumes(data.resumes || []);
    } catch (err) {
      console.error("Error fetching resumes:", err);
      setResumes([]);
    } finally {
      setLoadingResumes(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchResumes();
  }, []);

  // Handle Create Resume
  const handleCreateResume = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      toast.error("Please enter a resume title");
      return;
    }

    try {
      setIsSubmittingCreate(true);
      const { data } = await axios.post(
        `${API_BASE}/api/resume`,
        {
          title: newTitle,
          rawText: newRawText,
          template: createSelectedTemplate,
          jobDescription: newJdText,
        },
        { withCredentials: true }
      );
      toast.success(data.message || "Resume created and AI optimized!");
      setIsCreateModalOpen(false);
      setNewTitle("");
      setNewRawText("");
      setNewJdText("");
      fetchResumes();

      if (data.resume?._id) {
        navigate(`/builder/${data.resume._id}`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create resume");
    } finally {
      setIsSubmittingCreate(false);
    }
  };

  // Handle Delete Resume
  const handleDeleteResume = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this resume?")) return;

    try {
      await axios.delete(`${API_BASE}/api/resume/${id}`, {
        withCredentials: true,
      });
      toast.success("Resume deleted");
      fetchResumes();
      if (activeResume?._id === id) {
        setIsPreviewModalOpen(false);
        setActiveResume(null);
      }
    } catch {
      toast.error("Failed to delete resume");
    }
  };

  // Handle Analyze Job Description
  const handleAnalyzeJD = async () => {
    if (!jdText.trim()) {
      toast.error("Please enter target job description");
      return;
    }
    if (!activeResume) return;

    try {
      setIsAnalyzingJd(true);
      const { data } = await axios.post(
        `${API_BASE}/api/jd/${activeResume._id}/analyze`,
        { jobDescription: jdText },
        { withCredentials: true }
      );
      toast.success("Job Description Analyzed!");
      setIsJdModalOpen(false);
      setJdText("");
      await fetchResumes();
      const updated = resumes.find((r) => r._id === activeResume._id);
      if (updated) {
        setActiveResume({ ...updated, jdAnalysis: data.jdAnalysis, status: "analyzed" });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to analyze JD");
    } finally {
      setIsAnalyzingJd(false);
    }
  };

  // Handle Gemini Resume Rewrite
  const handleRewriteResume = async (resume, e) => {
    if (e) e.stopPropagation();
    try {
      setRewritingId(resume._id);
      toast.loading("AI is optimizing your resume...", { id: "rewrite-toast" });

      const { data } = await axios.post(
        `${API_BASE}/api/resume/${resume._id}/rewrite`,
        {},
        { withCredentials: true }
      );

      toast.success("Resume rewritten with AI & ATS score generated!", {
        id: "rewrite-toast",
      });

      await fetchResumes();
      setActiveResume(data.resume);
      setIsPreviewModalOpen(true);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to rewrite resume", {
        id: "rewrite-toast",
      });
    } finally {
      setRewritingId(null);
    }
  };

  // Status color badge helper
  const getStatusColor = (status) => {
    switch (status) {
      case "rewritten":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "analyzed":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "draft":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      default:
        return "bg-gray-500/10 text-gray-400 border-gray-500/20";
    }
  };

  // Export Resume Helper (Download PDF generated from AI using selected template)
  const handleExportPDF = async (resumeId, title, template, e) => {
    if (e && typeof e.stopPropagation === "function") e.stopPropagation();
    const targetResume = resumes.find((r) => r._id === resumeId) || activeResume;
    const tpl = template || targetResume?.template || createSelectedTemplate || "classic";
    const toastId = toast.loading(`Generating ${tpl.toUpperCase()} Resume PDF...`);
    try {
      const response = await axios.post(
        `${API_BASE}/api/resume/${resumeId}/export-pdf?template=${tpl}`,
        { template: tpl },
        { responseType: "blob", withCredentials: true }
      );

      const dataName = targetResume?.rewrittenData?.name || title || "Resume";
      const fileName = `${dataName.replace(/[^a-z0-9]/gi, "_")}_${tpl}.pdf`;

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success(`${tpl.toUpperCase()} PDF downloaded successfully!`, { id: toastId });
    } catch (err) {
      console.error("PDF download error:", err);
      toast.error("Failed to download PDF", { id: toastId });
    }
  };

  // Stats calculation
  const highestAtsScore = resumes.reduce(
    (max, r) => (r.atsScore > max ? r.atsScore : max),
    0
  );
  const rewrittenCount = resumes.filter((r) => r.status === "rewritten").length;
  const analyzedCount = resumes.filter((r) => r.status === "analyzed").length;
  const draftsCount = resumes.filter((r) => r.status === "draft" || r.status === "new" || !r.status).length;

  // Filtered resumes calculation
  const filteredResumes = resumes.filter((r) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      (r.title || "").toLowerCase().includes(query) ||
      (r.rawText || "").toLowerCase().includes(query);

    if (!matchesSearch) return false;

    if (activeTab === "rewritten") return r.status === "rewritten";
    if (activeTab === "analyzed") return r.status === "analyzed";
    if (activeTab === "draft") return r.status === "draft" || r.status === "new" || !r.status;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col relative overflow-hidden">
      <Toaster position="top-right" />

      {/* Ambient background glow */}
      <div className="absolute w-[700px] h-[700px] bg-red-600/10 blur-[160px] rounded-full top-[-100px] left-[-100px] pointer-events-none" />
      <div className="absolute w-[600px] h-[600px] bg-orange-600/10 blur-[160px] rounded-full bottom-[-100px] right-[-100px] pointer-events-none" />

      {/* Header */}
      <Header />

      {/* Main Interactive Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full z-10">
        
        {/* User Welcome & Banner Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 pb-8 border-b border-white/10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                Welcome back
                {User?.name ? (
                  <>
                    ,{" "}
                    <span className="text-white">
                      {User.name}
                    </span>
                  </>
                ) : null}
              </h1>
              {User?.subscription === "pro" && (
                <span className="px-3 py-1 rounded-full text-xs font-semibold border bg-red-500/10 border-red-500/30 text-red-400">
                  PRO MEMBER
                </span>
              )}
            </div>
            <p className="text-gray-400 text-sm max-w-xl leading-relaxed">
              Manage your tailored resumes, trigger AI optimization, analyze job postings, and maximize your interview callback rate.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                const el = document.getElementById("create-resume-title");
                if (el) {
                  el.scrollIntoView({ behavior: "smooth" });
                  el.focus();
                }
              }}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-red-600 to-orange-500 hover:opacity-90 transition font-semibold text-sm shadow-lg shadow-red-500/20 cursor-pointer transform hover:-translate-y-0.5"
            >
              <Plus className="w-4 h-4" />
              Create New Resume
            </button>
            {User?.subscription !== "pro" && (
              <button
                onClick={() => navigate("/pricing")}
                className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition text-sm font-medium cursor-pointer"
              >
                <Crown className="w-4 h-4 text-orange-400" />
                Upgrade
              </button>
            )}
          </div>
        </div>

        {/* Interactive Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {/* Total Resumes */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 relative overflow-hidden group hover:border-red-500/30 transition duration-300">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Resumes</span>
              <div className="p-2 rounded-xl bg-white/5 border border-white/10 group-hover:bg-red-500/10 transition">
                <FileText className="w-4 h-4 text-red-400" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-white">
              {resumes.length}{" "}
              <span className="text-xs font-normal text-gray-400">
                / {User?.subscription === "pro" ? "∞" : "5"}
              </span>
            </div>
            <div className="mt-3 w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-red-500 to-orange-500 h-full rounded-full transition-all duration-500"
                style={{
                  width: User?.subscription === "pro" ? "100%" : `${(resumes.length / 5) * 100}%`,
                }}
              />
            </div>
          </div>

          {/* Highest ATS Score */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 relative overflow-hidden group hover:border-emerald-500/30 transition duration-300">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Highest ATS Score</span>
              <div className="p-2 rounded-xl bg-white/5 border border-white/10 group-hover:bg-emerald-500/10 transition">
                <Award className="w-4 h-4 text-emerald-400" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-emerald-400">
              {highestAtsScore > 0 ? `${highestAtsScore}%` : "N/A"}
            </div>
            <div className="mt-3 w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${highestAtsScore}%` }}
              />
            </div>
          </div>

          {/* AI Rewrites */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 relative overflow-hidden group hover:border-orange-500/30 transition duration-300">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">AI Rewrites</span>
              <div className="p-2 rounded-xl bg-white/5 border border-white/10 group-hover:bg-orange-500/10 transition">
                <Sparkles className="w-4 h-4 text-orange-400" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-white">{rewrittenCount}</div>
            <p className="text-[11px] text-gray-400 mt-3 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-orange-400" />
              AI Optimized
            </p>
          </div>

          {/* Plan Status */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 relative overflow-hidden group hover:border-yellow-500/30 transition duration-300">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Plan Status</span>
              <div className="p-2 rounded-xl bg-white/5 border border-white/10 group-hover:bg-yellow-500/10 transition">
                <Crown className="w-4 h-4 text-yellow-400" />
              </div>
            </div>
            <div className="text-xl font-extrabold uppercase tracking-tight">
              {User?.subscription === "pro" ? (
                <span className="text-white">
                  CV-Catalyst Pro
                </span>
              ) : (
                <span className="text-white">Free Plan</span>
              )}
            </div>
            {User?.subscription !== "pro" && (
              <button
                onClick={() => navigate("/pricing")}
                className="mt-2 text-xs font-semibold text-orange-400 hover:text-orange-300 transition flex items-center gap-1 cursor-pointer"
              >
                Upgrade to Pro →
              </button>
            )}
          </div>
        </div>

        {/* Create Resume Form Section - Interactive Prompt Bar with '+' PDF Upload & Description */}
        <div id="create-resume-section" className="mb-10 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 pb-4 border-b border-white/10 gap-4">
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-red-400" />
                Create & Optimize Resume
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                Click the <span className="font-bold text-white">+</span> button to add a PDF document, type your prompt, and let AI extract text & optimize your resume.
              </p>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              {/* Selected Template Badge / Selector */}
              <div className="flex items-center bg-white/5 border border-white/15 rounded-full px-3 py-1.5 text-xs font-medium text-gray-200 shadow-sm hover:border-white/30 transition">
                <Layout className="w-3.5 h-3.5 text-red-400 mr-1.5 flex-shrink-0" />
                <span className="text-gray-400 mr-1.5 text-[11px] font-semibold">Template:</span>
                <select
                  value={createSelectedTemplate}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val !== "classic" && User?.subscription !== "pro") {
                      toast.error("Modern & Minimal templates require a Pro subscription");
                      return navigate("/pricing");
                    }
                    setCreateSelectedTemplate(val);
                    localStorage.setItem("selectedTemplatePreference", val);
                    toast.success(`Selected ${val.toUpperCase()} template`);
                  }}
                  className="bg-transparent text-white font-bold capitalize focus:outline-none cursor-pointer text-xs"
                >
                  <option value="classic" className="bg-[#18181b] text-white">Classic (Free)</option>
                  <option value="modern" className="bg-[#18181b] text-white">Modern (Pro)</option>
                  <option value="minimal" className="bg-[#18181b] text-white">Minimal (Pro)</option>
                </select>
              </div>

              <span className="px-3 py-1.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-full text-xs font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Smart AI Extraction</span>
              </span>
            </div>
          </div>

          <form onSubmit={handleCreateResume} className="space-y-6">
            {/* Hidden File Input for Local PDF File */}
            <input
              type="file"
              id="plus-local-file-input"
              accept=".pdf,application/pdf"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleExtractFileText(e.target.files[0]);
                }
              }}
              className="hidden"
              disabled={isExtractingFile}
            />

            {/* Prompt Input Pill Bar */}
            <div className="relative bg-[#18181b] border border-white/20 rounded-full p-2 sm:p-2.5 flex items-center gap-3 shadow-2xl focus-within:border-red-500/50 focus-within:ring-2 focus-within:ring-red-500/20 transition-all">
              
              {/* + (Plus) Button directly triggering PDF File Upload */}
              <button
                type="button"
                onClick={() => document.getElementById("plus-local-file-input")?.click()}
                title="Add PDF document"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer active:scale-95 flex-shrink-0"
              >
                <Plus className="w-5 h-5 text-gray-200" />
              </button>

              {/* Attached PDF Chip Tag */}
              {attachedFileName && (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs text-white whitespace-nowrap animate-in fade-in duration-200">
                  {isExtractingFile ? (
                    <Loader2 className="w-3.5 h-3.5 text-red-400 animate-spin" />
                  ) : (
                    <FileText className="w-3.5 h-3.5 text-red-400" />
                  )}
                  <span className="max-w-[130px] truncate text-gray-200 font-medium">
                    {attachedFileName}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setAttachedFileName("");
                      setAttachedFileType("");
                      setNewRawText("");
                    }}
                    className="p-0.5 rounded-full hover:bg-white/20 text-gray-400 hover:text-white transition"
                    title="Remove attached file"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Main Input Field */}
              <input
                id="create-resume-title"
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Ask anything, enter resume title, or paste prompt..."
                className="flex-1 bg-transparent text-sm text-white placeholder-gray-400 focus:outline-none px-2"
                required
              />

              {/* Toggle Details Section Button */}
              <button
                type="button"
                onClick={() => setShowDetailsSection(!showDetailsSection)}
                title={showDetailsSection ? "Hide Details Section" : "Show Description Section"}
                className={`p-2 rounded-full text-gray-400 hover:text-white transition cursor-pointer ${
                  showDetailsSection ? "bg-white/10 text-white" : ""
                }`}
              >
                {showDetailsSection ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>

              {/* Submit Create Button */}
              <button
                type="submit"
                disabled={isSubmittingCreate || isExtractingFile}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 hover:opacity-90 transition font-semibold text-xs text-white shadow-lg disabled:opacity-50 cursor-pointer whitespace-nowrap"
              >
                {isSubmittingCreate ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>{newJdText.trim() ? "AI Optimize" : "Create"}</span>
                  </>
                )}
              </button>
            </div>

            {/* Description & Job Details Section */}
            {showDetailsSection && (
              <div className="space-y-5 pt-2 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Target Job Description */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider flex items-center justify-between">
                      <span>Target Job Description (Optional)</span>
                      <span className="text-[10px] text-orange-400 font-normal">For AI Optimization & Correction</span>
                    </label>
                    <textarea
                      value={newJdText}
                      onChange={(e) => setNewJdText(e.target.value)}
                      placeholder="Paste target job title, required skills, responsibilities..."
                      className="w-full h-28 bg-black/40 border border-white/10 rounded-2xl p-3.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-orange-500/50 resize-none transition"
                    />
                  </div>

                  {/* Extracted / Raw Resume Content */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider flex items-center justify-between">
                      <span>Description / Raw Resume Content</span>
                      <span className="text-[10px] text-gray-400 font-normal">Auto-extracted from local file/image</span>
                    </label>
                    <textarea
                      value={newRawText}
                      onChange={(e) => setNewRawText(e.target.value)}
                      placeholder="Extracted work experience, skills, education, summary..."
                      className="w-full h-28 bg-black/40 border border-white/10 rounded-2xl p-3.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-red-500/50 resize-none transition"
                    />
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t border-white/10">
                  <div className="text-[11px] text-gray-400">
                    {newJdText.trim() ? (
                      <span className="text-orange-400 flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 inline" /> AI will optimize & align resume content for target JD
                      </span>
                    ) : (
                      <span>Tip: Click '+' on the input bar to attach a local document or image to extract text</span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        setNewTitle("");
                        setNewRawText("");
                        setNewJdText("");
                        setAttachedFileName("");
                        setAttachedFileType("");
                      }}
                      className="px-4 py-2 rounded-xl border border-white/10 hover:bg-white/10 text-xs font-semibold text-gray-300 transition cursor-pointer"
                    >
                      Clear Form
                    </button>
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Search & Category Filter Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4">
          
          {/* Real-time Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search resumes by title or content..."
              className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-9 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-red-500/50 transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-2.5 p-0.5 text-gray-400 hover:text-white transition"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {[
              { id: "all", label: "All Resumes", count: resumes.length },
              { id: "rewritten", label: "ATS Optimized", count: rewrittenCount },
              { id: "analyzed", label: "JD Analyzed", count: analyzedCount },
              { id: "draft", label: "Drafts", count: draftsCount },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-red-600 to-orange-500 text-white shadow-md"
                    : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                    activeTab === tab.id
                      ? "bg-white/20 text-white"
                      : "bg-white/10 text-gray-400"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Resumes Grid */}
        <div className="mb-12">
          {loadingResumes ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white/5 border border-white/10 rounded-3xl">
              <Loader2 className="w-8 h-8 text-red-500 animate-spin mb-3" />
              <p className="text-gray-400 text-sm font-medium">Loading your resumes...</p>
            </div>
          ) : filteredResumes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-6 bg-white/5 border border-white/10 rounded-3xl text-center">
              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                <FileText className="w-8 h-8 text-gray-500" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                {searchQuery ? "No matching resumes found" : "No resumes found"}
              </h3>
              <p className="text-gray-400 text-xs max-w-sm">
                {searchQuery
                  ? `No resumes matched "${searchQuery}". Try clearing your search query.`
                  : "Create your first resume draft or upload plain text to start optimizing with AI."}
              </p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="mt-6 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition cursor-pointer"
                >
                  Clear Search
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResumes.map((resume) => (
                <div
                  key={resume._id}
                  onClick={() => {
                    setActiveResume(resume);
                    setIsPreviewModalOpen(true);
                  }}
                  className="group bg-white/5 hover:bg-white/[0.08] border border-white/10 hover:border-red-500/40 rounded-3xl p-6 transition-all duration-300 cursor-pointer relative flex flex-col justify-between shadow-xl transform hover:-translate-y-1.5"
                >
                  <div>
                    {/* Top Status & ATS Score Header */}
                    <div className="flex items-center justify-between mb-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${getStatusColor(
                          resume.status
                        )} uppercase tracking-wider`}
                      >
                        {resume.status || "draft"}
                      </span>

                      <div className="flex items-center gap-2">
                        {resume.atsScore > 0 && (
                          <div className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                            <Award className="w-3.5 h-3.5" />
                            <span>{resume.atsScore}% ATS</span>
                          </div>
                        )}
                        <span className="text-[11px] text-gray-500 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(resume.updatedAt || Date.now()).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* Resume Title */}
                    <h3 className="text-lg font-bold text-white group-hover:text-red-400 transition-colors mb-2 line-clamp-1 flex items-center justify-between">
                      <span>{resume.title || "Untitled Resume"}</span>
                      <Eye className="w-4 h-4 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h3>

                    {/* Content Preview */}
                    <p className="text-gray-400 text-xs line-clamp-2 leading-relaxed mb-6">
                      {resume.rawText || "No text content provided yet."}
                    </p>

                    {/* Score Bar Indicator */}
                    {resume.atsScore > 0 ? (
                      <div className="mb-6">
                        <div className="flex items-center justify-between text-[11px] text-gray-400 mb-1">
                          <span>ATS Match Rate</span>
                          <span className="font-bold text-emerald-400">{resume.atsScore}%</span>
                        </div>
                        <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500"
                            style={{ width: `${resume.atsScore}%` }}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="mb-6 py-1.5 px-3 rounded-xl bg-white/5 border border-white/5 text-[11px] text-gray-500 italic">
                        Not yet ATS optimized
                      </div>
                    )}
                  </div>

                  {/* Interactive Actions Footer Toolbar */}
                  <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      {/* Analyze JD Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveResume(resume);
                          setIsJdModalOpen(true);
                        }}
                        title="Analyze Job Description"
                        className="p-2 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-orange-400 transition cursor-pointer"
                      >
                        <Target className="w-4 h-4" />
                      </button>

                      {/* AI Rewrite Button */}
                      <button
                        onClick={(e) => handleRewriteResume(resume, e)}
                        disabled={rewritingId === resume._id}
                        title="AI Rewrite"
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-gradient-to-r from-red-600 to-orange-500 hover:opacity-90 transition text-xs font-semibold text-white shadow-md disabled:opacity-50 cursor-pointer"
                      >
                        {rewritingId === resume._id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <>
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>AI Rewrite</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="flex items-center gap-1">
                      {/* Open in Builder */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/builder/${resume._id}`);
                        }}
                        title="Edit in Builder"
                        className="p-2 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-gray-300 hover:text-white transition cursor-pointer"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      {/* Download PDF if rewritten */}
                      {resume.status === "rewritten" && (
                        <button
                          onClick={(e) => handleExportPDF(resume._id, resume.title, e)}
                          title="Export PDF"
                          className="p-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-400 transition cursor-pointer"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      )}

                      {/* Delete Resume */}
                      <button
                        onClick={(e) => handleDeleteResume(resume._id, e)}
                        title="Delete Resume"
                        className="p-2 rounded-xl text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </main>

      {/* Footer */}
      <Footer />



      {/* ───────────────────────────────────────────── */}
      {/* 2. ANALYZE JD MODAL */}
      {/* ───────────────────────────────────────────── */}
      {isJdModalOpen && activeResume && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="relative w-full max-w-xl bg-[#0a0a0f] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl">
            <button
              onClick={() => setIsJdModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
              <Target className="w-5 h-5 text-orange-400" />
              Target Job Description Match
            </h3>
            <p className="text-xs text-gray-400 mb-6">
              Paste the target job description to extract required skills and tone using AI.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase">
                  Job Description Text
                </label>
                <textarea
                  value={jdText}
                  onChange={(e) => setJdText(e.target.value)}
                  placeholder="Paste responsibilities, qualifications, tech stack..."
                  className="w-full h-44 bg-black/40 border border-white/10 rounded-xl p-4 text-xs text-white focus:outline-none focus:border-orange-500/50 resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsJdModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-400 hover:text-white transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAnalyzeJD}
                  disabled={isAnalyzingJd || !jdText.trim()}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 hover:opacity-90 transition font-semibold text-xs text-white shadow-lg disabled:opacity-50 cursor-pointer"
                >
                  {isAnalyzingJd ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Analyze with AI
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────── */}
      {/* 3. RESUME PREVIEW & REWRITE MODAL */}
      {/* ───────────────────────────────────────────── */}
      {isPreviewModalOpen && activeResume && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-5xl bg-[#0a0a0f] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl my-auto max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setIsPreviewModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition z-10"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-white/10">
              <div>
                <h3 className="text-2xl font-bold text-white line-clamp-1">
                  {activeResume.title || "Resume Details"}
                </h3>
                <p className="text-xs text-gray-400 mt-1">Status: {(activeResume.status || "draft").toUpperCase()}</p>
              </div>

              <div className="flex items-center gap-3">
                {/* Download PDF Button */}
                <button
                  onClick={(e) =>
                    handleExportPDF(
                      activeResume._id,
                      activeResume.title,
                      activeResume.template || createSelectedTemplate || "classic",
                      e
                    )
                  }
                  title="Download PDF in selected template"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:opacity-90 text-xs font-bold text-white transition shadow-lg cursor-pointer active:scale-95"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </button>

                <button
                  onClick={() => {
                    setIsPreviewModalOpen(false);
                    setIsJdModalOpen(true);
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-semibold text-gray-300 transition cursor-pointer"
                >
                  <Target className="w-3.5 h-3.5 text-orange-400" />
                  Analyze JD
                </button>

                <button
                  onClick={() => handleRewriteResume(activeResume)}
                  disabled={rewritingId === activeResume._id}
                  className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-red-600 to-orange-500 hover:opacity-90 text-xs font-semibold text-white transition shadow-lg disabled:opacity-50 cursor-pointer"
                >
                  {rewritingId === activeResume._id ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      AI Rewrite
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Body Sections Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Sidebar: ATS Score & Keywords */}
              <div className="lg:col-span-1 space-y-6">
                <ATSScoreRing score={activeResume.atsScore || 0} />
                {activeResume.jdAnalysis && (
                  <KeywordBadges analysis={activeResume.jdAnalysis} />
                )}
              </div>

              {/* Main Content: Resume Preview */}
              <div className="lg:col-span-2 space-y-6">
                {activeResume.rewrittenData && Object.keys(activeResume.rewrittenData).length > 0 ? (
                  <ResumeEditor data={activeResume.rewrittenData} template={activeResume.template || "classic"} />
                ) : (
                  <div className="bg-white/5 border border-white/10 rounded-3xl p-6 text-gray-300 text-xs leading-relaxed">
                    <h4 className="text-sm font-bold text-white mb-2">Raw Resume Text:</h4>
                    <p className="whitespace-pre-wrap">{activeResume.rawText || "No text available."}</p>
                  </div>
                )}
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default DashboardPage;
