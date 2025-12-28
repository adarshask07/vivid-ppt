import React, { useRef, useEffect, useState } from "react";
import { useSlideStore } from "../../store/useSlideStore";
import { useProjects } from "../../context/ProjectContext";
import { SlideElement } from "../../types";
import { cn } from "../../lib/utils";
import SlideTextElement from "./SlideTextElement";
import { SlideRenderer } from "../slides/SlideRenderer";

const SLIDE_WIDTH = 960;
const SLIDE_HEIGHT = 540;

const SlideCanvas: React.FC = () => {
  const {
    slides,
    currentSlideIndex,
    setSelectedElementIds,
    scale,
    setScale,
    pan,
    setPan,
    setEditingElementId,
  } = useSlideStore();

  const { projects, activeProjectId } = useProjects();

  const currentSlide = slides[currentSlideIndex];
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isSpacePressed, setIsSpacePressed] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  // Get theme from active project for AI-generated slides
  const activeProject = projects.find((p) => p.id === activeProjectId);
  const theme = activeProject?.theme;

  // Check if current slide uses new schema
  const hasNewSchema = currentSlide && !!(currentSlide as any).newSchemaData;
  //   const [isSpacePressed, setIsSpacePressed] = useState(false);
  //   const [isPanning, setIsPanning] = useState(false);
  //   const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  // Keyboard shortcuts (Space for Pan)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" && !isSpacePressed) setIsSpacePressed(true);
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space") setIsSpacePressed(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [isSpacePressed]);

  // Wheel Zoom/Pan - use native event listener with passive: false to allow preventDefault
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const delta = -e.deltaY * 0.001;
        const newScale = Math.min(Math.max(scale + delta, 0.1), 5);
        setScale(newScale);
      } else {
        setPan({ x: pan.x - e.deltaX, y: pan.y - e.deltaY });
      }
    };

    canvas.addEventListener("wheel", handleWheel, { passive: false });
    return () => canvas.removeEventListener("wheel", handleWheel);
  }, [scale, pan, setScale, setPan]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isSpacePressed || e.button === 1) {
      setIsPanning(true);
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
      e.preventDefault();
    } else {
      // If clicked on canvas background (not an element), clear selection
      if (
        e.target === containerRef.current ||
        (e.target as HTMLElement).classList.contains("slide-bg")
      ) {
        setSelectedElementIds([]);
        setEditingElementId(null);
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setPan({ x: e.clientX - panStart.x, y: e.clientY - panStart.y });
    }
  };

  return (
    <div
      ref={canvasRef}
      className={cn(
        "flex-1 bg-gray-900 overflow-hidden relative canvas-grid select-none",
        isSpacePressed || isPanning
          ? "cursor-grab active:cursor-grabbing"
          : "cursor-default"
      )}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={() => setIsPanning(false)}
      onMouseLeave={() => setIsPanning(false)}
    >
      {/* Infinite Transformation Container */}
      <div
        ref={containerRef}
        className="absolute origin-center will-change-transform"
        style={{
          left: "50%",
          top: "50%",
          transform: `translate(calc(-50% + ${pan.x}px), calc(-50% + ${pan.y}px)) scale(${scale})`,
          width: SLIDE_WIDTH,
          height: SLIDE_HEIGHT,
        }}
      >
        {/* The Slide - render differently based on schema */}
        {hasNewSchema && theme ? (
          // New schema: use SlideRenderer for AI-generated slides
          <div className="w-full h-full shadow-2xl rounded-lg overflow-hidden">
            <SlideRenderer
              slide={(currentSlide as any).newSchemaData}
              theme={theme}
            />
          </div>
        ) : (
          // Old schema: original element-based renderer
          <div
            className="w-full h-full shadow-2xl bg-white relative slide-bg"
            style={{ backgroundColor: currentSlide?.background }}
          >
            {currentSlide?.elements.map((element) => (
              <SlideElementWrapper
                key={element.id}
                element={element}
                zoomScale={scale}
              />
            ))}
          </div>
        )}
      </div>

      {/* HUD */}
      <div className="absolute bottom-4 right-4 bg-black/80 text-white text-xs px-3 py-1.5 rounded-full border border-white/10 backdrop-blur-md">
        {Math.round(scale * 100)}%
      </div>
    </div>
  );
};

