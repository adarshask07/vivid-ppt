import React, { useState, useEffect } from "react";
import Layout from "./components/Layout";
import Dashboard from "./components/Dashboard";
import Templates from "./components/Templates";
import Trash from "./components/Trash";
import Settings from "./components/Settings";
import TopBar from "./components/TopBar";
import EditorLayout from "./components/editor/EditorLayout";
import CreatePresentationPage from "./components/CreatePresentationPage";
import SlideDemo from "./components/SlideDemo";
import { GenerationStudio } from "./components/GenerationStudio";

import { ProjectProvider, useProjects } from "./context/ProjectContext";
import VividPackageDemo from "./components/VividPackageDemo";

const AppContent: React.FC = () => {
  const {
    activeProjectId,
    activeView,
    navigate,
    generationState,
    cancelGeneration,
    completeGeneration,
  } = useProjects();
  const [showDemo, setShowDemo] = useState(false);
  const [showVividDemo, setShowVividDemo] = useState(true);

  // Press Ctrl+Shift+Alt+P to toggle demo mode (for development)
  // Press Ctrl+Shift+Alt+V to toggle Vivid package demo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.ctrlKey && e.shiftKey) {
        if (e.key === "p") {
          e.preventDefault();
          setShowDemo((prev) => !prev);
        } else if (e.key === "v") {
          e.preventDefault();
          setShowVividDemo((prev) => !prev);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Show Vivid package demo (Ctrl+Shift+Alt+V)
  if (showVividDemo) {
    return <VividPackageDemo onBack={() => setShowVividDemo(false)} />;
  }

  // Show slide demo if toggled (Ctrl+Shift+Alt+P)
  if (showDemo) {
    return <SlideDemo />;
  }

  // Show GenerationStudio when generating a presentation
  if (generationState.isGenerating && generationState.prompt) {
    return (
      <GenerationStudio
        prompt={generationState.prompt}
        onComplete={(presentation) => completeGeneration(presentation)}
        onCancel={cancelGeneration}
      />
    );
  }

  // If a project is active, show the Editor instead of the main dashboard layout
  if (activeProjectId) {
    return <EditorLayout />;
  }

  // If the user is in the Creation Studio, show it full screen (no sidebar)
  if (activeView === "create") {
    return <CreatePresentationPage onCancel={() => navigate("home")} />;
  }

  const renderContent = () => {
    switch (activeView) {
      case "home":
        return (
          <>
            <TopBar />
            <Dashboard />
          </>
        );
      case "templates":
        return (
          <>
            <TopBar />
            <Templates />
          </>
        );
      case "trash":
        return <Trash />;
      case "settings":
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return <Layout>{renderContent()}</Layout>;
};

const App: React.FC = () => {
  return (
    <ProjectProvider>
      <AppContent />
    </ProjectProvider>
  );
};

export default App;
