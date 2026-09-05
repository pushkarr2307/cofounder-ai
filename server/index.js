import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Helper to check if GEMINI_API_KEY exists securely in environment
const getApiKey = () => process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || '';

// Clean helper to get Gemini SDK instance securely
const getGeminiClient = () => {
  const apiKey = getApiKey();
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
};

console.log(`[Co-Founder AI Proxy] Starting server... API key detected: ${getApiKey() ? 'YES (Key Hidden)' : 'NO (Demo fallback mode active)'}`);

// Helper to extract JSON from Gemini markdown code block or raw string
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
    console.error('Failed to parse Gemini JSON output:', e, 'Raw text:', text);
    throw new Error('Malformed AI response format');
  }
}

// ----------------------------------------------------
// 1. GENERATE PROJECT IDEAS
// ----------------------------------------------------
app.post('/api/ai/ideas', async (req, res) => {
  const { profile, discovery } = req.body;

  try {
    const ai = getGeminiClient();
    if (!ai) {
      console.log('[API Proxy] Using fallback project ideas generator (No API key present)');
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

RETURN STRICT JSON ONLY matching this array structure:
[
  {
    "id": "idea-1",
    "projectName": "Project Name",
    "summary": "Short 1-2 sentence description",
    "matchScore": 95,
    "feasibilityScore": 92,
    "innovationScore": 88,
    "estimatedDuration": "6 Weeks",
    "requiredSkills": ["Skill 1", "Skill 2"],
    "techStack": ["Tech 1", "Tech 2"],
    "industryValue": "Short industry impact note",
    "risks": ["Risk 1", "Risk 2"],
    "whyItFits": "Why this specific project fits the student profile",
    "isAIPick": true
  }
]`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const parsed = parseGeminiJson(response.text);
    return res.json({ success: true, ideas: parsed, isFallback: false });
  } catch (error) {
    console.error('Error generating project ideas via Gemini:', error.message);
    return res.json({ success: true, ideas: getFallbackIdeas(profile), isFallback: true, error: error.message });
  }
});

// ----------------------------------------------------
// 2. REALITY CHECK / STRESS TEST
// ----------------------------------------------------
app.post('/api/ai/challenge', async (req, res) => {
  const { profile, selectedProject } = req.body;

  try {
    const ai = getGeminiClient();
    if (!ai) {
      console.log('[API Proxy] Using fallback reality check (No API key present)');
      return res.json({ success: true, realityCheck: getFallbackRealityCheck(selectedProject), isFallback: true });
    }

    const prompt = `You are a tough but constructive Startup Co-Founder & Tech Lead.
Your goal is to stress-test and challenge the student's selected final-year project idea to prevent them from taking on unrealistic scope or bad architectural choices.

PROJECT TO CHALLENGE:
Name: ${selectedProject?.projectName}
Summary: ${selectedProject?.summary}
Proposed Skills: ${(selectedProject?.techStack || []).join(', ')}

STUDENT CONSTRAINTS:
Duration: ${profile?.duration || '6 Weeks'}
Team Size: ${profile?.teamSize || 3} members
Weekly Availability: ${profile?.weeklyAvailability || '15 hrs/week'}
Skills: ${(profile?.skills || []).join(', ')}

CRITIQUE INSTRUCTIONS:
1. Identify 2-3 severe scope creep or technical complexity risks (e.g. training LLMs from scratch vs using pre-trained APIs, building complex custom engines vs off-the-shelf wrappers).
2. Provide a practical recommendation that keeps the core innovation while lowering unnecessary complexity.
3. Calculate Feasibility Score Before (usually 60-72%) and Feasibility Score After applying recommendation (88-95%).

RETURN STRICT JSON ONLY matching:
{
  "originalScope": "Brief description of the original ambitious scope",
  "detectedRisks": [
    "Risk 1: Timeline or resource impossibility",
    "Risk 2: High friction or skill mismatch"
  ],
  "aiCritique": "2-3 sentences explaining why the original plan will struggle",
  "recommendation": "Specific actionable pivot recommendation (e.g. Use pre-trained LLM + RAG instead of custom model training)",
  "feasibilityBefore": 68,
  "feasibilityAfter": 92,
  "accepted": true
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const parsed = parseGeminiJson(response.text);
    return res.json({ success: true, realityCheck: parsed, isFallback: false });
  } catch (error) {
    console.error('Error generating reality check via Gemini:', error.message);
    return res.json({ success: true, realityCheck: getFallbackRealityCheck(selectedProject), isFallback: true, error: error.message });
  }
});

// ----------------------------------------------------
// 3. GENERATE BLUEPRINT
// ----------------------------------------------------
app.post('/api/ai/blueprint', async (req, res) => {
  const { profile, selectedProject, realityCheck } = req.body;

  try {
    const ai = getGeminiClient();
    if (!ai) {
      console.log('[API Proxy] Using fallback blueprint generator (No API key present)');
      return res.json({ success: true, blueprint: getFallbackBlueprint(selectedProject), isFallback: true });
    }

    const prompt = `You are a Senior Systems Architect & Technical Co-Founder.
Generate a complete, production-grade Project Blueprint for the final-year student project described below.

PROJECT:
Name: ${selectedProject?.projectName}
Summary: ${selectedProject?.summary}
Accepted Pivot: ${realityCheck?.recommendation || 'Standard implementation'}
Target Duration: ${profile?.duration || '6 Weeks'}
Team Size: ${profile?.teamSize || 3} members

SECTIONS REQUIRED IN JSON:
- problemStatement
- objectives (3-4 bullet points)
- targetUsers (2-3 items)
- expectedOutcome
- mvpFeatures (array of { name, description, priority: "High"|"Medium"|"Low", complexity: "Easy"|"Medium"|"Hard" })
- advancedFeatures (array of { name, description, priority: "Low", complexity: "Hard" })
- architectureDiagram (array of { layer: "Frontend"|"Backend/API"|"AI Layer"|"Database"|"External Services", component: string, description: string })
- techStack (array of { category, technology, rationale })
- roadmap (array of 6 phases: Phase 1 Planning, Phase 2 Setup, Phase 3 Core Dev, Phase 4 AI Integration, Phase 5 Testing, Phase 6 Deployment with duration & task list)
- testingStrategy (3-4 items)
- securityConsiderations (API key protection, rate limiting, authentication, input validation)
- deploymentPlan (2-3 steps)

RETURN STRICT JSON ONLY.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const parsed = parseGeminiJson(response.text);
    return res.json({ success: true, blueprint: parsed, isFallback: false });
  } catch (error) {
    console.error('Error generating blueprint via Gemini:', error.message);
    return res.json({ success: true, blueprint: getFallbackBlueprint(selectedProject), isFallback: true, error: error.message });
  }
});

// ----------------------------------------------------
// 4. AI MENTOR CHAT
// ----------------------------------------------------
app.post('/api/ai/mentor', async (req, res) => {
  const { message, history, context } = req.body;

  try {
    const ai = getGeminiClient();
    if (!ai) {
      console.log('[API Proxy] Using fallback mentor responder (No API key present)');
      return res.json({ success: true, reply: getFallbackMentorReply(message, context), isFallback: true });
    }

    const prompt = `You are the Co-Founder AI Mentor. You act as a practical, empathetic, and sharp technical co-founder.
You give project-aware guidance, NOT generic canned responses.

PROJECT CONTEXT:
Project Name: ${context?.project?.projectName || 'AI Campus Copilot'}
Current Phase: ${context?.currentPhase || 'Backend Development'}
Completed Tasks: ${(context?.completedTasks || []).join(', ')}
Remaining Tasks: ${(context?.remainingTasks || []).join(', ')}
Student Goal: ${context?.profile?.goal || 'Balanced'}

USER MESSAGE: "${message}"

INSTRUCTIONS:
- Give a concise, high-value 2-4 paragraph response tailored to the student's project phase and exact progress.
- Include actionable next steps formatted clearly with bold text or bullet points.
- If asked questions like "Authentication complete ho gaya. Ab kya karu?", acknowledge completion warmly, then direct them to the next highest-leverage task (e.g. RAG pipeline ingestion & chunking).
- Keep a encouraging co-founder tone: direct, practical, technical, and motivating.

Respond in natural text formatting.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt
    });

    return res.json({ success: true, reply: response.text, isFallback: false });
  } catch (error) {
    console.error('Error generating mentor reply via Gemini:', error.message);
    return res.json({ success: true, reply: getFallbackMentorReply(message, context), isFallback: true, error: error.message });
  }
});

