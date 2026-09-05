import { useState } from 'react';
import { Sidebar } from './components/Navigation';
import { LandingPage } from './components/LandingPage';
import { Onboarding } from './components/Onboarding';
import { AIDiscovery } from './components/AIDiscovery';
import { ProjectIdeas } from './components/ProjectIdeas';
import { RealityCheck } from './components/RealityCheck';
import { ProjectBlueprintView } from './components/ProjectBlueprint';
import { ProjectWorkspace } from './components/ProjectWorkspace';
import { AIMentor } from './components/AIMentor';
import { Dashboard } from './components/Dashboard';

import type { StudentProfile, ProjectIdea } from './types';
import { storageService, DEFAULT_SAMPLE_PROJECT } from './services/storageService';

export function App() {
  const [activeRoute, setActiveRoute] = useState<string>('landing');
  const [profile, setProfile] = useState<StudentProfile>(() => storageService.getProfile());
  const [selectedProject, setSelectedProject] = useState<ProjectIdea>(() => {
    return storageService.getSelectedProject() || DEFAULT_SAMPLE_PROJECT;
  });

  const navigateTo = (route: string) => {
    setActiveRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOnboardingComplete = (updatedProfile: StudentProfile) => {
    setProfile(updatedProfile);
    navigateTo('discovery');
  };

  const handleDiscoveryDone = () => {
    navigateTo('ideas');
  };

  const handleSelectProject = (project: ProjectIdea, nextAction: 'challenge' | 'blueprint') => {
    setSelectedProject(project);
    storageService.saveSelectedProject(project);
    navigateTo(nextAction);
  };

  const isPublicRoute = activeRoute === 'landing' || activeRoute === 'onboarding';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col md:flex-row font-sans antialiased">
      {!isPublicRoute && (
        <Sidebar
          activeRoute={activeRoute}
          onNavigate={navigateTo}
          selectedProjectName={selectedProject?.projectName}
        />
      )}

      <main className="flex-1 min-w-0 overflow-y-auto">
        {activeRoute === 'landing' && (
          <LandingPage onStart={() => navigateTo('onboarding')} />
        )}

        {activeRoute === 'onboarding' && (
          <Onboarding
            onComplete={handleOnboardingComplete}
            onCancel={() => navigateTo('landing')}
          />
        )}

        {activeRoute === 'discovery' && (
          <AIDiscovery
            profile={profile}
            onIdeasGenerated={handleDiscoveryDone}
          />
        )}

        {activeRoute === 'ideas' && (
          <ProjectIdeas
            profile={profile}
            onSelectProject={handleSelectProject}
          />
        )}

        {activeRoute === 'challenge' && (
          <RealityCheck
            profile={profile}
            selectedProject={selectedProject}
            onProceedToBlueprint={() => navigateTo('blueprint')}
          />
        )}

        {activeRoute === 'blueprint' && (
          <ProjectBlueprintView
            profile={profile}
            selectedProject={selectedProject}
            onStartWorkspace={() => navigateTo('workspace')}
          />
        )}

        {activeRoute === 'workspace' && (
          <ProjectWorkspace
            selectedProject={selectedProject}
            onNavigateToMentor={() => navigateTo('mentor')}
          />
        )}

        {activeRoute === 'mentor' && (
          <AIMentor
            profile={profile}
            selectedProject={selectedProject}
          />
        )}

        {activeRoute === 'dashboard' && (
          <Dashboard
            profile={profile}
            selectedProject={selectedProject}
            onNavigate={navigateTo}
          />
        )}
      </main>
    </div>
  );
}

export default App;
