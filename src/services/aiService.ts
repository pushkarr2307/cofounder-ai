import type {
  StudentProfile,
  ProjectIdea,
  RealityCheckResult,
  ProjectBlueprint,
  ChatMessage
} from '../types';
import {
  DEFAULT_SAMPLE_PROJECT,
  DEFAULT_REALITY_CHECK,
  storageService
} from './storageService';

const API_BASE_URL = '/api/ai';

export const aiService = {
  async generateProjectIdeas(
    profile: StudentProfile,
    discovery: Record<string, string>
  ): Promise<ProjectIdea[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/ideas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile, discovery })
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      if (data.ideas && Array.isArray(data.ideas)) {
        storageService.saveProjectIdeas(data.ideas);
        return data.ideas;
      }
      throw new Error('Invalid response structure');
    } catch (e) {
      console.warn('AI proxy request failed, returning client fallback ideas:', e);
      const fallbacks = getClientFallbackIdeas(profile);
      storageService.saveProjectIdeas(fallbacks);
      return fallbacks;
    }
  },

  async challengeProject(
    profile: StudentProfile,
    selectedProject: ProjectIdea
  ): Promise<RealityCheckResult> {
    try {
      const res = await fetch(`${API_BASE_URL}/challenge`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile, selectedProject })
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      if (data.realityCheck) {
        storageService.saveRealityCheck(data.realityCheck);
        return data.realityCheck;
      }
      throw new Error('Invalid response structure');
    } catch (e) {
      console.warn('AI challenge request failed, returning client fallback reality check:', e);
      const fallback = getClientFallbackRealityCheck();
      storageService.saveRealityCheck(fallback);
      return fallback;
    }
  },

  async generateBlueprint(
    profile: StudentProfile,
    selectedProject: ProjectIdea,
    realityCheck: RealityCheckResult | null
  ): Promise<ProjectBlueprint> {
    try {
      const res = await fetch(`${API_BASE_URL}/blueprint`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile, selectedProject, realityCheck })
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      if (data.blueprint) {
        storageService.saveBlueprint(data.blueprint);
        return data.blueprint;
      }
      throw new Error('Invalid response structure');
    } catch (e) {
      console.warn('AI blueprint request failed, returning client fallback blueprint:', e);
      const fallback = getClientFallbackBlueprint(selectedProject);
      storageService.saveBlueprint(fallback);
      return fallback;
    }
  },

  async generateMentorResponse(
    message: string,
    history: ChatMessage[],
    context: {
      profile: StudentProfile;
      project: ProjectIdea | null;
      blueprint: ProjectBlueprint | null;
      tasks: any[];
      currentPhase: string;
      completedTasks: string[];
      remainingTasks: string[];
    }
  ): Promise<string> {
    try {
      const res = await fetch(`${API_BASE_URL}/mentor`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, history, context })
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      if (data.reply) return data.reply;
      throw new Error('Invalid response structure');
    } catch (e) {
      console.warn('AI mentor request failed, returning client fallback reply:', e);
      return getClientFallbackMentorReply(message, context);
    }
  }
};

function getClientFallbackIdeas(profile: StudentProfile): ProjectIdea[] {
  const duration = profile.duration || '6 Weeks';
  return [
    { ...DEFAULT_SAMPLE_PROJECT, estimatedDuration: duration },
    {
      id: 'idea-health-nav',
      projectName: 'Smart Health Navigator',
      summary: 'AI-powered health information assistant for symptom triage, doctor specialization routing, and medical report translation.',
      matchScore: 88,
      feasibilityScore: 84,
      innovationScore: 86,
      estimatedDuration: duration,
      requiredSkills: ['Python', 'React', 'Healthcare APIs'],
      techStack: ['React', 'Node.js', 'Gemini Flash', 'Tailwind'],
      industryValue: 'High - Growing telemedicine market and consumer health awareness.',
      risks: ['Medical compliance & disclaimer requirements', 'Accuracy validation'],
      whyItFits: 'Leverages AI/ML capabilities to solve real consumer healthcare access challenges.',
      isAIPick: false
    },
    {
      id: 'idea-interview-sim',
      projectName: 'AI Interview Simulator',
      summary: 'Practice technical & behavioral mock interviews with realistic AI feedback, audio transcription, and weakness analytics.',
      matchScore: 85,
      feasibilityScore: 80,
      innovationScore: 82,
      estimatedDuration: duration,
      requiredSkills: ['JavaScript', 'Web Audio API', 'LLM Prompt Engineering'],
      techStack: ['React', 'Express', 'WebRTC', 'Gemini Flash'],
      industryValue: 'Very High - Massive job placement demand for engineering graduates.',
      risks: ['Real-time audio processing latency', 'Feedback scoring consistency'],
      whyItFits: 'Practical application that directly helps you and your batchmates prepare for campus placement rounds.',
      isAIPick: false
    }
  ];
}

