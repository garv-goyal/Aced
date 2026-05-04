import React, { useState } from "react";
import { useLocation, useParams } from "wouter";
import { useGetScorecard, useRetryInterview } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  Loader2, ArrowLeft, CheckCircle2, XCircle, FileText,
  ChevronDown, ChevronUp, RotateCcw,
} from "lucide-react";
import { format } from "date-fns";

const INTERVIEW_TYPE_DISPLAY: Record<string, { label: string; emoji: string }> = {
  mixed:       { label: "Mixed",       emoji: "🎯" },
  behavioral:  { label: "Behavioral",  emoji: "🧠" },
  technical:   { label: "Technical",   emoji: "⚙️" },
  case_study:  { label: "Case Study",  emoji: "📊" },
  culture_fit: { label: "Culture Fit", emoji: "🤝" },
};

function getGrade(score: number) {
  if (score >= 88) return { letter: "A", label: "Excellent", color: "text-emerald-400" };
  if (score >= 75) return { letter: "B", label: "Good",      color: "text-blue-400"    };
  if (score >= 60) return { letter: "C", label: "Fair",      color: "text-amber-400"   };
  return              { letter: "D", label: "Needs Work", color: "text-red-400"     };
}

function getScoreColor(score: number) {
  if (score >= 75) return "text-emerald-600";
  if (score >= 55) return "text-amber-500";
  return "text-red-500";
}

function getScoreBarColor(score: number) {
  if (score >= 75) return "bg-emerald-500";
  if (score >= 55) return "bg-amber-400";
  return "bg-red-400";
}

const GRID_BG: React.CSSProperties = {
  backgroundImage:
    "linear-gradient(rgba(37,99,235,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(37,99,235,0.045) 1px, transparent 1px)",
  backgroundSize: "44px 44px",
  backgroundColor: "#ffffff",
};

const DARK_GRID_BG: React.CSSProperties = {
  backgroundImage:
    "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
  backgroundSize: "44px 44px",
};

