import React from "react";
import { Mic, Upload, Play, ChevronRight, FileText, Briefcase, Plus, Clock, CheckCircle2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

export function CleanProfessional() {
  return (
    <div className="min-h-screen w-full overflow-auto bg-[#f9fafb] font-sans text-slate-900" style={{ fontFamily: '"Inter", sans-serif' }}>
      {/* Header */}
      <header className="sticky top-0 z-10 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm">
              <Mic size={18} className="text-white" />
            </div>
            <span className="text-xl font-semibold tracking-tight text-slate-900">Career Mirror</span>
            <Badge variant="secondary" className="ml-2 hidden rounded-full bg-blue-50 text-blue-700 hover:bg-blue-50 sm:inline-flex">
              AI Mock Interviewer
            </Badge>
          </div>
          <nav className="flex items-center gap-6">
            <a href="#" className="text-sm font-medium text-slate-600 hover:text-slate-900">Dashboard</a>
            <a href="#" className="text-sm font-medium text-slate-600 hover:text-slate-900">Questions</a>
            <a href="#" className="text-sm font-medium text-slate-600 hover:text-slate-900">Analytics</a>
            <div className="h-8 w-8 overflow-hidden rounded-full border border-slate-200 bg-slate-100">
              <User className="h-full w-full p-1.5 text-slate-400" />
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto max-w-6xl px-4 py-12 md:px-6">
        <div className="mb-10">
          <h1 className="mb-2 text-4xl font-bold tracking-tight text-slate-900">Ace your next interview.</h1>
          <p className="text-lg text-slate-500">Practice with a realistic AI interviewer tailored to your role and experience.</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-12">
          {/* Left Column: New Session */}
          <div className="lg:col-span-7 xl:col-span-8">
            <Card className="border-slate-200 bg-white shadow-sm">
              <CardHeader className="border-b border-slate-100 pb-5">
                <CardTitle className="text-xl">Start a New Session</CardTitle>
                <CardDescription className="text-sm text-slate-500">
                  Configure your interview context so the AI can tailor its questions.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="space-y-2">
                  <Label htmlFor="role" className="text-sm font-medium text-slate-700">Target Role</Label>
                  <Input 
                    id="role" 
                    placeholder="e.g. Senior Product Manager" 
                    className="h-11 border-slate-300 bg-white shadow-sm placeholder:text-slate-400 focus-visible:ring-blue-500"
                    defaultValue="Senior Frontend Engineer"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="jd" className="text-sm font-medium text-slate-700">Job Description</Label>
                  <Textarea 
                    id="jd" 
                    placeholder="Paste the job description here..." 
                    className="min-h-[140px] resize-y border-slate-300 shadow-sm placeholder:text-slate-400 focus-visible:ring-blue-500"
                    defaultValue="We are looking for a Senior Frontend Engineer to join our core product team. You will be responsible for building complex web applications using React, TypeScript, and Tailwind CSS. The ideal candidate has 5+ years of experience, a deep understanding of browser performance, and a passion for accessible UX."
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="resume" className="text-sm font-medium text-slate-700">Your Resume Context</Label>
                    <Button variant="outline" size="sm" className="h-8 gap-1.5 border-slate-200 text-xs font-medium text-slate-600 shadow-sm hover:bg-slate-50">
                      <Upload size={14} />
                      Upload PDF / DOCX
                    </Button>
                  </div>
                  <Textarea 
                    id="resume" 
                    placeholder="Or paste your resume text here..." 
                    className="min-h-[100px] resize-y border-slate-300 shadow-sm placeholder:text-slate-400 focus-visible:ring-blue-500"
                    defaultValue="I am a Frontend Engineer with 6 years of experience building scalable web apps. Previously at TechCorp, where I led the migration to a modern React stack, reducing bundle size by 40% and improving LCP. Strong skills in React, TypeScript, Node.js, and system design."
                  />
                </div>
              </CardContent>
              <CardFooter className="border-t border-slate-100 bg-slate-50/50 px-6 py-4">
                <Button className="w-full bg-blue-600 text-base font-medium text-white shadow-sm hover:bg-blue-700 sm:w-auto sm:px-8">
                  <Play className="mr-2 h-4 w-4" />
                  Start Interview
                </Button>
                <span className="ml-4 text-xs text-slate-500">Takes approx. 15-30 minutes</span>
              </CardFooter>
            </Card>
          </div>

          {/* Right Column: Past Sessions */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Past Sessions</h2>
              <Button variant="ghost" size="sm" className="h-8 text-xs text-blue-600 hover:bg-blue-50 hover:text-blue-700">
                View All
              </Button>
            </div>

            <div className="space-y-3">
              {/* Session Card 1 */}
              <div className="group cursor-pointer rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-blue-200 hover:shadow-md">
                <div className="mb-3 flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="rounded-md bg-blue-50 p-2">
                      <Briefcase size={16} className="text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-slate-900 group-hover:text-blue-700 transition-colors">Frontend Engineer at Stripe</h3>
                      <p className="text-xs text-slate-500">Today, 10:30 AM</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                  <Badge variant="outline" className="rounded-full border-green-200 bg-green-50 text-green-700 font-medium">
                    <CheckCircle2 size={12} className="mr-1 inline" /> Complete
                  </Badge>
                  <div className="flex items-center text-xs font-medium text-blue-600 opacity-0 transition-opacity group-hover:opacity-100">
                    Review Feedback <ChevronRight size={14} className="ml-0.5" />
                  </div>
                </div>
              </div>

              {/* Session Card 2 */}
              <div className="group cursor-pointer rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-blue-200 hover:shadow-md">
                <div className="mb-3 flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="rounded-md bg-blue-50 p-2">
                      <Briefcase size={16} className="text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-slate-900 group-hover:text-blue-700 transition-colors">Product Designer at Vercel</h3>
                      <p className="text-xs text-slate-500">Yesterday</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                  <Badge variant="outline" className="rounded-full border-blue-200 bg-blue-50 text-blue-700 font-medium">
                    <Clock size={12} className="mr-1 inline" /> In Progress
                  </Badge>
                  <div className="flex items-center text-xs font-medium text-blue-600 opacity-0 transition-opacity group-hover:opacity-100">
                    Resume <ChevronRight size={14} className="ml-0.5" />
                  </div>
                </div>
              </div>

              {/* Session Card 3 */}
              <div className="group cursor-pointer rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-blue-200 hover:shadow-md opacity-75">
                <div className="mb-3 flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="rounded-md bg-slate-50 p-2">
                      <Briefcase size={16} className="text-slate-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-slate-900 group-hover:text-blue-700 transition-colors">Backend Developer at Meta</h3>
                      <p className="text-xs text-slate-500">Oct 12, 2023</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                  <Badge variant="outline" className="rounded-full border-green-200 bg-green-50 text-green-700 font-medium">
                    <CheckCircle2 size={12} className="mr-1 inline" /> Complete
                  </Badge>
                  <div className="flex items-center text-xs font-medium text-blue-600 opacity-0 transition-opacity group-hover:opacity-100">
                    Review Feedback <ChevronRight size={14} className="ml-0.5" />
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
