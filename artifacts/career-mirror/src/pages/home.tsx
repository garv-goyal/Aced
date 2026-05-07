import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import { format } from "date-fns";
import {
  useListInterviews,
  useCreateInterview,
  getListInterviewsQueryKey,
  useDeleteInterview,
} from "@workspace/api-client-react";
import type { InterviewType } from "@workspace/api-client-react";
import { useUser, useClerk } from "@clerk/react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Loader2, Trash2, ArrowRight, ArrowLeft, Upload,
  FileText, BrainCircuit, ChevronRight, X, History, Play, Sparkles, LogIn, LogOut, Timer,
  Mic, BarChart3, Layers, Users, Code2, TrendingUp, Heart,
  type LucideIcon
} from "lucide-react";

function useTypewriter(text: string, speed = 55, startDelay = 400) {
  const [displayed, setDisplayed] = useState("");
  const [started, setStarted] = useState(false);
  useEffect(() => {
    setDisplayed("");
    setStarted(false);
    const delay = setTimeout(() => setStarted(true), startDelay);
    return () => clearTimeout(delay);
  }, [text, startDelay]);
  useEffect(() => {
    if (!started) return;
    if (displayed.length >= text.length) return;
    const id = setTimeout(() => setDisplayed(text.slice(0, displayed.length + 1)), speed);
    return () => clearTimeout(id);
  }, [started, displayed, text, speed]);
  return { displayed, done: displayed.length >= text.length };
}

const INTERVIEW_TYPES: { value: InterviewType; label: string; icon: LucideIcon; color: string; desc: string }[] = [
  { value: "mixed",        label: "Mixed",        icon: Layers,     color: "text-blue-600 bg-blue-50",    desc: "Best-of-all — AI picks the right blend" },
  { value: "behavioral",  label: "Behavioral",   icon: Users,      color: "text-violet-600 bg-violet-50", desc: "STAR-method, past experiences & leadership" },
  { value: "technical",   label: "Technical",    icon: Code2,      color: "text-amber-600 bg-amber-50",   desc: "Skills, system design & problem-solving" },
  { value: "case_study",  label: "Case Study",   icon: TrendingUp, color: "text-emerald-600 bg-emerald-50", desc: "Business scenarios & strategic thinking" },
  { value: "culture_fit", label: "Culture Fit",  icon: Heart,      color: "text-rose-600 bg-rose-50",     desc: "Values, team dynamics & motivations" },
];

const STEPS = [
  {
    key: "role",
    stepLabel: "STEP 1 OF 3 · ROLE",
    heading: "What role are you interviewing for?",
    hint: "Be specific — 'Senior Product Manager at a fintech startup' works better than just 'PM'.",
  },
  {
    key: "jd",
    stepLabel: "STEP 2 OF 3 · JOB DESCRIPTION",
    heading: "Paste the job description.",
    hint: "Even a partial JD helps. The more detail, the more targeted your questions will be.",
  },
  {
    key: "resume",
    stepLabel: "STEP 3 OF 3 · YOUR BACKGROUND",
    heading: "Tell us about your experience.",
    hint: "Paste your resume, LinkedIn summary, or bullet points. We'll find the gaps.",
  },
];

function StepDot({ active, current, label }: { active: boolean; current: boolean; label: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={`h-3 w-3 rounded-full transition-all duration-500 ${
          active ? "bg-blue-600" : "bg-slate-200"
        } ${current ? "ring-4 ring-blue-100 scale-110" : ""}`}
      />
      <span className={`text-xs font-medium tracking-wide transition-colors duration-300 ${
        current ? "text-blue-600" : active ? "text-slate-700" : "text-slate-400"
      }`}>
        {label}
      </span>
    </div>
  );
}