function getClientFallbackRealityCheck(): RealityCheckResult {
  return DEFAULT_REALITY_CHECK;
}

function getClientFallbackBlueprint(selectedProject: ProjectIdea): ProjectBlueprint {
  const name = selectedProject?.projectName || 'AI Campus Copilot';
  return {
    projectName: name,
    summary: selectedProject?.summary || 'An AI assistant for college students to navigate academic guidelines, track project milestones, and get guidance.',
    feasibility: selectedProject?.feasibilityScore || 92,
    estimatedDuration: selectedProject?.estimatedDuration || '6 Weeks',
    teamSize: '3 Members',
    problemStatement: 'Students often struggle to find accurate academic information, manage complex project schedules, and get guidance. Existing college portals are slow and difficult to search.',
    objectives: [
      'Provide instant conversational answers for campus policies, timetables, and project templates.',
      'Implement RAG document retrieval with zero hallucinations on official college PDFs.',
      'Offer interactive progress tracking and phase recommendations for final-year projects.',
      'Deliver a polished web dashboard accessible on both desktop and mobile browsers.'
    ],
    targetUsers: ['College Final-Year Students', 'Project Guides & Mentors', 'Department HODs'],
    expectedOutcome: 'Higher student productivity, 80% reduction in administrative queries, and a portfolio-worthy final-year project.',
    mvpFeatures: [
      { name: 'AI Campus Query Bot', description: 'Ask natural questions about syllabus, exams, and project guidelines.', priority: 'High', complexity: 'Medium' },
      { name: 'Document Ingestion & RAG', description: 'Upload syllabus PDFs and index them into vector embeddings.', priority: 'High', complexity: 'Hard' },
      { name: 'Interactive Project Task Checklist', description: 'Track phase completion with dynamic visual progress calculations.', priority: 'High', complexity: 'Easy' },
      { name: 'AI Co-Founder Guidance Bar', description: 'Real-time next step recommendations tailored to current project phase.', priority: 'Medium', complexity: 'Medium' }
    ],
    advancedFeatures: [
      { name: 'Viva Voce Mock Practice', description: 'Simulated viva questions with real-time AI feedback and scoring.', priority: 'Low', complexity: 'Hard' },
      { name: 'Multi-Student Team Sync', description: 'Collaborative task assignment for team members.', priority: 'Low', complexity: 'Hard' }
    ],
    architectureDiagram: [
      { layer: 'Frontend', component: 'React 18 + Tailwind UI', description: 'Responsive web interface with stateful navigation and interactive dashboards.' },
      { layer: 'Backend / API', component: 'Express Node Proxy / FastAPI', description: 'Handles secure proxy requests, rate limiting, and session caching.' },
      { layer: 'AI Layer', component: 'Gemini Flash API + Vector Search', description: 'Executes document embeddings, semantic search, and context-aware chat generation.' },
      { layer: 'Database', component: 'Vector Index / Browser LocalStorage', description: 'Conceptual vector index for documents + client-side state persistence.' },
      { layer: 'External APIs', component: 'Google Gemini AI Studio API', description: 'Low-latency AI inference model engine.' }
    ],
    techStack: [
      { category: 'Frontend', technology: 'React 18, TypeScript, Tailwind CSS', rationale: 'Fast development, strong type safety, clean SaaS UI components.' },
      { category: 'Backend', technology: 'Express Proxy / Node.js', rationale: 'Simple lightweight server to protect secret API keys.' },
      { category: 'AI Engine', technology: 'Gemini 2.5 Flash', rationale: 'Optimized for low latency, high accuracy, and low token cost.' },
      { category: 'State / Storage', technology: 'Browser LocalStorage', rationale: 'Zero-configuration state persistence for hackathon MVP.' }
    ],
    roadmap: [
      { phase: 'Phase 1', title: 'Planning & Requirements', duration: 'Week 1', description: 'Finalize student scope, tech stack setup, and repository creation.', tasks: ['Requirement gathering', 'Git setup', 'Design system setup'] },
      { phase: 'Phase 2', title: 'Frontend & UI Scaffolding', duration: 'Week 2', description: 'Build responsive landing page, onboarding wizard, and navigation sidebar.', tasks: ['Landing page', 'Onboarding step 1 & 2', 'Dashboard UI'] },
      { phase: 'Phase 3', title: 'Backend API & AI Proxy', duration: 'Week 3', description: 'Build Express proxy server and integrate secure Gemini API endpoints.', tasks: ['Express server', 'AI proxy routes', 'Error fallback engine'] },
      { phase: 'Phase 4', title: 'RAG Pipeline & AI Features', duration: 'Week 4', description: 'Implement document retrieval, scope reality check, and AI mentor context.', tasks: ['Document parsing', 'RAG chunking', 'Mentor context prompt'] },
      { phase: 'Phase 5', title: 'Testing & Optimization', duration: 'Week 5', description: 'Conduct end-to-end user testing, responsiveness checks, and Viva prep.', tasks: ['Task tracker tests', 'Mobile drawer check', 'Viva prep mock'] },
      { phase: 'Phase 6', title: 'Deployment & Demo', duration: 'Week 6', description: 'Deploy production build to Vercel/Netlify and record demo video.', tasks: ['Production bundle', 'Vercel deploy', 'Hackathon submission'] }
    ],
    testingStrategy: [
      'Unit testing client storage helpers and JSON parser robustness.',
      'Integration test backend AI proxy with mock and live Gemini keys.',
      'Responsive design check across desktop (1440px), tablet (768px), and mobile (375px) viewports.'
    ],
    securityConsiderations: [
      'GEMINI_API_KEY stored strictly in server-side environment secrets.',
      'Zero exposure of API keys in browser network tab or client bundles.',
      'Input sanitization on student inputs to prevent prompt injection.',
      'Rate-limiting middleware on public proxy endpoints.'
    ],
    deploymentPlan: [
      'Frontend built using Vite and hosted on Vercel static edge.',
      'Backend Express proxy deployed on Render / Vercel Serverless Functions.'
    ]
  };
}

