import React, { useState } from 'react';
import type { StudentProfile } from '../types';
import { storageService } from '../services/storageService';
import { aiService } from '../services/aiService';
import {
  Sparkles,
  Send,
  Bot,
  User,
  ArrowRight,
  Loader2,
  CheckCircle2
} from 'lucide-react';

interface AIDiscoveryProps {
  profile: StudentProfile;
  onIdeasGenerated: () => void;
}

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  options?: string[];
}

export const AIDiscovery: React.FC<AIDiscoveryProps> = ({ profile, onIdeasGenerated }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [inputVal, setInputVal] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const discoveryQuestions = [
    {
      key: 'problem_type',
      question: `Hi ${profile.collegeName ? profile.collegeName + ' student' : 'there'}! I'm your AI Co-Founder. Before we choose a project, I want to understand what kind of problems you actually enjoy solving.`,
      options: [
        'Solving real world campus & productivity problems',
        'Healthcare and patient triage tools',
        'Interactive developer & recruitment tools',
        'FinTech and automated finance workflows'
      ]
    },
    {
      key: 'motivation',
      question: 'That makes sense! Next question: Are you building mainly for top grades, your developer portfolio, a startup idea, or all three?',
      options: ['Grades', 'Portfolio', 'Startup Idea', 'All Three']
    },
    {
      key: 'demo_pride',
      question: 'Got it! What specific achievement would make you proud during your final viva demo?',
      options: [
        'Working RAG & document retrieval pipeline',
        'Clean production SaaS web design',
        'Complex backend microservices & fast API',
        'Realistic AI feedback simulation'
      ]
    }
  ];

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm-0',
      sender: 'ai',
      text: discoveryQuestions[0].question,
      options: discoveryQuestions[0].options
    }
  ]);

  const handleUserAnswer = (textAnswer: string) => {
    if (!textAnswer.trim()) return;

    const currentQ = discoveryQuestions[currentStepIndex];
    const newAnswers = { ...answers, [currentQ.key]: textAnswer };
    setAnswers(newAnswers);

    const userMsg: Message = { id: `u-${Date.now()}`, sender: 'user', text: textAnswer };
    const nextIndex = currentStepIndex + 1;

    if (nextIndex < discoveryQuestions.length) {
      const nextQ = discoveryQuestions[nextIndex];
      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: nextQ.question,
        options: nextQ.options
      };

      setMessages(prev => [...prev, userMsg, aiMsg]);
      setCurrentStepIndex(nextIndex);
    } else {
      const aiFinalMsg: Message = {
        id: `ai-final`,
        sender: 'ai',
        text: "Perfect. I have complete context on your skills, constraints, and preferences. Ready to view your shortlisted ideas!"
      };
      setMessages(prev => [...prev, userMsg, aiFinalMsg]);
      setCurrentStepIndex(nextIndex);
    }

    setInputVal('');
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      storageService.saveDiscoveryResponses(answers);
      await aiService.generateProjectIdeas(profile, answers);
      onIdeasGenerated();
    } catch (e) {
      console.error('Failed to generate ideas:', e);
      onIdeasGenerated();
    } finally {
      setIsGenerating(false);
    }
  };

  const isComplete = currentStepIndex >= discoveryQuestions.length;

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 select-none">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive AI Discovery</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mt-2">Let's find the right project for you</h1>
        </div>

        <div className="text-xs font-semibold text-slate-500 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-xs">
          Question {Math.min(currentStepIndex + 1, discoveryQuestions.length)} of {discoveryQuestions.length}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[520px]">
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {messages.map((m) => {
            const isAI = m.sender === 'ai';
            return (
              <div key={m.id} className={`flex gap-3 animate-fade-in ${isAI ? 'items-start' : 'items-end justify-end'}`}>
                {isAI && (
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div className="max-w-[80%] space-y-2">
                  <div
                    className={`p-4 rounded-2xl text-sm leading-relaxed ${
                      isAI
                        ? 'bg-slate-100/80 text-slate-800 rounded-tl-xs border border-slate-200/60'
                        : 'bg-indigo-600 text-white rounded-tr-xs shadow-xs'
                    }`}
                  >
                    {m.text}
                  </div>

                  {isAI && m.options && !isComplete && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {m.options.map((opt, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleUserAnswer(opt)}
                          className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold border border-indigo-200/80 transition-all text-left"
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {!isAI && (
                  <div className="w-8 h-8 rounded-xl bg-slate-800 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-200">
          {isComplete ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-200">
                <CheckCircle2 className="w-4 h-4" />
                <span>Discovery complete. Profile context linked.</span>
              </div>

              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-sm shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Analyzing & Generating...</span>
                  </>
                ) : (
                  <>
                    <span>Generate My Ideas</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleUserAnswer(inputVal);
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                placeholder="Type your answer..."
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
              />
              <button
                type="submit"
                disabled={!inputVal.trim()}
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-all disabled:opacity-40 flex items-center gap-1.5"
              >
                <span>Send</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
