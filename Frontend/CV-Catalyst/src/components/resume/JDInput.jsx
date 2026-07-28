import { useState } from 'react';
import { Briefcase, Loader2, Sparkles, Target } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../lib/axios';

const JDInput = ({ resumeId, onAnalysisComplete, initialJd }) => {
  const [jobDescription, setJobDescription] = useState(initialJd || '');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

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
      onAnalysisComplete(data.jdAnalysis);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to analyze Job Description');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="relative w-full bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 mt-6">
      
      {/* Ambient background glow */}
      <div className="absolute -top-10 -right-10 w-48 h-48 bg-orange-500/10 blur-3xl rounded-full pointer-events-none" />

      {/* Header */}
      <div className="border-b border-white/10 bg-white/5 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-lg">
            <Briefcase className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">Step 2: Target Job Description</h3>
            <p className="text-xs text-gray-400">Extract skills, requirements & tone</p>
          </div>
        </div>

        <div className="px-3 py-1 bg-red-500/10 text-red-400 border border-red-500/20 rounded-full text-[11px] font-semibold flex items-center gap-1.5 backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI Engine</span>
        </div>
      </div>

      {/* Body */}
      <div className="p-6">
        <div className="mb-4 flex items-start gap-3 text-xs text-gray-300 bg-black/40 p-4 rounded-2xl border border-white/10">
          <Target className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            Paste the full job description below. AI will analyze non-negotiable requirements, key competencies, and role tone to optimize your resume score.
          </p>
        </div>

        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste target Job Description here (responsibilities, qualifications, tech stack, etc)..."
          className="w-full h-[240px] bg-black/40 border border-white/10 rounded-2xl p-4 text-gray-200 focus:outline-none focus:border-red-500/50 resize-none font-sans text-xs leading-relaxed placeholder-gray-500"
          disabled={isAnalyzing}
        />

        <div className="mt-6 flex justify-end">
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing || !jobDescription.trim()}
            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-orange-500 to-red-500 hover:opacity-90 text-white text-xs font-semibold rounded-xl transition disabled:opacity-50 shadow-lg shadow-red-500/20"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Analyzing Keywords...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Analyze Job Description
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default JDInput;
