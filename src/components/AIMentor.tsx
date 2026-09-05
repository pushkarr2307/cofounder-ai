import React, { useState, useEffect, useRef } from 'react';
import type { ProjectIdea, StudentProfile, ChatMessage } from '../types';
import { storageService } from '../services/storageService';
import { aiService } from '../services/aiService';
import {
  Bot,
  User,
  Send,
  Sparkles,
  Loader2,
  FolderKanban,
  MessageSquare
} from 'lucide-react';

interface AIMentorProps {
  profile: StudentProfile;
  selectedProject: ProjectIdea;
}

export const AIMentor: React.FC<AIMentorProps> = ({ profile, selectedProject }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMsg, setInputMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const tasks = storageService.getWorkspaceTasks();
  const completedTasks = tasks.filter(t => t.completed).map(t => t.title);
  const remainingTasks = tasks.filter(t => !t.completed).map(t => t.title);
  const progressPercent = tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0;

  useEffect(() => {
    const savedChat = storageService.getMentorChat();
    if (savedChat && savedChat.length > 0) {
      setMessages(savedChat);
    } else {
      const initial: ChatMessage = {
        id: 'msg-welcome',
        sender: 'ai',
        text: `Hey! I'm active as your AI Co-Founder for **${selectedProject.projectName}**. I have full context on your 6-week timeline, skills, and current workspace progress (${progressPercent}% complete). How can I assist you right now?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([initial]);
      storageService.saveMentorChat([initial]);
    }
  }, [selectedProject]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const quickPrompts = [
    "Authentication complete ho gaya. Ab kya karu?",
    "What should I build next?",
    "Review my architecture",
    "Find risks",
    "Prepare me for viva",
    "Improve my project"
  ];

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedHistory = [...messages, userMsg];
    setMessages(updatedHistory);
    storageService.saveMentorChat(updatedHistory);
    setInputMsg('');
    setLoading(true);

    try {
      const blueprint = storageService.getBlueprint();
      const replyText = await aiService.generateMentorResponse(textToSend, updatedHistory, {
        profile,
        project: selectedProject,
        blueprint,
        tasks,
        currentPhase: 'AI Integration',
        completedTasks,
        remainingTasks
      });

      const aiReplyMsg: ChatMessage = {
        id: `reply-${Date.now()}`,
        sender: 'ai',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      const finalChat = [...updatedHistory, aiReplyMsg];
      setMessages(finalChat);
      storageService.saveMentorChat(finalChat);
    } catch (e) {
      console.error('Mentor chat error:', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 space-y-6 select-none animate-fade-in">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Project-Aware AI Co-Founder</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
          Your AI Co-Founder
        </h1>
        <p className="text-slate-600 text-sm mt-1">
          Project-aware technical guidance, viva preparation, and next step advice.
        </p>
      </div>

      <div className="grid md:grid-cols-12 gap-6">
        <div className="md:col-span-4 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase tracking-wider">
              <FolderKanban className="w-4 h-4" />
              <span>Project Context</span>
            </div>

            <div>
              <div className="text-base font-bold text-slate-900">{selectedProject.projectName}</div>
              <div className="text-xs text-slate-500 mt-0.5">{selectedProject.summary}</div>
            </div>

            <div className="p-3 rounded-2xl bg-indigo-50/70 border border-indigo-100 space-y-1">
              <div className="flex justify-between text-xs font-semibold text-indigo-900">
                <span>Phase: AI Integration</span>
                <span>{progressPercent}% Complete</span>
              </div>
              <div className="w-full h-1.5 bg-indigo-200 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${progressPercent}%` }}></div>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="font-semibold text-slate-700">Completed Tasks ({completedTasks.length}):</div>
              <ul className="space-y-1 text-slate-500">
                {completedTasks.slice(0, 3).map((t, idx) => (
                  <li key={idx} className="flex items-center gap-1.5 text-[11px]">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span className="truncate">{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-3">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-indigo-600" />
              <span>Quick Co-Founder Prompts</span>
            </div>

            <div className="flex flex-col gap-2">
              {quickPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(prompt)}
                  disabled={loading}
                  className="w-full text-left p-2.5 rounded-xl bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 text-xs font-medium border border-slate-200/80 transition-all flex items-center justify-between"
                >
                  <span className="truncate">{prompt}</span>
                  <span className="text-indigo-600 font-bold ml-1">→</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="md:col-span-8 bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden flex flex-col h-[600px]">
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            {messages.map((m) => {
              const isAI = m.sender === 'ai';
              return (
                <div key={m.id} className={`flex gap-3 animate-fade-in ${isAI ? 'items-start' : 'items-end justify-end'}`}>
                  {isAI && (
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                      <Bot className="w-5 h-5" />
                    </div>
                  )}

                  <div className="max-w-[85%] space-y-1">
                    <div
                      className={`p-4 rounded-2xl text-sm leading-relaxed ${
                        isAI
                          ? 'bg-slate-100/90 text-slate-800 rounded-tl-xs border border-slate-200/60 whitespace-pre-wrap'
                          : 'bg-indigo-600 text-white rounded-tr-xs shadow-xs'
                      }`}
                    >
                      {m.text}
                    </div>

                    <div className={`text-[10px] text-slate-400 font-medium ${isAI ? 'text-left pl-1' : 'text-right pr-1'}`}>
                      {m.timestamp}
                    </div>
                  </div>

                  {!isAI && (
                    <div className="w-9 h-9 rounded-xl bg-slate-800 text-white flex items-center justify-center shrink-0 shadow-xs">
                      <User className="w-5 h-5" />
                    </div>
                  )}
                </div>
              );
            })}

            {loading && (
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center shrink-0">
                  <Bot className="w-5 h-5" />
                </div>
                <div className="p-4 rounded-2xl bg-slate-100 text-slate-500 text-xs font-semibold flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
                  <span>Thinking like a co-founder...</span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="p-4 bg-slate-50 border-t border-slate-200">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(inputMsg);
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                placeholder="Ask your co-founder (e.g. 'Authentication complete ho gaya. Ab kya karu?')"
                value={inputMsg}
                onChange={(e) => setInputMsg(e.target.value)}
                className="flex-1 px-4 py-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
              />
              <button
                type="submit"
                disabled={!inputMsg.trim() || loading}
                className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm transition-all disabled:opacity-40 flex items-center gap-1.5"
              >
                <span>Send</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
