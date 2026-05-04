import { useState } from "react";

const types = [
  { value: "mixed",      label: "Mixed",      desc: "Best-of-all blend — AI picks question types based on your role and resume." },
  { value: "behavioral", label: "Behavioral", desc: "STAR-method questions focused on past experiences and leadership moments." },
  { value: "technical",  label: "Technical",  desc: "Deep-dive on skills, system design, and problem-solving ability." },
  { value: "case_study", label: "Case Study", desc: "Business scenarios and strategic thinking — ideal for PM and consulting roles." },
];

export function PillTabs() {
  const [selected, setSelected] = useState("mixed");
  const active = types.find((t) => t.value === selected)!;
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-8">
      <div className="w-full max-w-sm space-y-5">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">Interview Focus</p>

        {/* Pill row */}
        <div className="flex flex-wrap gap-2">
          {types.map((t) => {
            const isActive = selected === t.value;
            return (
              <button
                key={t.value}
                onClick={() => setSelected(t.value)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-150 ${
                  isActive
                    ? "bg-blue-600 text-white shadow-sm shadow-blue-200"
                    : "bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700"
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>

        {/* Description card */}
        <div className="bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 transition-all duration-200">
          <p className="text-sm text-slate-600 leading-relaxed">{active.desc}</p>
        </div>
      </div>
    </div>
  );
}
