import React, { useState } from 'react';
import {
  Sparkles,
  LayoutDashboard,
  Lightbulb,
  ShieldCheck,
  FileText,
  CheckSquare,
  Bot,
  User,
  Menu,
  X,
  FolderKanban,
  ArrowRight,
  Globe
} from 'lucide-react';

interface SidebarProps {
  activeRoute: string;
  onNavigate: (route: string) => void;
  selectedProjectName?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeRoute, onNavigate, selectedProjectName }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'ideas', label: 'Ideas Shortlist', icon: Lightbulb },
    { id: 'challenge', label: 'Reality Check', icon: ShieldCheck, highlight: true },
    { id: 'blueprint', label: 'Project Blueprint', icon: FileText },
    { id: 'workspace', label: 'Workspace', icon: CheckSquare },
    { id: 'mentor', label: 'AI Mentor', icon: Bot }
  ];

  return (
    <>
      <aside className="hidden md:flex flex-col w-64 bg-white/90 backdrop-blur-xl border-r border-slate-200/80 h-screen sticky top-0 z-30 select-none shadow-sm">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div 
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white shadow-md shadow-indigo-300 group-hover:scale-105 transition-all">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="font-extrabold text-lg text-slate-900 tracking-tight flex items-center gap-1">
                Co-Founder <span className="text-indigo-600">AI</span>
              </span>
              <span className="text-[10px] text-slate-400 font-semibold block uppercase tracking-widest -mt-1">
                SaaS Project Partner
              </span>
            </div>
          </div>
        </div>

        {selectedProjectName && (
          <div className="mx-4 mt-4 p-3 bg-gradient-to-r from-indigo-50/80 to-purple-50/80 border border-indigo-100/90 rounded-2xl shadow-xs">
            <div className="flex items-center justify-between text-xs font-bold text-indigo-900 mb-1">
              <div className="flex items-center gap-1.5">
                <FolderKanban className="w-3.5 h-3.5 text-indigo-600" />
                <span>Active Project</span>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            </div>
            <p className="text-xs text-indigo-800 font-semibold truncate">
              {selectedProjectName}
            </p>
          </div>
        )}

        <nav className="flex-1 px-3 py-4 space-y-1.5">
          <div className="px-3 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Main Application
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeRoute === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-200'
                    : 'text-slate-600 hover:bg-indigo-50/60 hover:text-indigo-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : item.highlight ? 'text-purple-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.highlight && !isActive && (
                  <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 text-[10px] font-extrabold uppercase">
                    Pivot
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-3 border-t border-slate-100 space-y-1 bg-slate-50/50">
          <button 
            onClick={() => onNavigate('onboarding')}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-white hover:text-slate-900 transition-colors"
          >
            <User className="w-4 h-4 text-indigo-600" />
            <span>Profile & Skills</span>
          </button>
          <button 
            onClick={() => onNavigate('landing')}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-white hover:text-slate-800 transition-colors"
          >
            <Globe className="w-4 h-4 text-slate-400" />
            <span>Landing Overview</span>
          </button>
        </div>
      </aside>

      <div className="md:hidden sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 py-3 flex items-center justify-between shadow-xs">
        <div 
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-2 cursor-pointer"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-sm">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="font-bold text-base text-slate-900">
            Co-Founder <span className="text-indigo-600">AI</span>
          </span>
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-xl text-slate-700 hover:bg-slate-100"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)}>
          <div 
            className="w-4/5 max-w-xs bg-white h-full shadow-2xl p-5 flex flex-col justify-between"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-slate-900">Co-Founder AI</span>
                </div>
                <button onClick={() => setMobileOpen(false)} className="text-slate-400 p-1">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeRoute === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onNavigate(item.id);
                        setMobileOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold ${
                        isActive ? 'bg-indigo-600 text-white' : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-2">
              <button 
                onClick={() => { onNavigate('onboarding'); setMobileOpen(false); }}
                className="w-full text-left px-3 py-2 text-xs text-slate-600 font-semibold"
              >
                Edit Profile
              </button>
              <button 
                onClick={() => { onNavigate('landing'); setMobileOpen(false); }}
                className="w-full text-left px-3 py-2 text-xs text-indigo-600 font-bold"
              >
                Landing Page
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export const PublicNavbar: React.FC<{ onStartBuilding: () => void }> = ({ onStartBuilding }) => {
  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100/90 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white shadow-md shadow-indigo-200">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <span className="font-extrabold text-xl text-slate-900 tracking-tight">
            Co-Founder <span className="text-indigo-600">AI</span>
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-xs font-bold text-slate-600">
          <a href="#demo" className="hover:text-indigo-600 transition-colors">Live Demo</a>
          <a href="#how-it-works" className="hover:text-indigo-600 transition-colors">How It Works</a>
          <a href="#features" className="hover:text-indigo-600 transition-colors">Features</a>
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={onStartBuilding}
            className="px-5 py-2.5 rounded-xl btn-shimmer text-white font-bold text-xs shadow-md shadow-indigo-200 hover:shadow-indigo-300 transition-all flex items-center gap-2 transform hover:-translate-y-0.5"
          >
            <span>Start Building</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
