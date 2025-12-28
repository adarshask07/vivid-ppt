// ============================================================================
// VIVID CONTEXT - CORE STATE MANAGEMENT
// ============================================================================

import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useMemo,
} from "react";
import type {
  Presentation,
  PresentationMetadata,
  PresentationTheme,
  Slide,
  DesignSystem,
  StreamingStatus,
  VividError,
} from "../types";
import { defaultDarkTheme } from "../types/theme";

// --- STATE ---
export interface VividState {
  // Presentation data
  presentation: Presentation | null;
  slides: Slide[];

  // Navigation
  currentSlideIndex: number;

  // Theme
  theme: DesignSystem;

  // Streaming
  streamingStatus: StreamingStatus;
  streamingProgress: number;
  totalSlides: number;

  // Errors
  error: VividError | null;

  // Config
  aspectRatio: "16:9" | "4:3" | "16:10" | "1:1";
  animations: boolean;
}

// --- ACTIONS ---
type VividAction =
  | { type: "SET_PRESENTATION"; payload: Presentation }
  | { type: "SET_SLIDES"; payload: Slide[] }
  | { type: "ADD_SLIDE"; payload: Slide }
  | { type: "UPDATE_SLIDE"; payload: { index: number; slide: Partial<Slide> } }
  | { type: "GO_TO_SLIDE"; payload: number }
  | { type: "NEXT_SLIDE" }
  | { type: "PREV_SLIDE" }
  | { type: "SET_THEME"; payload: DesignSystem }
  | { type: "SET_STREAMING_STATUS"; payload: StreamingStatus }
  | {
      type: "SET_STREAMING_PROGRESS";
      payload: { progress: number; totalSlides?: number };
    }
  | {
      type: "SET_METADATA";
      payload: {
        metadata: PresentationMetadata;
        theme: PresentationTheme;
        totalSlides: number;
      };
    }
  | { type: "SET_ERROR"; payload: VividError | null }
  | { type: "RESET" };

// --- INITIAL STATE ---
const initialState: VividState = {
  presentation: null,
  slides: [],
  currentSlideIndex: 0,
  theme: defaultDarkTheme,
  streamingStatus: "idle",
  streamingProgress: 0,
  totalSlides: 0,
  error: null,
  aspectRatio: "16:9",
  animations: true,
};

// --- REDUCER ---
function vividReducer(state: VividState, action: VividAction): VividState {
  switch (action.type) {
    case "SET_PRESENTATION":
      return {
        ...state,
        presentation: action.payload,
        slides: action.payload.slides,
        currentSlideIndex: 0,
        error: null,
      };

    case "SET_SLIDES":
      return {
        ...state,
        slides: action.payload,
      };

    case "ADD_SLIDE":
      return {
        ...state,
        slides: [...state.slides, action.payload],
      };

    case "UPDATE_SLIDE": {
      const { index, slide } = action.payload;
      const newSlides = [...state.slides];
      if (newSlides[index]) {
        newSlides[index] = { ...newSlides[index], ...slide };
      }
      return {
        ...state,
        slides: newSlides,
      };
    }

    case "GO_TO_SLIDE":
      return {
        ...state,
        currentSlideIndex: Math.max(
          0,
          Math.min(action.payload, state.slides.length - 1)
        ),
      };

    case "NEXT_SLIDE":
      return {
        ...state,
        currentSlideIndex: Math.min(
          state.currentSlideIndex + 1,
          state.slides.length - 1
        ),
      };

    case "PREV_SLIDE":
      return {
        ...state,
        currentSlideIndex: Math.max(state.currentSlideIndex - 1, 0),
      };

    case "SET_THEME":
      return {
        ...state,
        theme: action.payload,
      };

    case "SET_STREAMING_STATUS":
      return {
        ...state,
        streamingStatus: action.payload,
      };

    case "SET_STREAMING_PROGRESS":
      return {
        ...state,
        streamingProgress: action.payload.progress,
        totalSlides: action.payload.totalSlides ?? state.totalSlides,
      };

    case "SET_METADATA":
      return {
        ...state,
        presentation: state.presentation
          ? {
              ...state.presentation,
              metadata: action.payload.metadata,
              theme: action.payload.theme,
            }
          : null,
        totalSlides: action.payload.totalSlides,
      };

    case "SET_ERROR":
      return {
        ...state,
        error: action.payload,
        streamingStatus: action.payload ? "error" : state.streamingStatus,
      };

    case "RESET":
      return initialState;

    default:
      return state;
  }
}

