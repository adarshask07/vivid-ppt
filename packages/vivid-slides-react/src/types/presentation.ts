// ============================================================================
// SLIDE & PRESENTATION TYPE DEFINITIONS
// ============================================================================

import type {
  Color,
  Unit,
  Percentage,
  Gradient,
  EasingFunction,
  Animation,
} from "./primitives";
import type { SlideElement, ImageFit } from "./elements";

// --- SLIDE LAYOUT TYPES ---
export type SlideLayoutType =
  | "blank"
  | "title"
  | "title-subtitle"
  | "title-only"
  | "section-header"
  | "content"
  | "content-two-column"
  | "comparison"
  | "image-full"
  | "image-left"
  | "image-right"
  | "quote"
  | "metrics"
  | "metrics-grid"
  | "chart"
  | "chart-with-text"
  | "timeline"
  | "team"
  | "team-grid"
  | "agenda"
  | "table-of-contents"
  | "thank-you"
  | "contact"
  | "q-and-a";

// --- SLIDE BACKGROUND ---
export interface SlideBackground {
  type: "solid" | "gradient" | "image" | "video";
  color?: Color;
  gradient?: Gradient;
  image?: {
    src: string;
    fit: ImageFit;
    position?: { x: Percentage; y: Percentage };
    overlay?: {
      color: Color;
      opacity: number;
    };
  };
  video?: {
    src: string;
    poster?: string;
    overlay?: {
      color: Color;
      opacity: number;
    };
  };
}

// --- SLIDE TRANSITION ---
export interface SlideTransition {
  type:
    | "none"
    | "fade"
    | "slide"
    | "push"
    | "zoom"
    | "flip"
    | "cube"
    | "reveal";
  direction?: "left" | "right" | "up" | "down";
  duration?: number;
  easing?: EasingFunction;
}

// --- SLIDE ---
export interface Slide {
  id: string;
  name?: string;
  layoutType?: SlideLayoutType;
  background?: SlideBackground;
  elements: SlideElement[];
  transition?: SlideTransition;
  notes?: string;
  duration?: number;
  hidden?: boolean;
  thumbnailOverride?: string;
}

// --- PRESENTATION METADATA ---
export interface PresentationMetadata {
  title: string;
  description?: string;
  author?: string;
  company?: string;
  createdAt?: string;
  updatedAt?: string;
  version?: string;
  tags?: string[];
}

// --- PRESENTATION SETTINGS ---
export interface PresentationSettings {
  aspectRatio: "16:9" | "4:3" | "16:10" | "1:1";
  width: Unit;
  height: Unit;
  defaultTransition?: SlideTransition;
  defaultAnimation?: Animation;
  autoAdvance?: boolean;
  autoAdvanceDelay?: number;
  loop?: boolean;
}

// --- PRESENTATION THEME ---
export interface PresentationTheme {
  id: string;
  name: string;
  colors: {
    primary: Color;
    secondary: Color;
    accent: Color;
    background: Color;
    surface: Color;
    text: {
      primary: Color;
      secondary: Color;
      muted: Color;
      inverse: Color;
    };
    success: Color;
    warning: Color;
    error: Color;
    info: Color;
  };
  typography: {
    headingFont: string;
    bodyFont: string;
    codeFont: string;
  };
  spacing: {
    unit: Unit;
    margins: { top: Unit; right: Unit; bottom: Unit; left: Unit };
  };
}

// --- PRESENTATION ---
export interface Presentation {
  id: string;
  metadata: PresentationMetadata;
  settings: PresentationSettings;
  theme: PresentationTheme;
  slides: Slide[];
  masterSlides?: Slide[];
}

// --- GENERATION HINTS ---
export interface SlideGenerationHint {
  purpose: string;
  suggestedLayout: SlideLayoutType;
  keyPoints: string[];
  visualStyle?: "minimal" | "corporate" | "creative" | "bold" | "elegant";
  dataToVisualize?: {
    type: "chart" | "table" | "metrics" | "timeline";
    data: unknown;
  };
}

export interface PresentationGenerationConfig {
  topic: string;
  audience?: string;
  tone?: "formal" | "casual" | "inspiring" | "educational";
  slideCount?: number;
  hints?: SlideGenerationHint[];
  includeElements?: SlideElement["type"][];
  excludeElements?: SlideElement["type"][];
}

// --- THEME ALIAS (for useTheme hook) ---
export type Theme = PresentationTheme;
