// Re-export all types from slide schema
export * from "./slide-schema";

// Utility type guards
import type {
  SlideElement,
  TextElement,
  ImageElement,
  ShapeElement,
  IconElement,
  LineElement,
  ChartElement,
  TableElement,
  VideoElement,
  EmbedElement,
  CodeElement,
  ListElement,
  DividerElement,
  CalloutElement,
  ProgressElement,
  MetricElement,
  TimelineElement,
  GroupElement,
} from "./slide-schema";

export const isTextElement = (el: SlideElement): el is TextElement =>
  el.type === "text";
export const isImageElement = (el: SlideElement): el is ImageElement =>
  el.type === "image";
export const isShapeElement = (el: SlideElement): el is ShapeElement =>
  el.type === "shape";
export const isIconElement = (el: SlideElement): el is IconElement =>
  el.type === "icon";
export const isLineElement = (el: SlideElement): el is LineElement =>
  el.type === "line";
export const isChartElement = (el: SlideElement): el is ChartElement =>
  el.type === "chart";
export const isTableElement = (el: SlideElement): el is TableElement =>
  el.type === "table";
export const isVideoElement = (el: SlideElement): el is VideoElement =>
  el.type === "video";
export const isEmbedElement = (el: SlideElement): el is EmbedElement =>
  el.type === "embed";
export const isCodeElement = (el: SlideElement): el is CodeElement =>
  el.type === "code";
export const isListElement = (el: SlideElement): el is ListElement =>
  el.type === "list";
export const isDividerElement = (el: SlideElement): el is DividerElement =>
  el.type === "divider";
export const isCalloutElement = (el: SlideElement): el is CalloutElement =>
  el.type === "callout";
export const isProgressElement = (el: SlideElement): el is ProgressElement =>
  el.type === "progress";
export const isMetricElement = (el: SlideElement): el is MetricElement =>
  el.type === "metric";
export const isTimelineElement = (el: SlideElement): el is TimelineElement =>
  el.type === "timeline";
export const isGroupElement = (el: SlideElement): el is GroupElement =>
  el.type === "group";