const ResizeHandle = ({
  className,
  cursor,
  onMouseDown,
}: {
  className?: string;
  cursor: string;
  onMouseDown: (e: React.MouseEvent) => void;
}) => (
  <div
    className={cn(
      "absolute w-3 h-3 bg-white border border-blue-500 rounded-full z-50 pointer-events-auto",
      className
    )}
    style={{ cursor }}
    onMouseDown={(e) => {
      e.stopPropagation();
      onMouseDown(e);
    }}
  />
);

const SlideElementWrapper: React.FC<{
  element: SlideElement;
  zoomScale: number;
}> = ({ element, zoomScale }) => {
  const {
    selectedElementIds,
    setSelectedElementIds,
    editingElementId,
    setEditingElementId,
    updateElement,
  } = useSlideStore();

  const isSelected = selectedElementIds.includes(element.id);
  const isEditing = editingElementId === element.id;

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isEditing) {
      e.stopPropagation();
      return;
    }
    e.stopPropagation();
    if (!isSelected) {
      setSelectedElementIds([element.id]);
    }

    // Drag Logic
    const startX = e.clientX;
    const startY = e.clientY;
    const initialX = element.x;
    const initialY = element.y;

    const handleWindowMouseMove = (moveEvent: MouseEvent) => {
      const dx = (moveEvent.clientX - startX) / zoomScale;
      const dy = (moveEvent.clientY - startY) / zoomScale;
      updateElement(element.id, {
        x: initialX + dx,
        y: initialY + dy,
      });
    };

    const handleWindowMouseUp = () => {
      window.removeEventListener("mousemove", handleWindowMouseMove);
      window.removeEventListener("mouseup", handleWindowMouseUp);
    };

    window.addEventListener("mousemove", handleWindowMouseMove);
    window.addEventListener("mouseup", handleWindowMouseUp);
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (element.type === "text") {
      setEditingElementId(element.id);
    }
  };

  // Resizing Logic
  const handleResizeStart = (e: React.MouseEvent, direction: string) => {
    e.stopPropagation();
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = element.width;
    const startHeight = element.height;
    const startLeft = element.x;
    const startTop = element.y;
    const rotationRad = (element.rotation * Math.PI) / 180;

    const handleWindowMouseMove = (moveEvent: MouseEvent) => {
      // Calculate delta in screen space
      const deltaX = (moveEvent.clientX - startX) / zoomScale;
      const deltaY = (moveEvent.clientY - startY) / zoomScale;

      // Project delta onto element's local axis to handle rotation
      // We rotate the delta vector by -rotation to align with local axes
      const localDx =
        deltaX * Math.cos(-rotationRad) - deltaY * Math.sin(-rotationRad);
      const localDy =
        deltaX * Math.sin(-rotationRad) + deltaY * Math.cos(-rotationRad);

      let newWidth = startWidth;
      let newHeight = startHeight;
      let newX = startLeft;
      let newY = startTop;

      if (direction.includes("e")) {
        newWidth = Math.max(20, startWidth + localDx);
      }
      if (direction.includes("s")) {
        newHeight = Math.max(20, startHeight + localDy);
      }
      if (direction.includes("w")) {
        const wDelta = Math.min(startWidth - 20, localDx); // Limit so we don't flip
        newWidth = startWidth - wDelta;
        // We need to move X/Y to compensate for the width change in rotated space
        // Move position by the amount we "trimmed" from the left, rotated back to world space
        newX = startLeft + wDelta * Math.cos(rotationRad);
        newY = startTop + wDelta * Math.sin(rotationRad);
      }
      if (direction.includes("n")) {
        const hDelta = Math.min(startHeight - 20, localDy);
        newHeight = startHeight - hDelta;
        // Move position by amount trimmed from top, rotated back to world space
        // Note: Y axis is down, so "top" is negative Y in local space usually, but here we just add the vector
        // The vector (0, hDelta) rotated is:
        // x' = 0 - hDelta * sin(rot)
        // y' = 0 + hDelta * cos(rot)
        newX = startLeft - hDelta * Math.sin(rotationRad);
        newY = startTop + hDelta * Math.cos(rotationRad);
      }

      updateElement(element.id, {
        width: newWidth,
        height: newHeight,
        x: newX,
        y: newY,
      });
    };

    const handleWindowMouseUp = () => {
      window.removeEventListener("mousemove", handleWindowMouseMove);
      window.removeEventListener("mouseup", handleWindowMouseUp);
    };

    window.addEventListener("mousemove", handleWindowMouseMove);
    window.addEventListener("mouseup", handleWindowMouseUp);
  };

  return (
    <div
      id={element.id}
      data-x={element.x}
      data-y={element.y}
      className={cn(
        "absolute box-border select-none transition-shadow",
        isSelected && !isEditing
          ? "ring-1 ring-blue-500 border-transparent"
          : "hover:border border-dashed border-gray-400/50",
        isEditing
          ? "cursor-text z-[100] ring-2 ring-blue-500 bg-white"
          : "cursor-move"
      )}
      style={{
        transform: `translate(${element.x}px, ${element.y}px) rotate(${element.rotation}deg)`,
        width: element.width,
        height: element.height,
        zIndex: element.zIndex,
        ...element.style,
      }}
      onMouseDown={handleMouseDown}
      onDoubleClick={handleDoubleClick}
    >
      {element.type === "text" ? (
        <SlideTextElement element={element} isEditing={isEditing} />
      ) : element.type === "shape" ? (
        <div
          className="w-full h-full"
          style={{ backgroundColor: element.style?.backgroundColor }}
        />
      ) : (
        <div className="w-full h-full bg-gray-200 flex items-center justify-center text-muted-foreground text-xs">
          Image Placeholder
        </div>
      )}

      {/* Resize Handles - Only show when selected and NOT editing text */}
      {isSelected && !isEditing && (
        <>
          <ResizeHandle
            cursor="nw-resize"
            className="-top-1.5 -left-1.5"
            onMouseDown={(e) => handleResizeStart(e, "nw")}
          />
          <ResizeHandle
            cursor="n-resize"
            className="-top-1.5 left-1/2 -translate-x-1/2"
            onMouseDown={(e) => handleResizeStart(e, "n")}
          />
          <ResizeHandle
            cursor="ne-resize"
            className="-top-1.5 -right-1.5"
            onMouseDown={(e) => handleResizeStart(e, "ne")}
          />

          <ResizeHandle
            cursor="w-resize"
            className="top-1/2 -translate-y-1/2 -left-1.5"
            onMouseDown={(e) => handleResizeStart(e, "w")}
          />
          <ResizeHandle
            cursor="e-resize"
            className="top-1/2 -translate-y-1/2 -right-1.5"
            onMouseDown={(e) => handleResizeStart(e, "e")}
          />

          <ResizeHandle
            cursor="sw-resize"
            className="-bottom-1.5 -left-1.5"
            onMouseDown={(e) => handleResizeStart(e, "sw")}
          />
          <ResizeHandle
            cursor="s-resize"
            className="-bottom-1.5 left-1/2 -translate-x-1/2"
            onMouseDown={(e) => handleResizeStart(e, "s")}
          />
          <ResizeHandle
            cursor="se-resize"
            className="-bottom-1.5 -right-1.5"
            onMouseDown={(e) => handleResizeStart(e, "se")}
          />
        </>
      )}
    </div>
  );
};

export default SlideCanvas;
