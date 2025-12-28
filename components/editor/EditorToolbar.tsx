import React, { useState } from "react";
import {
  ArrowLeft,
  Type,
  Image as ImageIcon,
  Square,
  Save,
  Download,
  Play,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { Button } from "../ui/Button";
import { useProjects } from "../../context/ProjectContext";
import { useSlideStore } from "../../store/useSlideStore";
import ExportDialog from "../ExportDialog";
import type { Presentation } from "../../types/slide-schema";

const EditorToolbar: React.FC = () => {
  const { closeProject, projects, activeProjectId } = useProjects();
  const { addElement, scale, setScale, slides } = useSlideStore();
  const [showExportDialog, setShowExportDialog] = useState(false);

  const project = projects.find((p) => p.id === activeProjectId);

  const handleZoomIn = () => setScale(Math.min(scale + 0.1, 3));
  const handleZoomOut = () => setScale(Math.max(scale - 0.1, 0.2));

  // Build presentation object for export
  const getExportPresentation = (): Presentation | null => {
    if (!project) return null;

    // Check if we have new schema slides
    const hasNewSchema = slides.some((s: any) => s.newSchemaData);

    if (hasNewSchema && project.theme) {
      // Build from new schema
      return {
        id: project.id,
        metadata: {
          title: project.title,
          description: project.title,
          author: "Vivid AI",
          createdAt: project.createdAt,
        },
        settings: {
          aspectRatio: "16:9",
          width: 960,
          height: 540,
        },
        theme: project.theme,
        slides: slides
          .filter((s: any) => s.newSchemaData)
          .map((s: any) => s.newSchemaData),
      };
    }

    // Fallback for old schema (basic export)
    return {
      id: project.id,
      metadata: {
        title: project.title,
        description: project.title,
        author: "Vivid AI",
        createdAt: project.createdAt,
      },
      settings: {
        aspectRatio: "16:9",
        width: 960,
        height: 540,
      },
      theme: {
        id: "default",
        name: "Default",
        colors: {
          primary: "#6366f1",
          secondary: "#8b5cf6",
          accent: "#06b6d4",
          background: "#0f172a",
          surface: "#1e293b",
          text: {
            primary: "#f8fafc",
            secondary: "#94a3b8",
            muted: "#64748b",
            inverse: "#0f172a",
          },
          success: "#22c55e",
          warning: "#f59e0b",
          error: "#ef4444",
          info: "#3b82f6",
        },
        typography: {
          headingFont: "Inter",
          bodyFont: "Inter",
          codeFont: "JetBrains Mono",
        },
        spacing: {
          unit: 8,
          margins: { top: 60, right: 60, bottom: 60, left: 60 },
        },
      },
      slides: slides.map((s: any) => ({
        id: s.id,
        name: s.name || "Slide",
        background: { type: "solid" as const, color: "#0f172a" },
        elements:
          s.elements?.map((el: any) => ({
            id: el.id,
            type: "text" as const,
            bounds: {
              x: el.x || 0,
              y: el.y || 0,
              width: el.width || 200,
              height: el.height || 100,
            },
            content: el.content || "",
            semanticStyle: "body" as const,
          })) || [],
      })),
    };
  };

  const exportPresentation = getExportPresentation();

  return (
    <>
      <header className="h-14 border-b border-border bg-card flex items-center justify-between px-4 z-20 shrink-0">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={closeProject}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex flex-col">
            <span className="text-sm font-semibold truncate max-w-[200px]">
              {project?.title || "Untitled Project"}
            </span>
            <span className="text-[10px] text-muted-foreground">
              Last saved just now
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Tools */}
          <div className="flex items-center bg-secondary/50 rounded-lg p-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 gap-2"
              onClick={() => addElement("text")}
            >
              <Type className="w-4 h-4" />
              <span className="sr-only md:not-sr-only">Text</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 gap-2"
              onClick={() => addElement("image")}
            >
              <ImageIcon className="w-4 h-4" />
              <span className="sr-only md:not-sr-only">Image</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 gap-2"
              onClick={() => addElement("shape")}
            >
              <Square className="w-4 h-4" />
              <span className="sr-only md:not-sr-only">Shape</span>
            </Button>
          </div>

          {/* Zoom */}
          <div className="flex items-center gap-1 border-l border-border pl-4 ml-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={handleZoomOut}
            >
              <ZoomOut className="w-3 h-3" />
            </Button>
            <span className="text-xs w-10 text-center">
              {Math.round(scale * 100)}%
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={handleZoomIn}
            >
              <ZoomIn className="w-3 h-3" />
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Save className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => setShowExportDialog(true)}
            disabled={!exportPresentation}
          >
            <Download className="w-4 h-4" />
            Export
          </Button>
          <Button variant="accent" size="sm" className="gap-2">
            <Play className="w-4 h-4 fill-current" />
            Present
          </Button>
        </div>
      </header>

      {/* Export Dialog */}
      {exportPresentation && (
        <ExportDialog
          isOpen={showExportDialog}
          onClose={() => setShowExportDialog(false)}
          presentation={exportPresentation}
        />
      )}
    </>
  );
};

export default EditorToolbar;
