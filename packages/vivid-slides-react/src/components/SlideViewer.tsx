// ============================================================================
// SLIDE VIEWER - MAIN VIEWER COMPONENT WITH ZOOM/PAN
// ============================================================================

import React, { useRef, useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useVividContext } from "../context";
import { SlideRenderer, SLIDE_WIDTH, SLIDE_HEIGHT } from "./SlideRenderer";
import { useKeyboardNavigation } from "../hooks/useKeyboardNavigation";

export interface SlideViewerProps {
  /** Custom width */
  width?: number | string;
  /** Custom height */
  height?: number | string;
  /** Enable keyboard navigation */
  enableKeyboard?: boolean;
  /** Show navigation controls */
  showControls?: boolean;
  /** Show slide counter */
  showCounter?: boolean;
  /** Custom className */
  className?: string;
  /** Custom style */
  style?: React.CSSProperties;
  /** Callback for fullscreen toggle */
  onFullscreenChange?: (isFullscreen: boolean) => void;
  /** Fit mode */
  fitMode?: "contain" | "cover" | "none";
  /** Initial scale (only for fitMode='none') */
  initialScale?: number;
  /** Enable animations between slides */
  enableTransitions?: boolean;
}

export const SlideViewer: React.FC<SlideViewerProps> = ({
  width = "100%",
  height = "100%",
  enableKeyboard = true,
  showControls = true,
  showCounter = true,
  className,
  style,
  onFullscreenChange,
  fitMode = "contain",
  initialScale = 1,
  enableTransitions = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);

  const { slides, currentSlideIndex, goToSlide } = useVividContext();
  const currentSlide = slides[currentSlideIndex];

  // Keyboard navigation
  useKeyboardNavigation({
    enabled: enableKeyboard,
    onEscape: () => {
      if (isFullscreen) {
        document.exitFullscreen?.();
      }
    },
    onFullscreen: () => {
      if (containerRef.current && !isFullscreen) {
        containerRef.current.requestFullscreen?.();
      }
    },
  });

  // Track container size
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        setContainerSize({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Track fullscreen state
  useEffect(() => {
    const handleFullscreenChange = () => {
      const fs = !!document.fullscreenElement;
      setIsFullscreen(fs);
      onFullscreenChange?.(fs);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, [onFullscreenChange]);

  // Calculate scale based on fit mode
  const calculateScale = useCallback(() => {
    if (fitMode === "none") return initialScale;
    if (containerSize.width === 0 || containerSize.height === 0) return 1;

    const scaleX = containerSize.width / SLIDE_WIDTH;
    const scaleY = containerSize.height / SLIDE_HEIGHT;

    if (fitMode === "contain") {
      return Math.min(scaleX, scaleY);
    }
    return Math.max(scaleX, scaleY);
  }, [fitMode, initialScale, containerSize]);

  const scale = calculateScale();

  const handlePrevious = () => {
    if (currentSlideIndex > 0) {
      goToSlide(currentSlideIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentSlideIndex < slides.length - 1) {
      goToSlide(currentSlideIndex + 1);
    }
  };

  // Slide transition variants
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 100 : -100,
      opacity: 0,
    }),
  };

  return (
    <div
      ref={containerRef}
      className={`vivid-slide-viewer ${className || ""}`}
      style={{
        position: "relative",
        width,
        height,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "var(--vivid-background, #0a0a0a)",
        overflow: "hidden",
        ...style,
      }}
    >
      {currentSlide ? (
        <AnimatePresence mode="wait" custom={1}>
          <motion.div
            key={currentSlide.id}
            custom={1}
            variants={enableTransitions ? slideVariants : undefined}
            initial={enableTransitions ? "enter" : false}
            animate="center"
            exit={enableTransitions ? "exit" : undefined}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <SlideRenderer slide={currentSlide} scale={scale} />
          </motion.div>
        </AnimatePresence>
      ) : (
        <div
          style={{
            color: "#666",
            fontSize: 18,
            textAlign: "center",
          }}
        >
          No slides to display
        </div>
      )}

      {/* Navigation Controls */}
      {showControls && slides.length > 1 && (
        <>
          <button
            onClick={handlePrevious}
            disabled={currentSlideIndex === 0}
            className="vivid-slide-viewer__nav vivid-slide-viewer__nav--prev"
            aria-label="Previous slide"
            style={{
              position: "absolute",
              top: "50%",
              left: 16,
              transform: "translateY(-50%)",
              width: 48,
              height: 48,
              borderRadius: "50%",
              backgroundColor: "var(--vivid-surface, rgba(0,0,0,0.5))",
              border: "1px solid var(--vivid-border, rgba(255,255,255,0.1))",
              color: "var(--vivid-text-primary, white)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 10,
            }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          <button
            onClick={handleNext}
            disabled={currentSlideIndex === slides.length - 1}
            className="vivid-slide-viewer__nav vivid-slide-viewer__nav--next"
            aria-label="Next slide"
            style={{
              position: "absolute",
              top: "50%",
              right: 16,
              transform: "translateY(-50%)",
              width: 48,
              height: 48,
              borderRadius: "50%",
              backgroundColor: "var(--vivid-surface, rgba(0,0,0,0.5))",
              border: "1px solid var(--vivid-border, rgba(255,255,255,0.1))",
              color: "var(--vivid-text-primary, white)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 10,
            }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </>
      )}

      {/* Slide Counter */}
      {showCounter && slides.length > 0 && (
        <div
          className="vivid-slide-viewer__counter"
          style={{
            position: "absolute",
            bottom: 16,
            left: "50%",
            transform: "translateX(-50%)",
            padding: "4px 16px",
            backgroundColor: "var(--vivid-surface, rgba(0,0,0,0.6))",
            borderRadius: 9999,
            fontFamily: "var(--vivid-font-body, inherit)",
            fontSize: 14,
            color: "var(--vivid-text-secondary, rgba(255,255,255,0.7))",
          }}
        >
          {currentSlideIndex + 1} / {slides.length}
        </div>
      )}
    </div>
  );
};