function getClientFallbackMentorReply(message: string, context: any): string {
  const msgLower = (message || '').toLowerCase();
  const project = context?.project?.projectName || 'AI Campus Copilot';

  if (msgLower.includes('auth') || msgLower.includes('authentication') || msgLower.includes('complete')) {
    return `Nice job! 🎉 Since authentication is complete, your next highest-value step is the **RAG Pipeline**.

Here is what I recommend for your next 48 hours:
1. **Set up Document Ingestion**: Prepare 3-5 clean sample campus PDFs (syllabus, exam rules, project guidelines).
2. **Chunking & Embeddings**: Split text into ~500-token chunks with 50-token overlap. Pass them to Gemini or your vector search index.
3. **Build Retrieval Logic**: Create a query function that fetches top-k relevant chunks before calling Gemini Flash.
4. **Test with Sample Queries**: Verify zero hallucinations on official college policy.

*Pro tip*: Don't spend time on advanced UI animations or settings pages until this core RAG pipeline is working end-to-end!`;
  }

  if (msgLower.includes('next') || msgLower.includes('build')) {
    return `Based on your progress for **${project}**, here is your priority roadmap:

- **Immediate Focus**: Complete the RAG Document Ingestion task in your workspace.
- **Key Risk to Avoid**: Don't try to index entire 500-page textbooks at once. Start with key campus summary files.
- **Next Milestone**: Hook the vector retrieval output directly into your AI Mentor chat interface so answers quote exact policy clauses.`;
  }

  if (msgLower.includes('viva') || msgLower.includes('interview') || msgLower.includes('present')) {
    return `Here are the **Top 3 Viva Questions** judges and professors will ask about **${project}**:

1. *"Why did you use RAG instead of training or fine-tuning your own LLM?"*
   👉 **Your Answer**: *"Fine-tuning is expensive and causes catastrophic forgetting. RAG allows us to update campus documents instantly with zero retraining cost and zero hallucination risk."*

2. *"How do you handle API key security and backend latency?"*
   👉 **Your Answer**: *"We implemented a secure server-side AI proxy so secrets are never exposed client-side, and utilized Gemini Flash for sub-second responses."*

3. *"How do you measure match & feasibility scores?"*
   👉 **Your Answer**: *"Our Co-Founder engine evaluates student technical background against project architecture complexity and timeline constraints."*`;
  }

  return `Great question! Looking at **${project}** in phase **${context?.currentPhase || 'Backend Development'}**:

To maximize your score in the hackathon:
- Focus on demonstrating a **working end-to-end user flow**.
- Highlight your **Reality Check** pivot (how you challenged unrealistic scope into an achievable 6-week MVP).
- Keep your UI clean, fast, and responsive.

What specific part of your code or architecture would you like me to review next?`;
}