// --- CONTEXT VALUE ---
export interface VividContextValue {
  // State (raw access)
  state: VividState;

  // Direct accessors (convenience)
  presentation: Presentation | null;
  slides: Slide[];
  currentSlideIndex: number;
  theme: DesignSystem;
  streamingStatus: StreamingStatus;
  streamingProgress: { current: number; total: number };
  streamingError: VividError | null;

  // Computed values
  currentSlide: Slide | null;
  isLoading: boolean;
  isStreaming: boolean;
  canGoNext: boolean;
  canGoPrev: boolean;

  // Actions
  setPresentation: (presentation: Presentation) => void;
  setSlides: (slides: Slide[]) => void;
  addSlide: (slide: Slide) => void;
  updateSlide: (index: number, slide: Partial<Slide>) => void;
  clearSlides: () => void;
  goToSlide: (index: number) => void;
  nextSlide: () => void;
  prevSlide: () => void;
  setTheme: (theme: DesignSystem) => void;
  setStreamingStatus: (status: StreamingStatus) => void;
  setStreamingProgress: (current: number, total: number) => void;
  setStreamingError: (error: VividError | null) => void;
  setError: (error: VividError | null) => void;
  reset: () => void;
}

// --- CONTEXT ---
const VividContext = createContext<VividContextValue | null>(null);

// --- PROVIDER PROPS ---
export interface VividProviderProps {
  /** Initial presentation data */
  presentation?: Presentation | null;
  /** Initial theme */
  theme?: DesignSystem | "light" | "dark";
  /** Aspect ratio for slides */
  aspectRatio?: "16:9" | "4:3" | "16:10" | "1:1";
  /** Enable/disable animations */
  animations?: boolean;
  /** Callback when slide changes */
  onSlideChange?: (index: number) => void;
  /** Callback when error occurs */
  onError?: (error: VividError) => void;
  /** Children */
  children: React.ReactNode;
}

