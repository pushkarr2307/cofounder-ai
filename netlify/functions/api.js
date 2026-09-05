import { GoogleGenAI } from '@google/genai';

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

export async function handler(event, context) {
  const path = event.path.replace(/\/\.netlify\/functions\/api\/?/, '');
  const method = event.httpMethod;

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  if (method === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const body = event.body ? JSON.parse(event.body) : {};

    // 1. GENERATE PROJECT IDEAS
    if (path.includes('ideas') && method === 'POST') {
      const { profile, discovery } = body;
      const ai = getGeminiClient();
      if (!ai) {
        return { statusCode: 200, headers, body: JSON.stringify({ success: true, ideas: getFallbackIdeas(profile), isFallback: true }) };
      }

      const prompt = `Generate 3 realistic final-year projects for profile: ${JSON.stringify(profile)}. Return STRICT JSON array.`;
      const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt, config: { responseMimeType: 'application/json' } });
      return { statusCode: 200, headers, body: JSON.stringify({ success: true, ideas: parseGeminiJson(response.text), isFallback: false }) };
    }

    // 2. REALITY CHECK
    if (path.includes('challenge') && method === 'POST') {
      const { profile, selectedProject } = body;
      const ai = getGeminiClient();
      if (!ai) {
        return { statusCode: 200, headers, body: JSON.stringify({ success: true, realityCheck: getFallbackRealityCheck(selectedProject), isFallback: true }) };
      }

      const prompt = `Stress test project ${selectedProject?.projectName}. Return STRICT JSON.`;
      const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt, config: { responseMimeType: 'application/json' } });
      return { statusCode: 200, headers, body: JSON.stringify({ success: true, realityCheck: parseGeminiJson(response.text), isFallback: false }) };
    }

    // DEFAULT / MENTOR / FALLBACK
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true, reply: "Netlify serverless AI function active." })
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: err.message })
    };
  }
}

function getFallbackIdeas(profile) {
  const branch = profile?.branch || 'Computer Science';
  return [
    {
      id: 'idea-1',
      projectName: 'AI Campus Copilot',
      summary: 'An AI assistant for college students to query campus academic guidelines, track project milestones, and get study assistance.',
      matchScore: 95,
      feasibilityScore: 92,
      innovationScore: 90,
      estimatedDuration: profile?.duration || '6 Weeks',
      requiredSkills: ['Python', 'React', 'RAG / LLM APIs'],
      techStack: ['React', 'FastAPI', 'Pinecone', 'Gemini Flash'],
      industryValue: 'High utility for universities and student productivity.',
      risks: ['Hallucinations on college policy'],
      whyItFits: `Directly matches your ${branch} background and skills.`,
      isAIPick: true
    }
  ];
}

function getFallbackRealityCheck(selectedProject) {
  return {
    originalScope: `Train a custom LLM from scratch for ${selectedProject?.projectName || 'project'}.`,
    detectedRisks: ['Scope too large for 6 weeks.'],
    aiCritique: 'Training LLMs from scratch is unnecessary. Use Gemini Flash + RAG instead.',
    recommendation: 'Use pre-trained Gemini Flash API + RAG vector search.',
    feasibilityBefore: 68,
    feasibilityAfter: 92,
    accepted: true
  };
}
