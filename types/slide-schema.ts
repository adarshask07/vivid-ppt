// ============================================================================
// SLIDE SCHEMA - Comprehensive Data Structure for AI-Generated Presentations
// ============================================================================

// --- PRIMITIVES & UNITS ---
export type Unit = number; // Pixels
export type Percentage = `${number}%`;
export type HexColor = `#${string}`;
export type ThemeColor = `theme.${string}`;
export type Color = HexColor | ThemeColor | "transparent";

// --- POSITION & DIMENSIONS ---
export interface Position {
  x: Unit;
  y: Unit;
}

export interface Dimensions {
  width: Unit;
  height: Unit;
}

export interface Bounds extends Position, Dimensions {}

// --- TRANSFORMS ---
export interface Transform {
  rotation?: number; // Degrees
  scaleX?: number;
  scaleY?: number;
  skewX?: number;
  skewY?: number;
  originX?: Percentage | Unit;
  originY?: Percentage | Unit;
}

// --- SHADOWS ---
export interface Shadow {
  color: Color;
  offsetX: Unit;
  offsetY: Unit;
  blur: Unit;
  spread?: Unit;
}

// --- BORDERS ---
export interface Border {
  width: Unit;
  style: "solid" | "dashed" | "dotted" | "double" | "none";
  color: Color;
  radius?:
    | Unit
    | { topLeft: Unit; topRight: Unit; bottomRight: Unit; bottomLeft: Unit };
}

// --- EFFECTS ---
export interface Effects {
  opacity?: number; // 0-1
  shadow?: Shadow;
  blur?: Unit;
  brightness?: number; // 0-2 (1 is normal)
  contrast?: number; // 0-2 (1 is normal)
  saturation?: number; // 0-2 (1 is normal)
  grayscale?: number; // 0-1
}

// --- ANIMATIONS ---
export type AnimationType =
  | "none"
  | "fade-in"
  | "fade-out"
  | "slide-up"
  | "slide-down"
  | "slide-left"
  | "slide-right"
  | "zoom-in"
  | "zoom-out"
  | "bounce"
  | "pulse"
  | "shake"
  | "typewriter"
  | "flip"
  | "rotate-in"
  | "blur-in"
  | "blur-out";

export type EasingFunction =
  | "linear"
  | "ease"
  | "ease-in"
  | "ease-out"
  | "ease-in-out"
  | "spring"
  | [number, number, number, number]; // Custom cubic-bezier

export interface Animation {
  type: AnimationType;
  duration: number; // ms
  delay?: number; // ms
  easing?: EasingFunction;
  iterations?: number | "infinite";
  direction?: "normal" | "reverse" | "alternate";
  stagger?: number; // ms - for list items
}

// --- TEXT STYLING ---
export type FontWeight =
  | 100
  | 200
  | 300
  | 400
  | 500
  | 600
  | 700
  | 800
  | 900
  | "normal"
  | "bold";
export type TextAlign = "left" | "center" | "right" | "justify";
export type VerticalAlign = "top" | "middle" | "bottom";
export type TextDecoration = "none" | "underline" | "line-through" | "overline";
export type TextTransform = "none" | "uppercase" | "lowercase" | "capitalize";

export interface TextStyle {
  fontFamily?: string;
  fontSize?: Unit;
  fontWeight?: FontWeight;
  fontStyle?: "normal" | "italic";
  color?: Color;
  lineHeight?: number | Percentage;
  letterSpacing?: Unit;
  wordSpacing?: Unit;
  textAlign?: TextAlign;
  verticalAlign?: VerticalAlign;
  textDecoration?: TextDecoration;
  textTransform?: TextTransform;
  textShadow?: Shadow;
}

export interface ParagraphStyle {
  marginTop?: Unit;
  marginBottom?: Unit;
  indent?: Unit;
  listStyle?:
    | "none"
    | "disc"
    | "circle"
    | "square"
    | "decimal"
    | "alpha"
    | "roman";
  listIndent?: Unit;
}

// --- RICH TEXT CONTENT ---
export interface TextRun {
  text: string;
  style?: Partial<TextStyle>;
  link?: string;
}

export interface Paragraph {
  runs: TextRun[];
  style?: ParagraphStyle;
  align?: TextAlign;
}

export interface RichTextContent {
  paragraphs: Paragraph[];
}

