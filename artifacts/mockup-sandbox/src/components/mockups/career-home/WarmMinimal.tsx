import React from "react";
import { Mic, Upload, Play, ChevronRight, FileText, Activity, Clock, CheckCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

export function WarmMinimal() {
  return (
    <div 
      className="min-h-screen w-full overflow-auto font-sans" 
      style={{ 
        backgroundColor: "#faf9f7",
        fontFamily: "'Plus Jakarta Sans', 'DM Sans', sans-serif" 
      }}
    >
      {/* Header */}
      <header className="sticky top-0 z-10 bg-[#faf9f7]/80 backdrop-blur-md border-b border-[#e8e4dd]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-sm">
              <Mic className="w-5 h-5" />
            </div>
            <span className="font-semibold text-xl tracking-tight text-slate-800">Career Mirror</span>
            <span className="text-slate-400 ml-2 text-sm hidden sm:inline-block">/ your AI interview coach</span>
          </div>
          <nav className="flex items-center gap-6 text-sm font-medium text-slate-600">
            <a href="#" className="hover:text-teal-600 transition-colors">Dashboard</a>
            <a href="#" className="hover:text-teal-600 transition-colors">History</a>
            <a href="#" className="hover:text-teal-600 transition-colors">Resources</a>
            <div className="w-8 h-8 rounded-full bg-slate-200 ml-2 border-2 border-white shadow-sm overflow-hidden">
              <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Felix&backgroundColor=e8e4dd" alt="User" />
            </div>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 tracking-tight mb-4 flex items-center gap-3">
            Land your dream role <Sparkles className="text-amber-400 w-8 h-8" />
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl">
            Practice with an AI coach that tailors questions to your target role and gives you actionable feedback on your delivery.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* LEFT COLUMN - 60% */}
          <div className="lg:col-span-7 space-y-6">
            <Card className="border-[#e8e4dd] shadow-sm rounded-[24px] overflow-hidden bg-white/70 backdrop-blur-sm">
              <div className="h-2 w-full bg-gradient-to-r from-teal-500 to-emerald-400" />
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl text-slate-800">New Session</CardTitle>
                <CardDescription className="text-slate-500 text-base">Configure your mock interview context.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                
                <div className="space-y-2">
                  <Label htmlFor="role" className="text-slate-700 font-medium">Target Role</Label>
                  <Input 
                    id="role" 
                    placeholder="e.g. Senior Product Manager" 
                    className="border-[#e8e4dd] bg-[#faf9f7] rounded-xl focus-visible:ring-teal-500 focus-visible:border-teal-500 h-12 text-base px-4 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="jd" className="text-slate-700 font-medium">Job Description <span className="text-slate-400 font-normal">(Optional)</span></Label>
                  <Textarea 
                    id="jd" 
                    placeholder="Paste the job description here so the AI can ask highly specific questions..." 
                    className="border-[#e8e4dd] bg-[#faf9f7] rounded-xl min-h-[120px] focus-visible:ring-teal-500 focus-visible:border-teal-500 resize-none transition-all p-4"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="resume" className="text-slate-700 font-medium">Your Resume</Label>
                    <Button variant="ghost" size="sm" className="h-8 text-teal-600 hover:text-teal-700 hover:bg-teal-50 rounded-lg font-medium">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload PDF / DOCX
                    </Button>
                  </div>
                  <Textarea 
                    id="resume" 
                    placeholder="Or paste your resume text here..." 
                    className="border-[#e8e4dd] bg-[#faf9f7] rounded-xl min-h-[120px] focus-visible:ring-teal-500 focus-visible:border-teal-500 resize-none transition-all p-4"
                  />
                </div>

              </CardContent>
              <CardFooter className="pt-2 pb-8 px-6">
                <Button className="w-full h-14 rounded-full bg-teal-600 hover:bg-teal-700 text-white text-lg font-medium shadow-md hover:shadow-lg transition-all group">
                  <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" fill="currentColor" />
                  Start Interview
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* RIGHT COLUMN - 40% */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-semibold text-slate-800">Past Sessions</h2>
              <Button variant="link" className="text-teal-600 hover:text-teal-700 font-medium p-0">View all</Button>
            </div>

            <div className="space-y-4">
              
              {/* Card 1 */}
              <div className="group bg-white border border-[#e8e4dd] rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-teal-200 transition-all cursor-pointer">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center text-teal-600">
                      <CheckCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800">Frontend Engineer</h3>
                      <p className="text-sm text-slate-500">Stripe</p>
                    </div>
                  </div>
                  <Badge className="bg-teal-100 text-teal-700 hover:bg-teal-200 border-none rounded-full px-3">Completed</Badge>
                </div>
                <div className="flex items-center justify-between text-sm mt-4 text-slate-500">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> 45 min</span>
                    <span className="flex items-center gap-1.5"><Activity className="w-4 h-4" /> Score: 88/100</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-teal-500 transition-colors" />
                </div>
              </div>

              {/* Card 2 */}
              <div className="group bg-white border border-[#e8e4dd] rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-teal-200 transition-all cursor-pointer">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-500">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800">Product Designer</h3>
                      <p className="text-sm text-slate-500">Airbnb</p>
                    </div>
                  </div>
                  <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-200 border-none rounded-full px-3">In Progress</Badge>
                </div>
                <div className="flex items-center justify-between text-sm mt-4 text-slate-500">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> 12 min</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-teal-500 transition-colors" />
                </div>
              </div>

              {/* Card 3 */}
              <div className="group bg-white border border-[#e8e4dd] rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-teal-200 transition-all cursor-pointer">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center text-teal-600">
                      <CheckCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800">Engineering Manager</h3>
                      <p className="text-sm text-slate-500">Vercel</p>
                    </div>
                  </div>
                  <Badge className="bg-teal-100 text-teal-700 hover:bg-teal-200 border-none rounded-full px-3">Completed</Badge>
                </div>
                <div className="flex items-center justify-between text-sm mt-4 text-slate-500">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> 30 min</span>
                    <span className="flex items-center gap-1.5"><Activity className="w-4 h-4" /> Score: 92/100</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-teal-500 transition-colors" />
                </div>
              </div>

            </div>
            
            <div className="mt-8 bg-teal-50 rounded-2xl p-6 border border-teal-100 flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-sm text-teal-600">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-teal-900 mb-1">Pro Tip</h4>
                <p className="text-sm text-teal-800 leading-relaxed">
                  Uploading a specific job description helps the AI interviewer ask targeted situational questions rather than generic behavioral ones.
                </p>
              </div>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
}
