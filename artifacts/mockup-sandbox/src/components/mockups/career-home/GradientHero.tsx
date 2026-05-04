import React from "react";
import { Mic, Upload, Play, ChevronRight, FileText, Briefcase, Clock, Calendar, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

export function GradientHero() {
  const pastSessions = [
    {
      id: 1,
      role: "Frontend Engineer",
      company: "Stripe",
      date: "Oct 24, 2023",
      status: "completed",
      score: "85/100",
      accent: "border-indigo-500",
    },
    {
      id: 2,
      role: "Senior Product Manager",
      company: "Linear",
      date: "Oct 22, 2023",
      status: "completed",
      score: "92/100",
      accent: "border-cyan-500",
    },
    {
      id: 3,
      role: "UX Designer",
      company: "Vercel",
      date: "Oct 18, 2023",
      status: "in-progress",
      score: "-",
      accent: "border-pink-500",
    },
  ];

  return (
    <div className="min-h-screen w-full overflow-auto bg-gray-50 flex flex-col" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-indigo-600 via-blue-500 to-cyan-500 text-white overflow-hidden pb-32 pt-6">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl opacity-50 animate-pulse"></div>
          <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-cyan-300 rounded-full mix-blend-overlay filter blur-3xl opacity-60"></div>
          <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-indigo-300 rounded-full mix-blend-overlay filter blur-3xl opacity-40"></div>
        </div>

        {/* Navigation */}
        <div className="max-w-6xl mx-auto px-6 relative z-10 flex justify-between items-center mb-16">
          <div className="flex items-center gap-2">
            <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
              <Mic className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">Career Mirror</span>
          </div>
          <div className="flex items-center gap-6 text-sm font-medium">
            <a href="#" className="hover:text-white/80 transition-colors">Dashboard</a>
            <a href="#" className="hover:text-white/80 transition-colors">History</a>
            <a href="#" className="hover:text-white/80 transition-colors">Settings</a>
            <Button variant="secondary" className="bg-white text-indigo-600 hover:bg-gray-100 rounded-full font-semibold px-6">
              Upgrade
            </Button>
          </div>
        </div>

        {/* Hero Content */}
        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center space-y-6">
          <Badge className="bg-white/20 hover:bg-white/30 text-white border-none backdrop-blur-md px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            ✨ GPT-4 Powered Voice Interviews
          </Badge>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight leading-tight">
            Practice for your dream role.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 to-white">Out loud.</span>
          </h1>
          <p className="text-xl text-indigo-100 max-w-2xl mx-auto leading-relaxed">
            Upload your resume, paste a job description, and jump into a realistic voice interview. Get real-time feedback on your answers, tone, and pacing.
          </p>
        </div>
      </div>

      {/* Main Content Area - overlaps hero */}
      <div className="max-w-6xl mx-auto px-6 w-full relative z-20 -mt-24 pb-20 flex-1">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Left Column - New Session (60%) */}
          <div className="w-full lg:w-[60%]">
            <Card className="border-0 shadow-xl shadow-indigo-100/50 rounded-2xl overflow-hidden bg-white">
              <div className="h-2 w-full bg-gradient-to-r from-indigo-500 to-cyan-400"></div>
              <CardHeader className="pb-4 border-b border-gray-50 bg-white/50 backdrop-blur-sm">
                <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <Play className="w-5 h-5 text-indigo-500 fill-indigo-100" />
                  Start a New Session
                </CardTitle>
                <CardDescription className="text-gray-500 text-base">
                  Configure your AI interviewer context to get started.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="space-y-2">
                  <Label htmlFor="role" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-indigo-400" />
                    Target Role
                  </Label>
                  <Input 
                    id="role" 
                    placeholder="e.g. Senior Product Manager" 
                    className="h-12 border-gray-200 focus-visible:ring-indigo-500 rounded-xl bg-gray-50/50 focus:bg-white transition-colors text-base"
                    defaultValue="Senior Product Manager"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="jd" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-cyan-500" />
                    Job Description <span className="text-gray-400 font-normal ml-1">(Optional)</span>
                  </Label>
                  <Textarea 
                    id="jd" 
                    placeholder="Paste the job description here..." 
                    className="min-h-[120px] resize-none border-gray-200 focus-visible:ring-indigo-500 rounded-xl bg-gray-50/50 focus:bg-white transition-colors text-sm"
                    defaultValue="Looking for an experienced Product Manager to lead our core growth team. You will be responsible for defining the product roadmap, working closely with engineering and design, and driving user acquisition metrics..."
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Upload className="w-4 h-4 text-pink-400" />
                    Your Resume
                  </Label>
                  <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center gap-3 bg-gray-50/50 hover:bg-gray-50 hover:border-indigo-300 transition-all cursor-pointer group">
                    <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                      <FileText className="w-6 h-6 text-indigo-500" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-900">Upload PDF / DOCX</p>
                      <p className="text-xs text-gray-500 mt-1">or drag and drop here</p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-2 pb-6 px-6 bg-gray-50/30">
                <Button className="w-full h-14 text-base font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20 group">
                  Start Voice Interview
                  <Mic className="ml-2 w-5 h-5 group-hover:scale-110 transition-transform" />
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Right Column - Past Sessions (40%) */}
          <div className="w-full lg:w-[40%] space-y-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-indigo-500" />
                Recent Sessions
              </h3>
              
              <div className="space-y-4">
                {pastSessions.map((session) => (
                  <Card key={session.id} className={`border-l-4 ${session.accent} hover:shadow-md transition-all cursor-pointer group bg-white border-y border-r border-gray-100`}>
                    <CardContent className="p-5">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{session.role}</h4>
                          <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                            <span className="font-medium text-gray-700">{session.company}</span>
                          </p>
                        </div>
                        <Badge variant={session.status === 'completed' ? 'default' : 'secondary'} className={
                          session.status === 'completed' 
                            ? 'bg-green-100 text-green-700 hover:bg-green-200 border-none rounded-full px-2.5 py-0.5' 
                            : 'bg-amber-100 text-amber-700 hover:bg-amber-200 border-none rounded-full px-2.5 py-0.5'
                        }>
                          {session.status === 'completed' ? 'Completed' : 'In Progress'}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs text-gray-500 mt-4 pt-4 border-t border-gray-50">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          {session.date}
                        </div>
                        {session.status === 'completed' ? (
                          <div className="flex items-center gap-1.5 font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">
                            <CheckCircle className="w-3.5 h-3.5" />
                            Score: {session.score}
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 font-medium text-amber-600">
                            Resume session <ChevronRight className="w-3.5 h-3.5" />
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
            
            {/* Promo Card */}
            <Card className="bg-gradient-to-br from-indigo-50 to-cyan-50 border-none shadow-inner overflow-hidden relative">
              <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-cyan-200 rounded-full mix-blend-multiply filter blur-2xl opacity-50"></div>
              <CardContent className="p-6 relative z-10">
                <h4 className="font-bold text-indigo-900 mb-2">Want better results?</h4>
                <p className="text-sm text-indigo-700/80 mb-4 leading-relaxed">
                  Unlock detailed analytics, custom interview scenarios, and comprehensive feedback reports.
                </p>
                <Button variant="outline" className="w-full border-indigo-200 text-indigo-700 hover:bg-indigo-100/50 bg-white/50 backdrop-blur-sm">
                  View Pro Plans
                </Button>
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
}
