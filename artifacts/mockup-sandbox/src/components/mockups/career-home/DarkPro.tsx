import React from "react";
import { Mic, Upload, Play, ChevronRight, FileText, Activity, Terminal, CheckCircle2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

export function DarkPro() {
  return (
    <div 
      className="min-h-screen w-full overflow-auto bg-slate-950 text-slate-300 font-sans selection:bg-blue-500/30"
      style={{
        backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(59, 130, 246, 0.15) 1px, transparent 0)',
        backgroundSize: '24px 24px'
      }}
    >
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Terminal size={18} />
            </div>
            <div>
              <h1 className="text-slate-100 font-medium tracking-tight">Career Mirror</h1>
              <p className="text-[10px] uppercase tracking-widest text-slate-500 font-mono">v2.0.4-beta</p>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center gap-6 text-sm font-mono">
            <a href="#" className="text-blue-400">/sessions</a>
            <a href="#" className="text-slate-500 hover:text-slate-300 transition-colors">/analytics</a>
            <a href="#" className="text-slate-500 hover:text-slate-300 transition-colors">/settings</a>
            <div className="h-4 w-px bg-slate-800"></div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-slate-400 text-xs">System Online</span>
            </div>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: New Session */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-semibold text-slate-100 flex items-center gap-2">
                <Activity size={20} className="text-blue-400" />
                Initialize Session
              </h2>
            </div>
            
            <Card className="bg-slate-900 border-slate-800 shadow-2xl">
              <CardContent className="p-6 space-y-6">
                
                <div className="space-y-2">
                  <Label htmlFor="role" className="text-xs uppercase tracking-wider font-mono text-slate-400">Target Role</Label>
                  <Input 
                    id="role" 
                    placeholder="e.g. Senior Product Manager" 
                    defaultValue="Senior Frontend Engineer"
                    className="bg-slate-950 border-slate-800 text-slate-200 placeholder:text-slate-600 focus-visible:ring-blue-500/50 focus-visible:border-blue-500/50 h-11"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="jd" className="text-xs uppercase tracking-wider font-mono text-slate-400">Job Description Context</Label>
                  <Textarea 
                    id="jd" 
                    placeholder="Paste the job description here..." 
                    className="bg-slate-950 border-slate-800 text-slate-200 placeholder:text-slate-600 focus-visible:ring-blue-500/50 focus-visible:border-blue-500/50 min-h-[120px] resize-none"
                    defaultValue="Looking for a Senior Frontend Engineer to lead architecture for our core web application. Must have deep expertise in React, TypeScript, and modern state management. Experience with performance optimization and accessible UI components is required. You will mentor junior developers and work closely with product and design."
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="resume" className="text-xs uppercase tracking-wider font-mono text-slate-400">Candidate Profile (Resume)</Label>
                    <Button variant="outline" size="sm" className="h-8 text-xs bg-transparent border-blue-500/30 text-blue-400 hover:bg-blue-500/10 hover:text-blue-300 font-mono">
                      <Upload size={14} className="mr-2" />
                      Import PDF/DOCX
                    </Button>
                  </div>
                  <Textarea 
                    id="resume" 
                    placeholder="Paste your resume or use the upload button above..." 
                    className="bg-slate-950 border-slate-800 text-slate-200 placeholder:text-slate-600 focus-visible:ring-blue-500/50 focus-visible:border-blue-500/50 min-h-[120px] resize-none font-mono text-sm"
                    defaultValue="Jane Doe | Frontend Engineer&#10;5+ years experience building scalable web applications.&#10;&#10;EXPERIENCE&#10;Stripe | UI Engineer (2021-Present)&#10;- Led migration to Next.js reducing load times by 40%&#10;- Built accessible component library used by 50+ developers&#10;- Mentored 3 junior engineers"
                  />
                </div>

              </CardContent>
              <CardFooter className="bg-slate-950/50 border-t border-slate-800 p-6">
                <Button className="w-full bg-blue-600 hover:bg-blue-500 text-white h-12 text-base font-medium transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)]">
                  <Play size={18} className="mr-2 fill-current" />
                  Execute Interview
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* RIGHT COLUMN: Past Sessions */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-semibold text-slate-100 flex items-center gap-2">
                <Clock size={20} className="text-slate-400" />
                Session History
              </h2>
              <Button variant="ghost" size="sm" className="text-xs text-slate-500 hover:text-slate-300 h-8 font-mono">
                View All
              </Button>
            </div>
            
            <div className="space-y-4">
              {/* Session Card 1 */}
              <Card className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-colors cursor-pointer group">
                <CardContent className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 font-mono text-[10px] uppercase">
                      <CheckCircle2 size={10} className="mr-1 inline-block" /> Completed
                    </Badge>
                    <span className="text-xs text-slate-500 font-mono">Today, 14:30</span>
                  </div>
                  <h3 className="text-slate-100 font-medium mb-1 group-hover:text-blue-400 transition-colors">Frontend Engineer at Stripe</h3>
                  <div className="flex items-center gap-4 text-sm text-slate-400 mt-4">
                    <div className="flex items-center gap-1.5">
                      <Mic size={14} className="text-slate-500" />
                      <span>45 min</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <FileText size={14} className="text-slate-500" />
                      <span>Score: 85/100</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Session Card 2 */}
              <Card className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-colors cursor-pointer group">
                <CardContent className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20 font-mono text-[10px] uppercase">
                      <Activity size={10} className="mr-1 inline-block animate-pulse" /> In Progress
                    </Badge>
                    <span className="text-xs text-slate-500 font-mono">Yesterday</span>
                  </div>
                  <h3 className="text-slate-100 font-medium mb-1 group-hover:text-blue-400 transition-colors">Product Manager at Vercel</h3>
                  <div className="flex items-center gap-4 text-sm text-slate-400 mt-4">
                    <div className="flex items-center gap-1.5">
                      <Mic size={14} className="text-slate-500" />
                      <span>12 min</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Session Card 3 */}
              <Card className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-colors cursor-pointer group opacity-75">
                <CardContent className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <Badge variant="outline" className="bg-slate-800 text-slate-400 border-slate-700 font-mono text-[10px] uppercase">
                      <CheckCircle2 size={10} className="mr-1 inline-block" /> Completed
                    </Badge>
                    <span className="text-xs text-slate-500 font-mono">Oct 12</span>
                  </div>
                  <h3 className="text-slate-100 font-medium mb-1 group-hover:text-blue-400 transition-colors">Full Stack Developer at Linear</h3>
                  <div className="flex items-center gap-4 text-sm text-slate-400 mt-4">
                    <div className="flex items-center gap-1.5">
                      <Mic size={14} className="text-slate-500" />
                      <span>30 min</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <FileText size={14} className="text-slate-500" />
                      <span>Score: 92/100</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
