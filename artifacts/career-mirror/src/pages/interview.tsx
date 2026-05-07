import { useState, useEffect, useRef, useCallback } from "react";
import { useLocation, useParams, useSearch } from "wouter";
import {
  useGetInterview,
  useSubmitAnswer,
  useScoreInterview,
  useUpdateQuestion,
  getGetInterviewQueryKey
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useSpeechRecognition } from "@/hooks/use-speech-recognition";
import { useTextToSpeech } from "@/hooks/use-text-to-speech";
import {
  Mic, Square, Loader2, ArrowRight, AlertCircle, Volume2,
  Keyboard, SkipForward, BrainCircuit, Pencil, Check, X, Timer
} from "lucide-react";

function useElapsedTimer(running: boolean) {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    if (!running) { setSeconds(0); return; }
    const id = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(id);
  }, [running]);
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

const INTERVIEW_TYPE_LABEL: Record<string, string> = {
  mixed: "Mixed",
  behavioral: "Behavioral",
  technical: "Technical",
  case_study: "Case Study",
  culture_fit: "Culture Fit",
};

type StreamedQuestion = {
  id: number;
  sessionId: number;
  orderIndex: number;
  questionText: string;
  category: string;
  gapArea: string;
  isCustom: boolean;
  answer?: null;
};

function useStreamedQuestions(interviewId: number, onDone: () => void) {
  const [questions, setQuestions] = useState<StreamedQuestion[]>([]);
  const [isStreaming, setIsStreaming] = useState(true);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    setQuestions([]);
    setIsStreaming(true);

    let done = false;
    let pollId: ReturnType<typeof setInterval> | null = null;

    const finish = (finalQuestions?: StreamedQuestion[]) => {
      if (done) return;
      done = true;
      if (pollId) clearInterval(pollId);
      if (finalQuestions) setQuestions(finalQuestions);
      setIsStreaming(false);
      onDoneRef.current();
    };

    // Fallback: poll GET /api/interviews/:id until questions appear
    const startPolling = () => {
      pollId = setInterval(async () => {
        try {
          const res = await fetch(`/api/interviews/${interviewId}`);
          if (!res.ok) return;
          const data = await res.json() as { questions?: StreamedQuestion[] };
          const qs = data.questions ?? [];
          if (qs.length > 0) {
            setQuestions(qs);
            finish(qs);
          }
        } catch { /* network blip, retry next tick */ }
      }, 1000);
    };

    const es = new EventSource(`/api/interviews/${interviewId}/stream-questions`);

    es.onmessage = (e: MessageEvent) => {
      try {
        const { question } = JSON.parse(e.data as string) as { question: StreamedQuestion };
        setQuestions(prev =>
          prev.some(q => q.id === question.id) ? prev : [...prev, question]
        );
      } catch { /* ignore malformed events */ }
    };

    es.addEventListener("done", () => { es.close(); finish(); });
    es.onerror = () => { es.close(); startPolling(); };

    return () => { es.close(); if (pollId) clearInterval(pollId); done = true; };
  }, [interviewId]);

  return { streamedQuestions: questions, isStreaming };
}

function useCountdown(limitSeconds: number, running: boolean, resetKey: number, onExpire: () => void) {
  const [timeLeft, setTimeLeft] = useState(limitSeconds);
  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;

  // Reset whenever question changes or limit changes
  useEffect(() => { setTimeLeft(limitSeconds); }, [resetKey, limitSeconds]);

  useEffect(() => {
    if (!running || limitSeconds === 0) return;
    if (timeLeft <= 0) { onExpireRef.current(); return; }
    const id = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(id);
  }, [running, timeLeft, limitSeconds]);

  return timeLeft;
}

