import React from "react";
import { Send, Bot, FileText, ChevronRight, Sparkles, User, Briefcase, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";

export function ConversationalSetup() {
  return (
    <div className="min-h-screen w-full flex bg-white font-sans text-slate-900">
      {/* Left Sidebar */}
      <aside className="w-[260px] border-r border-slate-200 bg-slate-50/50 flex flex-col flex-shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-slate-200">
          <div className="flex items-center gap-2 font-semibold text-slate-900">
            <div className="w-6 h-6 rounded-md bg-blue-600 flex items-center justify-center text-white">
              <Bot className="w-4 h-4" />
            </div>
            Career Mirror
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-6">
          <div className="px-4 mb-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Past Sessions
          </div>
          <div className="px-3 space-y-1">
            {[
              { role: "Product Manager", company: "Stripe", date: "2 days ago" },
              { role: "Frontend Engineer", company: "Vercel", date: "Last week" },
              { role: "Full Stack Dev", company: "Startup", date: "2 weeks ago" },
            ].map((session, i) => (
              <button
                key={i}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors flex items-start gap-3 group"
              >
                <div className="mt-0.5 p-1.5 rounded bg-slate-200 text-slate-600 group-hover:bg-white group-hover:text-blue-600 transition-colors">
                  <Briefcase className="w-3.5 h-3.5" />
                </div>
                <div className="overflow-hidden">
                  <div className="text-sm font-medium text-slate-700 truncate">
                    {session.role}
                  </div>
                  <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                    <span>{session.company}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                    <span>{session.date}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
        
        <div className="p-4 border-t border-slate-200">
          <button className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-slate-100 transition-colors">
            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
              <User className="w-4 h-4 text-slate-600" />
            </div>
            <div className="text-sm font-medium text-slate-700">Alex Smith</div>
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-white">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-6 border-b border-slate-200 shrink-0">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-semibold text-slate-900">Interview Setup</h1>
            <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-50 border-blue-100 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Powered by AI
            </Badge>
          </div>
          <Button variant="ghost" size="sm" className="text-slate-500">
            Skip to settings
          </Button>
        </header>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          {/* AI Message */}
          <div className="flex items-end gap-2 max-w-2xl">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mb-1">
              <Bot className="w-4 h-4 text-blue-600" />
            </div>
            <div className="bg-slate-100 text-slate-800 px-5 py-3.5 rounded-2xl rounded-bl-sm text-[15px] leading-relaxed shadow-sm">
              👋 Hi! I'm your AI interview coach. Let's set up your mock interview. What role are you applying for?
            </div>
          </div>

          {/* User Message */}
          <div className="flex items-end gap-2 max-w-2xl ml-auto justify-end">
            <div className="bg-blue-600 text-white px-5 py-3.5 rounded-2xl rounded-br-sm text-[15px] shadow-sm">
              Senior Frontend Engineer
            </div>
          </div>

          {/* AI Message */}
          <div className="flex items-end gap-2 max-w-2xl">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mb-1">
              <Bot className="w-4 h-4 text-blue-600" />
            </div>
            <div className="bg-slate-100 text-slate-800 px-5 py-3.5 rounded-2xl rounded-bl-sm text-[15px] leading-relaxed shadow-sm">
              Great choice! Frontend roles at top companies can be competitive. Now, paste the job description — even a partial one helps me tailor your questions.
            </div>
          </div>

          {/* User Message */}
          <div className="flex items-end gap-2 max-w-2xl ml-auto justify-end">
            <div className="bg-blue-600 text-white px-5 py-3.5 rounded-2xl rounded-br-sm text-[15px] shadow-sm leading-relaxed">
              We are looking for a Senior Frontend Engineer to join our product team. You'll build scalable React and TypeScript applications. 5+ years of experience required, strong system design background preferred.
            </div>
          </div>

          {/* AI Message */}
          <div className="flex items-end gap-2 max-w-2xl">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mb-1">
              <Bot className="w-4 h-4 text-blue-600" />
            </div>
            <div className="bg-slate-100 text-slate-800 px-5 py-3.5 rounded-2xl rounded-bl-sm text-[15px] leading-relaxed shadow-sm">
              Perfect. Last step — give me a brief summary of your experience and key skills. This helps me spot gaps and craft relevant questions.
            </div>
          </div>

          {/* Typing Indicator */}
          <div className="flex items-end gap-2 max-w-2xl">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mb-1">
              <Bot className="w-4 h-4 text-blue-600" />
            </div>
            <div className="bg-slate-100 px-5 py-4 rounded-2xl rounded-bl-sm shadow-sm flex items-center gap-1.5 h-[52px]">
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
            </div>
          </div>
          
          <div className="h-4" /> {/* Spacer */}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-slate-200 bg-white shrink-0">
          <div className="max-w-4xl mx-auto">
            <div className="relative flex items-end gap-3 bg-slate-50 border border-slate-200 rounded-xl p-2 shadow-sm focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
              <Textarea 
                placeholder="Paste your resume or type a summary..."
                className="min-h-[44px] h-[44px] max-h-[200px] resize-none border-0 bg-transparent focus-visible:ring-0 px-3 py-3 text-[15px] shadow-none"
              />
              <Button size="icon" className="h-10 w-10 shrink-0 rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-sm mb-0.5">
                <Send className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="flex items-center gap-3 mt-3 px-2">
              <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-100">
                <span className="text-[10px]">✓</span> Role captured
              </div>
              <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-100">
                <span className="text-[10px]">✓</span> JD captured
              </div>
              <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 bg-slate-50 px-2 py-1 rounded-full border border-slate-200">
                <span className="w-1 h-1 rounded-full bg-slate-400"></span> Resume pending
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
