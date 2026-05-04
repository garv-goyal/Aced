import { useState } from "react";

const types = [
  { value: "mixed",      label: "Mixed",      initial: "M", desc: "AI picks the right blend" },
  { value: "behavioral", label: "Behavioral", initial: "B", desc: "STAR method & leadership" },
  { value: "technical",  label: "Technical",  initial: "T", desc: "Skills & system design" },
  { value: "case_study", label: "Case Study", initial: "C", desc: "Business scenarios" },
];

export function TypographicInitials() {
  const [selected, setSelected] = useState("mixed");
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-8">
      <div className="w-full max-w-sm space-y-3">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-4">Interview Focus</p>
        <div className="grid grid-cols-2 gap-3">
          {types.map((t) => {
            const active = selected === t.value;
            return (
              <button
                key={t.value}
                onClick={() => setSelected(t.value)}
                className={`text-left p-5 rounded-2xl border transition-all duration-150 ${
                  active
                    ? "border-blue-200 bg-blue-50"
                    : "border-slate-100 bg-slate-50 hover:border-slate-200 hover:bg-white"
                }`}
              >
                <span
                  className={`block font-black leading-none mb-3 transition-all duration-150 ${
                    active ? "text-blue-600" : "text-slate-200"
                  }`}
                  style={{ fontSize: "3.5rem", fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.04em" }}
                >
                  {t.initial}
                </span>
                <span className={`block text-sm font-bold leading-tight mb-1 ${active ? "text-blue-700" : "text-slate-600"}`}>
                  {t.label}
                </span>
                <span className="block text-[11px] text-slate-400 leading-snug">{t.desc}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