export default function InterviewRoom() {
  const { id } = useParams();
  const interviewId = Number(id);
  const [, setLocation] = useLocation();
  const search = useSearch();
  const timeLimit = Math.max(0, parseInt(new URLSearchParams(search).get("timeLimit") ?? "0") || 0);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: session, isLoading, error } = useGetInterview(interviewId);
  const submitAnswer = useSubmitAnswer();
  const scoreInterview = useScoreInterview();
  const updateQuestion = useUpdateQuestion();

  const { streamedQuestions, isStreaming } = useStreamedQuestions(interviewId, () => {
    queryClient.invalidateQueries({ queryKey: getGetInterviewQueryKey(interviewId) });
  });

  const { isListening, transcript, interimTranscript, startListening, stopListening, resetTranscript, hasSupport } = useSpeechRecognition();
  const { speak, stop: stopTTS, isSpeaking } = useTextToSpeech();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [finalAnswer, setFinalAnswer] = useState("");
  const [showShortcutHint, setShowShortcutHint] = useState(true);

  // Question override state
  const [editingQuestionId, setEditingQuestionId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  const editTextareaRef = useRef<HTMLTextAreaElement>(null);

  const timer = useElapsedTimer(isListening);

  const questions = (!isStreaming && (session?.questions?.length ?? 0) > 0)
    ? session!.questions
    : streamedQuestions;
  const currentQuestion = questions[currentQuestionIndex];

  // Find the first unanswered question on mount
  useEffect(() => {
    if (session && questions.length > 0) {
      const firstUnanswered = questions.findIndex(q => !q.answer);
      if (firstUnanswered !== -1) {
        setCurrentQuestionIndex(firstUnanswered);
      } else if (session.status === "complete") {
        setLocation(`/results/${session.id}`);
      }
    }
  }, [session, questions.length, setLocation]);

  // Focus edit textarea when entering edit mode
  useEffect(() => {
    if (editingQuestionId !== null) {
      setTimeout(() => editTextareaRef.current?.focus(), 50);
    }
  }, [editingQuestionId]);

  // Accumulate transcript when recording stops
  useEffect(() => {
    if (!isListening && transcript) {
      setFinalAnswer(prev => prev + (prev ? " " : "") + transcript);
      resetTranscript();
    }
  }, [isListening, transcript, resetTranscript]);

  const handleSubmit = useCallback(() => {
    if (!currentQuestion) return;
    const textToSubmit = finalAnswer || transcript;
    if (!textToSubmit.trim()) {
      toast({ title: "No answer detected", description: "Please record an answer before submitting.", variant: "destructive" });
      return;
    }
    stopTTS();
    if (isListening) stopListening();

    submitAnswer.mutate({ id: interviewId, data: { questionId: currentQuestion.id, transcript: textToSubmit } }, {
      onSuccess: () => {
        setFinalAnswer("");
        resetTranscript();
        queryClient.invalidateQueries({ queryKey: getGetInterviewQueryKey(interviewId) });
        if (currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex(prev => prev + 1);
        }
      },
      onError: (err: unknown) => {
        const msg = err instanceof Error ? err.message : "Please try again.";
        toast({ title: "Error submitting answer", description: msg, variant: "destructive" });
      }
    });
  }, [currentQuestion, finalAnswer, transcript, stopTTS, isListening, stopListening, submitAnswer, interviewId, resetTranscript, queryClient, currentQuestionIndex, questions.length, toast]);

  // Countdown — placed after handleSubmit so it can reference it
  const timeLeft = useCountdown(timeLimit, isListening, currentQuestionIndex, handleSubmit);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (editingQuestionId !== null) return; // disable shortcuts while editing
      if (e.code === "Space" && e.target === document.body) {
        e.preventDefault();
        if (!hasSupport || submitAnswer.isPending) return;
        if (isListening) {
          stopListening();
        } else {
          startListening();
        }
        setShowShortcutHint(false);
      }
      if (e.code === "Enter" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        handleSubmit();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [hasSupport, submitAnswer.isPending, isListening, stopListening, startListening, handleSubmit, editingQuestionId]);

  const handleFinish = () => {
    stopTTS();
    if (isListening) stopListening();
    scoreInterview.mutate({ id: interviewId }, {
      onSuccess: () => setLocation(`/results/${interviewId}`),
      onError: (err: unknown) => {
        const msg = err instanceof Error ? err.message : "Please try again.";
        toast({ title: "Error finalizing interview", description: msg, variant: "destructive" });
      }
    });
  };

  const startEditing = (questionId: number, currentText: string) => {
    stopTTS();
    if (isListening) stopListening();
    setEditingQuestionId(questionId);
    setEditText(currentText);
  };

  const cancelEditing = () => {
    setEditingQuestionId(null);
    setEditText("");
  };

  const saveEditing = () => {
    if (!editText.trim() || editingQuestionId === null) return;
    updateQuestion.mutate(
      { id: interviewId, questionId: editingQuestionId, data: { questionText: editText.trim() } },
      {
        onSuccess: () => {
          setEditingQuestionId(null);
          setEditText("");
          queryClient.invalidateQueries({ queryKey: getGetInterviewQueryKey(interviewId) });
          toast({ title: "Question updated", description: "Your custom question has been saved." });
        },
        onError: () => {
          toast({ title: "Failed to save question", variant: "destructive" });
        },
      }
    );
  };

  if (isLoading && isStreaming) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  if (isStreaming) {
    return (
      <div className="min-h-screen flex flex-col items-center py-16 px-6 gap-8">
        <div className="text-center space-y-2">
          <div className="flex items-center gap-2 justify-center text-blue-500">
            <BrainCircuit className="w-4 h-4 animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-widest">Analyzing your profile</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Generating your questions</h2>
          <p className="text-sm text-slate-400 tabular-nums">{streamedQuestions.length} of 5 ready</p>
        </div>

        <div className="w-full max-w-lg space-y-3">
          {streamedQuestions.map((q, i) => (
            <div
              key={q.id}
              className="p-4 rounded-xl border border-slate-100 bg-white shadow-sm animate-in fade-in slide-in-from-bottom-3 duration-500"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Q{i + 1}</span>
                <span className="text-[11px] bg-blue-50 text-blue-600 font-semibold px-2 py-0.5 rounded-full">{q.gapArea}</span>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed">{q.questionText}</p>
            </div>
          ))}
          {Array.from({ length: 5 - streamedQuestions.length }).map((_, i) => (
            <div key={`skel-${i}`} className="p-4 rounded-xl border border-slate-100 bg-white">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Q{streamedQuestions.length + i + 1}</span>
                <div className="h-4 w-20 bg-slate-100 rounded-full animate-pulse" />
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-slate-100 rounded-full animate-pulse" />
                <div className="h-3 bg-slate-100 rounded-full animate-pulse w-4/5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !session) {
    return <div className="min-h-screen flex items-center justify-center p-8 text-center text-destructive">Failed to load interview session.</div>;
  }

  const progress = (currentQuestionIndex / questions.length) * 100;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const allAnswered = questions.every(q => q.answer);
  const wordCount = (finalAnswer + " " + transcript).trim().split(/\s+/).filter(Boolean).length;
  const isEditing = editingQuestionId === currentQuestion?.id;
  const interviewTypeLabel = INTERVIEW_TYPE_LABEL[session.interviewType ?? "mixed"] ?? "Mixed";

  if (allAnswered) {
    return (
      <div className="min-h-[100dvh] w-full flex flex-col items-center justify-center p-8">
        <div className="max-w-2xl w-full space-y-8">
          {/* Animated checkmark circle */}
          <div className="flex justify-center">
            <div className="relative w-32 h-32">
              {/* Outer circle glow */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 opacity-20 blur-2xl animate-pulse" />
              {/* Main circle */}
              <div className="absolute inset-0 rounded-full border-4 border-blue-600 flex items-center justify-center bg-gradient-to-br from-blue-50 to-white">
                <Check className="w-16 h-16 text-blue-600 animate-bounce" style={{ animationDelay: '0s' }} />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="text-center space-y-3">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">You're all set!</h2>
            <p className="text-lg text-muted-foreground max-w-md mx-auto">
              All questions answered. Let's analyze your performance with AI-powered insights.
            </p>
          </div>

          {/* CTA Button */}
          <div className="flex justify-center pt-4">
            <Button onClick={handleFinish} disabled={scoreInterview.isPending} size="lg" className="font-semibold gap-2 px-8 py-6 text-base bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all">
              {scoreInterview.isPending ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Generating Results...</>
              ) : (
                <>
                  <span>View My Scorecard</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] w-full flex flex-col bg-background">
      {/* Sticky header */}
      <div className="w-full bg-white/80 backdrop-blur border-b border-border sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center gap-4">
          <button onClick={() => setLocation("/")} className="flex items-center gap-2 shrink-0 group">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center shadow-sm shadow-blue-200">
              <BrainCircuit className="w-3.5 h-3.5 text-white" />
            </div>
            <div className="hidden sm:flex items-center leading-none select-none" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
              <span className="text-[22px] tracking-[0.06em] text-slate-800">AC</span>
              <span className="text-blue-500 text-[7px] mx-[3px] mt-[1px]">◆</span>
              <span className="text-[22px] tracking-[0.06em] text-slate-800">ED</span>
            </div>
          </button>

          <div className="flex flex-col flex-1 gap-1">
            <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
              <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
              <div className="flex items-center gap-3">
                {isSpeaking && (
                  <span className="flex items-center gap-1.5 text-primary animate-pulse">
                    <Volume2 className="w-3.5 h-3.5" /> Speaking...
                  </span>
                )}
                <span>{Math.round(progress)}% complete</span>
              </div>
            </div>
            <Progress value={progress} className="h-1" />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Badge variant="outline" className="text-xs border-primary/30 text-primary hidden sm:flex">
              {session.jobTitle}
            </Badge>
            <Badge variant="secondary" className="text-xs hidden sm:flex">
              {interviewTypeLabel}
            </Badge>
          </div>
        </div>
      </div>

      <div className="flex-1 w-full max-w-4xl mx-auto p-4 md:p-8 flex flex-col gap-6">
        {!hasSupport && (
          <div className="bg-destructive/10 text-destructive p-4 rounded-xl border border-destructive/20 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-semibold">Browser not supported</p>
              <p>Speech recognition requires Chrome, Edge, or Safari.</p>
            </div>
          </div>
        )}

        {/* Question block */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-2">
            <Badge className="text-xs font-medium">{currentQuestion?.category}</Badge>
            <span className="text-xs text-muted-foreground">{currentQuestion?.gapArea}</span>
            {currentQuestion?.isCustom && (
              <Badge variant="outline" className="text-xs border-amber-300 text-amber-600 bg-amber-50">
                Custom
              </Badge>
            )}
          </div>

          {isEditing ? (
            /* Edit mode */
            <div className="space-y-3">
              <Textarea
                ref={editTextareaRef}
                className="text-xl font-semibold leading-snug min-h-[100px] resize-none border-blue-300 focus-visible:ring-blue-400 bg-blue-50/30"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                placeholder="Type your custom question..."
              />
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  onClick={saveEditing}
                  disabled={!editText.trim() || updateQuestion.isPending}
                  className="gap-1.5 h-8"
                >
                  {updateQuestion.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                  Save question
                </Button>
                <Button size="sm" variant="ghost" onClick={cancelEditing} className="gap-1.5 h-8 text-muted-foreground">
                  <X className="w-3.5 h-3.5" /> Cancel
                </Button>
                <p className="text-xs text-muted-foreground ml-auto">This replaces the AI-generated question</p>
              </div>
            </div>
          ) : (
            /* Display mode */
            <div className="group flex items-start gap-2">
              <h2 className="flex-1 text-2xl md:text-3xl font-semibold leading-snug text-foreground">
                {currentQuestion?.questionText}
              </h2>
              <div className="flex items-center gap-1 mt-1 shrink-0 opacity-0 group-hover:opacity-100 transition-all">
                <button
                  onClick={() => {
                    if (isSpeaking) { stopTTS(); }
                    else if (currentQuestion) { speak(currentQuestion.questionText); }
                  }}
                  className={`p-2 rounded-lg transition-all ${
                    isSpeaking
                      ? "text-primary bg-primary/10 hover:bg-primary/20"
                      : "text-slate-300 hover:text-slate-600 hover:bg-slate-100"
                  }`}
                  title={isSpeaking ? "Stop reading" : "Read question aloud"}
                >
                  <Volume2 className={`w-4 h-4 ${isSpeaking ? "animate-pulse" : ""}`} />
                </button>
                <button
                  onClick={() => currentQuestion && startEditing(currentQuestion.id, currentQuestion.questionText)}
                  className="p-2 rounded-lg text-slate-300 hover:text-slate-600 hover:bg-slate-100 transition-all"
                  title="Edit this question"
                >
                  <Pencil className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {!isEditing && (
            <p className="text-sm text-muted-foreground">
              Speak your answer clearly. Use the STAR method (Situation, Task, Action, Result) when relevant.
            </p>
          )}
        </div>

        {/* Recording area — hidden while editing */}
        {!isEditing && (
          <Card className="flex-1 min-h-[280px] border-border bg-white flex flex-col shadow-sm">
            <div className="p-5 flex-1 flex flex-col gap-4">
              <div className="flex items-center justify-between text-xs font-medium text-muted-foreground border-b border-border/60 pb-3">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full transition-colors ${isListening ? "bg-red-500 animate-pulse" : "bg-muted-foreground/30"}`} />
                  <span>{isListening ? `Recording · ${timer}` : "Transcript"}</span>
                </div>
                <div className="flex items-center gap-3">
                  {timeLimit > 0 && isListening && (
                    <span className={`flex items-center gap-1 tabular-nums font-semibold transition-colors ${
                      timeLeft <= 10 ? "text-red-500 animate-pulse" :
                      timeLeft <= 30 ? "text-amber-500" : "text-emerald-600"
                    }`}>
                      <Timer className="w-3 h-3" />
                      {timeLeft}s
                    </span>
                  )}
                  {timeLimit > 0 && !isListening && (
                    <span className="flex items-center gap-1 text-muted-foreground/50">
                      <Timer className="w-3 h-3" />
                      {timeLimit}s limit
                    </span>
                  )}
                  {wordCount > 0 && (
                    <span className={`tabular-nums ${wordCount < 30 ? "text-amber-500" : "text-emerald-600"}`}>
                      {wordCount} words {wordCount < 30 ? "— aim for 50+" : "· good length"}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto text-base md:text-lg font-light text-foreground/90 whitespace-pre-wrap leading-relaxed min-h-[120px]">
                {finalAnswer}
                {finalAnswer && (transcript || interimTranscript) && " "}
                <span className="text-foreground/50">{transcript || interimTranscript}</span>
                {!finalAnswer && !transcript && !interimTranscript && (
                  <span className="text-muted-foreground/40 italic text-base">
                    {isListening ? "Listening... speak your answer" : "Press Space or tap the mic to begin answering..."}
                  </span>
                )}
              </div>
            </div>

            <div className="p-4 md:p-5 bg-gray-50/80 border-t border-border rounded-b-lg flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <Button
                  variant={isListening ? "destructive" : "default"}
                  size="lg"
                  className={`w-14 h-14 rounded-full transition-all duration-200 shadow-sm ${isListening ? "shadow-red-200 ring-4 ring-red-100" : "shadow-primary/20"}`}
                  onClick={isListening ? stopListening : startListening}
                  disabled={!hasSupport || submitAnswer.isPending}
                  data-testid="button-record-toggle"
                >
                  {isListening ? <Square className="w-5 h-5 fill-current" /> : <Mic className="w-5 h-5" />}
                </Button>
                <div>
                  <p className="text-sm font-semibold">{isListening ? "Stop Recording" : "Start Recording"}</p>
                  {showShortcutHint && hasSupport && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                      <Keyboard className="w-3 h-3" /> Space to toggle · ⌘↵ to submit
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                {finalAnswer && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs text-muted-foreground gap-1"
                    onClick={() => { setFinalAnswer(""); resetTranscript(); }}
                  >
                    Clear
                  </Button>
                )}
                <Button
                  size="lg"
                  className="flex-1 sm:flex-none font-semibold gap-2 shadow-sm"
                  onClick={handleSubmit}
                  disabled={submitAnswer.isPending || (!finalAnswer && !transcript)}
                  data-testid="button-submit-answer"
                >
                  {submitAnswer.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : isLastQuestion ? (
                    <SkipForward className="w-4 h-4" />
                  ) : (
                    <ArrowRight className="w-4 h-4" />
                  )}
                  {isLastQuestion ? "Finish Interview" : "Next Question"}
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Question nav dots */}
        <div className="flex items-center justify-center gap-2">
          {questions.map((q, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === currentQuestionIndex ? "w-6 bg-primary" :
                q.answer ? "w-3 bg-primary/30" : "w-3 bg-muted"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
