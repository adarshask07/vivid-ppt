import React, { useEffect } from "react";
import EditorToolbar from "./EditorToolbar";
import SlideRail from "./SlideRail";
import SlideCanvas from "./SlideCanvas";
import PropertiesPanel from "./PropertiesPanel";
import { useProjects } from "../../context/ProjectContext";
import { useSlideStore } from "../../store/useSlideStore";

const EditorLayout: React.FC = () => {
  const { projects, activeProjectId } = useProjects();
  const { setSlides, setCurrentSlideIndex } = useSlideStore();

  // Load project slides into the slide store when project opens
  useEffect(() => {
    if (activeProjectId) {
      const project = projects.find((p) => p.id === activeProjectId);
      if (project?.slides && project.slides.length > 0) {
        setSlides(project.slides);
        setCurrentSlideIndex(0);
      }
    }
  }, [activeProjectId, projects, setSlides, setCurrentSlideIndex]);

  return (
    <div className="flex flex-col h-screen w-full bg-background text-foreground overflow-hidden">
      <EditorToolbar />
      <div className="flex-1 flex overflow-hidden">
        <SlideRail />
        <SlideCanvas />
        <PropertiesPanel />
      </div>
    </div>
  );
};

export default EditorLayout;