// ====================================================
// FALLBACK DEMO DATASET GENERATORS
// ====================================================

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
      whyItFits: `Directly matches your ${branch} background and skills in ${profile?.skills?.join(', ') || 'React & Python'}. Perfect fit for a ${profile?.duration || '6-week'} project.`,
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
      whyItFits: 'Practical application that directly helps you and your batchmates prepare for campus placements.',
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
      'High risk of running out of time before having a working demo for viva.'
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
    summary: 'An AI assistant for college students to navigate academic guidelines, query campus resources, track project milestones, and get personalized study assistance.',
    feasibility: 92,
    estimatedDuration: '6 Weeks',
    teamSize: '3 Members',
    problemStatement: 'Students often struggle to find accurate academic information, manage complex project schedules, and get personalized guidance. Existing college portals are slow and difficult to search.',
    objectives: [
      'Provide instant conversational answers for campus policies, timetables, and project templates.',
      'Implement RAG document retrieval with zero hallucinations on official college PDFs.',
      'Offer interactive progress tracking and phase recommendations for final-year projects.',
      'Deliver a polished web dashboard accessible on both desktop and mobile browsers.'
    ],
    targetUsers: ['College Final-Year Students', 'Project Guides & Mentors', 'Department HODs'],
    expectedOutcome: 'A functional, high-speed SaaS web platform demonstrating multi-modal AI retrieval, reducing administrative query times by 80%.',
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

function getFallbackMentorReply(message, context) {
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

app.listen(PORT, () => {
  console.log(`[Co-Founder AI Proxy] Server running on http://localhost:${PORT}`);
});
