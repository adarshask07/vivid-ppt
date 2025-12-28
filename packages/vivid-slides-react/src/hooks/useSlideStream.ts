// ============================================================================
// useSlideStream - STREAMING HOOK FOR AI GENERATION
// ============================================================================

import { useCallback, useRef } from "react";
import { useVividContext } from "../context";
import type {
  Slide,
  Presentation,
  GenerationEvent,
  StreamingStatus,
} from "../types";
import { VividError } from "../types";

export interface UseSlideStreamOptions {
  /** Callback when a new slide is received */
  onSlide?: (slide: Slide, index: number) => void;
  /** Callback when generation completes */
  onComplete?: (slides: Slide[]) => void;
  /** Callback on error */
  onError?: (error: Error) => void;
  /** Callback on progress update */
  onProgress?: (current: number, total: number) => void;
  /** Whether to auto-navigate to new slides */
  autoNavigate?: boolean;
}

export interface SlideStreamResult {
  /** Current streaming status */
  status: StreamingStatus;
  /** Start streaming from async generator */
  streamFromGenerator: (
    generator: AsyncGenerator<GenerationEvent>
  ) => Promise<void>;
  /** Start streaming from ReadableStream (for fetch responses) */
  streamFromReadable: (stream: ReadableStream<Uint8Array>) => Promise<void>;
  /** Parse and add slides from complete JSON */
  loadFromJSON: (data: Presentation | Slide[]) => void;
  /** Add a single slide */
  addSlide: (slide: Slide) => void;
  /** Cancel ongoing stream */
  cancel: () => void;
  /** Reset to idle state */
  reset: () => void;
  /** Current progress (0-1) */
  progress: number;
  /** Error if any */
  error: Error | null;
}

/**
 * Hook for streaming slide generation from AI.
 * Supports async generators and ReadableStreams.
 *
 * @example
 * ```tsx
 * const { streamFromGenerator, status } = useSlideStream({
 *   onSlide: (slide) => console.log('New slide:', slide.title),
 *   autoNavigate: true,
 * });
 *
 * // From async generator
 * await streamFromGenerator(aiService.generateSlides(prompt));
 *
 * // Or from fetch response
 * const response = await fetch('/api/generate');
 * await streamFromReadable(response.body);
 * ```
 */
