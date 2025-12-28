// ============================================================================
// ELEMENT TYPE DEFINITIONS
// ============================================================================

import type {
  BaseElement,
  TextStyle,
  ParagraphStyle,
  RichTextContent,
  Fill,
  Color,
  Unit,
  Percentage,
  Animation,
  Position,
  Gradient,
  VerticalAlign,
  TextAlign,
} from "./primitives";

// Re-export BaseElement from primitives
export type { BaseElement };

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
  content: string;
  richContent?: RichTextContent;
  semanticStyle?: TextSemanticStyle;
  textStyle?: TextStyle;
  paragraphStyle?: ParagraphStyle;
  fill?: Fill;
  padding?: { top: Unit; right: Unit; bottom: Unit; left: Unit };
  verticalAlign?: VerticalAlign;
  autoFit?: boolean;
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
    path?: string;
  };
  filters?: {
    brightness?: number;
    contrast?: number;
    saturation?: number;
    grayscale?: number;
    blur?: Unit;
    sepia?: number;
  };
  placeholder?: string;
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
  path?: string;
  points?: number;
  innerRadius?: number;
}

// --- ICON ELEMENT ---
export interface IconElement extends BaseElement {
  type: "icon";
  icon: string;
  library?: "lucide" | "heroicons" | "custom";
  color?: Color;
  strokeWidth?: number;
  fill?: Color;
}

// --- LINE ELEMENT ---
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
  controlPoints?: Position[];
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
  checked?: boolean;
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

// --- CALLOUT ELEMENT ---
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

// --- PROGRESS ELEMENT ---
export interface ProgressElement extends BaseElement {
  type: "progress";
  value: number;
  max?: number;
  variant: "bar" | "circle" | "semicircle" | "gauge";
  label?: string;
  showValue?: boolean;
  valueFormat?: string;
  colors?: {
    track?: Color;
    fill?: Color;
    text?: Color;
  };
  thickness?: Unit;
  animated?: boolean;
}

// --- METRIC ELEMENT ---
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

// --- GROUP ELEMENT ---
export interface GroupElement extends BaseElement {
  type: "group";
  children: SlideElement[];
  clipContent?: boolean;
}

// --- UNION TYPE ---
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
