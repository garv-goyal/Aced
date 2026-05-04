import { useState } from "react";

const mock = {
  jobTitle: "Senior Product Manager at Stripe",
  interviewType: "Mixed",
  date: "May 2, 2025",
  overallScore: 78,
  grade: "B",
  gradeLabel: "Good",
  confidenceLevel: "high",
  clarityScore: 82,
  starScore: 74,
  sentimentScore: 79,
  overallFeedback: "You demonstrated a solid command of product strategy and articulated your thinking clearly across most questions. Your STAR structure was present but sometimes incomplete — the 'Result' component was occasionally missing. Strong on vision; sharpen the metrics.",
  strengthPoints: [
    "Clear and structured communication throughout",
    "Strong sense of customer empathy and product intuition",
    "Confidently handled ambiguous trade-off questions",
  ],
  improvementPoints: [
    "Quantify outcomes more explicitly — add numbers to your results",
    "STAR structure broke down in Q3 and Q5",
    "Slow to arrive at the core insight in longer answers",
  ],
  questions: [
    { q: "Tell me about a time you drove alignment across competing stakeholders.", score: 84 },
    { q: "How do you decide what not to build?", score: 71 },
    { q: "Describe a product failure and what you learned.", score: 76 },
  ],
};

export function Newspaper() {
  const [openQ, setOpenQ] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[#faf9f7] font-sans">

      {/* Masthead */}
      <div className="border-b-4 border-black px-8 pt-6 pb-4">
        <div className="flex items-end justify-between mb-3">
          <div style={{ fontFamily: "'Bebas Neue', sans-serif" }} className="text-[36px] tracking-[0.12em] text-black leading-none">
            ACED
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Interview Performance Report</p>
            <p className="text-[10px] text-slate-400">{mock.date}</p>
          </div>
        </div>
        <div className="border-t border-slate-300 pt-2 flex items-center gap-3">
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{mock.interviewType}</span>
          <span className="text-slate-300">·</span>
          <span className="text-[10px] text-slate-500 font-medium flex-1 truncate">{mock.jobTitle}</span>
          <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${
            mock.confidenceLevel === "high" ? "border-emerald-400 text-emerald-700" : "border-amber-400 text-amber-700"
          }`}>{mock.confidenceLevel} confidence</span>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-8 py-8">

        {/* Hero: big score pull-quote */}
        <div className="flex items-start gap-8 pb-8 border-b border-slate-200">
          <div className="shrink-0 text-center border-r border-slate-200 pr-8">
            <div className="text-[72px] font-black text-black leading-none tabular-nums">{mock.overallScore}</div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Score</div>
            <div className="text-3xl font-black text-black mt-2">{mock.grade}</div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{mock.gradeLabel}</div>
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-black text-black leading-tight mb-4 tracking-tight">{mock.jobTitle}</h1>
            <p className="text-sm text-slate-600 leading-relaxed">{mock.overallFeedback}</p>
          </div>
        </div>

        {/* Dimensions — inline row */}
        <div className="py-5 border-b border-slate-200">
          <div className="flex items-center gap-8">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 shrink-0">Dimensions</span>
            {[["Clarity", mock.clarityScore], ["STAR Method", mock.starScore], ["Sentiment", mock.sentimentScore]].map(([label, val]) => (
              <div key={label} className="flex items-center gap-2">
                <span className="text-sm font-bold text-black tabular-nums">{val}</span>
                <span className="text-[11px] text-slate-500">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Two-column: strengths | improvements */}
        <div className="py-8 grid grid-cols-2 gap-8 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-px flex-1 bg-black" />
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-black">Strengths</p>
              <div className="h-px flex-1 bg-black" />
            </div>
            <ul className="space-y-3">
              {mock.strengthPoints.map((p, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-700 leading-snug">
                  <span className="font-black text-black shrink-0 mt-0.5">—</span> {p}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-px flex-1 bg-black" />
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-black">To Improve</p>
              <div className="h-px flex-1 bg-black" />
            </div>
            <ul className="space-y-3">
              {mock.improvementPoints.map((p, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-700 leading-snug">
                  <span className="font-black text-black shrink-0 mt-0.5">→</span> {p}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Questions */}
        <div className="py-8 space-y-0">
          <div className="flex items-center gap-2 mb-6">
            <div className="h-px flex-1 bg-black" />
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-black">Question Breakdown</p>
            <div className="h-px flex-1 bg-black" />
          </div>
          {mock.questions.map((qf, i) => {
            const sc = qf.score;
            const open = openQ === i;
            return (
              <div key={i} className="border-b border-slate-200 last:border-0">
                <button
                  className="w-full flex items-center gap-4 py-4 text-left hover:bg-slate-50 transition-colors"
                  onClick={() => setOpenQ(open ? null : i)}
                >
                  <span className="text-[10px] font-black text-slate-300 tabular-nums shrink-0 w-4">{i + 1}</span>
                  <span className="flex-1 text-sm text-black font-medium leading-snug">{qf.q}</span>
                  <span className="text-xl font-black text-black tabular-nums shrink-0">{sc}</span>
                </button>
              </div>
            );
          })}
        </div>

        <div className="flex justify-center pt-2">
          <button className="border-2 border-black text-black text-sm font-black uppercase tracking-widest px-8 py-3 hover:bg-black hover:text-white transition-colors">
            Practice Again
          </button>
        </div>

      </div>
    </div>
  );
}
