// ============================================================================
// @darshio/vivid - MAIN ENTRY POINT
// ============================================================================
// A production-grade React library for rendering AI-generated presentations
// ============================================================================

// --- CONTEXT & PROVIDER ---
export {
  VividProvider,
  useVividContext,
  type VividContextValue,
  type VividProviderProps,
} from "./context";

// --- COMPONENTS ---
export {
  // Core components
  SlideRenderer,
  SlideViewer,
  SlideRail,
  ExportButton,
  StreamingIndicator,
  // Constants
  SLIDE_WIDTH,
  SLIDE_HEIGHT,
  // Component types
  type SlideRendererProps,
  type SlideViewerProps,
  type SlideRailProps,
  type ExportButtonProps,
  type StreamingIndicatorProps,
  // Element components (for advanced usage)
  TextElement,
  ImageElement,
  ShapeElement,
  ChartElement,
  TableElement,
  ListElement,
  MetricElement,
  ProgressElement,
  CalloutElement,
  DividerElement,
  IconElement,
  CodeElement,
} from "./components";

// --- HOOKS ---
export {
  useVivid,
  useSlideNavigation,
  useTheme,
  useKeyboardNavigation,
  useSlideStream,
  // Hook types
  type SlideNavigationResult,
  type ThemeResult,
  type KeyboardNavigationOptions,
  type UseSlideStreamOptions,
  type SlideStreamResult,
} from "./hooks";

// --- TYPES ---
export type {
  // Primitives
  Unit,
  Color,
  Position,
  Bounds,
  Dimensions,
  Size,
  Padding,
  Alignment,
  VerticalAlignment,
  VerticalAlign,
  TextAlign,
  TextStyle,
  Fill,
  GradientStop,
  LinearGradient,
  RadialGradient,
  Gradient,
  Effects,
  Border,
  Transform,
  Animation,
  AnimationType,
  AnimationEasing,
  EasingFunction,
  BaseElement,
  // Elements
  TextElement as TextElementType,
  ImageElement as ImageElementType,
  ShapeElement as ShapeElementType,
  IconElement as IconElementType,
  ChartElement as ChartElementType,
  TableElement as TableElementType,
  ListElement as ListElementType,
  MetricElement as MetricElementType,
  ProgressElement as ProgressElementType,
  CalloutElement as CalloutElementType,
  DividerElement as DividerElementType,
  CodeElement as CodeElementType,
  GroupElement,
  EmbedElement,
  VideoElement,
  SlideElement,
  // Presentation
  SlideBackground,
  SlideTransition,
  Slide,
  Presentation,
  PresentationMetadata,
  PresentationTheme,
  Theme,
  // Design System
  DesignSystem,
  // Streaming
  StreamingStatus,
  StreamingState,
  GenerationEvent,
  SlideEvent,
  ProgressEvent,
  CompleteEvent,
  ErrorEvent,
  MetadataEvent,
  // Errors
  VividErrorCode,
} from "./types";

// Export error classes
export { VividError, ParseError, RenderError, ExportError } from "./types";

// --- UTILITIES ---
export {
  cn,
  resolveColor,
  fillToCSS,
  effectsToCSS,
  borderToCSS,
  transformToCSS,
  getAnimationConfig,
  getBaseElementStyles,
} from "./utils";

// --- EXPORT SERVICES ---
export {
  // PDF Export
  exportToPdf,
  exportToPdfBlob,
  type PdfExportOptions,
  // PPTX Export
  exportToPptx,
  exportToPptxBlob,
  type PptxExportOptions,
  // PNG Export
  exportToPng,
  exportToPngBlob,
  type PngExportOptions,
  // Utilities
  sanitizeFilename,
  stripHtml,
  formatColor,
  toInches,
  SLIDE_WIDTH_PX,
  SLIDE_HEIGHT_PX,
  PPTX_WIDTH_IN,
  PPTX_HEIGHT_IN,
} from "./exports";
