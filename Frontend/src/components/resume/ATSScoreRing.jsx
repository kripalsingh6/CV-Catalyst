import { useEffect, useState } from 'react';
import { Sparkles, CheckCircle2, AlertTriangle, XCircle, Target } from 'lucide-react';

const ATSScoreRing = ({ score = 0 }) => {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    let start = 0;
    const target = Math.min(100, Math.max(0, Number(score) || 0));
    const duration = 1200;
    const stepTime = 16;
    const steps = duration / stepTime;
    const increment = target / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setAnimatedScore(target);
        clearInterval(timer);
      } else {
        setAnimatedScore(Math.ceil(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [score]);

  // Design config based on score tier
  const getTier = (s) => {
    if (s >= 80) {
      return {
        gradientId: "ats-emerald-grad",
        gradientStart: "#10b981",
        gradientEnd: "#14b8a6",
        textGradient: "from-emerald-400 to-teal-300",
        badgeBg: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
        badgeText: "Strong Match",
        icon: CheckCircle2,
        iconColor: "text-emerald-400",
        message: "Excellent! Your resume highly aligns with ATS filters and key job requirements.",
        glowBg: "bg-emerald-500/15"
      };
    }
    if (s >= 60) {
      return {
        gradientId: "ats-amber-grad",
        gradientStart: "#f59e0b",
        gradientEnd: "#f97316",
        textGradient: "from-amber-400 to-orange-400",
        badgeBg: "bg-amber-500/10 border-amber-500/20 text-amber-400",
        badgeText: "Moderate Match",
        icon: AlertTriangle,
        iconColor: "text-amber-400",
        message: "Good foundation. Add a few more missing must-have keywords to improve your score.",
        glowBg: "bg-amber-500/15"
      };
    }
    return {
      gradientId: "ats-red-grad",
      gradientStart: "#ef4444",
      gradientEnd: "#f43f5e",
      textGradient: "from-red-500 to-rose-400",
      badgeBg: "bg-red-500/10 border-red-500/20 text-red-400",
      badgeText: "Low Match",
      icon: XCircle,
      iconColor: "text-red-400",
      message: "Needs improvement. Core required skills are missing from your resume.",
      glowBg: "bg-red-500/15"
    };
  };

  const tier = getTier(score);
  const StatusIcon = tier.icon;

  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  return (
    <div className="relative w-full max-w-sm bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-2xl overflow-hidden transition-all duration-300 hover:border-white/20">
      
      {/* Background ambient glow matching theme */}
      <div className={`absolute -top-12 -right-12 w-40 h-40 ${tier.glowBg} blur-3xl rounded-full pointer-events-none transition-all duration-500`} />
      <div className="absolute -bottom-10 -left-10 w-36 h-36 bg-red-600/10 blur-3xl rounded-full pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between mb-6 z-10 relative">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-white/5 border border-white/10 text-gray-300">
            <Target className="w-4 h-4 text-red-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wide">ATS Compatibility</h3>
            <p className="text-[11px] text-gray-400">Match score vs target Job Description</p>
          </div>
        </div>

        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-[11px] font-medium backdrop-blur-md ${tier.badgeBg}`}>
          <Sparkles className="w-3 h-3" />
          <span>{tier.badgeText}</span>
        </div>
      </div>

      {/* Score Ring Section */}
      <div className="flex flex-col items-center justify-center my-2 relative z-10">
        <div className="relative w-36 h-36 flex items-center justify-center">
          
          <svg className="w-full h-full transform -rotate-90 absolute inset-0">
            <defs>
              <linearGradient id={tier.gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={tier.gradientStart} />
                <stop offset="100%" stopColor={tier.gradientEnd} />
              </linearGradient>
            </defs>

            {/* Track Circle */}
            <circle
              cx="72"
              cy="72"
              r={radius}
              stroke="currentColor"
              strokeWidth="10"
              fill="transparent"
              className="text-white/5"
            />

            {/* Progress Circle */}
            <circle
              cx="72"
              cy="72"
              r={radius}
              stroke={`url(#${tier.gradientId})`}
              strokeWidth="10"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-300 ease-out drop-shadow-[0_0_10px_rgba(239,68,68,0.35)]"
            />
          </svg>

          {/* Inner Content */}
          <div className="flex flex-col items-center justify-center text-center z-10">
            <span className={`text-4xl font-extrabold bg-gradient-to-r ${tier.textGradient} bg-clip-text text-transparent tracking-tight`}>
              {animatedScore}
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 -mt-0.5">
              out of 100
            </span>
          </div>
        </div>
      </div>

      {/* Status Box */}
      <div className="mt-6 pt-4 border-t border-white/10 flex items-start gap-3 z-10 relative">
        <StatusIcon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${tier.iconColor}`} />
        <p className="text-xs text-gray-300 leading-relaxed font-normal">
          {tier.message}
        </p>
      </div>

    </div>
  );
};

export default ATSScoreRing;
