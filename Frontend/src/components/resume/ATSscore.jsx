import { useEffect, useState } from 'react';

const ATSScoreRing = ({ score }) => {
    const [animatedScore, setAnimatedScore] = useState(0);

    useEffect(() => {
        let start = 0;
        const duration = 1500;
        const increment = score / (duration / 16);

        const animate = () => {
            start += increment;
            if (start < score) {
                setAnimatedScore(Math.ceil(start));
                requestAnimationFrame(animate);
            } else {
                setAnimatedScore(score);
            }
        };

        requestAnimationFrame(animate);
    }, [score]);

    // Determine color based on score
    let colorClass = "text-rose-500"; // < 60
    let strokeClass = "stroke-rose-500";
    if (score >= 80) {
        colorClass = "text-emerald-500";
        strokeClass = "stroke-emerald-500";
    } else if (score >= 60) {
        colorClass = "text-amber-500";
        strokeClass = "stroke-amber-500";
    }

    const radius = 45;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

    return (
        <div className="flex flex-col items-center justify-center p-6 bg-[#12121A] border border-white/5 rounded-2xl shadow-xl relative">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-[40px] pointer-events-none"></div>

            <h3 className="text-gray-400 font-bold uppercase tracking-widest text-xs mb-4">ATS Match Score</h3>

            <div className="relative w-32 h-32 flex items-center justify-center">
                {/* Background circle */}
                <svg className="w-full h-full transform -rotate-90 absolute">
                    <circle
                        cx="64"
                        cy="64"
                        r={radius}
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        className="text-white/5"
                    />
                    {/* Progress circle */}
                    <circle
                        cx="64"
                        cy="64"
                        r={radius}
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        className={`${strokeClass} transition-all duration-75 ease-out drop-shadow-[0_0_8px_currentColor]`}
                    />
                </svg>

                <div className="flex flex-col items-center z-10">
                    <span className={`text-4xl font-black ${colorClass}`}>{animatedScore}</span>
                    <span className="text-gray-500 text-xs font-bold -mt-1">/ 100</span>
                </div>
            </div>

            <p className="text-sm text-gray-400 mt-4 text-center">
                {score >= 80
                    ? "Excellent! High likelihood of passing ATS filters."
                    : score >= 60
                        ? "Good start. Add a few more target keywords to improve."
                        : "Needs work. Missing several non-negotiable requirements."}
            </p>
        </div>
    );
};

export default ATSScoreRing;