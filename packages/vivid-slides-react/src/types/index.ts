// ============================================================================
// TYPE EXPORTS
// ============================================================================

// Primitives
export * from "./primitives";

// Elements
export * from "./elements";

// Presentation & Slides
export * from "./presentation";

// Theme
export * from "./theme";

// Streaming
export * from "./streaming";

// Errors
export * from "./errors";

// --- TYPE GUARDS ---
import type { SlideElement } from "./elements";

export const isTextElement = (
  el: SlideElement
): el is import("./elements").TextElement => el.type === "text";

export const isImageElement = (
  el: SlideElement
): el is import("./elements").ImageElement => el.type === "image";

export const isShapeElement = (
  el: SlideElement
): el is import("./elements").ShapeElement => el.type === "shape";

export const isChartElement = (
  el: SlideElement
): el is import("./elements").ChartElement => el.type === "chart";

export const isTableElement = (
  el: SlideElement
): el is import("./elements").TableElement => el.type === "table";

export const isListElement = (
  el: SlideElement
): el is import("./elements").ListElement => el.type === "list";

export const isCodeElement = (
  el: SlideElement
): el is import("./elements").CodeElement => el.type === "code";

export const isIconElement = (
  el: SlideElement
): el is import("./elements").IconElement => el.type === "icon";

export const isDividerElement = (
  el: SlideElement
): el is import("./elements").DividerElement => el.type === "divider";

export const isCalloutElement = (
  el: SlideElement
): el is import("./elements").CalloutElement => el.type === "callout";

export const isProgressElement = (
  el: SlideElement
): el is import("./elements").ProgressElement => el.type === "progress";

export const isMetricElement = (
  el: SlideElement
): el is import("./elements").MetricElement => el.type === "metric";

export const isGroupElement = (
  el: SlideElement
): el is import("./elements").GroupElement => el.type === "group";

export const isTimelineElement = (
  el: SlideElement
): el is import("./elements").TimelineElement => el.type === "timeline";

export const isVideoElement = (
  el: SlideElement
): el is import("./elements").VideoElement => el.type === "video";

export const isEmbedElement = (
  el: SlideElement
): el is import("./elements").EmbedElement => el.type === "embed";

export const isLineElement = (
  el: SlideElement
): el is import("./elements").LineElement => el.type === "line";
