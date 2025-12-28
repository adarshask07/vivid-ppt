import React from "react";
import { useSlideStore } from "../../store/useSlideStore";
import { useProjects } from "../../context/ProjectContext";
import { cn } from "../../lib/utils";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "../ui/Button";
import { SlideRenderer } from "../slides/SlideRenderer";

const SlideRail: React.FC = () => {
  const {
    slides,
    currentSlideIndex,
    setCurrentSlideIndex,
    addSlide,
    removeSlide,
  } = useSlideStore();
  const { projects, activeProjectId } = useProjects();

  // Get the theme from the active project (for AI-generated presentations)
  const activeProject = projects.find((p) => p.id === activeProjectId);
  const theme = activeProject?.theme;

  return (
    <div className="w-56 bg-card border-r border-border flex flex-col h-full overflow-hidden">
      <div className="p-3 border-b border-border flex justify-between items-center">
        <span className="text-xs font-semibold text-muted-foreground uppercase">
          Slides
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={addSlide}
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {slides.map((slide, index) => {
          // Check if this slide has the new schema data (AI-generated)
          const hasNewSchema = !!(slide as any).newSchemaData;

          return (
            <div key={slide.id} className="group relative flex gap-2">
              <span className="text-xs text-muted-foreground w-4 pt-1">
                {index + 1}
              </span>
              <div
                className={cn(
                  "flex-1 aspect-video rounded-md border-2 overflow-hidden cursor-pointer transition-all relative",
                  currentSlideIndex === index
                    ? "border-primary ring-2 ring-primary/20"
                    : "border-border hover:border-primary/50"
                )}
                onClick={() => setCurrentSlideIndex(index)}
              >
                {/* Thumbnail render */}
                {hasNewSchema && theme ? (
                  // New schema: use SlideRenderer
                  <div
                    className="w-full h-full"
                    style={{
                      transform: "scale(0.15)",
                      transformOrigin: "top left",
                      width: 960,
                      height: 540,
                    }}
                  >
                    <SlideRenderer
                      slide={(slide as any).newSchemaData}
                      theme={theme}
                    />
                  </div>
                ) : (
                  // Old schema: original renderer
                  <div
                    className="w-full h-full p-2 bg-white origin-top-left transform scale-[0.2]"
                    style={{ width: "500%", height: "500%" }}
                  >
                    {slide.elements.map((el) => (
                      <div
                        key={el.id}
                        style={{
                          position: "absolute",
                          left: el.x,
                          top: el.y,
                          width: el.width,
                          height: el.height,
                          ...el.style,
                        }}
                        className="bg-black/10 border border-black/5"
                      >
                        {el.type === "text" && (
                          <div
                            className="text-[10px] overflow-hidden"
                            dangerouslySetInnerHTML={{
                              __html: el.content?.html || "",
                            }}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Context Actions */}
                <button
                  className="absolute top-1 right-1 p-1 bg-destructive text-white rounded opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/90 z-10"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeSlide(slide.id);
                  }}
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}

        <button
          onClick={addSlide}
          className="w-full aspect-video rounded-md border-2 border-dashed border-border flex flex-col items-center justify-center text-muted-foreground hover:bg-secondary/50 hover:border-primary/50 transition-colors ml-6"
          style={{ width: "calc(100% - 1.5rem)" }}
        >
          <Plus className="w-6 h-6 mb-1" />
          <span className="text-xs">New Slide</span>
        </button>
      </div>
    </div>
  );
};

export default SlideRail;
