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
    { q: "Tell me about a time you drove alignment across competing stakeholders.", score: 84, clarity: 88, star: 82, sentiment: 80 },
    { q: "How do you decide what not to build?", score: 71, clarity: 76, star: 64, sentiment: 72 },
    { q: "Describe a product failure and what you learned.", score: 76, clarity: 80, star: 70, sentiment: 78 },
  ],
};

const R = 56;
const CIRC = 2 * Math.PI * R;
const GAP = 0.25;

function ArcScore({ value }: { value: number }) {
  const fill = ((value / 100) * (1 - GAP));
  const dashArr = `${fill * CIRC} ${CIRC}`;
  const rotate = `rotate(${90 + GAP * 180}deg)`;
  return (
    <div className="relative w-36 h-36 mx-auto">
      <svg className="absolute inset-0" width="144" height="144" viewBox="0 0 144 144" style={{ transform: rotate, transformOrigin: "center" }}>
        <circle cx="72" cy="72" r={R} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="10" strokeDasharray={`${(1 - GAP) * CIRC} ${CIRC}`} strokeLinecap="round" />
        <circle cx="72" cy="72" r={R} fill="none" stroke="white" strokeWidth="10" strokeDasharray={dashArr} strokeLinecap="round" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center pt-4">
        <span className="text-4xl font-black text-white leading-none">{value}</span>
        <span className="text-xs text-white/60 font-medium">/ 100</span>
      </div>
    </div>
  );
}

function DimBar({ label, value }: { label: string; value: number }) {
  const col = value >= 75 ? "#34d399" : value >= 55 ? "#fbbf24" : "#f87171";
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-[11px] font-semibold text-white/80">
        <span>{label}</span><span>{value}</span>
      </div>
      <div className="h-1.5 rounded-full bg-white/20 overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${value}%`, background: col }} />
      </div>
    </div>
  );
}

export function GradientArc() {
  const [openQ, setOpenQ] = useState<number | null>(null);

  return (
    <div className="min-h-screen font-sans" style={{ background: "#f8fafc" }}>

      {/* Header gradient */}
      <div style={{ background: "linear-gradient(135deg, #1e3a5f 0%, #1d4ed8 55%, #7c3aed 100%)" }} className="pb-10">
        {/* Nav */}
        <div className="px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, letterSpacing: "0.08em", color: "white" }}>AC</span>
            <span style={{ color: "#93c5fd", fontSize: 8 }}>◆</span>
            <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, letterSpacing: "0.08em", color: "white" }}>ED</span>
          </div>
          <button className="text-xs font-semibold text-white/60 hover:text-white transition-colors">← Results</button>
        </div>

        {/* Arc + title */}
        <div className="px-8 pt-2 pb-4 flex flex-col items-center text-center gap-3">
          <ArcScore value={mock.overallScore} />
          <div>
            <div className="flex items-center justify-center gap-2 mb-1">
              <span className="text-lg font-black text-white">{mock.grade}</span>
              <span className="text-white/50 text-sm">·</span>
              <span className="text-sm font-semibold text-white/70">{mock.gradeLabel}</span>
            </div>
            <h1 className="text-xl font-extrabold text-white leading-tight">{mock.jobTitle}</h1>
            <p className="text-xs text-white/50 mt-1">{mock.interviewType} · {mock.date}</p>
          </div>
        </div>

        {/* Dim bars in header */}
        <div className="mx-8 mt-2 grid grid-cols-3 gap-4 bg-white/10 rounded-2xl p-4">
          <DimBar label="Clarity" value={mock.clarityScore} />
          <DimBar label="STAR" value={mock.starScore} />
          <DimBar label="Sentiment" value={mock.sentimentScore} />
        </div>
      </div>

      {/* Body */}
      <div className="max-w-2xl mx-auto px-8 -mt-2 pb-16 space-y-8">

        {/* Coaching */}
        <section className="bg-white rounded-2xl p-6 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Coaching Summary</p>
          <p className="text-sm leading-relaxed text-slate-700">{mock.overallFeedback}</p>
        </section>

        {/* Strengths + Improvements — single connected panel */}
        <section className="bg-white rounded-2xl overflow-hidden shadow-sm divide-y divide-slate-100">
          <div className="p-6">
            <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 mb-4">Strengths</p>
            <ul className="space-y-2.5">
              {mock.strengthPoints.map((p, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-slate-700">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">✓</span>
                  {p}
                </li>
              ))}
            </ul>
          </div>
          <div className="p-6">
            <p className="text-[10px] font-bold uppercase tracking-widest text-amber-600 mb-4">To Improve</p>
            <ul className="space-y-2.5">
              {mock.improvementPoints.map((p, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-slate-700">
                  <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">→</span>
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Questions — connected panel */}
        <section className="bg-white rounded-2xl overflow-hidden shadow-sm">
          <div className="px-6 pt-5 pb-2">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Question Breakdown</p>
          </div>
          {mock.questions.map((qf, i) => {
            const open = openQ === i;
            const sc = qf.score;
            const accent = sc >= 75 ? "#10b981" : sc >= 55 ? "#f59e0b" : "#ef4444";
            const bgBadge = sc >= 75 ? "bg-emerald-50 text-emerald-700" : sc >= 55 ? "bg-amber-50 text-amber-700" : "bg-red-50 text-red-600";
            return (
              <div key={i} className="border-t border-slate-100 first:border-0">
                <button
                  className="w-full flex items-center gap-3 px-6 py-4 hover:bg-slate-50 transition-colors text-left"
                  onClick={() => setOpenQ(open ? null : i)}
                >
                  <span className="w-1.5 h-6 rounded-full shrink-0" style={{ background: accent }} />
                  <span className="text-sm font-medium text-slate-800 flex-1 leading-snug">{qf.q}</span>
                  <span className={`text-xs font-black px-2.5 py-1 rounded-full shrink-0 ${bgBadge}`}>{sc}</span>
                </button>
                {open && (
                  <div className="px-6 pb-5 space-y-2 bg-slate-50">
                    <div className="flex gap-6 text-xs pt-1">
                      {[["Clarity", qf.clarity], ["STAR", qf.star], ["Sentiment", qf.sentiment]].map(([l, v]) => (
                        <span key={l} className="text-slate-500">{l} <span className="font-bold text-slate-700">{v}</span></span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </section>

        <div className="flex justify-center pt-2">
          <button style={{ background: "linear-gradient(135deg, #1d4ed8, #7c3aed)" }} className="text-white text-sm font-semibold px-8 py-3 rounded-full shadow-md hover:opacity-90 transition-opacity">
            Practice Again
          </button>
        </div>

      </div>
    </div>
  );
}
