import React, { useState, useEffect } from 'react';
import type { ProjectIdea, StudentProfile, ProjectBlueprint as BlueprintType } from '../types';
import { storageService, DEFAULT_REALITY_CHECK } from '../services/storageService';
import { aiService } from '../services/aiService';
import {
  FileText,
  Layers,
  Code2,
  Calendar,
  Download,
  ArrowRight,
  Loader2,
  Sparkles,
  Globe,
  Cpu,
  Lock,
  FileCheck
} from 'lucide-react';

interface ProjectBlueprintProps {
  profile: StudentProfile;
  selectedProject: ProjectIdea;
  onStartWorkspace: () => void;
}

export const ProjectBlueprintView: React.FC<ProjectBlueprintProps> = ({
  profile,
  selectedProject,
  onStartWorkspace
}) => {
  const [blueprint, setBlueprint] = useState<BlueprintType | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'features' | 'architecture' | 'tech' | 'roadmap' | 'testing' | 'security' | 'deployment'>('overview');
  const [showExportModal, setShowExportModal] = useState(false);

  useEffect(() => {
    loadBlueprint();
  }, [selectedProject]);

  const loadBlueprint = async () => {
    const existing = storageService.getBlueprint();
    if (existing && existing.projectName === selectedProject.projectName) {
      setBlueprint(existing);
    } else {
      setLoading(true);
      try {
        const rc = storageService.getRealityCheck() || DEFAULT_REALITY_CHECK;
        const generated = await aiService.generateBlueprint(profile, selectedProject, rc);
        setBlueprint(generated);
      } catch (e) {
        console.error('Error generating blueprint:', e);
      } finally {
        setLoading(false);
      }
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FileText },
    { id: 'features', label: 'Features', icon: Layers },
    { id: 'architecture', label: 'Architecture', icon: Cpu },
    { id: 'tech', label: 'Tech Stack', icon: Code2 },
    { id: 'roadmap', label: 'Roadmap', icon: Calendar },
    { id: 'testing', label: 'Testing', icon: FileCheck },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'deployment', label: 'Deployment', icon: Globe }
  ];

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 space-y-6 select-none animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Complete Technical Specification</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
            Your Project Blueprint
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            Comprehensive roadmap, architecture, and features generated specifically for {selectedProject.projectName}.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowExportModal(true)}
            className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 hover:border-slate-300 text-slate-700 font-semibold text-xs shadow-xs transition-all flex items-center gap-2"
          >
            <Download className="w-4 h-4 text-indigo-600" />
            <span>Export Blueprint</span>
          </button>

          <button
            onClick={onStartWorkspace}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-200 transition-all flex items-center gap-2"
          >
            <span>Start Project Workspace</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center space-y-3 bg-white rounded-3xl border border-slate-200">
          <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mx-auto" />
          <p className="text-sm font-semibold text-slate-700">Synthesizing project architecture, feature priorities, and 6-phase roadmap...</p>
        </div>
      ) : blueprint && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
          <div className="bg-slate-900 text-white p-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Project</div>
              <div className="text-base font-bold text-white truncate">{blueprint.projectName}</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Feasibility</div>
              <div className="text-base font-bold text-emerald-400">{blueprint.feasibility}% Verified</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Duration</div>
              <div className="text-base font-bold text-indigo-300">{blueprint.estimatedDuration}</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Team Size</div>
              <div className="text-base font-bold text-purple-300">{blueprint.teamSize}</div>
            </div>
          </div>

          <div className="flex overflow-x-auto border-b border-slate-200 bg-slate-50/50 p-2 gap-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-white text-indigo-600 shadow-xs border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="p-6 sm:p-8">
            {activeTab === 'overview' && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-1">Problem Statement</h3>
                  <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                    {blueprint.problemStatement}
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-2">Core Objectives</h3>
                    <ul className="space-y-2">
                      {blueprint.objectives.map((obj, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-xs text-slate-700 bg-white p-3 rounded-xl border border-slate-200">
                          <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center shrink-0 text-[10px]">
                            {i + 1}
                          </span>
                          <span>{obj}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-2">Target Users</h3>
                      <div className="flex flex-wrap gap-2">
                        {blueprint.targetUsers.map((user, i) => (
                          <span key={i} className="px-3 py-1.5 rounded-xl bg-purple-50 text-purple-700 font-semibold text-xs border border-purple-100">
                            {user}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-1">Expected Outcome</h3>
                      <p className="text-xs text-slate-600 bg-emerald-50/70 p-3 rounded-xl border border-emerald-100 leading-relaxed">
                        {blueprint.expectedOutcome}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'features' && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                    <span>MVP Core Features (Must Have for Demo)</span>
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {blueprint.mvpFeatures.map((feat, i) => (
                      <div key={i} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-slate-900 text-sm">{feat.name}</h4>
                          <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-semibold text-[10px]">
                            {feat.priority} Priority
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">{feat.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                    <span>Advanced / Future Scope Features</span>
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {blueprint.advancedFeatures.map((feat, i) => (
                      <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                        <h4 className="font-bold text-slate-800 text-xs">{feat.name}</h4>
                        <p className="text-[11px] text-slate-500">{feat.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'architecture' && (
              <div className="space-y-6 animate-fade-in">
                <div className="text-center max-w-lg mx-auto mb-4">
                  <h3 className="font-bold text-slate-900 text-base">Visual System Architecture</h3>
                  <p className="text-xs text-slate-500">End-to-end component flow from browser client to Gemini AI layer</p>
                </div>

                <div className="flex flex-col items-center gap-3 py-4 max-w-xl mx-auto">
                  {blueprint.architectureDiagram.map((item, idx) => (
                    <React.Fragment key={idx}>
                      <div className="w-full p-4 rounded-2xl bg-white border-2 border-indigo-100 shadow-sm flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 font-bold flex items-center justify-center text-xs">
                            {idx + 1}
                          </div>
                          <div>
                            <span className="text-[10px] font-bold uppercase text-indigo-600 tracking-wider block">{item.layer}</span>
                            <span className="font-bold text-slate-900 text-sm">{item.component}</span>
                          </div>
                        </div>
                        <p className="text-xs text-slate-500 text-right max-w-xs">{item.description}</p>
                      </div>

                      {idx < blueprint.architectureDiagram.length - 1 && (
                        <div className="text-indigo-400 font-bold text-xs">↓</div>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'tech' && (
              <div className="grid sm:grid-cols-2 gap-4 animate-fade-in">
                {blueprint.techStack.map((tech, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                    <span className="text-[10px] font-bold uppercase text-indigo-600 tracking-wider">{tech.category}</span>
                    <h4 className="font-bold text-slate-900 text-sm">{tech.technology}</h4>
                    <p className="text-xs text-slate-600 pt-1">{tech.rationale}</p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'roadmap' && (
              <div className="space-y-4 animate-fade-in">
                {blueprint.roadmap.map((phase, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700 font-bold text-[10px]">
                          {phase.phase} ({phase.duration})
                        </span>
                        <h4 className="font-bold text-slate-900 text-sm">{phase.title}</h4>
                      </div>
                      <p className="text-xs text-slate-600">{phase.description}</p>
                    </div>

                    <div className="flex flex-wrap gap-1.5 shrink-0">
                      {phase.tasks.map((t, idx) => (
                        <span key={idx} className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-medium">
                          ✓ {t}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'testing' && (
              <div className="space-y-3 animate-fade-in">
                <h3 className="font-bold text-slate-900 text-sm mb-2">Quality Verification & Testing Strategy</h3>
                {blueprint.testingStrategy.map((item, i) => (
                  <div key={i} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-center gap-3">
                    <FileCheck className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-3 animate-fade-in">
                <h3 className="font-bold text-slate-900 text-sm mb-2">Security & Secret Protection Guidelines</h3>
                {blueprint.securityConsiderations.map((item, i) => (
                  <div key={i} className="p-3.5 rounded-xl bg-indigo-50/50 border border-indigo-100 text-xs text-indigo-950 flex items-center gap-3">
                    <Lock className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'deployment' && (
              <div className="space-y-3 animate-fade-in">
                <h3 className="font-bold text-slate-900 text-sm mb-2">Production Build & Edge Deployment Plan</h3>
                {blueprint.deploymentPlan.map((item, i) => (
                  <div key={i} className="p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-100 text-xs text-emerald-950 flex items-center gap-3">
                    <Globe className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {showExportModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 text-center space-y-6 shadow-2xl animate-fade-in">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <Download className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-900">Blueprint Exported!</h3>
              <p className="text-xs text-slate-500 mt-1">Your project specification has been formatted for submission.</p>
            </div>

            <div className="space-y-2">
              <a
                href={`data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(blueprint, null, 2))}`}
                download={`${selectedProject.projectName.toLowerCase().replace(/\s+/g, '-')}-blueprint.json`}
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Download Structured JSON Spec</span>
              </a>
            </div>

            <button
              onClick={() => setShowExportModal(false)}
              className="w-full py-2.5 rounded-xl bg-slate-100 text-slate-700 font-semibold text-xs"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