// --- GRADIENT ---
export interface GradientStop {
  color: Color;
  position: number; // 0-100
}

export interface LinearGradient {
  type: "linear";
  angle: number; // Degrees
  stops: GradientStop[];
}

export interface RadialGradient {
  type: "radial";
  centerX: Percentage;
  centerY: Percentage;
  radius: Percentage;
  stops: GradientStop[];
}

export type Gradient = LinearGradient | RadialGradient;

// --- FILL ---
export interface SolidFill {
  type: "solid";
  color: Color;
}

export interface GradientFill {
  type: "gradient";
  gradient: Gradient;
}

export interface ImageFill {
  type: "image";
  src: string;
  fit: "cover" | "contain" | "fill" | "none";
  position?: { x: Percentage; y: Percentage };
}

export interface PatternFill {
  type: "pattern";
  pattern: "dots" | "lines" | "grid" | "diagonal" | "crosshatch";
  color: Color;
  backgroundColor: Color;
  scale?: number;
}

export type Fill = SolidFill | GradientFill | ImageFill | PatternFill;

// ============================================================================
// BASE ELEMENT
// ============================================================================
export interface BaseElement {
  id: string;
  name?: string; // For layer panel display
  type: string;
  bounds: Bounds;
  transform?: Transform;
  effects?: Effects;
  border?: Border;
  animation?: Animation;
  zIndex?: number;
  locked?: boolean;
  hidden?: boolean;
  groupId?: string; // For element grouping
}

// ============================================================================
// ELEMENT TYPES
// ============================================================================

// --- TEXT ELEMENT ---
export type TextSemanticStyle =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "body"
  | "body-small"
  | "caption"
  | "quote"
  | "code";

export interface TextElement extends BaseElement {
  type: "text";
  content: string; // HTML or plain text
  richContent?: RichTextContent; // Structured rich text (alternative to HTML)
  semanticStyle?: TextSemanticStyle;
  textStyle?: TextStyle;
  paragraphStyle?: ParagraphStyle;
  fill?: Fill;
  padding?: { top: Unit; right: Unit; bottom: Unit; left: Unit };
  verticalAlign?: VerticalAlign;
  autoFit?: boolean; // Auto-shrink text to fit
  columns?: number;
  columnGap?: Unit;
}

// --- IMAGE ELEMENT ---
export type ImageFit = "cover" | "contain" | "fill" | "none" | "scale-down";

export interface ImageElement extends BaseElement {
  type: "image";
  src: string;
  alt: string;
  fit?: ImageFit;
  position?: { x: Percentage; y: Percentage };
  mask?: {
    type: "rect" | "circle" | "ellipse" | "polygon" | "custom";
    path?: string; // SVG path for custom
  };
  filters?: {
    brightness?: number;
    contrast?: number;
    saturation?: number;
    grayscale?: number;
    blur?: Unit;
    sepia?: number;
  };
  placeholder?: string; // Placeholder while loading
}

// --- SHAPE ELEMENT ---
export type ShapeVariant =
  | "rectangle"
  | "rounded-rect"
  | "square"
  | "circle"
  | "ellipse"
  | "oval"
  | "triangle"
  | "right-triangle"
  | "pentagon"
  | "hexagon"
  | "octagon"
  | "star"
  | "star-4"
  | "star-6"
  | "arrow-right"
  | "arrow-left"
  | "arrow-up"
  | "arrow-down"
  | "arrow-double"
  | "chevron-right"
  | "chevron-left"
  | "diamond"
  | "parallelogram"
  | "trapezoid"
  | "cross"
  | "plus"
  | "heart"
  | "cloud"
  | "lightning"
  | "callout"
  | "callout-rounded"
  | "line"
  | "curve"
  | "connector"
  | "custom";

export interface ShapeElement extends BaseElement {
  type: "shape";
  variant: ShapeVariant;
  fill?: Fill;
  stroke?: {
    color: Color;
    width: Unit;
    style?: "solid" | "dashed" | "dotted";
    dashArray?: number[];
    lineCap?: "butt" | "round" | "square";
    lineJoin?: "miter" | "round" | "bevel";
  };
  cornerRadius?:
    | Unit
    | { topLeft: Unit; topRight: Unit; bottomRight: Unit; bottomLeft: Unit };
  path?: string; // SVG path for custom shapes
  points?: number; // For star/polygon variants
  innerRadius?: number; // For star (0-1)
}

