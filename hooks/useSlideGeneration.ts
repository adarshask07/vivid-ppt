/**
 * useSlideGeneration Hook
 * State machine for managing AI slide generation flow
 */

import { useState, useCallback, useRef } from "react";
import type { Presentation, Slide } from "../types/slide-schema";
import {
  generatePresentationStream,
  type GenerationEvent,
} from "../services/AiStreamService";

export type GenerationStatus =
  | "idle"
  | "generating"
  | "complete"
  | "error"
  | "cancelled";

export interface GenerationState {
  status: GenerationStatus;
  prompt: string;
  presentation: Presentation | null;
  currentSlideIndex: number;
  totalSlides: number;
  error: string | null;
  startTime: number | null;
  elapsedMs: number;
}

export interface UseSlideGenerationReturn {
  state: GenerationState;
  startGeneration: (prompt: string) => void;
  cancelGeneration: () => void;
  reset: () => void;
  slides: Slide[];
  progress: number;
  isGenerating: boolean;
  isComplete: boolean;
}

const initialState: GenerationState = {
  status: "idle",
  prompt: "",
  presentation: null,
  currentSlideIndex: 0,
  totalSlides: 0,
  error: null,
  startTime: null,
  elapsedMs: 0,
};

export function useSlideGeneration(): UseSlideGenerationReturn {
  const [state, setState] = useState<GenerationState>(initialState);
  const abortControllerRef = useRef<AbortController | null>(null);
  const timerRef = useRef<number | null>(null);

  // Start elapsed time tracking
  const startTimer = useCallback(() => {
    const startTime = Date.now();
    setState((prev) => ({ ...prev, startTime }));

    timerRef.current = window.setInterval(() => {
      setState((prev) => ({
        ...prev,
        elapsedMs: Date.now() - (prev.startTime || Date.now()),
      }));
    }, 100);
  }, []);

  // Stop elapsed time tracking
  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Handle generation events
  const handleEvent = useCallback((event: GenerationEvent) => {
    switch (event.type) {
      case "metadata":
        setState((prev) => ({
          ...prev,
          totalSlides: event.totalSlides,
          presentation: {
            id: `gen-${Date.now()}`,
            metadata: event.data,
            settings: { aspectRatio: "16:9", width: 960, height: 540 },
            theme: event.theme,
            slides: [],
          },
        }));
        break;

      case "slide":
        setState((prev) => {
          if (!prev.presentation) return prev;
          return {
            ...prev,
            currentSlideIndex: event.slideIndex,
            presentation: {
              ...prev.presentation,
              slides: [...prev.presentation.slides, event.data],
            },
          };
        });
        break;

      case "complete":
        setState((prev) => ({
          ...prev,
          status: "complete",
        }));
        break;

      case "error":
        setState((prev) => ({
          ...prev,
          status: "error",
          error: event.error.message,
        }));
        break;
    }
  }, []);

  // Start generation
  const startGeneration = useCallback(
    async (prompt: string) => {
      // Cancel any existing generation
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new abort controller
      abortControllerRef.current = new AbortController();
      const signal = abortControllerRef.current.signal;

      // Reset state and start
      setState({
        ...initialState,
        status: "generating",
        prompt,
      });

      startTimer();

      try {
        const stream = generatePresentationStream(prompt, { signal });

        for await (const event of stream) {
          if (signal.aborted) break;
          handleEvent(event);
        }
      } catch (err) {
        if (!signal.aborted) {
          setState((prev) => ({
            ...prev,
            status: "error",
            error: err instanceof Error ? err.message : "Generation failed",
          }));
        }
      } finally {
        stopTimer();
      }
    },
    [handleEvent, startTimer, stopTimer]
  );

  // Cancel generation
  const cancelGeneration = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    stopTimer();
    setState((prev) => ({
      ...prev,
      status: "cancelled",
    }));
  }, [stopTimer]);

  // Reset to initial state
  const reset = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    stopTimer();
    setState(initialState);
  }, [stopTimer]);

  // Derived values
  const slides = state.presentation?.slides ?? [];
  const progress =
    state.totalSlides > 0 ? (slides.length / state.totalSlides) * 100 : 0;
  const isGenerating = state.status === "generating";
  const isComplete = state.status === "complete";

  return {
    state,
    startGeneration,
    cancelGeneration,
    reset,
    slides,
    progress,
    isGenerating,
    isComplete,
  };
}
