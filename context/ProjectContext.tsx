import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { Project, ProjectType, Template, NavItem } from "../types";
import type { Presentation } from "../types/slide-schema";

// Generation state for AI presentation creation
interface GenerationState {
  isGenerating: boolean;
  prompt: string | null;
  generatedPresentation: Presentation | null;
}

interface ProjectContextType {
  projects: Project[];
  templates: Template[];
  searchQuery: string;
  activeProjectId: string | null;
  activeView: NavItem;
  generationState: GenerationState;
  setSearchQuery: (query: string) => void;
  openProject: (id: string) => void;
  closeProject: () => void;
  addProject: (title: string, description: string, type: ProjectType) => void;
  importProject: (project: Project) => void;
  importGeneratedPresentation: (presentation: Presentation) => string;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  restoreProject: (id: string) => void;
  permanentlyDeleteProject: (id: string) => void;
  navigate: (view: NavItem) => void;
  startGeneration: (prompt: string) => void;
  cancelGeneration: () => void;
  completeGeneration: (presentation: Presentation) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

const SAMPLE_TEMPLATES: Template[] = [
  {
    id: "t1",
    title: "Quarterly Business Review",
    description: "Professional layout for QBRs",
    thumbnail: "bg-blue-900",
    tags: ["Business", "Corporate"],
  },
  {
    id: "t2",
    title: "Tech Startup Pitch",
    description: "Modern and bold design for startups",
    thumbnail: "bg-purple-900",
    tags: ["Startup", "Pitch"],
  },
  {
    id: "t3",
    title: "Creative Portfolio",
    description: "Minimalist layout for creatives",
    thumbnail: "bg-orange-800",
    tags: ["Creative", "Portfolio"],
  },
  {
    id: "t4",
    title: "Educational Course",
    description: "Clean layout for teaching",
    thumbnail: "bg-emerald-900",
    tags: ["Education"],
  },
];

const INITIAL_PROJECTS: Project[] = [
  {
    id: "1",
    title: "SaaS GTM Strategy",
    description: "Go-to-market plan for Q4",
    type: "AI",
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
    createdAt: new Date().toISOString(),
    isDeleted: false,
    slides: [],
  },
  {
    id: "2",
    title: "Global Warming Causes",
    type: "Manual",
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
    createdAt: new Date().toISOString(),
    isDeleted: false,
    slides: [],
  },
];

export const ProjectProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem("vivid_projects");
    return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
  });

  const [templates] = useState<Template[]>(SAMPLE_TEMPLATES);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<NavItem>("home");
  const [generationState, setGenerationState] = useState<GenerationState>({
    isGenerating: false,
    prompt: null,
    generatedPresentation: null,
  });

  // URL-based routing: parse URL on mount and handle popstate
  useEffect(() => {
    const parseUrl = () => {
      const path = window.location.pathname;
      const match = path.match(/^\/project\/([^/]+)/);
      if (match) {
        const projectId = match[1];
        if (projects.some((p) => p.id === projectId)) {
          setActiveProjectId(projectId);
          return;
        }
      }
      // Handle other routes
      if (path === "/create") {
        setActiveView("create");
      } else if (path === "/templates") {
        setActiveView("templates");
      } else if (path === "/trash") {
        setActiveView("trash");
      } else if (path === "/settings") {
        setActiveView("settings");
      } else {
        setActiveView("home");
      }
    };

    parseUrl();

    const handlePopState = () => parseUrl();
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [projects]);

  useEffect(() => {
    localStorage.setItem("vivid_projects", JSON.stringify(projects));
  }, [projects]);

  const addProject = (
    title: string,
    description: string,
    type: ProjectType
  ) => {
    const newProject: Project = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      description,
      type,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isDeleted: false,
      slides: [
        {
          id: "slide-1",
          background: "#ffffff",
          elements: [
            {
              id: "el-1",
              type: "text",
              x: 100,
              y: 100,
              width: 600,
              height: 100,
              rotation: 0,
              zIndex: 1,
              opacity: 1,
              content: {
                html: '<h1 class="ql-align-center">Click to add title</h1>',
                json: null,
              },
            },
          ],
        },
      ],
    };
    setProjects((prev) => [newProject, ...prev]);
    // Optionally open immediately
    setActiveProjectId(newProject.id);
  };

  const importProject = (project: Project) => {
    setProjects((prev) => [project, ...prev]);
    setActiveProjectId(project.id);
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, ...updates, updatedAt: new Date().toISOString() }
          : p
      )
    );
  };

  const deleteProject = (id: string) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, isDeleted: true, updatedAt: new Date().toISOString() }
          : p
      )
    );
  };

  const restoreProject = (id: string) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, isDeleted: false, updatedAt: new Date().toISOString() }
          : p
      )
    );
  };

  const permanentlyDeleteProject = (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  const openProject = (id: string) => {
    setActiveProjectId(id);
    window.history.pushState({}, "", `/project/${id}`);
  };

  const closeProject = () => {
    setActiveProjectId(null);
    window.history.pushState({}, "", "/");
  };

  const navigate = (view: NavItem) => {
    setActiveView(view);
    setActiveProjectId(null);
    const pathMap: Record<NavItem, string> = {
      home: "/",
      templates: "/templates",
      trash: "/trash",
      settings: "/settings",
      create: "/create",
    };
    window.history.pushState({}, "", pathMap[view]);
  };

  const startGeneration = (prompt: string) => {
    setGenerationState({
      isGenerating: true,
      prompt,
      generatedPresentation: null,
    });
    setActiveProjectId(null);
    window.history.pushState({}, "", "/generating");
  };

  const cancelGeneration = () => {
    setGenerationState({
      isGenerating: false,
      prompt: null,
      generatedPresentation: null,
    });
    window.history.pushState({}, "", "/");
  };

  // Convert generated Presentation to Project format and save
  const importGeneratedPresentation = useCallback(
    (presentation: Presentation): string => {
      const newProject: Project = {
        id: presentation.id,
        title: presentation.metadata.title,
        description: presentation.metadata.description,
        type: "AI" as ProjectType,
        createdAt: presentation.metadata.createdAt,
        updatedAt: new Date().toISOString(),
        isDeleted: false,
        // Store the new slide schema data in the project
        // We'll need to convert or store alongside the old format
        slides: presentation.slides.map((slide, index) => ({
          id: slide.id,
          background:
            typeof slide.background === "string"
              ? slide.background
              : slide.background?.type === "solid"
              ? slide.background.color
              : "#0f172a",
          elements: [], // Old format - we'll enhance this later
          // Store the new schema data
          newSchemaData: slide,
        })) as any,
        theme: presentation.theme as any,
      };

      setProjects((prev) => [newProject, ...prev]);
      return newProject.id;
    },
    []
  );

  const completeGeneration = useCallback(
    (presentation: Presentation) => {
      // Import the generated presentation as a project
      const projectId = importGeneratedPresentation(presentation);

      // Reset generation state
      setGenerationState({
        isGenerating: false,
        prompt: null,
        generatedPresentation: null,
      });

      // Open the new project in editor
      setActiveProjectId(projectId);
      window.history.pushState({}, "", `/project/${projectId}`);
    },
    [importGeneratedPresentation]
  );

  return (
    <ProjectContext.Provider
      value={{
        projects,
        templates,
        searchQuery,
        activeProjectId,
        activeView,
        generationState,
        setSearchQuery,
        addProject,
        importProject,
        importGeneratedPresentation,
        updateProject,
        deleteProject,
        restoreProject,
        permanentlyDeleteProject,
        openProject,
        closeProject,
        navigate,
        startGeneration,
        cancelGeneration,
        completeGeneration,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjects = () => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error("useProjects must be used within a ProjectProvider");
  }
  return context;
};