// --- ICON ELEMENT ---
export interface IconElement extends BaseElement {
  type: "icon";
  icon: string; // Icon name from Lucide or custom
  library?: "lucide" | "heroicons" | "custom";
  color?: Color;
  strokeWidth?: number;
  fill?: Color;
}

// --- LINE/CONNECTOR ELEMENT ---
export interface LineElement extends BaseElement {
  type: "line";
  startPoint: Position;
  endPoint: Position;
  stroke: {
    color: Color;
    width: Unit;
    style?: "solid" | "dashed" | "dotted";
    dashArray?: number[];
  };
  startArrow?: "none" | "arrow" | "circle" | "diamond" | "square";
  endArrow?: "none" | "arrow" | "circle" | "diamond" | "square";
  curved?: boolean;
  controlPoints?: Position[]; // For bezier curves
}

// --- CHART ELEMENT ---
export type ChartType =
  | "bar"
  | "bar-horizontal"
  | "bar-stacked"
  | "line"
  | "area"
  | "area-stacked"
  | "pie"
  | "doughnut"
  | "semi-doughnut"
  | "scatter"
  | "bubble"
  | "radar"
  | "polar"
  | "funnel"
  | "pyramid"
  | "gauge"
  | "progress";

export interface ChartDataset {
  label: string;
  data: number[];
  color?: Color;
  backgroundColor?: Color;
  borderColor?: Color;
  borderWidth?: number;
}

export interface ChartConfig {
  labels: string[];
  datasets: ChartDataset[];
}

export interface ChartElement extends BaseElement {
  type: "chart";
  chartType: ChartType;
  data: ChartConfig;
  options?: {
    showLegend?: boolean;
    legendPosition?: "top" | "bottom" | "left" | "right";
    showGrid?: boolean;
    showAxis?: boolean;
    showLabels?: boolean;
    showValues?: boolean;
    animate?: boolean;
    colors?: Color[];
    title?: string;
    subtitle?: string;
  };
}

// --- TABLE ELEMENT ---
export interface TableCell {
  content: string;
  colSpan?: number;
  rowSpan?: number;
  align?: TextAlign;
  verticalAlign?: VerticalAlign;
  fill?: Fill;
  textStyle?: TextStyle;
}

export interface TableRow {
  cells: TableCell[];
  height?: Unit;
  fill?: Fill;
}

export interface TableElement extends BaseElement {
  type: "table";
  headers?: TableRow;
  rows: TableRow[];
  columnWidths?: (Unit | "auto")[];
  style?: {
    headerFill?: Fill;
    headerTextStyle?: TextStyle;
    rowFill?: Fill;
    alternateRowFill?: Fill;
    cellPadding?: { top: Unit; right: Unit; bottom: Unit; left: Unit };
    borderColor?: Color;
    borderWidth?: Unit;
    showHeaderBorder?: boolean;
    showRowBorders?: boolean;
    showColumnBorders?: boolean;
    roundedCorners?: Unit;
  };
}

// --- VIDEO ELEMENT ---
export interface VideoElement extends BaseElement {
  type: "video";
  src: string;
  poster?: string;
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
  controls?: boolean;
  fit?: ImageFit;
}

// --- EMBED ELEMENT ---
export interface EmbedElement extends BaseElement {
  type: "embed";
  embedType:
    | "youtube"
    | "vimeo"
    | "twitter"
    | "instagram"
    | "codepen"
    | "figma"
    | "iframe";
  url: string;
  aspectRatio?: "16:9" | "4:3" | "1:1" | "auto";
}

// --- CODE ELEMENT ---
export interface CodeElement extends BaseElement {
  type: "code";
  code: string;
  language: string;
  theme?: "dark" | "light" | "github" | "monokai" | "dracula";
  showLineNumbers?: boolean;
  highlightLines?: number[];
  fontSize?: Unit;
}

// --- LIST ELEMENT ---
export interface ListItem {
  content: string;
  subItems?: ListItem[];
  icon?: string;
  checked?: boolean; // For checklist
}

