import { Tag, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

const KeywordBadges = ({ analysis }) => {
  if (!analysis) return null;

  const { mustHave = [], keywords = [], niceToHave = [], tone } = analysis;

  return (
    <div className="relative w-full bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-2xl overflow-hidden transition-all duration-300 mt-6">
      
      {/* Background ambient glow */}
      <div className="absolute -top-12 -right-12 w-44 h-44 bg-emerald-500/10 blur-3xl rounded-full pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 z-10 relative border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg">
            <Tag className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">Extracted Keywords & Skills</h3>
            <p className="text-xs text-gray-400">AI extracted requirements</p>
          </div>
        </div>

        {tone && (
          <div className="bg-black/40 border border-white/10 px-3 py-1.5 rounded-xl flex items-center gap-2 self-start sm:self-auto">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[11px] text-gray-400 font-medium">Tone:</span>
            <span className="text-xs text-emerald-400 font-semibold capitalize">{tone}</span>
          </div>
        )}
      </div>

      <div className="space-y-6 z-10 relative">
        {/* Must Haves */}
        {mustHave.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold text-rose-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400" />
              Non-Negotiable Requirements
            </h4>
            <div className="flex flex-wrap gap-2">
              {mustHave.map((kw, i) => (
                <span 
                  key={i} 
                  className="px-3 py-1.5 bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs rounded-xl font-medium shadow-sm backdrop-blur-md"
                >
                  {kw}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Core Keywords */}
        {keywords.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Core Competencies
            </h4>
            <div className="flex flex-wrap gap-2">
              {keywords.map((kw, i) => (
                <span 
                  key={i} 
                  className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs rounded-xl font-medium shadow-sm backdrop-blur-md"
                >
                  {kw}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Nice to have */}
        {niceToHave.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Bonus Skills (Nice to Have)
            </h4>
            <div className="flex flex-wrap gap-2">
              {niceToHave.map((kw, i) => (
                <span 
                  key={i} 
                  className="px-3 py-1.5 bg-white/5 border border-white/10 text-gray-300 text-xs rounded-xl font-medium shadow-sm"
                >
                  {kw}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default KeywordBadges;
