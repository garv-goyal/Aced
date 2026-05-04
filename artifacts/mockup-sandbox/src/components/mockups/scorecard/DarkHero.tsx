import { useState } from "react";

const mock = {
  jobTitle: "Senior Product Manager at Stripe",
  interviewType: "🎯 Mixed",
  date: "May 2, 2025 · 3:41 PM",
  overallScore: 78,
  grade: "B",
  gradeLabel: "Good",
  confidenceLevel: "high",
  clarityScore: 82,
  starScore: 74,
  sentimentScore: 79,
  overallFeedback: "You demonstrated a solid command of product strategy and articulated your thinking clearly across most questions. Your STAR structure was present but sometimes incomplete — the 'Result' component was occasionally missing, which weakens the impact of your answers. Strong on vision; sharpen the metrics.",
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
    { q: "Tell me about a time you drove alignment across competing stakeholders.", score: 84, hasSituation: true, hasTask: true, hasAction: true, hasResult: true },
    { q: "How do you decide what not to build?", score: 71, hasSituation: true, hasTask: true, hasAction: true, hasResult: false },
    { q: "Describe a product failure and what you learned.", score: 76, hasSituation: true, hasTask: false, hasAction: true, hasResult: true },
  ],
  jobDescription: "Stripe is looking for a Senior PM to own the core checkout experience. You will partner closely with engineering and design to define the 3-year roadmap..."
};

function ScorePill({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="text-2xl font-black text-white tabular-nums">{value}</div>
      <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">{label}</div>
    </div>
  );
}

