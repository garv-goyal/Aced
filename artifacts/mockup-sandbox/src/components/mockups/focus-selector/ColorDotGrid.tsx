import { useState } from "react";

const types = [
  { value: "mixed",     label: "Mixed",      desc: "AI picks the right blend",             dot: "#3b82f6" },
  { value: "behavioral",label: "Behavioral", desc: "STAR method & past experiences",        dot: "#8b5cf6" },
  { value: "technical", label: "Technical",  desc: "Skills, system design & problem-solving",dot: "#10b981" },
  { value: "case_study",label: "Case Study", desc: "Business scenarios & strategy",         dot: "#f59e0b" },
];

export function ColorDotGrid() {
  const [selected, setSelected] = useState("mixed");
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
      <div className="w-full max-w-sm space-y-3">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-4">Interview Focus</p>
        <div className="grid grid-cols-2 gap-3">
          {types.map((t) => {
            const active = selected === t.value;
            return (
              <button
                key={t.value}
                onClick={() => setSelected(t.value)}
                className={`relative text-left p-4 rounded-2xl border-2 transition-all duration-150 ${
                  active
                    ? "border-slate-900 bg-white shadow-md"
                    : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
                }`}
              >
                <span
                  className="block w-2.5 h-2.5 rounded-full mb-3"
                  style={{ backgroundColor: t.dot, opacity: active ? 1 : 0.35 }}
                />
                <span className={`block text-sm font-semibold leading-tight mb-1 ${active ? "text-slate-900" : "text-slate-500"}`}>
                  {t.label}
                </span>
                <span className="block text-[11px] text-slate-400 leading-snug">{t.desc}</span>
                {active && (
                  <span className="absolute top-3 right-3 w-4 h-4 rounded-full bg-slate-900 flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 10 10">
                      <path d="M2 5l2.5 2.5L8 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