export default function Results() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const [showJD, setShowJD] = useState(false);

  const { data: scorecard, isLoading, error } = useGetScorecard(Number(id));
  const retryInterview = useRetryInterview();

  const handleRetry = () => {
    retryInterview.mutate({ id: Number(id) }, {
      onSuccess: (newSession) => setLocation(`/interview/${newSession.id}`),
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={GRID_BG}>
        <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
          <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-blue-100/60 blur-[100px]" />
          <div className="absolute top-1/2 -right-60 w-[500px] h-[500px] rounded-full bg-indigo-100/50 blur-[120px]" />
        </div>
        <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
        <p className="text-xs font-bold uppercase tracking-widest text-slate-400 animate-pulse">Loading scorecard…</p>
      </div>
    );
  }

  if (error || !scorecard) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-8 text-center" style={GRID_BG}>
        <p className="text-slate-500 font-medium">Failed to load scorecard.</p>
        <Button variant="outline" onClick={() => setLocation("/")}>Back to Home</Button>
      </div>
    );
  }

  const grade     = getGrade(scorecard.overallScore);
  const typeInfo  = INTERVIEW_TYPE_DISPLAY[scorecard.interviewType] ?? { label: scorecard.interviewType, emoji: "🎯" };
  const sessionDate = new Date(scorecard.createdAt);

  const confidenceBadge = {
    low:    "bg-red-400/10    text-red-400    border-red-400/20",
    medium: "bg-amber-400/10  text-amber-400  border-amber-400/20",
    high:   "bg-emerald-400/10 text-emerald-400 border-emerald-400/20",
  }[scorecard.confidenceLevel] ?? "bg-slate-400/10 text-slate-400 border-slate-400/20";

  return (
    <div className="min-h-screen font-sans" style={GRID_BG}>

      {/* Decorative blobs — match home page exactly */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-blue-100/60 blur-[100px]" />
        <div className="absolute top-1/2 -right-60 w-[500px] h-[500px] rounded-full bg-indigo-100/50 blur-[120px]" />
        <div className="absolute bottom-0 left-1/3 w-[400px] h-[400px] rounded-full bg-sky-100/40 blur-[80px]" />
      </div>

      {/* ── Dark hero ───────────────────────────────────────────────── */}
      <div className="relative" style={{ backgroundColor: "rgba(15,23,42,0.97)", ...DARK_GRID_BG }}>
        {/* Blue glow */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full opacity-30 blur-[80px]"
            style={{ background: "radial-gradient(ellipse, #3b82f6 0%, #6366f1 50%, transparent 80%)" }}
          />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 md:px-8 pt-6 pb-10">

          {/* Nav row */}
          <div className="flex items-center justify-between mb-10">
            <button
              onClick={() => setLocation("/")}
              className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <div className="flex items-center leading-none select-none" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                <span className="text-[26px] tracking-[0.06em] text-white">AC</span>
                <span className="text-blue-400 text-[8px] mx-[4px]">◆</span>
                <span className="text-[26px] tracking-[0.06em] text-white">ED</span>
              </div>
            </button>
            <Button
              size="sm"
              onClick={handleRetry}
              disabled={retryInterview.isPending}
              className="h-8 text-xs gap-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/10 px-4 shadow-none"
            >
              {retryInterview.isPending
                ? <><Loader2 className="w-3 h-3 animate-spin" /> Starting…</>
                : <><RotateCcw className="w-3 h-3" /> Practice Again</>}
            </Button>
          </div>

          {/* Hero content */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">

            {/* Left: labels + title + meta */}
            <div className="flex-1 min-w-0 space-y-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400 bg-blue-400/10 border border-blue-400/20 rounded-full px-2.5 py-1">
                  Interview Scorecard
                </span>
                <span className={`text-[10px] font-bold uppercase tracking-wider rounded-full px-2.5 py-1 border ${confidenceBadge}`}>
                  {scorecard.confidenceLevel} Confidence
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-tight">
                {scorecard.jobTitle}
              </h1>
              <p className="text-sm text-slate-500">
                {typeInfo.emoji} {typeInfo.label} · {format(sessionDate, "MMM d, yyyy")} · {format(sessionDate, "h:mm a")}
              </p>
            </div>

            {/* Right: score number + grade */}
            <div className="shrink-0 text-center md:text-right">
              <div className="text-6xl font-black text-white leading-none tabular-nums">
                {Math.round(scorecard.overallScore)}
              </div>
              <div className="text-xs text-slate-500 mt-1">out of 100</div>
              <div className={`mt-2 text-lg font-black ${grade.color}`}>
                {grade.letter} · {grade.label}
              </div>
            </div>
          </div>

          {/* Dimension score pills */}
          <div className="flex items-center gap-8 md:gap-10 mt-8 pt-8 border-t border-white/[0.06]">
            {[
              { label: "Clarity",   value: scorecard.clarityScore   },
              { label: "STAR",      value: scorecard.starScore      },
              { label: "Sentiment", value: scorecard.sentimentScore },
            ].map(({ label, value }, i) => (
              <React.Fragment key={label}>
                {i > 0 && <div className="w-px h-8 bg-white/[0.06]" />}
                <div className="flex flex-col items-center gap-1">
                  <span className="text-2xl font-black text-white tabular-nums">{Math.round(value)}</span>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">{label}</span>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* ── Light body ──────────────────────────────────────────────── */}
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-10 space-y-10 relative">

        {/* Coaching Summary */}
        <section className="space-y-3">
          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">AI Coaching Summary</p>
          <p className="text-base leading-relaxed text-slate-700">{scorecard.overallFeedback}</p>
        </section>

        <hr className="border-slate-200/80" />

        {/* Strengths + Improvements */}
        <section className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <p className="text-[11px] font-bold uppercase tracking-widest text-emerald-600">Key Strengths</p>
            <ul className="space-y-3">
              {scorecard.strengthPoints.map((point, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">✓</span>
                  <span className="text-sm text-slate-700 leading-relaxed">{point}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-4">
            <p className="text-[11px] font-bold uppercase tracking-widest text-amber-600">Areas to Improve</p>
            <ul className="space-y-3">
              {scorecard.improvementPoints.map((point, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">!</span>
                  <span className="text-sm text-slate-700 leading-relaxed">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <hr className="border-slate-200/80" />

        {/* Question breakdown */}
        <section className="space-y-3">
          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Question Breakdown</p>

          <Accordion type="multiple" className="space-y-2">
            {scorecard.questionFeedbacks.map((qf, i) => {
              const qScore = Math.round((qf.clarityScore + qf.starScore + qf.sentimentScore) / 3);
              const badgeCls = qScore >= 75
                ? "bg-emerald-50 text-emerald-700"
                : qScore >= 55
                ? "bg-amber-50 text-amber-700"
                : "bg-red-50 text-red-600";
              const starItems = [
                { label: "Situation", has: qf.hasSituation },
                { label: "Task",      has: qf.hasTask      },
                { label: "Action",    has: qf.hasAction    },
                { label: "Result",    has: qf.hasResult    },
              ];

              return (
                <AccordionItem
                  key={qf.questionId}
                  value={`item-${i}`}
                  className="rounded-xl border border-slate-200/70 bg-white/70 backdrop-blur-sm overflow-hidden"
                  style={{ borderStyle: "solid" }}
                >
                  <AccordionTrigger className="hover:no-underline px-5 py-4 hover:bg-slate-50/80 transition-colors [&>svg]:hidden">
                    <div className="flex items-center gap-3 w-full text-left">
                      <span className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 text-xs font-bold flex items-center justify-center shrink-0">
                        {i + 1}
                      </span>
                      <span className="text-sm font-medium text-slate-800 flex-1 leading-snug">{qf.questionText}</span>
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full shrink-0 ${badgeCls}`}>{qScore}/100</span>
                    </div>
                  </AccordionTrigger>

                  <AccordionContent className="border-t border-slate-100 px-5 pb-5 pt-4 bg-slate-50/80">
                    <div className="space-y-5">

                      {/* Transcript */}
                      <div className="space-y-1.5">
                        <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Your Answer</p>
                        <blockquote className="border-l-2 border-blue-300 pl-3 text-sm text-slate-500 italic leading-relaxed">
                          "{qf.transcript}"
                        </blockquote>
                      </div>

                      <div className="grid md:grid-cols-2 gap-5">
                        {/* STAR chips */}
                        <div className="space-y-2">
                          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">STAR Components</p>
                          <div className="grid grid-cols-2 gap-2">
                            {starItems.map(({ label, has }) => (
                              <div
                                key={label}
                                className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-2 rounded-lg border ${
                                  has
                                    ? "bg-emerald-50 border-emerald-100 text-emerald-700"
                                    : "bg-slate-50 border-slate-100 text-slate-400"
                                }`}
                              >
                                {has
                                  ? <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                                  : <XCircle className="w-3.5 h-3.5 shrink-0" />}
                                {label}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Dimension mini-bars */}
                        <div className="space-y-2">
                          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Dimension Scores</p>
                          <div className="space-y-2.5">
                            {[
                              { label: "Clarity",   val: qf.clarityScore   },
                              { label: "STAR",      val: qf.starScore      },
                              { label: "Sentiment", val: qf.sentimentScore },
                            ].map(({ label, val }) => (
                              <div key={label} className="flex items-center gap-3">
                                <span className="text-xs text-slate-400 w-14 shrink-0">{label}</span>
                                <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                  <div
                                    className={`h-full rounded-full ${getScoreBarColor(val)}`}
                                    style={{ width: `${val}%` }}
                                  />
                                </div>
                                <span className={`text-xs font-bold tabular-nums w-5 text-right ${getScoreColor(val)}`}>
                                  {Math.round(val)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Coaching feedback */}
                      <div className="space-y-1.5">
                        <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Coaching Feedback</p>
                        <p className="text-sm text-slate-600 leading-relaxed">{qf.feedback}</p>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </section>

        <hr className="border-slate-200/80" />

        {/* Job Description reference */}
        <section>
          <button
            className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-slate-400 hover:text-slate-700 transition-colors"
            onClick={() => setShowJD(v => !v)}
          >
            <FileText className="w-3.5 h-3.5" />
            Job Description Reference
            {showJD ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
          {showJD && (
            <p className="mt-4 text-sm text-slate-500 leading-relaxed whitespace-pre-wrap">
              {scorecard.jobDescription}
            </p>
          )}
        </section>

        {/* Bottom CTA */}
        <div className="flex justify-center pt-4 pb-8">
          <Button
            size="lg"
            onClick={handleRetry}
            disabled={retryInterview.isPending}
            className="gap-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-200/60 px-8"
          >
            {retryInterview.isPending
              ? <><Loader2 className="w-4 h-4 animate-spin" /> Setting up session…</>
              : <><RotateCcw className="w-4 h-4" /> Practice Again</>}
          </Button>
        </div>

      </div>
    </div>
  );
}
