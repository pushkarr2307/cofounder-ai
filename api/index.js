import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));

const getApiKey = () => process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || '';

const getGeminiClient = () => {
  const apiKey = getApiKey();
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
};

function parseGeminiJson(text) {
  try {
    let clean = text.trim();
    if (clean.startsWith('```json')) {
      clean = clean.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (clean.startsWith('```')) {
      clean = clean.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }
    return JSON.parse(clean);
  } catch (e) {
    console.error('Failed to parse Gemini JSON output:', e);
    throw new Error('Malformed AI response format');
  }
}

// 1. GENERATE PROJECT IDEAS
app.post('/api/ai/ideas', async (req, res) => {
  const { profile, discovery } = req.body;

  try {
    const ai = getGeminiClient();
    if (!ai) {
      return res.json({ success: true, ideas: getFallbackIdeas(profile), isFallback: true });
    }

    const prompt = `You are a practical, highly experienced Startup Co-Founder & Final-Year College Project Advisor.
Given the student profile and discovery survey below, generate EXACTLY 3 realistic, high-impact final-year project ideas.

STUDENT PROFILE:
Branch: ${profile?.branch || 'Computer Science'}
Year: ${profile?.year || 'Final Year'}
Team Size: ${profile?.teamSize || 3} members
Available Duration: ${profile?.duration || '6 Weeks'}
Skills: ${(profile?.skills || []).join(', ')}
Interests: ${(profile?.interests || []).join(', ')}
Project Goal: ${profile?.goal || 'Balanced'}

DISCOVERY ANSWERS:
${JSON.stringify(discovery || {}, null, 2)}

REQUIREMENTS:
- Generate exactly 3 projects.
- Mark ONE project as "isAIPick": true (the most realistic & high-value one).
- Assign matchScore (80-98), feasibilityScore (75-95), and innovationScore (70-95).
- Keep descriptions crisp, realistic, and achievable within the student's duration and skill set.

RETURN STRICT JSON ONLY matching array:
[
  {
    "id": "idea-1",
    "projectName": "Project Name",
    "summary": "Short description",
    "matchScore": 95,
    "feasibilityScore": 92,
    "innovationScore": 88,
    "estimatedDuration": "6 Weeks",
    "requiredSkills": ["Skill 1"],
    "techStack": ["Tech 1"],
    "industryValue": "Impact note",
    "risks": ["Risk 1"],
    "whyItFits": "Why this fits",
    "isAIPick": true
  }
]`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' }
    });

    const parsed = parseGeminiJson(response.text);
    return res.json({ success: true, ideas: parsed, isFallback: false });
  } catch (error) {
    return res.json({ success: true, ideas: getFallbackIdeas(profile), isFallback: true, error: error.message });
  }
});

// 2. REALITY CHECK
app.post('/api/ai/challenge', async (req, res) => {
  const { profile, selectedProject } = req.body;

  try {
    const ai = getGeminiClient();
    if (!ai) {
      return res.json({ success: true, realityCheck: getFallbackRealityCheck(selectedProject), isFallback: true });
    }

    const prompt = `You are a tough but constructive Startup Co-Founder & Tech Lead.
Stress-test and challenge the student's selected project to prevent unrealistic scope.

PROJECT: ${selectedProject?.projectName} - ${selectedProject?.summary}
TIMELINE: ${profile?.duration || '6 Weeks'}

RETURN STRICT JSON ONLY matching:
{
  "originalScope": "Original scope description",
  "detectedRisks": ["Risk 1", "Risk 2"],
  "aiCritique": "Explanation why scope will struggle",
  "recommendation": "Specific actionable pivot recommendation",
  "feasibilityBefore": 68,
  "feasibilityAfter": 92,
  "accepted": true
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' }
    });

    const parsed = parseGeminiJson(response.text);
    return res.json({ success: true, realityCheck: parsed, isFallback: false });
  } catch (error) {
    return res.json({ success: true, realityCheck: getFallbackRealityCheck(selectedProject), isFallback: true, error: error.message });
  }
});

// 3. BLUEPRINT
app.post('/api/ai/blueprint', async (req, res) => {
  const { profile, selectedProject, realityCheck } = req.body;

  try {
    const ai = getGeminiClient();
    if (!ai) {
      return res.json({ success: true, blueprint: getFallbackBlueprint(selectedProject), isFallback: true });
    }

    const prompt = `Generate a production-grade Project Blueprint for ${selectedProject?.projectName}.
Pivot: ${realityCheck?.recommendation || 'Standard plan'}
Duration: ${profile?.duration || '6 Weeks'}

RETURN STRICT JSON ONLY matching blueprint schema.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' }
    });

    const parsed = parseGeminiJson(response.text);
    return res.json({ success: true, blueprint: parsed, isFallback: false });
  } catch (error) {
    return res.json({ success: true, blueprint: getFallbackBlueprint(selectedProject), isFallback: true, error: error.message });
  }
});

