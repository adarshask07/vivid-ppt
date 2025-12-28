// ============================================================================
// useKeyboardNavigation - KEYBOARD CONTROLS FOR SLIDES
// ============================================================================

import { useEffect, useCallback } from "react";
import { useSlideNavigation } from "./useSlideNavigation";

export interface KeyboardNavigationOptions {
  /** Enable keyboard navigation (default: true) */
  enabled?: boolean;
  /** Enable arrow key navigation (default: true) */
  arrows?: boolean;
  /** Enable space/enter for next slide (default: true) */
  spaceEnter?: boolean;
  /** Enable home/end for first/last slide (default: true) */
  homeEnd?: boolean;
  /** Enable escape key callback */
  onEscape?: () => void;
  /** Enable F key for fullscreen callback */
  onFullscreen?: () => void;
}

/**
 * Hook for keyboard-based slide navigation.
 *
 * @example
 * ```tsx
 * useKeyboardNavigation({
 *   onEscape: () => setFullscreen(false),
 *   onFullscreen: () => setFullscreen(true),
 * });
 * ```
 */
export function useKeyboardNavigation(
  options: KeyboardNavigationOptions = {}
): void {
  const {
    enabled = true,
    arrows = true,
    spaceEnter = true,
    homeEnd = true,
    onEscape,
    onFullscreen,
  } = options;

  const { nextSlide, previousSlide, firstSlide, lastSlide } =
    useSlideNavigation();

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // Ignore if typing in an input
      const target = event.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return;
      }

      switch (event.key) {
        // Arrow navigation
        case "ArrowRight":
        case "ArrowDown":
          if (arrows) {
            event.preventDefault();
            nextSlide();
          }
          break;
        case "ArrowLeft":
        case "ArrowUp":
          if (arrows) {
            event.preventDefault();
            previousSlide();
          }
          break;

        // Space/Enter for next
        case " ":
        case "Enter":
          if (spaceEnter) {
            event.preventDefault();
            nextSlide();
          }
          break;

        // Home/End
        case "Home":
          if (homeEnd) {
            event.preventDefault();
            firstSlide();
          }
          break;
        case "End":
          if (homeEnd) {
            event.preventDefault();
            lastSlide();
          }
          break;

        // Escape
        case "Escape":
          if (onEscape) {
            event.preventDefault();
            onEscape();
          }
          break;

        // Fullscreen
        case "f":
        case "F":
          if (onFullscreen && !event.ctrlKey && !event.metaKey) {
            event.preventDefault();
            onFullscreen();
          }
          break;
      }
    },
    [
      arrows,
      spaceEnter,
      homeEnd,
      nextSlide,
      previousSlide,
      firstSlide,
      lastSlide,
      onEscape,
      onFullscreen,
    ]
  );

  useEffect(() => {
    if (!enabled) return;

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [enabled, handleKeyDown]);
}
