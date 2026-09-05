import React, { useState, useEffect } from 'react';
import type { ProjectIdea, ProjectTask } from '../types';
import { storageService, DEFAULT_TASKS } from '../services/storageService';
import {
  CheckSquare,
  Square,
  Sparkles,
  ArrowRight,
  Plus,
  Trash2,
  CheckCircle2
} from 'lucide-react';

interface ProjectWorkspaceProps {
  selectedProject: ProjectIdea;
  onNavigateToMentor: () => void;
}

export const ProjectWorkspace: React.FC<ProjectWorkspaceProps> = ({
  selectedProject,
  onNavigateToMentor
}) => {
  const [tasks, setTasks] = useState<ProjectTask[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  useEffect(() => {
    const saved = storageService.getWorkspaceTasks();
    setTasks(saved.length > 0 ? saved : DEFAULT_TASKS);
  }, []);

  const toggleTask = (id: string) => {
    const updated = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    setTasks(updated);
    storageService.saveWorkspaceTasks(updated);
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newTask: ProjectTask = {
      id: `task-${Date.now()}`,
      title: newTaskTitle.trim(),
      category: 'Backend',
      completed: false,
      priority: 'Medium'
    };

    const updated = [...tasks, newTask];
    setTasks(updated);
    storageService.saveWorkspaceTasks(updated);
    setNewTaskTitle('');
  };

  const deleteTask = (id: string) => {
    const updated = tasks.filter(t => t.id !== id);
    setTasks(updated);
    storageService.saveWorkspaceTasks(updated);
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const totalCount = tasks.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const categories = ['All', 'Planning', 'Frontend', 'Backend', 'AI', 'Testing', 'Deployment'];

  const filteredTasks = selectedCategory === 'All'
    ? tasks
    : tasks.filter(t => t.category === selectedCategory);

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 space-y-6 select-none animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Interactive Development Workspace</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
            {selectedProject.projectName}
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            Track phase progress, check off tasks, and follow co-founder execution advice.
          </p>
        </div>

        <button
          onClick={onNavigateToMentor}
          className="px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
        >
          <span>Ask AI Mentor Next Step</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid md:grid-cols-12 gap-6">
        <div className="md:col-span-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between items-center text-center">
          <div className="w-full text-left">
            <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Overall Progress</span>
            <div className="text-xs text-slate-500 font-medium">Phase 4 of 6 Active</div>
          </div>

          <div className="my-6 relative flex items-center justify-center">
            <div className="w-36 h-36 rounded-full border-8 border-slate-100 flex items-center justify-center">
              <div className="w-28 h-28 rounded-full border-8 border-indigo-600 flex items-center justify-center bg-indigo-50/50">
                <div>
                  <div className="text-3xl font-black text-slate-900">{progressPercent}%</div>
                  <div className="text-[10px] font-bold text-indigo-600 uppercase">Complete</div>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full text-xs text-slate-600 bg-slate-50 p-3 rounded-2xl border border-slate-100 flex items-center justify-between">
            <span>Completed Tasks:</span>
            <strong className="text-slate-900 font-bold">{completedCount} of {totalCount}</strong>
          </div>
        </div>

        <div className="md:col-span-8 bg-gradient-to-tr from-indigo-900 via-indigo-800 to-purple-900 text-white p-6 rounded-3xl shadow-lg flex flex-col justify-between">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Today's Co-Founder Recommendation</span>
            </div>

            <h3 className="text-xl font-bold leading-snug">
              "Finish the RAG document ingestion pipeline before adding advanced UI features."
            </h3>

            <p className="text-xs text-indigo-200 leading-relaxed max-w-xl">
              Focusing on your core AI document retrieval now guarantees a solid demonstration for your project guide next week.
            </p>
          </div>

          <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between text-xs text-indigo-200 font-medium">
            <span>Current Phase: <strong className="text-white">AI Integration</strong></span>
            <span>Target Deadline: <strong className="text-white">Week 4</strong></span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Project Action Items</h3>
            <p className="text-xs text-slate-500">Click any task to toggle completion state</p>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleAddTask} className="flex gap-2">
          <input
            type="text"
            placeholder="Add custom task..."
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
          />
          <button
            type="submit"
            disabled={!newTaskTitle.trim()}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center gap-1 disabled:opacity-40"
          >
            <Plus className="w-4 h-4" />
            <span>Add</span>
          </button>
        </form>

        <div className="space-y-2">
          {filteredTasks.map((task) => (
            <div
              key={task.id}
              onClick={() => toggleTask(task.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                task.completed
                  ? 'bg-slate-50/80 border-slate-200 text-slate-400'
                  : 'bg-white border-slate-200/90 hover:border-slate-300 text-slate-900 shadow-xs'
              }`}
            >
              <div className="flex items-center gap-3">
                <button type="button" className="shrink-0">
                  {task.completed ? (
                    <CheckSquare className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <Square className="w-5 h-5 text-slate-400" />
                  )}
                </button>
                <span className={`text-xs font-medium ${task.completed ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                  {task.title}
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-semibold">
                  {task.category}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteTask(task.id);
                  }}
                  className="p-1 text-slate-300 hover:text-rose-500 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
