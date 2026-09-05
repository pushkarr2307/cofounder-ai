export interface StudentProfile {
  branch: string;
  year: string;
  collegeName: string;
  teamSize: number;
  duration: string;
  weeklyAvailability: string;
  budget: string;
  skills: string[];
  interests: string[];
  goal: 'Easy' | 'Balanced' | 'Challenging' | 'Industry-level';
  isCompleted: boolean;
}

export interface ProjectIdea {
  id: string;
  projectName: string;
  summary: string;
  matchScore: number;
  feasibilityScore: number;
  innovationScore: number;
  estimatedDuration: string;
  requiredSkills: string[];
  techStack: string[];
  industryValue: string;
  risks: string[];
  whyItFits: string;
  isAIPick?: boolean;
}

export interface RealityCheckResult {
  originalScope: string;
  detectedRisks: string[];
  aiCritique: string;
  recommendation: string;
  feasibilityBefore: number;
  feasibilityAfter: number;
  accepted: boolean;
}

export interface FeatureItem {
  name: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low';
  complexity: 'Easy' | 'Medium' | 'Hard';
}

export interface TechStackItem {
  category: string;
  technology: string;
  rationale: string;
}

export interface RoadmapPhaseItem {
  phase: string;
  title: string;
  duration: string;
  description: string;
  tasks: string[];
}

export interface ArchitectureItem {
  layer: string;
  component: string;
  description: string;
}

export interface ProjectBlueprint {
  projectName: string;
  summary: string;
  feasibility: number;
  estimatedDuration: string;
  teamSize: string;
  problemStatement: string;
  objectives: string[];
  targetUsers: string[];
  expectedOutcome: string;
  mvpFeatures: FeatureItem[];
  advancedFeatures: FeatureItem[];
  architectureDiagram: ArchitectureItem[];
  techStack: TechStackItem[];
  roadmap: RoadmapPhaseItem[];
  testingStrategy: string[];
  securityConsiderations: string[];
  deploymentPlan: string[];
}

export interface ProjectTask {
  id: string;
  title: string;
  category: 'Planning' | 'Frontend' | 'Backend' | 'AI' | 'Testing' | 'Deployment';
  completed: boolean;
  priority?: 'High' | 'Medium' | 'Low';
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  quickPrompts?: string[];
}
