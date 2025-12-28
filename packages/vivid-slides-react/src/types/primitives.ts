// ============================================================================
// VIVID SLIDES - CORE TYPE DEFINITIONS
// ============================================================================

// --- PRIMITIVES & UNITS ---
export type Unit = number;
export type Percentage = `${number}%`;
export type HexColor = `#${string}`;
export type ThemeColor = `theme.${string}`;
export type Color = HexColor | ThemeColor | "transparent" | string;

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
  rotation?: number;
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
  opacity?: number;
  shadow?: Shadow;
  blur?: Unit;
  brightness?: number;
  contrast?: number;
  saturation?: number;
  grayscale?: number;
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
  | [number, number, number, number];

export interface Animation {
  type: AnimationType;
  duration: number;
  delay?: number;
  easing?: EasingFunction;
  iterations?: number | "infinite";
  direction?: "normal" | "reverse" | "alternate";
  stagger?: number;
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
  position: number;
}

export interface LinearGradient {
  type: "linear";
  angle: number;
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

// --- BASE ELEMENT ---
export interface BaseElement {
  id: string;
  type: string;
  name?: string;
  bounds: Bounds;
  zIndex?: number;
  hidden?: boolean;
  locked?: boolean;
  opacity?: number;
  rotation?: number;
  transform?: Transform;
  border?: Border;
  effects?: Effects;
  animation?: Animation;
}

// --- SIZE (for responsive layouts) ---
export interface Size {
  width: Unit;
  height: Unit;
}

// --- PADDING ---
export interface Padding {
  top: Unit;
  right: Unit;
  bottom: Unit;
  left: Unit;
}

// --- ALIGNMENT ---
export type Alignment =
  | "start"
  | "center"
  | "end"
  | "stretch"
  | "space-between"
  | "space-around";
export type VerticalAlignment = "top" | "middle" | "bottom";

// --- ANIMATION EASING (alias) ---
export type AnimationEasing = EasingFunction;
