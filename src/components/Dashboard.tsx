import React from 'react';
import type { ProjectIdea, StudentProfile } from '../types';
import { storageService } from '../services/storageService';
import {
  Sparkles,
  ArrowRight,
  Bot,
  FileText,
  CheckSquare,
  FolderKanban
} from 'lucide-react';

interface DashboardProps {
  profile: StudentProfile;
  selectedProject: ProjectIdea;
  onNavigate: (route: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ selectedProject, onNavigate }) => {
  const tasks = storageService.getWorkspaceTasks();
  const completedCount = tasks.filter(t => t.completed).length;
  const totalCount = tasks.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 72;

  const upcomingTasks = tasks.filter(t => !t.completed).slice(0, 3);

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 space-y-6 select-none animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center gap-2">
            <span>Good morning 👋</span>
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            Your co-founder is ready. Let's build something amazing today.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('workspace')}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-200 transition-all flex items-center gap-2"
          >
            <span>Continue Building</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center font-bold shadow-md shadow-indigo-200">
              <FolderKanban className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase text-indigo-600 tracking-wider">Active Final-Year Project</span>
              <h2 className="text-xl font-bold text-slate-900">{selectedProject.projectName}</h2>
              <p className="text-xs text-slate-500 mt-0.5">{selectedProject.summary}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-indigo-50/70 p-3.5 rounded-2xl border border-indigo-100">
            <div className="w-14 h-14 rounded-full border-4 border-indigo-200 border-t-indigo-600 flex items-center justify-center bg-white font-black text-slate-900 text-sm shadow-xs">
              {progressPercent}%
            </div>
            <div>
              <div className="text-xs font-bold text-indigo-900">AI Integration Phase</div>
              <div className="text-[11px] text-indigo-700">{completedCount} of {totalCount} tasks completed</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center">
            <div className="text-2xl font-black text-indigo-600">{selectedProject.matchScore}%</div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">Match Score</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center">
            <div className="text-2xl font-black text-emerald-600">{selectedProject.feasibilityScore}%</div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">Feasibility</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center">
            <div className="text-2xl font-black text-purple-600">{selectedProject.innovationScore}%</div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">Innovation</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center">
            <div className="text-2xl font-black text-slate-800">{selectedProject.estimatedDuration}</div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">Timeline</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 flex items-start gap-3.5">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <div className="text-xs font-bold text-indigo-900 uppercase tracking-wider">Today's Co-Founder Recommendation</div>
            <p className="text-sm font-semibold text-slate-900">
              "Finish the RAG document ingestion pipeline before adding advanced UI features."
            </p>
          </div>
        </div>

        <div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Quick Actions</div>
          <div className="grid sm:grid-cols-3 gap-3">
            <button
              onClick={() => onNavigate('workspace')}
              className="p-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-between"
            >
              <div className="flex items-center gap-2.5">
                <CheckSquare className="w-4 h-4" />
                <span>Continue Building</span>
              </div>
              <span>→</span>
            </button>

            <button
              onClick={() => onNavigate('mentor')}
              className="p-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs border border-slate-200 shadow-xs transition-all flex items-center justify-between"
            >
              <div className="flex items-center gap-2.5">
                <Bot className="w-4 h-4 text-purple-600" />
                <span>Ask Co-Founder</span>
              </div>
              <span>→</span>
            </button>

            <button
              onClick={() => onNavigate('blueprint')}
              className="p-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs border border-slate-200 shadow-xs transition-all flex items-center justify-between"
            >
              <div className="flex items-center gap-2.5">
                <FileText className="w-4 h-4 text-indigo-600" />
                <span>View Blueprint</span>
              </div>
              <span>→</span>
            </button>
          </div>
        </div>

        <div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Upcoming Priority Tasks</div>
          <div className="space-y-2">
            {upcomingTasks.map((t) => (
              <div
                key={t.id}
                onClick={() => onNavigate('workspace')}
                className="p-3.5 rounded-xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 cursor-pointer transition-colors flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-800">
                  <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                  <span>{t.title}</span>
                </div>
                <span className="text-[10px] font-bold text-slate-500 uppercase">{t.category}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