// --- PROVIDER ---
export function VividProvider({
  presentation: initialPresentation,
  theme: initialTheme = "dark",
  aspectRatio = "16:9",
  animations = true,
  onSlideChange,
  onError,
  children,
}: VividProviderProps) {
  // Resolve initial theme
  const resolvedTheme = useMemo(() => {
    if (typeof initialTheme === "string") {
      return initialTheme === "light"
        ? { ...defaultDarkTheme, id: "light", name: "Light" }
        : defaultDarkTheme;
    }
    return initialTheme;
  }, [initialTheme]);

  // Initialize state
  const [state, dispatch] = useReducer(vividReducer, {
    ...initialState,
    presentation: initialPresentation ?? null,
    slides: initialPresentation?.slides ?? [],
    theme: resolvedTheme,
    aspectRatio,
    animations,
  });

  // Actions
  const setPresentation = useCallback((presentation: Presentation) => {
    dispatch({ type: "SET_PRESENTATION", payload: presentation });
  }, []);

  const setSlides = useCallback((slides: Slide[]) => {
    dispatch({ type: "SET_SLIDES", payload: slides });
  }, []);

  const addSlide = useCallback((slide: Slide) => {
    dispatch({ type: "ADD_SLIDE", payload: slide });
  }, []);

  const updateSlide = useCallback((index: number, slide: Partial<Slide>) => {
    dispatch({ type: "UPDATE_SLIDE", payload: { index, slide } });
  }, []);

  const goToSlide = useCallback(
    (index: number) => {
      dispatch({ type: "GO_TO_SLIDE", payload: index });
      onSlideChange?.(index);
    },
    [onSlideChange]
  );

  const nextSlide = useCallback(() => {
    const nextIndex = Math.min(
      state.currentSlideIndex + 1,
      state.slides.length - 1
    );
    dispatch({ type: "NEXT_SLIDE" });
    if (nextIndex !== state.currentSlideIndex) {
      onSlideChange?.(nextIndex);
    }
  }, [state.currentSlideIndex, state.slides.length, onSlideChange]);

  const prevSlide = useCallback(() => {
    const prevIndex = Math.max(state.currentSlideIndex - 1, 0);
    dispatch({ type: "PREV_SLIDE" });
    if (prevIndex !== state.currentSlideIndex) {
      onSlideChange?.(prevIndex);
    }
  }, [state.currentSlideIndex, onSlideChange]);

  const setTheme = useCallback((theme: DesignSystem) => {
    dispatch({ type: "SET_THEME", payload: theme });
  }, []);

  const setStreamingStatus = useCallback((status: StreamingStatus) => {
    dispatch({ type: "SET_STREAMING_STATUS", payload: status });
  }, []);

  const setStreamingProgress = useCallback((current: number, total: number) => {
    dispatch({
      type: "SET_STREAMING_PROGRESS",
      payload: { progress: current, totalSlides: total },
    });
  }, []);

  const setStreamingError = useCallback(
    (error: VividError | null) => {
      dispatch({ type: "SET_ERROR", payload: error });
      if (error) {
        onError?.(error);
      }
    },
    [onError]
  );

  const setError = useCallback(
    (error: VividError | null) => {
      dispatch({ type: "SET_ERROR", payload: error });
      if (error) {
        onError?.(error);
      }
    },
    [onError]
  );

  const clearSlides = useCallback(() => {
    dispatch({ type: "SET_SLIDES", payload: [] });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: "RESET" });
  }, []);

  // Computed values
  const currentSlide = state.slides[state.currentSlideIndex] ?? null;
  const isLoading =
    state.streamingStatus === "streaming" && state.slides.length === 0;
  const isStreaming = state.streamingStatus === "streaming";
  const canGoNext = state.currentSlideIndex < state.slides.length - 1;
  const canGoPrev = state.currentSlideIndex > 0;

  // Context value
  const value = useMemo<VividContextValue>(
    () => ({
      // Raw state
      state,
      // Direct accessors
      presentation: state.presentation,
      slides: state.slides,
      currentSlideIndex: state.currentSlideIndex,
      theme: state.theme,
      streamingStatus: state.streamingStatus,
      streamingProgress: {
        current: state.streamingProgress,
        total: state.totalSlides,
      },
      streamingError: state.error,
      // Computed values
      currentSlide,
      isLoading,
      isStreaming,
      canGoNext,
      canGoPrev,
      // Actions
      setPresentation,
      setSlides,
      addSlide,
      updateSlide,
      clearSlides,
      goToSlide,
      nextSlide,
      prevSlide,
      setTheme,
      setStreamingStatus,
      setStreamingProgress,
      setStreamingError,
      setError,
      reset,
    }),
    [
      state,
      currentSlide,
      isLoading,
      isStreaming,
      canGoNext,
      canGoPrev,
      setPresentation,
      setSlides,
      addSlide,
      updateSlide,
      clearSlides,
      goToSlide,
      nextSlide,
      prevSlide,
      setTheme,
      setStreamingStatus,
      setStreamingProgress,
      setStreamingError,
      setError,
      reset,
    ]
  );

  return <VividContext.Provider value={value}>{children}</VividContext.Provider>;
}

// --- HOOK ---
export function useVividContext(): VividContextValue {
  const context = useContext(VividContext);
  if (!context) {
    throw new Error("useVividContext must be used within a VividProvider");
  }
  return context;
}

export { VividContext };
