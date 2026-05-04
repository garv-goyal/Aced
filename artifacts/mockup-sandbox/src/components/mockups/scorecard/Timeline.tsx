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
  overallFeedback: "You demonstrated a solid command of product strategy and articulated your thinking clearly across most questions. Your STAR structure was present but sometimes incomplete. Strong on vision; sharpen the metrics.",
  strengthPoints: [
    "Clear and structured communication throughout",
    "Strong customer empathy and product intuition",
    "Confidently handled ambiguous trade-off questions",
  ],
  improvementPoints: [
    "Quantify outcomes more explicitly",
    "STAR structure broke down in Q3 and Q5",
    "Slow to arrive at the core insight in longer answers",
  ],
  questions: [
    { q: "Tell me about a time you drove alignment across competing stakeholders.", score: 84, clarity: 88, star: 82, sentiment: 80 },
    { q: "How do you decide what not to build?", score: 71, clarity: 76, star: 64, sentiment: 72 },
    { q: "Describe a product failure and what you learned.", score: 76, clarity: 80, star: 70, sentiment: 78 },
  ],
};

function Node({ color, icon }: { color: string; icon: string }) {
  return (
    <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0 shadow-sm" style={{ background: color }}>
      {icon}
    </div>
  );
}

function TimelineSection({ color, icon, label, children, last = false }: {
  color: string; icon: string; label: string; children: React.ReactNode; last?: boolean;
}) {
  return (
    <div className="flex gap-5">
      <div className="flex flex-col items-center">
        <Node color={color} icon={icon} />
        {!last && <div className="w-px flex-1 mt-2" style={{ background: "#e2e8f0", minHeight: 20 }} />}
      </div>
      <div className="flex-1 pb-8 min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color }}>{label}</p>
        {children}
      </div>
    </div>
  );
}

export function Timeline() {
  const [openQ, setOpenQ] = useState<number | null>(null);

  const ringColor = mock.overallScore >= 88 ? "#10b981" : mock.overallScore >= 75 ? "#3b82f6" : mock.overallScore >= 60 ? "#f59e0b" : "#ef4444";
  const CIRC = 2 * Math.PI * 40;
  const offset = CIRC - (mock.overallScore / 100) * CIRC;

  return (
    <div className="min-h-screen bg-slate-50 font-sans">

      {/* Header */}
      <div className="bg-white border-b border-slate-100 px-8 py-6">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-1">
            <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, letterSpacing: "0.08em", color: "#0f172a" }}>AC</span>
            <span style={{ color: "#3b82f6", fontSize: 7 }}>◆</span>
            <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, letterSpacing: "0.08em", color: "#0f172a" }}>ED</span>
          </div>
          <button className="text-xs font-semibold text-blue-600 hover:text-blue-800">Practice Again →</button>
        </div>
        <p className="text-[10px] text-slate-400 font-medium">{mock.interviewType} · {mock.date}</p>
      </div>

      {/* Score hero — spans full width, clean */}
      <div className="bg-white border-b border-slate-100 px-8 py-6">
        <div className="flex items-center gap-6">
          <svg width="96" height="96" viewBox="0 0 96 96" className="-rotate-90">
            <circle cx="48" cy="48" r="40" fill="none" stroke="#f1f5f9" strokeWidth="8" />
            <circle cx="48" cy="48" r="40" fill="none" stroke={ringColor} strokeWidth="8"
              strokeDasharray={CIRC} strokeDashoffset={offset} strokeLinecap="round" />
          </svg>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-extrabold text-slate-900 leading-tight mb-1">{mock.jobTitle}</h1>
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-3xl font-black tabular-nums" style={{ color: ringColor }}>{mock.overallScore}</span>
              <span className="text-base font-black text-slate-300">/</span>
              <span className="text-base font-black text-slate-900">{mock.grade} · {mock.gradeLabel}</span>
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                mock.confidenceLevel === "high" ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-amber-50 text-amber-700 border-amber-100"
              }`}>{mock.confidenceLevel} confidence</span>
            </div>
          </div>
        </div>

        {/* Dimensions inline */}
        <div className="mt-5 flex gap-6">
          {[["Clarity", mock.clarityScore, "#6366f1"], ["STAR", mock.starScore, "#f59e0b"], ["Sentiment", mock.sentimentScore, "#10b981"]].map(([label, val, col]) => (
            <div key={label as string} className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full shrink-0" style={{ background: col as string }} />
              <span className="text-xs text-slate-500">{label}</span>
              <span className="text-xs font-bold text-slate-800 tabular-nums">{val}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline body */}
      <div className="max-w-xl mx-auto px-8 pt-10">

        <TimelineSection color="#6366f1" icon="✦" label="Coaching Summary">
          <p className="text-sm leading-relaxed text-slate-700">{mock.overallFeedback}</p>
        </TimelineSection>

        <TimelineSection color="#10b981" icon="✓" label="Strengths">
          <ul className="space-y-2.5">
            {mock.strengthPoints.map((p, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                <span className="text-emerald-400 shrink-0 mt-0.5">·</span> {p}
              </li>
            ))}
          </ul>
        </TimelineSection>

        <TimelineSection color="#f59e0b" icon="!" label="To Improve">
          <ul className="space-y-2.5">
            {mock.improvementPoints.map((p, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                <span className="text-amber-400 shrink-0 mt-0.5">·</span> {p}
              </li>
            ))}
          </ul>
        </TimelineSection>

        <TimelineSection color="#3b82f6" icon="#" label="Question Breakdown" last>
          <div className="space-y-2">
            {mock.questions.map((qf, i) => {
              const open = openQ === i;
              const sc = qf.score;
              const colCls = sc >= 75 ? "text-emerald-600" : sc >= 55 ? "text-amber-500" : "text-red-500";
              const barCol = sc >= 75 ? "#10b981" : sc >= 55 ? "#f59e0b" : "#ef4444";
              return (
                <div key={i} className="rounded-xl bg-white border border-slate-100 overflow-hidden shadow-sm">
                  <button
                    className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-slate-50 transition-colors"
                    onClick={() => setOpenQ(open ? null : i)}
                  >
                    <span className="text-xs font-mono text-slate-300 shrink-0">Q{i + 1}</span>
                    <span className="text-sm font-medium text-slate-800 flex-1 leading-snug">{qf.q}</span>
                    <span className={`text-lg font-black tabular-nums shrink-0 ${colCls}`}>{sc}</span>
                  </button>
                  {open && (
                    <div className="border-t border-slate-100 px-4 py-3 space-y-2 bg-slate-50">
                      {[["Clarity", qf.clarity], ["STAR", qf.star], ["Sentiment", qf.sentiment]].map(([l, v]) => (
                        <div key={l} className="flex items-center gap-2">
                          <span className="text-[11px] text-slate-400 w-16 shrink-0">{l}</span>
                          <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${v}%`, background: barCol }} />
                          </div>
                          <span className="text-[11px] font-bold text-slate-600 w-5 text-right tabular-nums">{v}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </TimelineSection>

      </div>
    </div>
  );
}
