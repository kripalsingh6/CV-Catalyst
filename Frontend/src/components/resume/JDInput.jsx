import { useState } from 'react';
import {
  Briefcase,
  Loader2,
  Sparkles,
  Target,
  FileCode,
  Copy,
  Check,
  Download,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../lib/axios';
import {
  cleanLatexToPlainText,
  generateLatexFromResume,
  SAMPLE_OVERLEAF_TEX
} from '../../utils/latexHelper';

const JDInput = ({
  resumeId,
  onAnalysisComplete,
  initialJd,
  resume,
  onResumeUpdated
}) => {
  const [mode, setMode] = useState('jd'); // 'jd' | 'latex'
  const [jobDescription, setJobDescription] = useState(initialJd || '');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Overleaf / LaTeX state
  const [overleafText, setOverleafText] = useState('');
  const [isGeneratingOverleaf, setIsGeneratingOverleaf] = useState(false);
  const [hasCopied, setHasCopied] = useState(false);

  // Analyze Job Description Handler
  const handleAnalyze = async () => {
    if (!jobDescription.trim()) {
      toast.error('Please paste the target Job Description');
      return;
    }

    if (jobDescription.length < 50) {
      toast.error('Job Description seems too short. Please provide more detail.');
      return;
    }

    setIsAnalyzing(true);
    try {
      const { data } = await api.post(`/jd/${resumeId}/analyze`, { jobDescription });
      toast.success('Job Description Analyzed Successfully!');
      if (typeof onAnalysisComplete === 'function') {
        onAnalysisComplete(data.jdAnalysis);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to analyze Job Description');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Generate Resume from Overleaf LaTeX code & redirect to Overleaf with copied text
  const handleGenerateFromOverleaf = async () => {
    const textToCopy = overleafText.trim() || generateLatexFromResume(resume?.rewrittenData || resume || {});

    if (!textToCopy) {
      toast.error('Please paste your Overleaf LaTeX (.tex) code or load a sample first');
      return;
    }

    // 1. Copy LaTeX code to clipboard
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(textToCopy);
      } else {
        const tempText = document.createElement('textarea');
        tempText.value = textToCopy;
        document.body.appendChild(tempText);
        tempText.select();
        document.execCommand('copy');
        document.body.removeChild(tempText);
      }
      toast.success('LaTeX code copied to clipboard! Opening Overleaf...', { duration: 3000 });
    } catch (clipErr) {
      console.warn('Clipboard write warning:', clipErr);
    }

    // 2. Redirect to Overleaf project dashboard in new tab
    const overleafWindow = window.open('https://www.overleaf.com/project', '_blank', 'noopener,noreferrer');
    if (!overleafWindow) {
      // Fallback if popup blocker intercepted
      window.location.href = 'https://www.overleaf.com/project';
    }

    // 3. Extract and update resume in CV-Catalyst if overleafText was provided
    if (!overleafText.trim()) return;

    const cleanedText = cleanLatexToPlainText(overleafText);
    if (!cleanedText || cleanedText.length < 30) {
      return;
    }

    setIsGeneratingOverleaf(true);
    const toastId = toast.loading('Extracting & generating resume from Overleaf LaTeX...');

    try {
      // 1. Save extracted plain text to resume rawText
      await api.post(`/resume/${resumeId}/upload-raw`, { rawText: cleanedText });

      // 2. Analyze job description if present
      if (jobDescription && jobDescription.trim().length > 20) {
        try {
          const jdRes = await api.post(`/jd/${resumeId}/analyze`, { jobDescription: jobDescription.trim() });
          if (typeof onAnalysisComplete === 'function' && jdRes.data?.jdAnalysis) {
            onAnalysisComplete(jdRes.data.jdAnalysis);
          }
        } catch (jdErr) {
          console.warn('JD analysis note:', jdErr.message);
        }
      }

      // 3. Trigger AI rewrite
      const rewriteRes = await api.post(`/resume/${resumeId}/rewrite`, {
        template: resume?.template || 'classic',
        rawText: cleanedText,
        jobDescription: jobDescription || resume?.jobDescription || '',
      });

      if (rewriteRes.data?.resume) {
        if (typeof onResumeUpdated === 'function') {
          onResumeUpdated(rewriteRes.data.resume);
        }
        toast.success('Resume generated from Overleaf LaTeX successfully!', { id: toastId });
      } else {
        toast.success('Overleaf text extracted and resume updated!', { id: toastId });
      }
    } catch (err) {
      console.error('Overleaf generation error:', err);
      toast.error(err.response?.data?.message || 'Failed to generate resume from Overleaf text', { id: toastId });
    } finally {
      setIsGeneratingOverleaf(false);
    }
  };

  // Load sample Overleaf code into textarea
  const handleLoadSample = () => {
    setOverleafText(SAMPLE_OVERLEAF_TEX);
    toast.success('Loaded 1-page sample Overleaf LaTeX template');
  };

  // Copy current resume as Overleaf LaTeX code
  const handleCopyCurrentResumeAsTex = () => {
    const resumeData = resume?.rewrittenData || resume || {};
    const texCode = generateLatexFromResume(resumeData);
    navigator.clipboard.writeText(texCode);
    setHasCopied(true);
    toast.success('1-Page Overleaf (.tex) code copied to clipboard!');
    setTimeout(() => setHasCopied(false), 2500);
  };

  // Download .tex file
  const handleDownloadTexFile = () => {
    const resumeData = resume?.rewrittenData || resume || {};
    const texCode = overleafText.trim() ? overleafText : generateLatexFromResume(resumeData);
    const blob = new Blob([texCode], { type: 'text/x-tex;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const title = (resume?.title || resumeData.name || 'resume').replace(/[^a-z0-9]/gi, '_');
    link.href = url;
    link.setAttribute('download', `${title}_overleaf.tex`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('Downloaded Overleaf .tex file!');
  };

  const tabs = [
    { key: 'jd', label: 'Target JD', icon: Target },
    { key: 'latex', label: 'Overleaf LaTeX', icon: FileCode },
  ];

  return (
    <div className="bg-[#12121A] border border-white/5 rounded-2xl overflow-hidden shadow-xl mt-6">
      {/* Header matching other components */}
      <div className="border-b border-white/5 bg-[#1A1A24] px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <h3 className="text-lg font-bold text-white flex items-center">
          <Briefcase className="w-5 h-5 mr-2 text-orange-400" />
          Step 2: Target Job Description &amp; LaTeX
        </h3>
        <div className="flex bg-[#0A0A0F] rounded-lg p-1 border border-white/5">
          {tabs.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setMode(key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                mode === key
                  ? 'bg-gradient-to-r from-red-600 to-orange-500 text-white shadow-md shadow-red-500/20 font-semibold'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6">
        {/* ── MODE 1: TARGET JOB DESCRIPTION ── */}
        {mode === 'jd' && (
          <div>
            <div className="mb-4 flex items-start gap-3 text-xs text-gray-300 bg-[#0A0A0F] p-4 rounded-xl border border-white/5">
              <Target className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                Paste the full target job description below. AI extracts keywords, key competencies, and role tone to optimize your resume score.
              </p>
            </div>

            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste target Job Description here (responsibilities, qualifications, tech stack, etc)..."
              className="w-full h-[180px] bg-[#0A0A0F] border border-white/10 rounded-xl p-4 text-gray-200 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20 resize-none font-sans text-xs leading-relaxed placeholder-gray-500 transition selection:bg-orange-500/30 selection:text-white"
              disabled={isAnalyzing}
            />

            <div className="mt-4 flex justify-end">
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing || !jobDescription.trim()}
                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-red-600 to-orange-500 hover:opacity-90 text-white text-xs font-semibold rounded-xl transition disabled:opacity-50 shadow-lg shadow-red-500/20 cursor-pointer active:scale-95"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    Analyzing Keywords...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-white" />
                    Analyze Job Description
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* ── MODE 2: OVERLEAF / LATEX ── */}
        {mode === 'latex' && (
          <div>
            <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#0A0A0F] p-3.5 rounded-xl border border-white/5">
              <div className="flex items-center gap-2.5">
                <FileCode className="w-4 h-4 text-orange-400 flex-shrink-0" />
                <p className="text-xs text-gray-300">
                  Paste Overleaf <span className="font-mono text-orange-400 font-semibold">.tex</span> code to generate resume, or export 1-page LaTeX.
                </p>
              </div>

              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  type="button"
                  onClick={handleLoadSample}
                  className="px-2.5 py-1 text-[11px] font-medium bg-[#1A1A24] hover:bg-orange-500/10 text-gray-300 hover:text-orange-300 rounded-lg border border-white/10 hover:border-orange-500/30 transition cursor-pointer flex items-center gap-1"
                  title="Load sample 1-page Overleaf template"
                >
                  <RefreshCw className="w-3 h-3 text-orange-400" />
                  Load Sample
                </button>

                <button
                  type="button"
                  onClick={handleCopyCurrentResumeAsTex}
                  className="px-2.5 py-1 text-[11px] font-medium bg-orange-500/10 hover:bg-orange-500/20 text-orange-300 hover:text-orange-200 rounded-lg border border-orange-500/20 transition cursor-pointer flex items-center gap-1 shadow-sm"
                  title="Generate and copy 1-page Overleaf .tex code from current resume"
                >
                  {hasCopied ? (
                    <>
                      <Check className="w-3 h-3 text-orange-400" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 text-orange-400" />
                      Copy .tex
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const textToCopy = overleafText.trim() || generateLatexFromResume(resume?.rewrittenData || resume || {});
                    if (textToCopy) {
                      navigator.clipboard.writeText(textToCopy);
                      toast.success('LaTeX code copied to clipboard! Opening Overleaf...', { duration: 3000 });
                    }
                    window.open('https://www.overleaf.com/project', '_blank', 'noopener,noreferrer');
                  }}
                  className="px-2.5 py-1 text-[11px] font-medium bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 hover:text-emerald-200 rounded-lg border border-emerald-500/20 transition cursor-pointer flex items-center gap-1 shadow-sm"
                  title="Copy LaTeX code and open Overleaf project dashboard"
                >
                  <ExternalLink className="w-3 h-3 text-emerald-400" />
                  Overleaf
                </button>

                <button
                  type="button"
                  onClick={handleDownloadTexFile}
                  className="p-1.5 text-gray-400 hover:text-orange-400 bg-[#1A1A24] hover:bg-orange-500/10 rounded-lg border border-white/10 hover:border-orange-500/30 transition cursor-pointer"
                  title="Download as .tex file"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>

                {overleafText && (
                  <button
                    type="button"
                    onClick={() => setOverleafText('')}
                    className="px-2 py-1 text-[11px] text-gray-400 hover:text-rose-400 bg-[#1A1A24] hover:bg-rose-500/10 rounded-lg border border-white/10 transition cursor-pointer"
                    title="Clear text"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            <div className="relative">
              <textarea
                value={overleafText}
                onChange={(e) => setOverleafText(e.target.value)}
                placeholder={`% Paste your Overleaf LaTeX code here...\n\\documentclass[letterpaper,10pt]{article}\n\\begin{document}\n\\section{Education}\n...\n\\end{document}`}
                className="w-full h-[220px] bg-[#0A0A0F] border border-white/10 focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20 rounded-xl p-4 text-orange-200/90 focus:outline-none resize-none font-mono text-[11px] leading-relaxed placeholder-gray-600 transition selection:bg-orange-500/30 selection:text-white"
                disabled={isGeneratingOverleaf}
              />
              {overleafText && (
                <div className="absolute bottom-3 right-3 text-[10px] text-orange-400/90 font-mono bg-black/80 px-2.5 py-1 rounded-lg border border-orange-500/20 pointer-events-none shadow-md">
                  {overleafText.split('\n').length} lines • {overleafText.length} chars
                </div>
              )}
            </div>

            <div className="mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <span className="text-[11px] text-gray-400">
                Converts LaTeX structure into an ATS-optimized 1-page resume
              </span>
              <button
                onClick={handleGenerateFromOverleaf}
                disabled={isGeneratingOverleaf || !overleafText.trim()}
                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-red-600 to-orange-500 hover:opacity-90 text-white text-xs font-semibold rounded-xl transition disabled:opacity-50 shadow-lg shadow-red-500/20 cursor-pointer active:scale-95"
              >
                {isGeneratingOverleaf ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    Generating Resume...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-white" />
                    Generate Resume from LaTeX
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JDInput;
