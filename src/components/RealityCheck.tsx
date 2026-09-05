import React, { useState, useEffect } from 'react';
import type { ProjectIdea, StudentProfile, RealityCheckResult } from '../types';
import { storageService, DEFAULT_REALITY_CHECK } from '../services/storageService';
import { aiService } from '../services/aiService';
import {
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  HelpCircle,
  TrendingUp,
  Loader2,
  Sparkles,
  X
} from 'lucide-react';

interface RealityCheckProps {
  profile: StudentProfile;
  selectedProject: ProjectIdea;
  onProceedToBlueprint: () => void;
}

export const RealityCheck: React.FC<RealityCheckProps> = ({
  profile,
  selectedProject,
  onProceedToBlueprint
}) => {
  const [realityCheck, setRealityCheck] = useState<RealityCheckResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [showAskWhy, setShowAskWhy] = useState(false);

  useEffect(() => {
    runStressTest();
  }, [selectedProject]);

  const runStressTest = async () => {
    setLoading(true);
    try {
      const result = await aiService.challengeProject(profile, selectedProject);
      setRealityCheck(result);
    } catch (e) {
      console.error('Reality check error:', e);
      setRealityCheck(DEFAULT_REALITY_CHECK);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = () => {
    if (realityCheck) {
      const updated = { ...realityCheck, accepted: true };
      storageService.saveRealityCheck(updated);
    }
    onProceedToBlueprint();
  };

  const handleKeepOriginal = () => {
    if (realityCheck) {
      const updated = { ...realityCheck, accepted: false };
      storageService.saveRealityCheck(updated);
    }
    onProceedToBlueprint();
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 space-y-6 select-none animate-fade-in">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-100 text-purple-700 text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Co-Founder Stress-Test Engine</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
          Let's Stress-Test Your Idea
        </h1>
        <p className="text-slate-600 text-sm mt-1">
          A good co-founder doesn't just agree with you. We challenge bad assumptions before you waste 6 weeks.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden p-6 sm:p-8 space-y-8">
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Selected Target Project</span>
            <h3 className="text-lg font-bold text-slate-900">{selectedProject.projectName}</h3>
            <p className="text-xs text-slate-500 mt-0.5">{selectedProject.summary}</p>
          </div>
          <div className="text-right">
            <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
              {profile.duration} Timeline
            </span>
          </div>
        </div>

        {loading ? (
          <div className="py-16 text-center space-y-3">
            <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mx-auto" />
            <p className="text-sm font-semibold text-slate-700">Evaluating scope creep, compute limits, and technical risks...</p>
          </div>
        ) : (
          realityCheck && (
            <div className="space-y-6">
              <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-3">
                <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>CURRENT AMBITIOUS SCOPE DETECTED</span>
                </div>
                <p className="text-xs text-amber-900 font-medium leading-relaxed">
                  "{realityCheck.originalScope}"
                </p>

                <div className="pt-2 border-t border-amber-200/60">
                  <div className="text-xs font-bold text-amber-900 mb-1.5">Identified Execution Risks:</div>
                  <ul className="space-y-1 text-xs text-amber-800 list-disc list-inside">
                    {realityCheck.detectedRisks.map((risk, i) => (
                      <li key={i}>{risk}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-gradient-to-tr from-indigo-900 via-indigo-800 to-purple-900 text-white space-y-4 shadow-lg">
                <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
                  <Sparkles className="w-4 h-4" />
                  <span>CO-FOUNDER AI PIVOT RECOMMENDATION</span>
                </div>

                <p className="text-sm text-indigo-100 leading-relaxed font-medium">
                  {realityCheck.aiCritique}
                </p>

                <div className="p-4 rounded-xl bg-white/10 border border-white/20 text-white">
                  <div className="text-xs font-bold uppercase tracking-wider text-indigo-200 mb-1">
                    Recommended Adjusted Plan:
                  </div>
                  <p className="text-sm font-semibold leading-relaxed">
                    "{realityCheck.recommendation}"
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-5 h-5 text-emerald-400" />
                    <div>
                      <div className="text-xs text-indigo-200 font-semibold">Feasibility Improvement</div>
                      <div className="text-sm font-bold flex items-center gap-2">
                        <span className="text-rose-300 line-through">{realityCheck.feasibilityBefore}%</span>
                        <ArrowRight className="w-4 h-4 text-white" />
                        <span className="text-emerald-400 text-base font-extrabold">{realityCheck.feasibilityAfter}%</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowAskWhy(!showAskWhy)}
                    className="px-3.5 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-white text-xs font-semibold transition-colors flex items-center gap-1.5"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>Ask Why</span>
                  </button>
                </div>
              </div>

              {showAskWhy && (
                <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 space-y-2 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-900">Why this pivot works better:</span>
                    <button onClick={() => setShowAskWhy(false)} className="text-indigo-400 hover:text-indigo-700">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-xs text-indigo-800 leading-relaxed">
                    By leveraging pre-trained foundation APIs (like Gemini Flash) and Retrieval-Augmented Generation (RAG), you avoid spending 4 weeks troubleshooting PyTorch dependencies or model convergence issues. You can spend 80% of your time perfecting student UX, high-speed document indexing, and viva demo workflows.
                  </p>
                </div>
              )}

              <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                <button
                  onClick={handleKeepOriginal}
                  className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors"
                >
                  Keep Original Ambitious Plan
                </button>

                <button
                  onClick={handleAccept}
                  className="px-7 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-200 transition-all flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Accept Recommendation & Generate Blueprint</span>
                </button>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};
