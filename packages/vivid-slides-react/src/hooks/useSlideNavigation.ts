// ============================================================================
// useSlideNavigation - NAVIGATION HELPERS
// ============================================================================

import { useCallback, useMemo } from "react";
import { useVividContext } from "../context";

export interface SlideNavigationResult {
  /** Current slide index (0-based) */
  currentIndex: number;
  /** Total number of slides */
  totalSlides: number;
  /** Whether there's a previous slide */
  hasPrevious: boolean;
  /** Whether there's a next slide */
  hasNext: boolean;
  /** Go to specific slide by index */
  goToSlide: (index: number) => void;
  /** Go to next slide */
  nextSlide: () => void;
  /** Go to previous slide */
  previousSlide: () => void;
  /** Go to first slide */
  firstSlide: () => void;
  /** Go to last slide */
  lastSlide: () => void;
  /** Navigation progress (0-1) */
  progress: number;
}

/**
 * Hook for slide navigation with helper methods.
 *
 * @example
 * ```tsx
 * const { currentIndex, totalSlides, nextSlide, previousSlide } = useSlideNavigation();
 * ```
 */
export function useSlideNavigation(): SlideNavigationResult {
  const { slides, currentSlideIndex, goToSlide } = useVividContext();

  const totalSlides = slides.length;
  const hasPrevious = currentSlideIndex > 0;
  const hasNext = currentSlideIndex < totalSlides - 1;
  const progress = totalSlides > 0 ? currentSlideIndex / (totalSlides - 1) : 0;

  const nextSlide = useCallback(() => {
    if (hasNext) {
      goToSlide(currentSlideIndex + 1);
    }
  }, [hasNext, currentSlideIndex, goToSlide]);

  const previousSlide = useCallback(() => {
    if (hasPrevious) {
      goToSlide(currentSlideIndex - 1);
    }
  }, [hasPrevious, currentSlideIndex, goToSlide]);

  const firstSlide = useCallback(() => {
    goToSlide(0);
  }, [goToSlide]);

  const lastSlide = useCallback(() => {
    if (totalSlides > 0) {
      goToSlide(totalSlides - 1);
    }
  }, [totalSlides, goToSlide]);

  return useMemo(
    () => ({
      currentIndex: currentSlideIndex,
      totalSlides,
      hasPrevious,
      hasNext,
      goToSlide,
      nextSlide,
      previousSlide,
      firstSlide,
      lastSlide,
      progress,
    }),
    [
      currentSlideIndex,
      totalSlides,
      hasPrevious,
      hasNext,
      goToSlide,
      nextSlide,
      previousSlide,
      firstSlide,
      lastSlide,
      progress,
    ]
  );
}
