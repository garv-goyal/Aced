import { useState } from "react";

const mock = {
  jobTitle: "Senior Product Manager at Stripe",
  interviewType: "🎯 Mixed",
  date: "May 2, 2025",
  time: "3:41 PM",
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
    { q: "Tell me about a time you drove alignment across competing stakeholders.", score: 84, clarity: 88, star: 82, sentiment: 80, transcript: "At my previous role I worked with three different engineering leads who had conflicting priorities on a platform migration..." },
    { q: "How do you decide what not to build?", score: 71, clarity: 76, star: 64, sentiment: 72, transcript: "I look at the opportunity cost first. Every yes is a no to something else..." },
    { q: "Describe a product failure and what you learned.", score: 76, clarity: 80, star: 70, sentiment: 78, transcript: "We launched a feature that had strong qualitative signal but weak adoption..." },
  ],
  jobDescription: "Stripe is looking for a Senior PM to own the core checkout experience. You will partner closely with engineering and design to define the 3-year roadmap..."
};

function MiniBar({ value }: { value: number }) {
  const col = value >= 75 ? "bg-emerald-400" : value >= 55 ? "bg-amber-400" : "bg-red-400";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1 bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${col}`} style={{ width: `${value}%` }} />
      </div>
      <span className="text-[11px] font-bold tabular-nums text-slate-500 w-5 text-right">{value}</span>
    </div>
  );
}

export function ReportSidebar() {
  const [showJD, setShowJD] = useState(false);
  const [openQ, setOpenQ] = useState<number | null>(null);

  const ringCols = mock.overallScore >= 88 ? ["text-emerald-600", "#10b981"] : mock.overallScore >= 75 ? ["text-blue-600", "#3b82f6"] : mock.overallScore >= 60 ? ["text-amber-600", "#f59e0b"] : ["text-red-600", "#ef4444"];
  const circumference = 2 * Math.PI * 44;
  const offset = circumference - (mock.overallScore / 100) * circumference;

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">
      {/* Topbar */}
      <div className="border-b border-slate-100 px-6 h-12 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-1.5">
          <span style={{ fontFamily: "'Bebas Neue', sans-serif" }} className="text-[22px] tracking-[0.06em] text-slate-900">AC</span>
          <span className="text-blue-500 text-[7px]">◆</span>
          <span style={{ fontFamily: "'Bebas Neue', sans-serif" }} className="text-[22px] tracking-[0.06em] text-slate-900">ED</span>
        </div>
        <button className="text-xs font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1.5 rounded-full transition-colors">Practice Again</button>
      </div>

      {/* Body: sidebar + main */}
      <div className="flex flex-1 overflow-hidden">

        {/* Sidebar */}
        <aside className="w-64 shrink-0 border-r border-slate-100 p-6 flex flex-col gap-7 overflow-y-auto">

          {/* Score ring */}
          <div className="flex flex-col items-center gap-3 pt-2">
            <svg width="100" height="100" viewBox="0 0 100 100" className="-rotate-90">
              <circle cx="50" cy="50" r="44" fill="none" stroke="#f1f5f9" strokeWidth="8" />
              <circle
                cx="50" cy="50" r="44" fill="none"
                stroke={ringCols[1]} strokeWidth="8"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
              />
            </svg>
            <div className="text-center -mt-2">
              <div className={`text-4xl font-black leading-none ${ringCols[0]}`}>{mock.overallScore}</div>
              <div className="text-xs text-slate-400 mt-0.5">out of 100</div>
              <div className={`text-lg font-black mt-1 ${ringCols[0]}`}>{mock.grade}</div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{mock.gradeLabel}</div>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Meta */}
          <div className="space-y-2 text-xs text-slate-500">
            <p className="font-bold uppercase tracking-widest text-slate-300 mb-3">Session Info</p>
            <p className="font-medium text-slate-800 leading-snug">{mock.jobTitle}</p>
            <p>{mock.interviewType}</p>
            <p>{mock.date} · {mock.time}</p>
            <span className={`inline-block mt-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
              mock.confidenceLevel === "high" ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-amber-50 text-amber-700 border-amber-100"
            }`}>{mock.confidenceLevel} confidence</span>
          </div>

          <hr className="border-slate-100" />

          {/* Dimension breakdown */}
          <div className="space-y-3">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-300">Dimensions</p>
            <div className="space-y-2.5">
              {[
                { label: "Clarity", val: mock.clarityScore },
                { label: "STAR", val: mock.starScore },
                { label: "Sentiment", val: mock.sentimentScore },
              ].map(({ label, val }) => (
                <div key={label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-500 font-medium">{label}</span>
                  </div>
                  <MiniBar value={val} />
                </div>
              ))}
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Question scores */}
          <div className="space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-300">Questions</p>
            {mock.questions.map((qf, i) => {
              const col = qf.score >= 75 ? "text-emerald-600" : qf.score >= 55 ? "text-amber-500" : "text-red-500";
              return (
                <div key={i} className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Q{i + 1}</span>
                  <span className={`font-bold tabular-nums ${col}`}>{qf.score}</span>
                </div>
              );
            })}
          </div>

        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto px-10 py-8 space-y-9">

          {/* Heading */}
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-blue-600 mb-2">Interview Scorecard</p>
            <h1 className="text-2xl font-extrabold text-slate-900 leading-tight">{mock.jobTitle}</h1>
          </div>

          <hr className="border-slate-100" />

          {/* Summary */}
          <section className="space-y-2">
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Coaching Summary</p>
            <p className="text-sm leading-relaxed text-slate-700">{mock.overallFeedback}</p>
          </section>

          <hr className="border-slate-100" />

          {/* Strengths + Improvements */}
          <section className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <p className="text-[11px] font-bold uppercase tracking-widest text-emerald-600">Strengths</p>
              <ul className="space-y-2">
                {mock.strengthPoints.map((p, i) => (
                  <li key={i} className="text-sm text-slate-700 leading-relaxed flex items-start gap-2">
                    <span className="text-emerald-500 shrink-0 mt-0.5">✓</span> {p}
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-3">
              <p className="text-[11px] font-bold uppercase tracking-widest text-amber-600">To Improve</p>
              <ul className="space-y-2">
                {mock.improvementPoints.map((p, i) => (
                  <li key={i} className="text-sm text-slate-700 leading-relaxed flex items-start gap-2">
                    <span className="text-amber-500 shrink-0 mt-0.5">→</span> {p}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <hr className="border-slate-100" />

          {/* Questions */}
          <section className="space-y-3">
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Question Breakdown</p>
            {mock.questions.map((qf, i) => {
              const open = openQ === i;
              const col = qf.score >= 75 ? "bg-emerald-100 text-emerald-700" : qf.score >= 55 ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-600";
              return (
                <div key={i} className="rounded-lg border border-slate-100 overflow-hidden">
                  <button
                    className="w-full flex items-center gap-3 px-4 py-3.5 bg-white hover:bg-slate-50 transition-colors text-left"
                    onClick={() => setOpenQ(open ? null : i)}
                  >
                    <span className="text-xs font-mono font-bold text-slate-300 shrink-0">Q{i + 1}</span>
                    <span className="text-sm font-medium text-slate-800 flex-1 leading-snug">{qf.q}</span>
                    <span className={`text-xs font-black px-2.5 py-1 rounded-full shrink-0 ${col}`}>{qf.score}</span>
                  </button>
                  {open && (
                    <div className="border-t border-slate-100 px-4 py-4 bg-slate-50 space-y-3">
                      <blockquote className="text-sm text-slate-500 italic border-l-2 border-slate-200 pl-3">"{qf.transcript}"</blockquote>
                      <div className="flex gap-4 text-xs">
                        {[
                          { label: "Clarity", val: qf.clarity },
                          { label: "STAR", val: qf.star },
                          { label: "Sentiment", val: qf.sentiment },
                        ].map(({ label, val }) => (
                          <span key={label} className="text-slate-500">
                            {label} <span className="font-bold text-slate-700">{val}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </section>

          <hr className="border-slate-100" />

          {/* JD */}
          <section>
            <button
              className="text-[11px] font-bold uppercase tracking-widest text-slate-400 hover:text-slate-700 transition-colors flex items-center gap-2"
              onClick={() => setShowJD(v => !v)}
            >
              📄 Job Description {showJD ? "▲" : "▼"}
            </button>
            {showJD && (
              <p className="mt-3 text-sm text-slate-500 leading-relaxed">{mock.jobDescription}</p>
            )}
          </section>

        </main>
      </div>
    </div>
  );
}
