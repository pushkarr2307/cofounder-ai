# Co-Founder AI

> **Your AI Project Co-Founder for Final-Year Projects**

Co-Founder AI is an AI-powered web platform that helps final-year
students turn their skills, interests, constraints, and ideas into
practical projects they can actually build.

Instead of simply generating random project ideas, Co-Founder AI works
like a **project co-founder**: it understands the student, challenges
unrealistic plans, compares ideas, recommends the strongest option,
creates a project blueprint, and guides the student through development.

## ✨ Why Co-Founder AI?

Students often struggle with choosing the right project, controlling
scope and timelines, selecting technologies, and knowing what to build
next. Co-Founder AI brings these decisions into one guided workflow.

## 🚀 Core Workflow

``` text
Student Profile → AI Discovery → Personalized Ideas → Idea Comparison
→ AI Reality Check → Recommendation → Project Blueprint
→ Project Workspace → AI Mentor
```

## 🧠 Key Features

### AI Discovery

A conversational onboarding experience that asks meaningful questions
without overwhelming the student.

### Personalized Project Ideas

Generates project concepts based on skills, interests, team size,
available time, budget, preferred technologies, and goals.

Ideas can include match score, feasibility, innovation, estimated
duration, required skills, risks, and recommended technologies.

### AI Reality Check

The AI does not blindly agree with the student. It identifies
unrealistic scope, technical risks, timeline problems, and resource
constraints, then suggests practical alternatives.

### Project Blueprint

Turns the selected idea into a structured plan covering problem
statement, objectives, target users, MVP and advanced features,
architecture, technology stack, APIs, roadmap, testing, security,
deployment, and future scope.

### Project Workspace

A lightweight execution workspace with development phases, tasks,
completion tracking, progress percentage, current phase, and next
recommended action. MVP progress is persisted with browser localStorage.

### AI Mentor

A project-aware AI assistant that helps students decide what to do next
and make development decisions based on their project context.

## 🛠️ Technology

- React + TypeScript
- Vite
- Tailwind CSS
- Component-based UI architecture
- Google Gemini API
- Browser localStorage
- Compatible with modern web hosting platforms

## 🔐 Security

- Keep `GEMINI_API_KEY` in server-side environment variables.
- Never commit `.env` files or API keys to GitHub.
- Route AI requests through a secure server-side function/API.
- Validate user input.
- Handle AI/API failures gracefully.
- Add rate limiting and authentication before production-scale
  deployment.

## ⚙️ Local Development

### Prerequisites

- Node.js
- npm
- Google Gemini API key

### Installation

``` bash
git clone <your-repository-url>
cd cofounder-ai
npm install
```

Create a local environment file:

``` env
GEMINI_API_KEY=your_gemini_api_key
```

Start the development server:

``` bash
npm run dev
```

Open the local URL shown by Vite.

## 📁 Project Structure

``` text
src/
├── components/       # Reusable UI components
├── pages/            # Main website experiences
├── lib/              # AI, state and utility logic
└── ...
public/               # Static assets
```

The modular structure makes it easy to extend individual AI workflows
and website experiences.

## 🎯 Hackathon Value

Choosing a project is easy; choosing the **right** project and actually
finishing it is hard.

Co-Founder AI combines:

**Discovery + Validation + Planning + Execution + Mentoring**

It is designed as an AI partner throughout the project lifecycle, not
just an idea generator.

## 🔮 Future Scope

- User authentication and cloud storage
- Team collaboration
- GitHub integration
- AI code review
- Project report/document generation
- Presentation and viva preparation
- Automated progress analysis
- Deployment assistance
- College-specific project templates
- AI project evaluation and scoring

## 📄 License

Add your preferred license before public production release.

------------------------------------------------------------------------

### Built for the Prompt Wars Hackathon

**Co-Founder AI — Don’t just generate a project. Build the right one.**