// 4. MENTOR
app.post('/api/ai/mentor', async (req, res) => {
  const { message, context } = req.body;

  try {
    const ai = getGeminiClient();
    if (!ai) {
      return res.json({ success: true, reply: getFallbackMentorReply(message, context), isFallback: true });
    }

    const prompt = `You are Co-Founder AI Mentor. Respond to "${message}" with project-aware guidance for ${context?.project?.projectName}.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt
    });

    return res.json({ success: true, reply: response.text, isFallback: false });
  } catch (error) {
    return res.json({ success: true, reply: getFallbackMentorReply(message, context), isFallback: true, error: error.message });
  }
});

function getFallbackIdeas(profile) {
  const branch = profile?.branch || 'Computer Science';
  return [
    {
      id: 'idea-1',
      projectName: 'AI Campus Copilot',
      summary: 'An AI assistant for college students to query campus academic guidelines, track project milestones, and get personalized study assistance.',
      matchScore: 95,
      feasibilityScore: 92,
      innovationScore: 90,
      estimatedDuration: profile?.duration || '6 Weeks',
      requiredSkills: ['Python', 'React', 'RAG / LLM APIs', 'Node.js'],
      techStack: ['React', 'FastAPI', 'Pinecone', 'Gemini Flash'],
      industryValue: 'High - Direct utility for universities, edtech platforms, and student productivity.',
      risks: ['Hallucinations on college policy', 'Initial vector indexing latency'],
      whyItFits: `Directly matches your ${branch} background and skills. Perfect fit for a ${profile?.duration || '6-week'} project.`,
      isAIPick: true
    },
    {
      id: 'idea-2',
      projectName: 'Smart Health Navigator',
      summary: 'AI-powered health information assistant for symptom triage, doctor specialization routing, and medical report translation.',
      matchScore: 88,
      feasibilityScore: 84,
      innovationScore: 86,
      estimatedDuration: profile?.duration || '6 Weeks',
      requiredSkills: ['Python', 'React', 'Healthcare APIs'],
      techStack: ['React', 'Node.js', 'Gemini Flash', 'Tailwind'],
      industryValue: 'High - Growing telemedicine market and consumer health awareness.',
      risks: ['Medical compliance & disclaimer requirements', 'Accuracy validation'],
      whyItFits: 'Leverages AI/ML capabilities to solve real consumer healthcare access challenges.',
      isAIPick: false
    },
    {
      id: 'idea-3',
      projectName: 'AI Interview Simulator',
      summary: 'Practice technical & behavioral mock interviews with realistic AI feedback, audio transcription, and weakness analytics.',
      matchScore: 85,
      feasibilityScore: 80,
      innovationScore: 82,
      estimatedDuration: profile?.duration || '6 Weeks',
      requiredSkills: ['JavaScript', 'Web Audio API', 'LLM Prompt Engineering'],
      techStack: ['React', 'Express', 'WebRTC', 'Gemini Flash'],
      industryValue: 'Very High - Massive job placement demand for engineering graduates.',
      risks: ['Real-time audio processing latency', 'Feedback scoring consistency'],
      whyItFits: 'Practical application that directly helps you prepare for campus placements.',
      isAIPick: false
    }
  ];
}

function getFallbackRealityCheck(selectedProject) {
  const name = selectedProject?.projectName || 'AI Campus Copilot';
  return {
    originalScope: `Train a custom LLM foundation model from scratch for ${name} using local student compute.`,
    detectedRisks: [
      'Scope is far too large for a 6-week timeline with limited student compute.',
      'Training LLMs requires massive dataset curation, high VRAM GPUs, and weeks of tuning.',
      'High risk of running out of time before having a working demo.'
    ],
    aiCritique: `Training a custom model from scratch is unnecessary and risks project failure. Modern industry SaaS products leverage pre-trained foundation models like Gemini Flash combined with Retrieval-Augmented Generation (RAG).`,
    recommendation: 'Use pre-trained Gemini Flash API + RAG (Vector Search) for campus documents. Focus your innovation on student workflow, document ingestion, and accurate response evaluation.',
    feasibilityBefore: 68,
    feasibilityAfter: 92,
    accepted: true
  };
}

function getFallbackBlueprint(selectedProject) {
  const name = selectedProject?.projectName || 'AI Campus Copilot';
  return {
    projectName: name,
    summary: 'An AI assistant for college students to navigate academic guidelines, track project milestones, and get guidance.',
    feasibility: 92,
    estimatedDuration: '6 Weeks',
    teamSize: '3 Members',
    problemStatement: 'Students often struggle to find accurate academic information, manage complex project schedules, and get guidance.',
    objectives: [
      'Provide instant conversational answers for campus policies and project templates.',
      'Implement RAG document retrieval with zero hallucinations on official college PDFs.',
      'Offer interactive progress tracking and phase recommendations for final-year projects.',
      'Deliver a polished web dashboard accessible on both desktop and mobile browsers.'
    ],
    targetUsers: ['College Final-Year Students', 'Project Guides & Mentors', 'Department HODs'],
    expectedOutcome: 'Higher student productivity and 80% reduction in administrative queries.',
    mvpFeatures: [
      { name: 'AI Campus Query Bot', description: 'Ask natural questions about syllabus, exams, and project guidelines.', priority: 'High', complexity: 'Medium' },
      { name: 'Document Ingestion & RAG', description: 'Upload syllabus PDFs and index them into vector embeddings.', priority: 'High', complexity: 'Hard' }
    ],
    advancedFeatures: [
      { name: 'Viva Voce Mock Practice', description: 'Simulated viva questions with real-time AI feedback and scoring.', priority: 'Low', complexity: 'Hard' }
    ],
    architectureDiagram: [
      { layer: 'Frontend', component: 'React 18 + Tailwind UI', description: 'Responsive web interface with stateful navigation.' },
      { layer: 'Backend / API', component: 'Vercel Serverless Functions', description: 'Handles secure proxy requests, rate limiting, and session caching.' },
      { layer: 'AI Layer', component: 'Gemini Flash API + Vector Search', description: 'Executes document embeddings and semantic search.' }
    ],
    techStack: [
      { category: 'Frontend', technology: 'React 18, TypeScript, Tailwind CSS', rationale: 'Fast development, strong type safety, clean SaaS UI.' },
      { category: 'AI Engine', technology: 'Gemini 2.5 Flash', rationale: 'Optimized for low latency and high accuracy.' }
    ],
    roadmap: [
      { phase: 'Phase 1', title: 'Planning & Setup', duration: 'Week 1', description: 'Finalize scope and repo setup.', tasks: ['Requirements', 'Git setup'] },
      { phase: 'Phase 2', title: 'Frontend UI', duration: 'Week 2', description: 'Build responsive views.', tasks: ['Landing page', 'Workspace'] },
      { phase: 'Phase 3', title: 'AI Integration', duration: 'Week 3', description: 'Integrate Gemini API.', tasks: ['RAG pipeline', 'Mentor chat'] }
    ],
    testingStrategy: ['Unit testing storage helpers', 'Vercel deployment test'],
    securityConsiderations: ['GEMINI_API_KEY stored strictly in Vercel Environment Variables.'],
    deploymentPlan: ['Hosted on Vercel Serverless Edge Platform.']
  };
}

function getFallbackMentorReply(message, context) {
  const msgLower = (message || '').toLowerCase();
  const project = context?.project?.projectName || 'AI Campus Copilot';

  if (msgLower.includes('auth') || msgLower.includes('authentication') || msgLower.includes('complete')) {
    return `Nice job! 🎉 Since authentication is complete, your next highest-value step is the **RAG Pipeline**.

Here is what I recommend for your next 48 hours:
1. **Set up Document Ingestion**: Prepare 3-5 clean sample campus PDFs.
2. **Chunking & Embeddings**: Split text into ~500-token chunks with 50-token overlap.
3. **Build Retrieval Logic**: Create a query function that fetches top-k relevant chunks.
4. **Test with Sample Queries**: Verify zero hallucinations on official college policy.`;
  }

  return `Great question! Looking at **${project}**: focus on completing your core RAG ingestion and task tracking. What specific part would you like to build next?`;
}

export default app;
