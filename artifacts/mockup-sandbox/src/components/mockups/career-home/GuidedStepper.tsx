import React, { useState } from "react";
import { ArrowRight, ArrowLeft, ExternalLink, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

export function GuidedStepper() {
  const [step, setStep] = useState(2);

  const handleContinue = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="min-h-screen w-full overflow-auto bg-white flex flex-col font-sans">
      {/* HEADER */}
      <header className="sticky top-0 z-10 bg-white">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-2 text-slate-900 font-semibold">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
              <Briefcase className="h-4 w-4" />
            </div>
            Career Mirror
          </div>
          <div className="flex items-center gap-6">
            <button className="text-sm text-slate-500 hover:text-slate-900 flex items-center gap-1 transition-colors">
              3 previous sessions <ExternalLink className="h-3 w-3" />
            </button>
            <div className="text-sm font-medium text-slate-400">
              Step {step} of 3
            </div>
          </div>
        </div>
        
        {/* PROGRESS BAR */}
        <div className="h-1 w-full bg-slate-100">
          <div 
            className="h-full bg-blue-600 transition-all duration-500 ease-in-out"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>
      </header>

      {/* STEP CONTENT AREA */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-[600px] animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {step === 1 && (
            <div className="space-y-8">
              <div className="space-y-2">
                <p className="text-xs font-bold tracking-wider text-blue-600 uppercase">Step 1 of 3 · Role</p>
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">What's the job title?</h1>
                <p className="text-lg text-slate-500">Just the basic title of the position you're aiming for.</p>
              </div>
              <Input 
                className="h-14 text-lg" 
                placeholder="e.g. Senior Frontend Engineer" 
                defaultValue="Senior Frontend Engineer"
              />
              <div className="pt-4 space-y-4">
                <Button onClick={handleContinue} className="w-full h-12 text-lg bg-blue-600 hover:bg-blue-700 text-white">
                  Continue <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <div className="h-10"></div> {/* spacer for alignment with other steps that have back button */}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8">
              <div className="space-y-2">
                <p className="text-xs font-bold tracking-wider text-blue-600 uppercase">Step 2 of 3 · Job Description</p>
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">What role are you targeting?</h1>
                <p className="text-lg text-slate-500">We'll use this to generate questions tailored to your exact position.</p>
              </div>
              
              <Textarea 
                className="min-h-[200px] resize-none text-base p-4 leading-relaxed bg-white border-slate-200 focus-visible:ring-blue-600"
                defaultValue="We are looking for a Senior Frontend Engineer to join our core product team. You will be responsible for building React and TypeScript applications with a focus on performance and accessibility. 5+ years required."
              />
              
              <div className="pt-4 space-y-4">
                <Button onClick={handleContinue} className="w-full h-12 text-lg bg-blue-600 hover:bg-blue-700 text-white">
                  Continue <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <button onClick={handleBack} className="w-full text-center text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors flex items-center justify-center gap-1 py-2">
                  <ArrowLeft className="h-4 w-4" /> Back
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-8">
              <div className="space-y-2">
                <p className="text-xs font-bold tracking-wider text-blue-600 uppercase">Step 3 of 3 · Resume</p>
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">Your background</h1>
                <p className="text-lg text-slate-500">Paste your resume or key experience so we can personalize the interview.</p>
              </div>
              
              <Textarea 
                className="min-h-[200px] resize-none text-base p-4 leading-relaxed bg-white border-slate-200 focus-visible:ring-blue-600"
                placeholder="Paste your resume content here..."
              />
              
              <div className="pt-4 space-y-4">
                <Button className="w-full h-12 text-lg bg-slate-900 hover:bg-slate-800 text-white">
                  Start Interview
                </Button>
                <button onClick={handleBack} className="w-full text-center text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors flex items-center justify-center gap-1 py-2">
                  <ArrowLeft className="h-4 w-4" /> Back
                </button>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* STEP INDICATOR BOTTOM */}
      <footer className="pb-12 pt-6">
        <div className="flex items-center justify-center gap-8">
          <StepDot active={step >= 1} current={step === 1} label="Role" />
          <div className="h-px w-8 bg-slate-200"></div>
          <StepDot active={step >= 2} current={step === 2} label="Description" />
          <div className="h-px w-8 bg-slate-200"></div>
          <StepDot active={step >= 3} current={step === 3} label="Resume" />
        </div>
      </footer>
    </div>
  );
}

function StepDot({ active, current, label }: { active: boolean, current: boolean, label: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`h-3 w-3 rounded-full transition-all duration-300 ${active ? 'bg-blue-600' : 'bg-slate-200'} ${current ? 'ring-4 ring-blue-100' : ''}`} />
      <span className={`text-xs font-medium ${current ? 'text-blue-600' : (active ? 'text-slate-900' : 'text-slate-400')}`}>
        {label}
      </span>
    </div>
  );
}
