// ============================================================================
// SLIDE RAIL - THUMBNAIL NAVIGATION SIDEBAR
// ============================================================================

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useVividContext } from "../context";
import { SlideRenderer, SLIDE_WIDTH, SLIDE_HEIGHT } from "./SlideRenderer";

export interface SlideRailProps {
  /** Thumbnail width */
  thumbnailWidth?: number;
  /** Orientation */
  orientation?: "vertical" | "horizontal";
  /** Show slide numbers */
  showNumbers?: boolean;
  /** Custom className */
  className?: string;
  /** Custom style */
  style?: React.CSSProperties;
  /** Callback when slide is clicked */
  onSlideClick?: (index: number) => void;
  /** Enable drag to reorder (future feature) */
  enableReorder?: boolean;
}

export const SlideRail: React.FC<SlideRailProps> = ({
  thumbnailWidth = 160,
  orientation = "vertical",
  showNumbers = true,
  className,
  style,
  onSlideClick,
  enableReorder: _enableReorder = false, // Reserved for future drag-to-reorder feature
}) => {
  const { slides, currentSlideIndex, goToSlide } = useVividContext();

  // Calculate thumbnail height based on aspect ratio
  const thumbnailHeight = (thumbnailWidth / SLIDE_WIDTH) * SLIDE_HEIGHT;
  const scale = thumbnailWidth / SLIDE_WIDTH;

  const handleSlideClick = (index: number) => {
    goToSlide(index);
    onSlideClick?.(index);
  };

  const isVertical = orientation === "vertical";

  return (
    <div
      className={`vivid-slide-rail ${className || ""}`}
      style={{
        display: "flex",
        flexDirection: isVertical ? "column" : "row",
        gap: 12,
        padding: 12,
        overflowX: isVertical ? "hidden" : "auto",
        overflowY: isVertical ? "auto" : "hidden",
        ...style,
      }}
    >
      <AnimatePresence initial={false}>
        {slides.map((slide, index) => (
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            onClick={() => handleSlideClick(index)}
            className={`vivid-slide-rail__item ${
              currentSlideIndex === index
                ? "vivid-slide-rail__item--active"
                : ""
            }`}
            style={{
              position: "relative",
              flexShrink: 0,
              cursor: "pointer",
              borderRadius: "var(--vivid-radius-sm, 4px)",
              border:
                currentSlideIndex === index
                  ? "2px solid var(--vivid-primary, #3b82f6)"
                  : "2px solid transparent",
              overflow: "hidden",
              transition: "border-color 0.2s",
            }}
          >
            {/* Thumbnail */}
            <div
              style={{
                width: thumbnailWidth,
                height: thumbnailHeight,
                overflow: "hidden",
                pointerEvents: "none",
              }}
            >
              <SlideRenderer slide={slide} scale={scale} isPreview />
            </div>

            {/* Slide Number Badge */}
            {showNumbers && (
              <div
                className="vivid-slide-rail__number"
                style={{
                  position: "absolute",
                  top: 4,
                  left: 4,
                  padding: "2px 6px",
                  backgroundColor: "rgba(0,0,0,0.6)",
                  borderRadius: "var(--vivid-radius-sm, 4px)",
                  fontFamily: "var(--vivid-font-body, inherit)",
                  fontSize: 12,
                  color: "var(--vivid-text-secondary, rgba(255,255,255,0.7))",
                }}
              >
                {index + 1}
              </div>
            )}

            {/* Selection indicator */}
            {currentSlideIndex === index && (
              <motion.div
                layoutId="slide-selection"
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: "var(--vivid-radius-sm, 4px)",
                  border: "2px solid var(--vivid-primary, #3b82f6)",
                  pointerEvents: "none",
                }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Empty state */}
      {slides.length === 0 && (
        <div
          style={{
            width: thumbnailWidth,
            height: thumbnailHeight,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(255,255,255,0.05)",
            borderRadius: 6,
            border: "2px dashed rgba(255,255,255,0.2)",
            color: "#666",
            fontSize: 12,
            textAlign: "center",
            padding: 8,
          }}
        >
          No slides yet
        </div>
      )}
    </div>
  );
};
