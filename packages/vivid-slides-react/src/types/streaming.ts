// ============================================================================
// STREAMING TYPES
// ============================================================================

import type {
  Slide,
  PresentationMetadata,
  PresentationTheme,
} from "./presentation";

// --- GENERATION EVENTS ---
export interface MetadataEvent {
  type: "metadata";
  data: PresentationMetadata;
  theme: PresentationTheme;
  totalSlides: number;
}

export interface SlideEvent {
  type: "slide";
  slide: Slide;
  data?: Slide; // alias for compatibility
  slideIndex: number;
  progress?: {
    current: number;
    total: number;
  };
}

export interface ProgressEvent {
  type: "progress";
  current: number;
  total: number;
}

export interface CompleteEvent {
  type: "complete";
  progress?: 100;
}

export interface ErrorEvent {
  type: "error";
  message: string;
  error?: Error;
  recoverable?: boolean;
}

export type GenerationEvent =
  | MetadataEvent
  | SlideEvent
  | ProgressEvent
  | CompleteEvent
  | ErrorEvent;

// --- STREAMING STATE ---
export type StreamingStatus =
  | "idle"
  | "connecting"
  | "streaming"
  | "complete"
  | "error"
  | "cancelled";

export interface StreamingState {
  status: StreamingStatus;
  progress: number;
  slidesReceived: number;
  totalSlides: number;
  elapsedTime: number;
  error: Error | null;
}

// --- STREAMING OPTIONS ---
export interface StreamingOptions {
  onMetadata?: (
    metadata: PresentationMetadata,
    theme: PresentationTheme
  ) => void;
  onSlide?: (slide: Slide, index: number) => void;
  onProgress?: (progress: number) => void;
  onComplete?: () => void;
  onError?: (error: Error) => void;
}