export default function Home() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { user, isLoaded, isSignedIn } = useUser();
  const { signOut } = useClerk();
  const isLoadingAuth = !isLoaded;
  const isAuthenticated = !!isSignedIn;

  const { data: interviews, isLoading: isLoadingList } = useListInterviews();
  const createInterview = useCreateInterview();
  const deleteInterview = useDeleteInterview();

  useEffect(() => {
    if (!isLoaded) return;
    if (isSignedIn) {
      queryClient.invalidateQueries({ queryKey: getListInterviewsQueryKey() });
    } else {
      queryClient.removeQueries({ queryKey: getListInterviewsQueryKey() });
    }
  }, [isSignedIn, isLoaded]);

  const [step, setStep] = useState(1);
  const [animDir, setAnimDir] = useState<"forward" | "back">("forward");
  const [jobTitle, setJobTitle] = useState("");
  const [interviewType, setInterviewType] = useState<InterviewType>("mixed");
  const [timeLimit, setTimeLimit] = useState<0 | 30 | 60 | 90 | 120>(0);
  const [jobDescription, setJobDescription] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [isParsing, setIsParsing] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      if (step === 1) inputRef.current?.focus({ preventScroll: true });
      else textareaRef.current?.focus({ preventScroll: true });
    }, 350);
    return () => clearTimeout(t);
  }, [step]);

  const goNext = () => {
    if (step === 1 && !jobTitle.trim()) {
      toast({ title: "Enter a job title", description: "Tell us what role you're interviewing for.", variant: "destructive" });
      return;
    }
    if (step === 2 && !jobDescription.trim()) {
      toast({ title: "Paste the job description", description: "Even a few lines helps AI tailor your questions.", variant: "destructive" });
      return;
    }
    setAnimDir("forward");
    setStep(s => Math.min(s + 1, 3));
  };

  const goBack = () => {
    setAnimDir("back");
    setStep(s => Math.max(s - 1, 1));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const allowed = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowed.includes(file.type)) {
      toast({ title: "Unsupported file", description: "Please upload a PDF or DOCX file.", variant: "destructive" });
      return;
    }
    setIsParsing(true);
    setUploadedFileName(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/interviews/parse-resume", { method: "POST", body: formData });
      if (!res.ok) { const err = await res.json(); throw new Error(err.error || "Failed to parse file"); }
      const { text } = await res.json();
      setResumeText(text);
      setUploadedFileName(file.name);
      toast({ title: "Resume parsed", description: `Extracted text from "${file.name}".` });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Could not read the file.";
      toast({ title: "Parse failed", description: msg, variant: "destructive" });
    } finally {
      setIsParsing(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleStart = () => {
    if (!resumeText.trim()) {
      toast({ title: "Add your background", description: "Paste your resume or upload a PDF so AI can personalize your questions.", variant: "destructive" });
      return;
    }
    createInterview.mutate(
      { data: { jobTitle, jobDescription, resumeText, interviewType } },
      {
        onSuccess: (data) => {
          queryClient.invalidateQueries({ queryKey: getListInterviewsQueryKey() });
          setLocation(`/interview/${data.id}${timeLimit > 0 ? `?timeLimit=${timeLimit}` : ""}`);
        },
        onError: (err: unknown) => {
          const msg = err instanceof Error ? err.message : "Please try again.";
          toast({ title: "Failed to create session", description: msg, variant: "destructive" });
        },
      }
    );
  };

  const handleDelete = (id: number) => {
    deleteInterview.mutate({ id }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListInterviewsQueryKey() });
        toast({ title: "Session deleted" });
      },
    });
  };

  const { displayed: typedText, done: typingDone } = useTypewriter("Start acing it.", 55, 300);
  const wordCount = (text: string) => text.trim().split(/\s+/).filter(Boolean).length;
  const sessionCount = interviews?.length ?? 0;

  const displayName = user?.firstName
    || user?.primaryEmailAddress?.emailAddress?.split("@")[0]
    || "You";
  const avatarInitial = displayName[0]?.toUpperCase() ?? "?";

  return (
    <div className="min-h-screen w-full flex flex-col overflow-hidden">
      {/* Dot-grid background */}
      <div
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          backgroundColor: "#fff",
          backgroundImage: "radial-gradient(circle, #e2e8f0 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      {/* Fade edges so it doesn't look tiled */}
      <div className="pointer-events-none fixed inset-0 -z-10 bg-gradient-to-b from-white/60 via-transparent to-white/80" />

      {/* Header */}
      <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-xl border-b border-slate-100/80 shadow-sm shadow-slate-100/60">
        <div className="flex h-14 items-center justify-between px-5 max-w-screen-lg mx-auto">

          {/* Wordmark */}
          <div className="flex items-center gap-3">
            <div className="flex items-center leading-none select-none" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
              <span className="text-[28px] tracking-[0.06em] text-slate-900">AC</span>
              <span className="text-blue-500 text-[9px] mx-[4px] mt-[1px]">◆</span>
              <span className="text-[28px] tracking-[0.06em] text-slate-900">ED</span>
            </div>
            <span className="hidden sm:block w-px h-4 bg-slate-200" />
            <span className="hidden sm:inline text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
              AI Interview Coach
            </span>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Step pill */}
            <div className="hidden sm:flex items-center gap-1.5 bg-slate-50 border border-slate-100 rounded-full px-3 py-1">
              {[1, 2, 3].map(n => (
                <div
                  key={n}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    n === step ? "w-5 bg-blue-500" : n < step ? "w-2 bg-blue-200" : "w-2 bg-slate-200"
                  }`}
                />
              ))}
              <span className="text-[11px] font-semibold text-slate-500 ml-1 tabular-nums">{step}/3</span>
            </div>

            {/* History */}
            <button
              onClick={() => setShowHistory(true)}
              className="flex items-center gap-1.5 h-8 px-3 rounded-full text-xs font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-all"
            >
              <History style={{ width: 13, height: 13 }} />
              <span className="hidden sm:inline">
                {sessionCount > 0 ? `${sessionCount} session${sessionCount !== 1 ? "s" : ""}` : "History"}
              </span>
            </button>

            {/* Auth */}
            {isLoadingAuth ? (
              <div className="w-8 h-8 rounded-full bg-slate-100 animate-pulse" />
            ) : isAuthenticated ? (
              <div className="flex items-center gap-1.5">
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-full pl-1 pr-2.5 py-1">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-white flex items-center justify-center text-[10px] font-bold overflow-hidden shrink-0">
                    {user?.imageUrl ? (
                      <img src={user.imageUrl} alt={displayName} className="w-6 h-6 rounded-full object-cover" />
                    ) : avatarInitial}
                  </div>
                  <span className="text-xs font-medium text-slate-700 max-w-[72px] truncate hidden sm:block">{displayName}</span>
                </div>
                <button
                  onClick={() => signOut({ redirectUrl: "/" })}
                  className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                  title="Log out"
                >
                  <LogOut style={{ width: 13, height: 13 }} />
                </button>
              </div>
            ) : (
              <Button
                size="sm"
                onClick={() => setLocation("/sign-in")}
                className="h-8 text-xs gap-1.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-200/60 px-4"
              >
                <LogIn style={{ width: 12, height: 12 }} />
                Sign in
              </Button>
            )}
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-[2px] w-full bg-slate-100">
          <div
            className="h-full bg-gradient-to-r from-blue-400 via-blue-500 to-indigo-500 transition-all duration-500 ease-in-out"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 px-6 py-8 md:py-12">

        {step === 1 ? (
          /* ── STEP 1: split layout ── */
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_440px] gap-10 lg:gap-16 items-start pt-2 lg:pt-6">

            {/* LEFT: Hero */}
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-500">

              {/* Badge */}
              <div className="flex justify-center lg:justify-start">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-blue-600 bg-blue-50 border border-blue-100 rounded-full px-3 py-1 tracking-widest uppercase">
                  <Sparkles className="w-3 h-3 animate-pulse" /> AI Mock Interviews
                </span>
              </div>

              {/* Headline */}
              <div className="text-center lg:text-left space-y-4">
                <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
                  Stop winging it.
                  <br />
                  <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                    {typedText}
                    {!typingDone && (
                      <span className="inline-block w-[3px] h-[1em] bg-blue-500 ml-0.5 align-middle animate-pulse rounded-sm" />
                    )}
                  </span>
                </h2>
                <p className="text-slate-500 text-base leading-relaxed max-w-sm mx-auto lg:mx-0">
                  AI questions built from your real resume and job description — then a detailed coaching scorecard when you're done.
                </p>
              </div>

              {/* Scorecard preview card */}
              <div className="rounded-2xl border border-slate-100 bg-white shadow-xl shadow-slate-200/40 overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-50 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">AI Scorecard</p>
                    <p className="text-sm font-semibold text-slate-800 mt-0.5">Senior PM · Stripe</p>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-1 rounded-full uppercase tracking-wider">Complete</span>
                </div>
                <div className="p-5 space-y-3.5">
                  {[
                    { label: "Clarity", score: 82, color: "bg-blue-500" },
                    { label: "STAR Method", score: 74, color: "bg-violet-500" },
                    { label: "Confidence", score: 91, color: "bg-emerald-500" },
                  ].map(({ label, score, color }) => (
                    <div key={label}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-medium text-slate-600">{label}</span>
                        <span className="text-sm font-bold text-slate-900 tabular-nums">
                          {score}<span className="text-slate-300 text-xs font-normal">/100</span>
                        </span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full ${color} rounded-full`} style={{ width: `${score}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-5 pb-4">
                  <div className="rounded-xl bg-slate-50 px-4 py-3">
                    <p className="text-xs text-slate-500 leading-relaxed">
                      <span className="font-semibold text-slate-700">Coach note: </span>
                      Strong STAR structure on Q2 and Q4. Work on conciseness — aim for under 2 min per answer.
                    </p>
                  </div>
                </div>
              </div>

              {/* Minimal stats */}
              <div className="flex items-center justify-center lg:justify-start gap-6 text-xs text-slate-400 font-medium">
                <span><span className="text-slate-700 font-bold">5</span> questions</span>
                <span className="w-px h-3 bg-slate-200" />
                <span><span className="text-slate-700 font-bold">3</span> scored dimensions</span>
                <span className="w-px h-3 bg-slate-200" />
                <span><span className="text-slate-700 font-bold">100%</span> private</span>
              </div>
            </div>

            {/* RIGHT: Form card */}
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="rounded-2xl border border-slate-100 bg-white/90 shadow-xl shadow-slate-200/40 backdrop-blur-sm p-7 space-y-6">

                <div className="space-y-2">
                  <p className="text-xs font-bold tracking-[0.12em] text-blue-600 uppercase">{STEPS[0].stepLabel}</p>
                  <h1 className="text-2xl font-bold tracking-tight text-slate-900 leading-tight">{STEPS[0].heading}</h1>
                </div>

                <div className="space-y-5">
                  <div className="space-y-3">
                    <Input
                      ref={inputRef}
                      className="h-14 text-lg border-slate-200 focus-visible:ring-blue-500 shadow-sm"
                      placeholder="e.g. Senior Frontend Engineer at Stripe"
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && goNext()}
                      data-testid="input-job-title"
                    />
                    <p className="text-sm text-slate-400">{STEPS[0].hint}</p>
                  </div>

                  {/* Interview type selector */}
                  <div className="space-y-2.5">
                    <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Interview Focus</p>
                    <div className="grid grid-cols-2 gap-2">
                      {INTERVIEW_TYPES.map((type) => {
                        const isSelected = interviewType === type.value;
                        const isMixed = type.value === "mixed";
                        return (
                          <button
                            key={type.value}
                            onClick={() => setInterviewType(type.value)}
                            className={`${isMixed ? "col-span-2 flex-row items-center gap-3" : "flex-col items-start gap-2"} flex text-left p-3 rounded-xl border transition-all duration-200 ${
                              isSelected
                                ? "border-blue-400 bg-blue-50 shadow-sm shadow-blue-100/60"
                                : "border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50/80"
                            }`}
                          >
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${type.color}`}>
                              <type.icon className="w-4 h-4" />
                            </div>
                            <div className={isMixed ? "flex-1 min-w-0" : ""}>
                              <div className="flex items-center gap-1.5">
                                <span className={`text-sm font-semibold leading-tight ${isSelected ? "text-blue-700" : "text-slate-800"}`}>
                                  {type.label}
                                </span>
                                {isMixed && (
                                  <span className="text-[9px] font-bold uppercase tracking-wide text-slate-400 bg-slate-100 rounded-full px-1.5 py-0.5 leading-none">
                                    Default
                                  </span>
                                )}
                              </div>
                              {(isMixed || isSelected) && (
                                <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{type.desc}</p>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Time limit */}
                  <div className="space-y-2.5">
                    <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                      <Timer className="w-3.5 h-3.5" /> Time limit per question
                    </p>
                    <div className="flex items-center gap-2 flex-wrap">
                      {([0, 30, 60, 90, 120] as const).map((secs) => (
                        <button
                          key={secs}
                          onClick={() => setTimeLimit(secs)}
                          className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-all duration-150 ${
                            timeLimit === secs
                              ? "border-blue-400 bg-blue-50 text-blue-700 shadow-sm shadow-blue-100/60"
                              : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                          }`}
                        >
                          {secs === 0 ? "No limit" : `${secs}s`}
                        </button>
                      ))}
                    </div>
                    {timeLimit > 0 && (
                      <p className="text-xs text-slate-400">Recording auto-stops and submits when time runs out.</p>
                    )}
                  </div>

                  {!isLoadingAuth && !isAuthenticated && (
                    <button
                      onClick={() => setLocation("/sign-in")}
                      className="w-full text-left flex items-center gap-3 rounded-xl border border-dashed border-blue-200 bg-blue-50/50 px-4 py-3 hover:border-blue-300 hover:bg-blue-50 transition-all group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-blue-100 group-hover:bg-blue-200 flex items-center justify-center shrink-0 transition-colors">
                        <LogIn className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-blue-800">Log in to save your history</p>
                        <p className="text-xs text-blue-500">Sign in with Google — your sessions will be saved</p>
                      </div>
                    </button>
                  )}
                </div>

                <Button
                  onClick={goNext}
                  className="w-full h-12 text-base font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-200/60 gap-2"
                >
                  Continue <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>

          </div>
        ) : (
          /* ── STEPS 2 & 3: centered layout ── */
          <div className="flex flex-col items-center gap-10">
            <div
              key={step}
              className={`w-full max-w-xl space-y-7 ${
                animDir === "forward"
                  ? "animate-in fade-in slide-in-from-right-4 duration-400"
                  : "animate-in fade-in slide-in-from-left-4 duration-400"
              }`}
            >
              <div className="space-y-3">
                <p className="text-xs font-bold tracking-[0.12em] text-blue-600 uppercase">
                  {STEPS[step - 1].stepLabel}
                </p>
                <h1 className="text-4xl font-bold tracking-tight text-slate-900 leading-tight">
                  {STEPS[step - 1].heading}
                </h1>
              </div>

              {/* Step 2 — Job description */}
              {step === 2 && (
                <div className="space-y-3">
                  <Textarea
                    ref={textareaRef}
                    className="min-h-[220px] text-base border-slate-200 focus-visible:ring-blue-500 resize-none leading-relaxed shadow-sm p-4"
                    placeholder="Paste the full job description here — requirements, responsibilities, and qualifications..."
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    data-testid="input-job-description"
                  />
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-slate-400">{STEPS[1].hint}</p>
                    {jobDescription && (
                      <span className={`text-xs font-medium tabular-nums ${wordCount(jobDescription) < 40 ? "text-amber-500" : "text-emerald-600"}`}>
                        {wordCount(jobDescription)} words
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Step 3 — Resume / background */}
              {step === 3 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      className="hidden"
                      onChange={handleFileUpload}
                      data-testid="input-file-upload"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isParsing}
                      className="h-9 text-xs gap-1.5 border-slate-200 text-slate-600 hover:bg-slate-50"
                      data-testid="button-upload-file"
                    >
                      {isParsing ? <><Loader2 className="w-3 h-3 animate-spin" /> Parsing...</> : <><Upload className="w-3 h-3" /> Upload PDF / DOCX</>}
                    </Button>
                    <span className="text-xs text-slate-400">or paste text below</span>
                  </div>
                  {uploadedFileName && (
                    <div className="flex items-center gap-2 text-xs text-blue-600 bg-blue-50 border border-blue-100 rounded-lg px-3 py-2">
                      <FileText className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{uploadedFileName}</span>
                    </div>
                  )}
                  <Textarea
                    ref={textareaRef}
                    className="min-h-[200px] text-base border-slate-200 focus-visible:ring-blue-500 resize-none leading-relaxed shadow-sm p-4"
                    placeholder="Paste your resume, LinkedIn About section, or key bullet points from your work history..."
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    data-testid="input-resume-text"
                  />
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-slate-400">{STEPS[2].hint}</p>
                    {resumeText && (
                      <span className={`text-xs font-medium tabular-nums ${wordCount(resumeText) < 60 ? "text-amber-500" : "text-emerald-600"}`}>
                        {wordCount(resumeText)} words
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* CTA */}
              <div className="space-y-3 pt-2">
                <Button
                  onClick={handleStart}
                  disabled={createInterview.isPending}
                  className="w-full h-12 text-base font-semibold bg-slate-900 hover:bg-slate-800 text-white shadow-md gap-2"
                  data-testid="button-start-interview"
                >
                  {createInterview.isPending ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Creating session...</>
                  ) : (
                    <><Play className="w-4 h-4 fill-current" /> Start Interview</>
                  )}
                </Button>
                <button
                  onClick={goBack}
                  className="w-full text-center text-sm font-medium text-slate-400 hover:text-slate-700 transition-colors flex items-center justify-center gap-1.5 py-2"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Step indicator footer */}
      <footer className="pb-10 pt-4">
        <div className="flex items-center justify-center gap-8">
          <StepDot active={step >= 1} current={step === 1} label="Role" />
          <div className="h-px w-10" style={{ backgroundColor: step >= 2 ? "#bfdbfe" : "#e2e8f0" }} />
          <StepDot active={step >= 2} current={step === 2} label="Description" />
          <div className="h-px w-10" style={{ backgroundColor: step >= 3 ? "#bfdbfe" : "#e2e8f0" }} />
          <StepDot active={step >= 3} current={step === 3} label="Resume" />
        </div>
      </footer>

      {/* History panel */}
      {showHistory && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/20 backdrop-blur-sm" onClick={() => setShowHistory(false)} />
          <div className="w-full max-w-sm bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <div>
                <h2 className="font-bold text-slate-900">Past Sessions</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  {isAuthenticated ? `${sessionCount} interview${sessionCount !== 1 ? "s" : ""} saved` : "Log in to view history"}
                </p>
              </div>
              <button
                onClick={() => setShowHistory(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
              {isLoadingList && (
                <div className="flex justify-center py-12"><Loader2 className="w-5 h-5 animate-spin text-slate-300" /></div>
              )}
              {!isLoadingAuth && !isAuthenticated && (
                <div className="text-center py-16 space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto">
                    <BrainCircuit className="w-7 h-7 text-blue-400" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-slate-700 font-semibold">Save your interview history</p>
                    <p className="text-xs text-slate-400">Log in to keep track of all your practice sessions.</p>
                  </div>
                  <Button size="sm" onClick={() => { setShowHistory(false); setLocation("/sign-in"); }} className="gap-1.5">
                    <LogIn className="w-3.5 h-3.5" /> Log in
                  </Button>
                </div>
              )}
              {isAuthenticated && !isLoadingList && sessionCount === 0 && (
                <div className="text-center py-16 space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto">
                    <BrainCircuit className="w-6 h-6 text-slate-300" />
                  </div>
                  <p className="text-sm text-slate-500 font-medium">No sessions yet</p>
                  <p className="text-xs text-slate-400">Complete your first interview to see it here.</p>
                </div>
              )}
              {isAuthenticated && interviews?.map((interview) => {
                const typeInfo = INTERVIEW_TYPES.find(t => t.value === interview.interviewType);
                const sessionDate = new Date(interview.createdAt);
                return (
                  <div
                    key={interview.id}
                    className="group p-3.5 rounded-xl border border-slate-100 bg-white hover:border-blue-200 hover:bg-blue-50/30 cursor-pointer transition-all"
                    onClick={() => {
                      setShowHistory(false);
                      if (interview.status === "complete") setLocation(`/results/${interview.id}`);
                      else setLocation(`/interview/${interview.id}`);
                    }}
                  >
                    {/* Top row: title + actions */}
                    <div className="flex items-start gap-2">
                      <p className="font-semibold text-sm text-slate-900 leading-snug flex-1 line-clamp-2">
                        {interview.jobTitle}
                      </p>
                      <div className="flex items-center gap-1 shrink-0 mt-0.5">
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDelete(interview.id); }}
                          className="p-1 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-400 transition-colors" />
                      </div>
                    </div>
                    {/* Bottom row: type · date · time · status */}
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      {typeInfo && (
                        <span className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
                          <typeInfo.icon className="w-3 h-3" />
                          <span>{typeInfo.label}</span>
                        </span>
                      )}
                      <span className="w-px h-3 bg-slate-200" />
                      <span className="text-[11px] text-slate-400 tabular-nums">
                        {format(sessionDate, "MMM d, yyyy")}
                        <span className="text-slate-300 mx-1">·</span>
                        {format(sessionDate, "h:mm a")}
                      </span>
                      <span className="w-px h-3 bg-slate-200" />
                      <Badge
                        variant={interview.status === "complete" ? "default" : "secondary"}
                        className="text-[10px] uppercase font-mono px-1.5 py-0 h-4"
                      >
                        {interview.status}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
