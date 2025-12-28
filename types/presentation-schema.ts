// --- 1. PRIMITIVES ---
export type Unit = number; // Pixels
export type HexColor = string; // "#FF0000" or "theme.colors.primary"

// --- 2. ANIMATIONS (The "Wow" Factor) ---
export interface AnimationConfig {
  type: 'fade-in' | 'slide-up' | 'zoom-in' | 'typewriter';
  duration: number; // ms
  delay: number; // ms
  ease: 'linear' | 'ease-out' | 'ease-in-out';
}

// --- 3. ELEMENTS (The Building Blocks) ---
export interface BaseElement {
  id: string;
  x: Unit;
  y: Unit;
  width: Unit;
  height: Unit;
  rotation?: number;
  zIndex?: number;
  animation?: AnimationConfig;
}

export interface TextElement extends BaseElement {
  type: 'text';
  content: string; // HTML or Markdown
  style: 'h1' | 'h2' | 'h3' | 'body' | 'caption' | 'quote'; // Semantic Tokens
  color?: HexColor;
  align?: 'left' | 'center' | 'right';
}

export interface ImageElement extends BaseElement {
  type: 'image';
  src: string; // URL or "placeholder.tech"
  alt: string;
  borderRadius?: number;
}

export interface ShapeElement extends BaseElement {
  type: 'shape';
  variant: 'rect' | 'circle' | 'arrow' | 'line' | 'star';
  fill: HexColor;
  stroke?: HexColor;
  strokeWidth?: number;
}

// --- 4. ADVANCED DATA CONFIGS (The "Production" Value) ---
export interface ChartElement extends BaseElement {
  type: 'chart';
  chartType: 'bar' | 'line' | 'pie' | 'doughnut';
  data: {
    labels: string[];
    datasets: { label: string; data: number[]; color: string }[];
  };
  showLegend: boolean;
}

export interface TableElement extends BaseElement {
  type: 'table';
  headers: string[];
  rows: string[][];
  striped: boolean;
}

// Union Type
export type SlideElement = TextElement | ImageElement | ShapeElement | ChartElement | TableElement;

// --- 5. THE SLIDE & DECK ---
export interface SlideConfig {
  id: string;
  layoutId?: string; // e.g., "layout-title-centered" (for AI context)
  background?: HexColor;
  notes?: string; // Speaker notes (Crucial for AI)
  elements: SlideElement[];
}

export interface PresentationConfig {
  title: string;
  themeId: string; // "midnight-blue"
  aspectRatio: '16:9' | '4:3';
  slides: SlideConfig[];
}