import React, { useState } from 'react';
import type { StudentProfile } from '../types';
import { storageService, DEFAULT_PROFILE } from '../services/storageService';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check
} from 'lucide-react';

interface OnboardingProps {
  onComplete: (profile: StudentProfile) => void;
  onCancel?: () => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete, onCancel }) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [profile, setProfile] = useState<StudentProfile>(() => {
    const existing = storageService.getProfile();
    return existing || DEFAULT_PROFILE;
  });

  const availableSkills = [
    'Python', 'JavaScript', 'Java', 'C++', 'React', 'Node.js', 'Machine Learning', 'AI/LLM', 'SQL', 'TypeScript', 'Flutter'
  ];

  const availableInterests = [
    'AI/ML', 'Web Development', 'Mobile Apps', 'Healthcare', 'Education', 'FinTech', 'Cybersecurity', 'Robotics', 'Sustainability'
  ];

  const goals: { id: StudentProfile['goal']; label: string; desc: string }[] = [
    { id: 'Easy', label: 'Easy', desc: 'Simple MVP focused on passing requirements smoothly.' },
    { id: 'Balanced', label: 'Balanced', desc: 'Solid technical depth with realistic scope for 6 weeks.' },
    { id: 'Challenging', label: 'Challenging', desc: 'Advanced AI/ML features with modern stack.' },
    { id: 'Industry-level', label: 'Industry-level', desc: 'Production SaaS quality ready for portfolio demo.' }
  ];

  const toggleSkill = (skill: string) => {
    setProfile(prev => {
      const skills = prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill];
      return { ...prev, skills };
    });
  };

  const toggleInterest = (interest: string) => {
    setProfile(prev => {
      const interests = prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest];
      return { ...prev, interests };
    });
  };

  const handleSubmit = () => {
    const updated = { ...profile, isCompleted: true };
    storageService.saveProfile(updated);
    onComplete(updated);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-4 sm:p-6 select-none relative overflow-hidden">
      <div className="absolute top-10 left-1/3 w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-10 right-1/3 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-2xl bg-slate-900/90 backdrop-blur-2xl rounded-3xl border border-slate-800 shadow-2xl overflow-hidden animate-fade-in-up">
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-sm">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-base text-white">Co-Founder AI Onboarding</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-400">Step {step} of 2</span>
            <div className="w-24 h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300"
                style={{ width: step === 1 ? '50%' : '100%' }}
              ></div>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-400">Step 1 of 2</span>
                <h2 className="text-2xl font-extrabold text-white mt-1">Tell us about your constraints</h2>
                <p className="text-slate-400 text-xs mt-1">
                  We use this data to calculate realistic feasibility scores.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Branch / Department</label>
                  <select
                    value={profile.branch}
                    onChange={(e) => setProfile({ ...profile, branch: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    <option>Computer Science and Engineering</option>
                    <option>Information Technology</option>
                    <option>Electronics & Communication</option>
                    <option>Artificial Intelligence & Data Science</option>
                    <option>Electrical Engineering</option>
                    <option>Mechanical Engineering</option>
                    <option>Biotechnology</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Academic Year</label>
                  <select
                    value={profile.year}
                    onChange={(e) => setProfile({ ...profile, year: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    <option>Final Year</option>
                    <option>Pre-Final Year (3rd Year)</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">College Name (Optional)</label>
                  <input
                    type="text"
                    placeholder="Enter your college or university name"
                    value={profile.collegeName}
                    onChange={(e) => setProfile({ ...profile, collegeName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Team Size</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4].map(num => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setProfile({ ...profile, teamSize: num })}
                        className={`flex-1 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                          profile.teamSize === num
                            ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                            : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        {num} {num === 1 ? 'Solo' : 'Devs'}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Available Duration</label>
                  <select
                    value={profile.duration}
                    onChange={(e) => setProfile({ ...profile, duration: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    <option>4 Weeks</option>
                    <option>6 Weeks</option>
                    <option>8 Weeks</option>
                    <option>3 Months</option>
                    <option>6 Months</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Weekly Time Commitment</label>
                  <select
                    value={profile.weeklyAvailability}
                    onChange={(e) => setProfile({ ...profile, weeklyAvailability: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    <option>5-10 hrs/week</option>
                    <option>10-15 hrs/week</option>
                    <option>15-20 hrs/week</option>
                    <option>20+ hrs/week</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Budget Preference</label>
                  <select
                    value={profile.budget}
                    onChange={(e) => setProfile({ ...profile, budget: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    <option>Free / Low cost</option>
                    <option>&lt; $50</option>
                    <option>Flexible</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-slate-800">
                {onCancel ? (
                  <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2.5 text-xs font-semibold text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                ) : <div />}

                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
                >
                  <span>Next: Skills & Goals</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-400">Step 2 of 2</span>
                <h2 className="text-2xl font-extrabold text-white mt-1">Select your tech stack & ambition</h2>
                <p className="text-slate-400 text-xs mt-1">
                  We match stack components to your comfortable skills.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">Programming & Tech Skills</label>
                <div className="flex flex-wrap gap-2">
                  {availableSkills.map(skill => {
                    const isSelected = profile.skills.includes(skill);
                    return (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => toggleSkill(skill)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                          isSelected
                            ? 'bg-indigo-600 text-white border-indigo-500 shadow-xs'
                            : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        {skill} {isSelected && '✓'}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">Areas of Interest</label>
                <div className="flex flex-wrap gap-2">
                  {availableInterests.map(interest => {
                    const isSelected = profile.interests.includes(interest);
                    return (
                      <button
                        key={interest}
                        type="button"
                        onClick={() => toggleInterest(interest)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                          isSelected
                            ? 'bg-purple-600 text-white border-purple-500 shadow-xs'
                            : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        {interest} {isSelected && '✓'}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">Project Ambition Level</label>
                <div className="grid grid-cols-2 gap-3">
                  {goals.map(g => (
                    <div
                      key={g.id}
                      onClick={() => setProfile({ ...profile, goal: g.id })}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                        profile.goal === g.id
                          ? 'bg-indigo-950/70 border-indigo-500 ring-2 ring-indigo-500/20'
                          : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-white">{g.label}</span>
                        {profile.goal === g.id && <Check className="w-4 h-4 text-indigo-400" />}
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1 leading-snug">{g.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>

                <button
                  type="button"
                  onClick={handleSubmit}
                  className="px-7 py-3 rounded-xl btn-shimmer text-white font-extrabold text-xs shadow-lg transition-all flex items-center gap-2"
                >
                  <span>Meet My Co-Founder</span>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