function StarDot({ has, label }: { has: boolean; label: string }) {
  return (
    <div className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg ${has ? "bg-emerald-50 text-emerald-700" : "bg-slate-50 text-slate-400"}`}>
      <span>{has ? "✓" : "·"}</span> {label}
    </div>
  );
}

const GRID_BG = {
  backgroundImage: "linear-gradient(rgba(37,99,235,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(37,99,235,0.045) 1px, transparent 1px)",
  backgroundSize: "44px 44px",
};

const DARK_GRID_BG = {
  backgroundImage: "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
  backgroundSize: "44px 44px",
};

export function DarkHero() {
  const [showJD, setShowJD] = useState(false);
  const [openQ, setOpenQ] = useState<number | null>(null);

  return (
    <div className="min-h-screen font-sans" style={{ backgroundColor: "#ffffff", ...GRID_BG }}>

      {/* Decorative blobs — fixed behind everything, matching home page */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-blue-100/60 blur-[100px]" />
        <div className="absolute top-1/2 -right-60 w-[500px] h-[500px] rounded-full bg-indigo-100/50 blur-[120px]" />
        <div className="absolute bottom-0 left-1/3 w-[400px] h-[400px] rounded-full bg-sky-100/40 blur-[80px]" />
      </div>

      {/* Dark hero — overlays the grid, has its own subtle grid on top */}
      <div className="relative" style={{ backgroundColor: "rgba(15,23,42,0.97)", ...DARK_GRID_BG }}>
        {/* Blue glow behind the hero */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full opacity-30 blur-[80px]"
            style={{ background: "radial-gradient(ellipse, #3b82f6 0%, #6366f1 50%, transparent 80%)" }} />
        </div>

        <div className="relative px-8 pt-8 pb-10">
          {/* Nav */}
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center leading-none select-none" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
              <span className="text-[28px] tracking-[0.06em] text-white">AC</span>
              <span className="text-blue-400 text-[9px] mx-[4px]">◆</span>
              <span className="text-[28px] tracking-[0.06em] text-white">ED</span>
            </div>
            <button className="text-xs font-semibold text-slate-500 hover:text-white transition-colors">← Back</button>
          </div>

          {/* Hero content */}
          <div className="max-w-3xl mx-auto">
            <div className="flex items-start justify-between gap-8">
              <div className="flex-1 min-w-0 space-y-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400 bg-blue-400/10 border border-blue-400/20 rounded-full px-2.5 py-1">
                    Interview Scorecard
                  </span>
                  <span className={`text-[10px] font-bold uppercase tracking-wider rounded-full px-2.5 py-1 border ${
                    mock.confidenceLevel === "high" ? "bg-emerald-400/10 text-emerald-400 border-emerald-400/20"
                    : "bg-amber-400/10 text-amber-400 border-amber-400/20"
                  }`}>{mock.confidenceLevel} confidence</span>
                </div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-tight">{mock.jobTitle}</h1>
                <p className="text-sm text-slate-500">{mock.interviewType} · {mock.date}</p>
              </div>

              {/* Score */}
              <div className="shrink-0 text-center">
                <div className="text-6xl font-black text-white leading-none tabular-nums">{mock.overallScore}</div>
                <div className="text-xs text-slate-500 mt-1">out of 100</div>
                <div className="mt-2 text-sm font-black text-blue-400">{mock.grade} · {mock.gradeLabel}</div>
              </div>
            </div>

            {/* Score sub-pills */}
            <div className="flex items-center gap-10 mt-8 pt-8 border-t border-white/[0.06]">
              <ScorePill label="Clarity" value={mock.clarityScore} />
              <div className="w-px h-8 bg-white/[0.06]" />
              <ScorePill label="STAR" value={mock.starScore} />
              <div className="w-px h-8 bg-white/[0.06]" />
              <ScorePill label="Sentiment" value={mock.sentimentScore} />
            </div>
          </div>
        </div>
      </div>

      {/* Light body — grid shines through from the page background */}
      <div className="max-w-3xl mx-auto px-8 py-10 space-y-10 relative">

        {/* Summary */}
        <section className="space-y-3">
          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Coaching Summary</p>
          <p className="text-base leading-relaxed text-slate-700">{mock.overallFeedback}</p>
        </section>

        <hr className="border-slate-200/80" />

        {/* Strengths + Improvements */}
        <section className="grid grid-cols-2 gap-8">
          <div className="space-y-3">
            <p className="text-[11px] font-bold uppercase tracking-widest text-emerald-600">Strengths</p>
            <ul className="space-y-3">
              {mock.strengthPoints.map((p, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">✓</span>
                  <span className="text-sm text-slate-700 leading-relaxed">{p}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-3">
            <p className="text-[11px] font-bold uppercase tracking-widest text-amber-600">To Improve</p>
            <ul className="space-y-3">
              {mock.improvementPoints.map((p, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">!</span>
                  <span className="text-sm text-slate-700 leading-relaxed">{p}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <hr className="border-slate-200/80" />

        {/* Questions */}
        <section className="space-y-2">
          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-4">Question Breakdown</p>
          {mock.questions.map((qf, i) => {
            const open = openQ === i;
            const sc = qf.score;
            const badgeCls = sc >= 75 ? "bg-emerald-50 text-emerald-700" : sc >= 55 ? "bg-amber-50 text-amber-700" : "bg-red-50 text-red-600";
            return (
              <div key={i} className="rounded-xl border border-slate-200/70 overflow-hidden bg-white/70 backdrop-blur-sm">
                <button
                  className="w-full flex items-center gap-4 px-5 py-4 hover:bg-slate-50/80 transition-colors text-left"
                  onClick={() => setOpenQ(open ? null : i)}
                >
                  <span className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 text-xs font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                  <span className="text-sm font-medium text-slate-800 flex-1 leading-snug">{qf.q}</span>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full shrink-0 ${badgeCls}`}>{sc}/100</span>
                </button>
                {open && (
                  <div className="px-5 pb-5 pt-3 bg-slate-50/80 border-t border-slate-100 space-y-3">
                    <div className="flex gap-2 flex-wrap">
                      <StarDot has={qf.hasSituation} label="Situation" />
                      <StarDot has={qf.hasTask} label="Task" />
                      <StarDot has={qf.hasAction} label="Action" />
                      <StarDot has={qf.hasResult} label="Result" />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </section>

        <hr className="border-slate-200/80" />

        {/* JD */}
        <section>
          <button
            className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-slate-400 hover:text-slate-700 transition-colors"
            onClick={() => setShowJD(v => !v)}
          >
            <span>📄</span> Job Description {showJD ? "▲" : "▼"}
          </button>
          {showJD && (
            <p className="mt-4 text-sm text-slate-500 leading-relaxed">{mock.jobDescription}</p>
          )}
        </section>

        {/* CTA */}
        <div className="flex justify-center pt-4">
          <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-8 py-3 rounded-full shadow-md shadow-blue-200/60 transition-colors">
            Practice Again
          </button>
        </div>

      </div>
    </div>
  );
}