export function useSlideStream(
  options: UseSlideStreamOptions = {}
): SlideStreamResult {
  const {
    onSlide,
    onComplete,
    onError,
    onProgress,
    autoNavigate = true,
  } = options;

  const {
    slides,
    streamingStatus,
    streamingProgress,
    streamingError,
    addSlide: contextAddSlide,
    setStreamingStatus,
    setStreamingProgress,
    setStreamingError,
    clearSlides,
    setPresentation,
    goToSlide,
  } = useVividContext();

  const abortControllerRef = useRef<AbortController | null>(null);
  const slideCountRef = useRef(0);

  // Cancel ongoing stream
  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setStreamingStatus("idle");
  }, [setStreamingStatus]);

  // Reset state
  const reset = useCallback(() => {
    cancel();
    clearSlides();
    setStreamingError(null);
    setStreamingProgress(0, 0);
    slideCountRef.current = 0;
  }, [cancel, clearSlides, setStreamingError, setStreamingProgress]);

  // Add a single slide
  const addSlide = useCallback(
    (slide: Slide) => {
      contextAddSlide(slide);
      slideCountRef.current++;
      onSlide?.(slide, slideCountRef.current - 1);

      if (autoNavigate) {
        goToSlide(slideCountRef.current - 1);
      }
    },
    [contextAddSlide, onSlide, autoNavigate, goToSlide]
  );

  // Stream from async generator
  const streamFromGenerator = useCallback(
    async (generator: AsyncGenerator<GenerationEvent>) => {
      abortControllerRef.current = new AbortController();
      slideCountRef.current = 0;

      setStreamingStatus("connecting");
      setStreamingError(null);
      clearSlides();

      try {
        setStreamingStatus("streaming");

        for await (const event of generator) {
          // Check if cancelled
          if (abortControllerRef.current?.signal.aborted) {
            break;
          }

          switch (event.type) {
            case "slide":
              addSlide(event.slide);
              if (event.progress) {
                setStreamingProgress(
                  event.progress.current,
                  event.progress.total
                );
                onProgress?.(event.progress.current, event.progress.total);
              }
              break;

            case "progress":
              setStreamingProgress(event.current, event.total);
              onProgress?.(event.current, event.total);
              break;

            case "complete":
              setStreamingStatus("complete");
              onComplete?.(slides);
              break;

            case "error":
              const vividError = VividError.streamError(
                event.message,
                event.error
              );
              setStreamingError(vividError);
              setStreamingStatus("error");
              onError?.(vividError);
              return;
          }
        }

        if (!abortControllerRef.current?.signal.aborted) {
          setStreamingStatus("complete");
          onComplete?.(slides);
        }
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        const vividError = VividError.streamError(error.message, error);
        setStreamingError(vividError);
        setStreamingStatus("error");
        onError?.(error);
      } finally {
        abortControllerRef.current = null;
      }
    },
    [
      addSlide,
      slides,
      clearSlides,
      setStreamingStatus,
      setStreamingProgress,
      setStreamingError,
      onComplete,
      onError,
      onProgress,
    ]
  );

  // Stream from ReadableStream (for fetch responses)
  const streamFromReadable = useCallback(
    async (stream: ReadableStream<Uint8Array>) => {
      abortControllerRef.current = new AbortController();
      slideCountRef.current = 0;

      setStreamingStatus("connecting");
      setStreamingError(null);
      clearSlides();

      try {
        const reader = stream.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        setStreamingStatus("streaming");

        while (true) {
          // Check if cancelled
          if (abortControllerRef.current?.signal.aborted) {
            reader.cancel();
            break;
          }

          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });

          // Process complete JSON objects (newline-delimited)
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (!line.trim()) continue;

            try {
              const event = JSON.parse(line) as GenerationEvent;

              switch (event.type) {
                case "slide":
                  addSlide(event.slide);
                  if (event.progress) {
                    setStreamingProgress(
                      event.progress.current,
                      event.progress.total
                    );
                    onProgress?.(event.progress.current, event.progress.total);
                  }
                  break;

                case "progress":
                  setStreamingProgress(event.current, event.total);
                  onProgress?.(event.current, event.total);
                  break;

                case "complete":
                  setStreamingStatus("complete");
                  onComplete?.(slides);
                  break;

                case "error":
                  const vividErr = VividError.streamError(
                    event.message,
                    event.error
                  );
                  setStreamingError(vividErr);
                  setStreamingStatus("error");
                  onError?.(vividErr);
                  return;
              }
            } catch {
              // Invalid JSON line, skip
              console.warn("Invalid JSON in stream:", line);
            }
          }
        }

        if (!abortControllerRef.current?.signal.aborted) {
          setStreamingStatus("complete");
          onComplete?.(slides);
        }
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        const vividError2 = VividError.streamError(error.message, error);
        setStreamingError(vividError2);
        setStreamingStatus("error");
        onError?.(error);
      } finally {
        abortControllerRef.current = null;
      }
    },
    [
      addSlide,
      slides,
      clearSlides,
      setStreamingStatus,
      setStreamingProgress,
      setStreamingError,
      onComplete,
      onError,
      onProgress,
    ]
  );

  // Load from complete JSON
  const loadFromJSON = useCallback(
    (data: Presentation | Slide[]) => {
      clearSlides();
      slideCountRef.current = 0;

      const slidesToLoad = Array.isArray(data) ? data : data.slides;

      for (const slide of slidesToLoad) {
        addSlide(slide);
      }

      if (!Array.isArray(data)) {
        setPresentation(data);
      }

      setStreamingStatus("complete");
      onComplete?.(slidesToLoad);
    },
    [addSlide, clearSlides, setPresentation, setStreamingStatus, onComplete]
  );

  // Calculate progress
  const progress =
    streamingProgress.total > 0
      ? streamingProgress.current / streamingProgress.total
      : 0;

  return {
    status: streamingStatus,
    streamFromGenerator,
    streamFromReadable,
    loadFromJSON,
    addSlide,
    cancel,
    reset,
    progress,
    error: streamingError,
  };
}
