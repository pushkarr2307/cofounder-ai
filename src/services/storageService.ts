import type {
  StudentProfile,
  ProjectIdea,
  RealityCheckResult,
  ProjectBlueprint,
  ProjectTask,
  ChatMessage
} from '../types';

const STORAGE_KEYS = {
  PROFILE: 'cofounder_student_profile',
  DISCOVERY: 'cofounder_discovery_responses',
  IDEAS: 'cofounder_project_ideas',
  SELECTED_PROJECT: 'cofounder_selected_project',
  REALITY_CHECK: 'cofounder_reality_check',
  BLUEPRINT: 'cofounder_project_blueprint',
  TASKS: 'cofounder_workspace_tasks',
  MENTOR_CHAT: 'cofounder_mentor_chat'
};

export const DEFAULT_PROFILE: StudentProfile = {
  branch: 'Computer Science and Engineering',
  year: 'Final Year',
  collegeName: 'National Institute of Technology',
  teamSize: 3,
  duration: '6 Weeks',
  weeklyAvailability: '15-20 hrs/week',
  budget: 'Free / Low cost',
  skills: ['Python', 'JavaScript', 'React', 'AI/LLM'],
  interests: ['AI/ML', 'Web Development', 'Education'],
  goal: 'Balanced',
  isCompleted: false
};

export const DEFAULT_SAMPLE_PROJECT: ProjectIdea = {
  id: 'idea-campus-copilot',
  projectName: 'AI Campus Copilot',
  summary: 'An AI assistant for college students to navigate academic guidelines, query campus resources, track project milestones, and get personalized study assistance.',
  matchScore: 95,
  feasibilityScore: 92,
  innovationScore: 90,
  estimatedDuration: '6 Weeks',
  requiredSkills: ['Python', 'React', 'RAG / LLM APIs', 'Node.js'],
  techStack: ['React', 'FastAPI', 'Pinecone / ChromaDB', 'Gemini Flash'],
  industryValue: 'High - Direct utility for universities, edtech platforms, and student productivity.',
  risks: ['Hallucinations on college policy', 'Initial vector indexing setup latency'],
  whyItFits: 'Matches your Python and React background, aligns with your AI interest in Education, and can be built realistically in 6 weeks.',
  isAIPick: true
};

export const DEFAULT_REALITY_CHECK: RealityCheckResult = {
  originalScope: 'Train a custom 7B LLM from scratch on college textbooks and host local GPUs.',
  detectedRisks: [
    'Scope is far too large for a 6-week timeline with limited student hardware.',
    'Training LLMs requires massive dataset curation, high VRAM GPUs, and weeks of fine-tuning.',
    'High cloud compute costs exceeding student budget.'
  ],
  aiCritique: 'Training a custom foundation model from scratch is unnecessary and risks project failure. Modern industry products leverage pre-trained LLMs with retrieval-augmented generation (RAG).',
  recommendation: 'Use pre-trained Gemini Flash API + RAG (Vector Search) for campus documents. Focus your innovation on student workflow, document ingestion, and accurate response evaluation.',
  feasibilityBefore: 68,
  feasibilityAfter: 92,
  accepted: true
};

export const DEFAULT_TASKS: ProjectTask[] = [
  { id: 'task-1', title: 'Project setup & repository structure', category: 'Planning', completed: true, priority: 'High' },
  { id: 'task-2', title: 'User authentication & session store', category: 'Backend', completed: true, priority: 'High' },
  { id: 'task-3', title: 'Campus database schema & data parsing', category: 'Backend', completed: true, priority: 'Medium' },
  { id: 'task-4', title: 'REST API endpoints & middleware setup', category: 'Backend', completed: true, priority: 'High' },
  { id: 'task-5', title: 'RAG Pipeline (Document Ingestion, Chunking & Embeddings)', category: 'AI', completed: false, priority: 'High' },
  { id: 'task-6', title: 'AI response evaluation & hallucination filter', category: 'AI', completed: false, priority: 'Medium' },
  { id: 'task-7', title: 'End-to-end integration testing & Viva demo prep', category: 'Testing', completed: false, priority: 'High' },
  { id: 'task-8', title: 'Production build & Vercel/Render deployment', category: 'Deployment', completed: false, priority: 'Medium' }
];

export const storageService = {
  getProfile(): StudentProfile {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
      return data ? JSON.parse(data) : DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  },
  saveProfile(profile: StudentProfile): void {
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
    } catch (e) {
      console.error('Error saving profile:', e);
    }
  },

  getDiscoveryResponses(): Record<string, string> {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.DISCOVERY);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  },
  saveDiscoveryResponses(responses: Record<string, string>): void {
    try {
      localStorage.setItem(STORAGE_KEYS.DISCOVERY, JSON.stringify(responses));
    } catch (e) {
      console.error('Error saving discovery responses:', e);
    }
  },

  getProjectIdeas(): ProjectIdea[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.IDEAS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },
  saveProjectIdeas(ideas: ProjectIdea[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.IDEAS, JSON.stringify(ideas));
    } catch (e) {
      console.error('Error saving project ideas:', e);
    }
  },

  getSelectedProject(): ProjectIdea | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SELECTED_PROJECT);
      return data ? JSON.parse(data) : DEFAULT_SAMPLE_PROJECT;
    } catch {
      return DEFAULT_SAMPLE_PROJECT;
    }
  },
  saveSelectedProject(project: ProjectIdea): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SELECTED_PROJECT, JSON.stringify(project));
    } catch (e) {
      console.error('Error saving selected project:', e);
    }
  },

  getRealityCheck(): RealityCheckResult | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.REALITY_CHECK);
      return data ? JSON.parse(data) : DEFAULT_REALITY_CHECK;
    } catch {
      return DEFAULT_REALITY_CHECK;
    }
  },
  saveRealityCheck(result: RealityCheckResult): void {
    try {
      localStorage.setItem(STORAGE_KEYS.REALITY_CHECK, JSON.stringify(result));
    } catch (e) {
      console.error('Error saving reality check:', e);
    }
  },

  getBlueprint(): ProjectBlueprint | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.BLUEPRINT);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },
  saveBlueprint(blueprint: ProjectBlueprint): void {
    try {
      localStorage.setItem(STORAGE_KEYS.BLUEPRINT, JSON.stringify(blueprint));
    } catch (e) {
      console.error('Error saving blueprint:', e);
    }
  },

  getWorkspaceTasks(): ProjectTask[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TASKS);
      return data ? JSON.parse(data) : DEFAULT_TASKS;
    } catch {
      return DEFAULT_TASKS;
    }
  },
  saveWorkspaceTasks(tasks: ProjectTask[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
    } catch (e) {
      console.error('Error saving tasks:', e);
    }
  },

  getMentorChat(): ChatMessage[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.MENTOR_CHAT);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },
  saveMentorChat(messages: ChatMessage[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.MENTOR_CHAT, JSON.stringify(messages));
    } catch (e) {
      console.error('Error saving chat:', e);
    }
  },

  clearAll(): void {
    try {
      Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
    } catch (e) {
      console.error('Error resetting storage:', e);
    }
  }
};
