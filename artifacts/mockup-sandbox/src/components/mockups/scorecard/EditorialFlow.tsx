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
    { q: "Tell me about a time you drove alignment across competing stakeholders.", score: 84, transcript: "At my previous role I worked with three different engineering leads who had conflicting priorities on a platform migration..." },
    { q: "How do you decide what not to build?", score: 71, transcript: "I look at the opportunity cost first. Every yes is a no to something else..." },
    { q: "Describe a product failure and what you learned.", score: 76, transcript: "We launched a feature that had strong qualitative signal but weak adoption..." },
  ],
  jobDescription: "Stripe is looking for a Senior PM to own the core checkout experience. You will partner closely with engineering and design to define the 3-year roadmap..."
};

function Bar({ label, value, sub }: { label: string; value: number; sub: string }) {
  const col = value >= 75 ? "bg-emerald-500" : value >= 55 ? "bg-amber-400" : "bg-red-400";
  const txt = value >= 75 ? "text-emerald-600" : value >= 55 ? "text-amber-500" : "text-red-500";
  return (
    <div className="flex items-center gap-4">
      <div className="w-28 shrink-0">
        <p className="text-sm font-semibold text-slate-800">{label}</p>
        <p className="text-[11px] text-slate-400 mt-0.5">{sub}</p>
      </div>
      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${col}`} style={{ width: `${value}%` }} />
      </div>
      <span className={`text-sm font-bold tabular-nums w-8 text-right ${txt}`}>{value}</span>
    </div>
  );
}

export function EditorialFlow() {
  const [showJD, setShowJD] = useState(false);
  const [openQ, setOpenQ] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Nav */}
      <div className="border-b border-slate-100 px-8 h-12 flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-[0.15em] text-slate-400">ACED · Interview Scorecard</span>
        <button className="text-xs font-semibold text-blue-600 hover:text-blue-800">Practice Again →</button>
      </div>

      <div className="max-w-2xl mx-auto px-8 py-12 space-y-10">

        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-6">
            <div className="space-y-1 flex-1 min-w-0">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400">{mock.interviewType} · {mock.date}</p>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 leading-tight">{mock.jobTitle}</h1>
              <span className={`inline-block mt-2 text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                mock.confidenceLevel === "high" ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                : mock.confidenceLevel === "medium" ? "bg-amber-50 text-amber-700 border-amber-100"
                : "bg-red-50 text-red-600 border-red-100"
              }`}>{mock.confidenceLevel} confidence</span>
            </div>
            <div className="text-right shrink-0">
              <div className="text-7xl font-black text-slate-900 leading-none tabular-nums">{mock.overallScore}</div>
              <div className="text-sm text-slate-400 font-medium mt-1">out of 100</div>
              <div className="text-xl font-black text-blue-600 mt-1">{mock.grade} · {mock.gradeLabel}</div>
            </div>
          </div>
        </div>

        <hr className="border-slate-100" />

        {/* Score bars */}
        <div className="space-y-5">
          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Score Breakdown</p>
          <Bar label="Clarity" value={mock.clarityScore} sub="Communication & structure" />
          <Bar label="STAR Method" value={mock.starScore} sub="Situation · Task · Action · Result" />
          <Bar label="Sentiment" value={mock.sentimentScore} sub="Confidence & positivity" />
        </div>

        <hr className="border-slate-100" />

        {/* Summary */}
        <div className="space-y-3">
          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Coaching Summary</p>
          <p className="text-base leading-relaxed text-slate-700">{mock.overallFeedback}</p>
        </div>

        <hr className="border-slate-100" />

        {/* Strengths + Improvements */}
        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-3">
            <p className="text-[11px] font-bold uppercase tracking-widest text-emerald-600">Strengths</p>
            <ul className="space-y-2.5">
              {mock.strengthPoints.map((p, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                  <span className="text-emerald-500 mt-0.5 shrink-0">✓</span> {p}
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-3">
            <p className="text-[11px] font-bold uppercase tracking-widest text-amber-600">To Improve</p>
            <ul className="space-y-2.5">
              {mock.improvementPoints.map((p, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                  <span className="text-amber-500 mt-0.5 shrink-0">→</span> {p}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <hr className="border-slate-100" />

        {/* Questions */}
        <div className="space-y-4">
          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Question Breakdown</p>
          {mock.questions.map((qf, i) => {
            const open = openQ === i;
            const sc = qf.score;
            const col = sc >= 75 ? "text-emerald-600" : sc >= 55 ? "text-amber-500" : "text-red-500";
            return (
              <div key={i} className="border-b border-slate-100 last:border-0">
                <button
                  className="w-full flex items-center justify-between gap-4 py-4 text-left hover:text-blue-700 transition-colors"
                  onClick={() => setOpenQ(open ? null : i)}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-slate-300 shrink-0">Q{i + 1}</span>
                    <span className="text-sm font-medium text-slate-800">{qf.q}</span>
                  </div>
                  <span className={`text-xl font-black tabular-nums shrink-0 ${col}`}>{sc}</span>
                </button>
                {open && (
                  <div className="pb-5 pl-7 space-y-3">
                    <blockquote className="text-sm text-slate-500 italic border-l-2 border-slate-200 pl-3 leading-relaxed">
                      "{qf.transcript}"
                    </blockquote>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <hr className="border-slate-100" />

        {/* JD Reference */}
        <div className="space-y-2">
          <button
            className="text-[11px] font-bold uppercase tracking-widest text-slate-400 hover:text-slate-700 transition-colors flex items-center gap-2"
            onClick={() => setShowJD(v => !v)}
          >
            Job Description Reference <span className="text-slate-300">{showJD ? "▲" : "▼"}</span>
          </button>
          {showJD && (
            <p className="text-sm text-slate-500 leading-relaxed whitespace-pre-wrap">{mock.jobDescription}</p>
          )}
        </div>

      </div>
    </div>
  );
}
