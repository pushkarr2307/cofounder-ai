import React, { useState, useEffect } from 'react';
import type { ProjectIdea, StudentProfile } from '../types';
import { storageService } from '../services/storageService';
import { aiService } from '../services/aiService';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  RotateCcw,
  SlidersHorizontal,
  X
} from 'lucide-react';

interface ProjectIdeasProps {
  profile: StudentProfile;
  onSelectProject: (project: ProjectIdea, action: 'challenge' | 'blueprint') => void;
}

export const ProjectIdeas: React.FC<ProjectIdeasProps> = ({ profile, onSelectProject }) => {
  const [ideas, setIdeas] = useState<ProjectIdea[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCompare, setShowCompare] = useState(false);

  useEffect(() => {
    loadIdeas();
  }, []);

  const loadIdeas = async () => {
    const existing = storageService.getProjectIdeas();
    if (existing && existing.length > 0) {
      setIdeas(existing);
    } else {
      setLoading(true);
      try {
        const fetched = await aiService.generateProjectIdeas(profile, storageService.getDiscoveryResponses());
        setIdeas(fetched);
      } catch (e) {
        console.error('Error fetching ideas:', e);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleRegenerate = async () => {
    setLoading(true);
    try {
      const fresh = await aiService.generateProjectIdeas(profile, storageService.getDiscoveryResponses());
      setIdeas(fresh);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 space-y-6 select-none">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Curriculum Matcher</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
            Your Project Shortlist
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            Projects selected specifically for your skills, interests and constraints.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowCompare(!showCompare)}
            className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 hover:border-slate-300 text-slate-700 font-semibold text-xs shadow-xs transition-all flex items-center gap-2"
          >
            <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
            <span>Compare Projects</span>
          </button>

          <button
            onClick={handleRegenerate}
            disabled={loading}
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors flex items-center gap-1.5"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Re-Generate</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center space-y-4">
          <div className="w-12 h-12 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin mx-auto"></div>
          <p className="text-sm font-semibold text-slate-600">Generating tailored project options with Gemini AI...</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {ideas.map((idea) => {
            const isPick = idea.isAIPick;
            return (
              <div
                key={idea.id}
                className={`bg-white rounded-2xl border transition-all duration-300 flex flex-col justify-between relative overflow-hidden ${
                  isPick
                    ? 'border-indigo-500 ring-2 ring-indigo-500/20 shadow-xl'
                    : 'border-slate-200/90 hover:border-slate-300 shadow-sm hover:shadow-md'
                }`}
              >
                {isPick && (
                  <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-[11px] font-bold py-1.5 px-4 text-center flex items-center justify-center gap-1.5 uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>AI Co-Founder Pick</span>
                  </div>
                )}

                <div className="p-6 space-y-5 flex-1">
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg leading-snug">{idea.projectName}</h3>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">{idea.summary}</p>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="text-base font-extrabold text-indigo-600">{idea.matchScore}%</div>
                      <div className="text-[9px] font-bold text-slate-400 uppercase">Match</div>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="text-base font-extrabold text-emerald-600">{idea.feasibilityScore}%</div>
                      <div className="text-[9px] font-bold text-slate-400 uppercase">Feasibility</div>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="text-base font-extrabold text-purple-600">{idea.innovationScore}%</div>
                      <div className="text-[9px] font-bold text-slate-400 uppercase">Innovation</div>
                    </div>
                  </div>

                  <div>
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Tech Stack</div>
                    <div className="flex flex-wrap gap-1.5">
                      {idea.techStack.map((tech, i) => (
                        <span key={i} className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-indigo-50/60 border border-indigo-100">
                    <div className="text-xs font-bold text-indigo-900 mb-0.5">Why this fits you:</div>
                    <p className="text-xs text-indigo-800 leading-snug">{idea.whyItFits}</p>
                  </div>

                  {idea.risks && idea.risks.length > 0 && (
                    <div className="space-y-1">
                      <div className="text-[11px] font-bold text-amber-700 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        <span>Potential Risks</span>
                      </div>
                      <p className="text-xs text-slate-500 leading-tight truncate">{idea.risks[0]}</p>
                    </div>
                  )}
                </div>

                <div className="p-4 bg-slate-50/80 border-t border-slate-100 flex flex-col gap-2">
                  <button
                    onClick={() => {
                      storageService.saveSelectedProject(idea);
                      onSelectProject(idea, 'challenge');
                    }}
                    className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-2"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Challenge This Idea</span>
                  </button>

                  <button
                    onClick={() => {
                      storageService.saveSelectedProject(idea);
                      onSelectProject(idea, 'blueprint');
                    }}
                    className="w-full py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>View Blueprint Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showCompare && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Compare Shortlisted Projects</h3>
                <p className="text-xs text-slate-500">Side-by-side comparison of scores, stacks and risks</p>
              </div>
              <button onClick={() => setShowCompare(false)} className="p-2 rounded-lg text-slate-400 hover:bg-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {ideas.map((item) => (
                <div key={item.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <h4 className="font-bold text-slate-900 text-sm">{item.projectName}</h4>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between"><span>Match:</span><strong className="text-indigo-600">{item.matchScore}%</strong></div>
                    <div className="flex justify-between"><span>Feasibility:</span><strong className="text-emerald-600">{item.feasibilityScore}%</strong></div>
                    <div className="flex justify-between"><span>Innovation:</span><strong className="text-purple-600">{item.innovationScore}%</strong></div>
                  </div>
                  <div className="pt-2 border-t border-slate-200 text-xs">
                    <div className="font-semibold text-slate-700 mb-1">Tech Stack:</div>
                    <p className="text-slate-500">{item.techStack.join(', ')}</p>
                  </div>
                  <button
                    onClick={() => {
                      setShowCompare(false);
                      storageService.saveSelectedProject(item);
                      onSelectProject(item, 'challenge');
                    }}
                    className="w-full py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs mt-2"
                  >
                    Select This
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