export interface ListElement extends BaseElement {
  type: "list";
  items: ListItem[];
  listType: "bullet" | "numbered" | "checklist" | "icon";
  textStyle?: TextStyle;
  bulletStyle?: {
    type: "disc" | "circle" | "square" | "dash" | "arrow" | "check" | "custom";
    color?: Color;
    size?: Unit;
    customIcon?: string;
  };
  spacing?: Unit;
  indent?: Unit;
  animation?: Animation & { staggerChildren?: boolean };
}

// --- DIVIDER ELEMENT ---
export interface DividerElement extends BaseElement {
  type: "divider";
  orientation: "horizontal" | "vertical";
  style: "solid" | "dashed" | "dotted" | "gradient" | "decorative";
  color?: Color;
  thickness?: Unit;
  gradient?: Gradient;
  decoratorStart?: "none" | "dot" | "diamond" | "arrow";
  decoratorEnd?: "none" | "dot" | "diamond" | "arrow";
}

// --- QUOTE/CALLOUT ELEMENT ---
export interface CalloutElement extends BaseElement {
  type: "callout";
  content: string;
  variant: "quote" | "info" | "warning" | "success" | "error" | "tip" | "note";
  icon?: string;
  author?: string;
  authorTitle?: string;
  fill?: Fill;
  accentColor?: Color;
  textStyle?: TextStyle;
}

// --- PROGRESS/METRIC ELEMENT ---
export interface ProgressElement extends BaseElement {
  type: "progress";
  value: number; // 0-100
  max?: number;
  variant: "bar" | "circle" | "semicircle" | "gauge";
  label?: string;
  showValue?: boolean;
  valueFormat?: string; // e.g., "{value}%", "${value}M"
  colors?: {
    track?: Color;
    fill?: Color;
    text?: Color;
  };
  thickness?: Unit;
  animated?: boolean;
}

// --- METRIC/STAT CARD ELEMENT ---
export interface MetricElement extends BaseElement {
  type: "metric";
  value: string;
  label: string;
  prefix?: string;
  suffix?: string;
  change?: {
    value: string;
    direction: "up" | "down" | "neutral";
    label?: string;
  };
  icon?: string;
  fill?: Fill;
  valueStyle?: TextStyle;
  labelStyle?: TextStyle;
}

// --- TIMELINE ELEMENT ---
export interface TimelineItem {
  date?: string;
  title: string;
  description?: string;
  icon?: string;
  color?: Color;
}

export interface TimelineElement extends BaseElement {
  type: "timeline";
  items: TimelineItem[];
  orientation: "horizontal" | "vertical";
  variant: "line" | "cards" | "alternating";
  lineColor?: Color;
  connectorStyle?: "solid" | "dashed" | "dotted";
}

// --- GROUP ELEMENT ---
export interface GroupElement extends BaseElement {
  type: "group";
  children: SlideElement[];
  clipContent?: boolean;
}

// ============================================================================
// UNION TYPE FOR ALL ELEMENTS
// ============================================================================
export type SlideElement =
  | TextElement
  | ImageElement
  | ShapeElement
  | IconElement
  | LineElement
  | ChartElement
  | TableElement
  | VideoElement
  | EmbedElement
  | CodeElement
  | ListElement
  | DividerElement
  | CalloutElement
  | ProgressElement
  | MetricElement
  | TimelineElement
  | GroupElement;

// ============================================================================
// SLIDE CONFIGURATION
// ============================================================================
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

export interface Slide {
  id: string;
  name?: string;
  layoutType?: SlideLayoutType;
  background?: SlideBackground;
  elements: SlideElement[];
  transition?: SlideTransition;
  notes?: string; // Speaker notes
  duration?: number; // Suggested duration in seconds
  hidden?: boolean;
  thumbnailOverride?: string; // Custom thumbnail
}

// ============================================================================
// PRESENTATION CONFIGURATION
// ============================================================================
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

export interface PresentationSettings {
  aspectRatio: "16:9" | "4:3" | "16:10" | "1:1";
  width: Unit;
  height: Unit;
  defaultTransition?: SlideTransition;
  defaultAnimation?: Animation;
  autoAdvance?: boolean;
  autoAdvanceDelay?: number; // ms
  loop?: boolean;
}

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

export interface Presentation {
  id: string;
  metadata: PresentationMetadata;
  settings: PresentationSettings;
  theme: PresentationTheme;
  slides: Slide[];
  masterSlides?: Slide[]; // Template slides
}

// ============================================================================
// HELPER TYPES FOR LLM GENERATION
// ============================================================================
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
