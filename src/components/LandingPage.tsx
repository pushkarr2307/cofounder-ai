import React, { useState } from 'react';
import { PublicNavbar } from './Navigation';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Rocket,
  Compass,
  FileCode2,
  Users,
  BrainCircuit,
  Zap,
  Star
} from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  const [selectedSkills, setSelectedSkills] = useState<string[]>(['Python', 'RAG / LLM', 'React']);
  const demoDuration = '6 Weeks';

  const toggleDemoSkill = (skill: string) => {
    setSelectedSkills(prev => 
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  const liveMatchScore = Math.min(98, 70 + selectedSkills.length * 7);
  const liveFeasibilityScore = Math.min(95, 80 + (demoDuration === '6 Weeks' ? 10 : 5));
  const liveInnovationScore = selectedSkills.includes('RAG / LLM') ? 92 : 84;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col relative overflow-hidden select-none">
      <PublicNavbar onStartBuilding={onStart} />

      <div className="absolute top-12 left-1/4 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none animate-orb-1"></div>
      <div className="absolute top-40 right-1/4 w-[400px] h-[400px] bg-purple-600/20 rounded-full blur-[100px] pointer-events-none animate-orb-2"></div>
      <div className="absolute bottom-20 left-1/3 w-[600px] h-[600px] bg-pink-600/10 rounded-full blur-[140px] pointer-events-none"></div>

      <section className="relative pt-12 pb-16 md:pt-20 md:pb-28 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid md:grid-cols-12 gap-12 items-center">
          
          <div className="md:col-span-6 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-950/80 border border-indigo-500/40 text-indigo-300 font-semibold text-xs shadow-lg shadow-indigo-950/50">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>AI-Powered Final-Year Project Partner</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.1]">
              Meet Your AI <br />
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Project Co-Founder
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-xl font-normal leading-relaxed">
              Turn your skills, constraints and interests into a production-grade project. We stress-test bad scope, build visual architecture, and guide execution.
            </p>

            <div className="pt-2 flex flex-wrap gap-4 items-center">
              <button
                onClick={onStart}
                className="px-8 py-4 rounded-2xl btn-shimmer text-white font-extrabold text-sm shadow-xl shadow-indigo-900/50 hover:shadow-indigo-700/60 transition-all flex items-center gap-2.5 transform hover:-translate-y-0.5"
              >
                <span>Meet My Co-Founder</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="#demo"
                className="px-6 py-4 rounded-2xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700/80 font-semibold text-sm transition-all flex items-center gap-2 backdrop-blur-md"
              >
                <span>Try Live Matcher</span>
                <Zap className="w-4 h-4 text-amber-400" />
              </a>
            </div>

            <div className="pt-6 border-t border-slate-800 flex items-center gap-8 text-xs text-slate-400 font-medium">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-400" />
                <span><strong className="text-white font-bold">10,000+</strong> Students</span>
              </div>
              <div className="flex items-center gap-2">
                <FileCode2 className="w-4 h-4 text-purple-400" />
                <span><strong className="text-white font-bold">500+</strong> Projects</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span><strong className="text-white font-bold">95%</strong> Pass Rate</span>
              </div>
            </div>
          </div>

          <div id="demo" className="md:col-span-6 relative">
            <div className="gradient-border shadow-2xl">
              <div className="gradient-border-inner bg-slate-900/90 backdrop-blur-2xl p-6 space-y-5 text-left text-slate-100">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-md">
                      <BrainCircuit className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-base">Live Interactive Feasibility Preview</h3>
                      <span className="text-[11px] text-indigo-400 font-semibold">Test your skills live below</span>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-400 text-[10px] font-bold border border-emerald-800">
                    Live Simulator
                  </span>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">Select Your Tech Stack:</label>
                  <div className="flex flex-wrap gap-2">
                    {['Python', 'RAG / LLM', 'React', 'FastAPI', 'Node.js', 'ChromaDB'].map(skill => {
                      const active = selectedSkills.includes(skill);
                      return (
                        <button
                          key={skill}
                          onClick={() => toggleDemoSkill(skill)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                            active
                              ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm shadow-indigo-900'
                              : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:border-slate-600'
                          }`}
                        >
                          {skill} {active ? '✓' : '+'}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-white text-sm">AI Campus Copilot</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">RAG Document Assistant for University Syllabus</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-indigo-950 text-indigo-300 text-[10px] font-bold border border-indigo-800">
                      Top Match
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                      <div className="text-xl font-black text-indigo-400">{liveMatchScore}%</div>
                      <div className="text-[9px] font-bold text-slate-500 uppercase">Match</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                      <div className="text-xl font-black text-emerald-400">{liveFeasibilityScore}%</div>
                      <div className="text-[9px] font-bold text-slate-500 uppercase">Feasibility</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                      <div className="text-xl font-black text-purple-400">{liveInnovationScore}%</div>
                      <div className="text-[9px] font-bold text-slate-500 uppercase">Innovation</div>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-indigo-950/60 border border-indigo-900/60 flex items-center justify-between text-xs">
                    <span className="text-indigo-300 font-semibold">Stress-Test Pivot Status:</span>
                    <span className="text-emerald-400 font-bold">Scope Optimized (6 Weeks)</span>
                  </div>
                </div>

                <button
                  onClick={onStart}
                  className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <span>Build This Project Blueprint</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-6 bg-slate-950/80 border-y border-slate-800/80">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <span className="text-[11px] font-bold uppercase tracking-widest text-slate-500 block mb-3">
            Trusted by Final-Year Students Across Top Institutes
          </span>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 text-sm font-bold text-slate-400 opacity-75">
            <span>IIT Bombay</span>
            <span>NIT Trichy</span>
            <span>BITS Pilani</span>
            <span>DTU Delhi</span>
            <span>VTU Bangalore</span>
          </div>
        </div>
      </section>

      <section id="features" className="py-20 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <span className="px-3 py-1 rounded-full bg-indigo-950 text-indigo-400 text-xs font-bold border border-indigo-800">
            Why We Are Different
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Built Like a Real Startup Co-Founder
          </h2>
          <p className="text-slate-400 text-sm">
            Most tools dump 50 generic CRUD project ideas. We challenge scope and ensure you ship on time.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-8 rounded-3xl bg-slate-800/60 border border-slate-700/80 hover:border-indigo-500/80 transition-all duration-300 space-y-4 backdrop-blur-md hover:-translate-y-1 shadow-lg">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
              <Compass className="w-7 h-7" />
            </div>
            <h3 className="font-extrabold text-xl text-white">DISCOVER</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Find customized project ideas matched strictly to your department, timeline, tech stack, and career goals.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-slate-800/60 border border-slate-700/80 hover:border-purple-500/80 transition-all duration-300 space-y-4 backdrop-blur-md hover:-translate-y-1 shadow-lg">
            <div className="w-14 h-14 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h3 className="font-extrabold text-xl text-white">VALIDATE</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Stress-test unrealistic compute or dataset demands before wasting 6 weeks on a failing topic.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-slate-800/60 border border-slate-700/80 hover:border-emerald-500/80 transition-all duration-300 space-y-4 backdrop-blur-md hover:-translate-y-1 shadow-lg">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <Rocket className="w-7 h-7" />
            </div>
            <h3 className="font-extrabold text-xl text-white">BUILD</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Generate visual architecture, tech stack rationales, interactive tasks, and ask your AI mentor for viva prep.
            </p>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-20 bg-slate-950/90 border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center space-y-12">
          <div>
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Execution Workflow</span>
            <h2 className="text-3xl font-extrabold text-white mt-1">
              5 Steps to a High-Impact Final Project
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 text-left">
            {[
              { step: '01', title: 'Understand You', desc: 'Input your branch, skills, team size & budget.' },
              { step: '02', title: 'Discover Ideas', desc: 'AI discovery conversation yields 3 tailored projects.' },
              { step: '03', title: 'Reality Check', desc: 'Stress-test scope creep & accept AI pivot advice.' },
              { step: '04', title: 'Build Blueprint', desc: 'Generate system architecture & tech stack rationale.' },
              { step: '05', title: 'Execute With AI', desc: 'Track action items in workspace & ask AI mentor.' }
            ].map((item, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 relative">
                <div className="text-3xl font-black text-indigo-500/30 mb-2">{item.step}</div>
                <h4 className="font-bold text-white text-sm mb-1">{item.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-tr from-indigo-950 via-purple-950 to-slate-950 border-t border-slate-800 text-white mt-auto">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight">
            Ready to build something worth showing?
          </h2>
          <p className="text-indigo-200 text-base max-w-xl mx-auto">
            Stop stressing over generic topics. Let your AI Co-Founder help you design, validate, and build a project you'll be proud to demo.
          </p>
          <div>
            <button
              onClick={onStart}
              className="px-10 py-5 rounded-2xl btn-shimmer text-white font-extrabold text-base shadow-2xl transition-all inline-flex items-center gap-3 transform hover:-translate-y-1"
            >
              <span>Meet Your Co-Founder</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
