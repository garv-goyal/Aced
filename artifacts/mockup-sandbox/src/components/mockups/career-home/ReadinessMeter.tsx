import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Circle, AlertCircle, Sparkles, ChevronRight } from "lucide-react";

export function ReadinessMeter() {
  const [readiness, setReadiness] = useState(0);

  // Animate on load to 78%
  useEffect(() => {
    const timer = setTimeout(() => setReadiness(78), 300);
    return () => clearTimeout(timer);
  }, []);

  const circumference = 2 * Math.PI * 90;
  const dashoffset = circumference * (1 - readiness / 100);

  return (
    <div className="min-h-screen w-full overflow-auto bg-slate-50 font-sans text-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white font-bold">
            CM
          </div>
          <span className="text-xl font-semibold tracking-tight">Career Mirror</span>
        </div>
        <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100">
          <Sparkles className="mr-1.5 h-3.5 w-3.5" />
          AI Mock Interviews
        </Badge>
      </header>

      <main className="mx-auto max-w-6xl p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column - Form */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Prepare for your next interview
              </h1>
              <p className="mt-2 text-lg text-slate-600">
                Paste your details below to get a tailored AI mock interview experience.
              </p>
            </div>

            <Card className="border-slate-200 shadow-sm bg-white">
              <CardContent className="p-6 space-y-6">
                <div className="space-y-2.5">
                  <Label htmlFor="role" className="text-sm font-medium">Target Role</Label>
                  <Input 
                    id="role" 
                    defaultValue="Senior Frontend Engineer" 
                    className="h-11 bg-white"
                  />
                </div>

                <div className="space-y-2.5">
                  <div className="flex justify-between items-end">
                    <Label htmlFor="jd" className="text-sm font-medium">Job Description</Label>
                    <span className="text-xs text-slate-500">Optional but recommended</span>
                  </div>
                  <Textarea 
                    id="jd" 
                    rows={4}
                    defaultValue="We are looking for a Senior Frontend Engineer with deep expertise in React, TypeScript, and modern CSS to lead our design system efforts. You should have 5+ years of experience building complex web applications..." 
                    className="resize-none bg-white font-mono text-sm leading-relaxed"
                  />
                </div>

                <div className="space-y-2.5">
                  <div className="flex justify-between items-end">
                    <Label htmlFor="resume" className="text-sm font-medium">Your Resume</Label>
                  </div>
                  <Textarea 
                    id="resume" 
                    rows={5}
                    defaultValue="I am a Frontend Engineer with 6 years of experience building scalable applications. Led migration from legacy SPA to Next.js. Improved core web vitals by 40%. Proficient in React, Node.js, and GraphQL." 
                    className="resize-none bg-white font-mono text-sm leading-relaxed"
                  />
                </div>

                <Button className="w-full h-12 text-base bg-blue-600 hover:bg-blue-700 shadow-sm" size="lg">
                  Start Interview
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Readiness Meter */}
          <div className="lg:col-span-5 sticky top-24">
            <Card className="border-slate-200 shadow-md rounded-2xl overflow-hidden bg-white">
              <div className="p-6 pb-0 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="font-semibold text-slate-900">Interview Readiness</h3>
                <Badge variant="outline" className="border-blue-200 text-blue-700 bg-blue-50 font-mono">
                  {readiness} / 100
                </Badge>
              </div>

              <div className="p-6 space-y-8">
                {/* Gauge */}
                <div className="relative flex justify-center py-4">
                  <svg className="w-[200px] h-[200px] transform -rotate-90">
                    <circle
                      cx="100"
                      cy="100"
                      r="90"
                      stroke="currentColor"
                      strokeWidth="12"
                      fill="transparent"
                      className="text-slate-100"
                    />
                    <circle
                      cx="100"
                      cy="100"
                      r="90"
                      stroke="currentColor"
                      strokeWidth="12"
                      fill="transparent"
                      strokeDasharray={circumference}
                      strokeDashoffset={dashoffset}
                      className="text-blue-600 transition-all duration-1000 ease-out"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-5xl font-bold tracking-tighter text-slate-900">
                      {readiness}
                    </span>
                    <span className="text-xs font-medium text-slate-500 uppercase tracking-wider mt-1">
                      out of 100
                    </span>
                  </div>
                </div>

                {/* Criteria Checklist */}
                <div className="space-y-5">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        Role Clarity
                      </span>
                      <span className="text-slate-500">Senior Frontend Engineer ✓</span>
                    </div>
                    <Progress value={100} className="h-2 bg-slate-100 [&>div]:bg-green-500" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-amber-500" />
                        Job Description
                      </span>
                      <span className="text-slate-500">Strong match · 127 words</span>
                    </div>
                    <Progress value={85} className="h-2 bg-slate-100 [&>div]:bg-amber-500" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium flex items-center gap-2">
                        <Circle className="h-4 w-4 text-slate-300" />
                        Resume Match
                      </span>
                      <span className="text-slate-500">Add more skills & achievements</span>
                    </div>
                    <Progress value={48} className="h-2 bg-slate-100 [&>div]:bg-blue-600" />
                  </div>
                </div>

                {/* Insight Box */}
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3 text-sm text-blue-900">
                  <div className="shrink-0 mt-0.5">💡</div>
                  <div>
                    <p className="font-medium">Tip to improve your score:</p>
                    <p className="mt-1 text-blue-800/80 leading-relaxed">
                      Your resume doesn't explicitly mention <strong>TypeScript</strong> or <strong>modern CSS</strong>, which are key requirements in the job description.
                    </p>
                  </div>
                </div>

                <p className="text-center text-xs text-slate-400">
                  Readiness score updates automatically as you type
                </p>
              </div>
            </Card>
          </div>

        </div>
      </main>
    </div>
  );
}
