/**
 * @darshio/vivid - Export Services
 * Built-in exporters for PDF, PPTX, PNG, and JSON formats
 */

// PDF Exporter
export {
  exportToPdf,
  exportToPdfBlob,
  type PdfExportOptions,
} from "./PdfExporter";

// PPTX Exporter
export {
  exportToPptx,
  exportToPptxBlob,
  type PptxExportOptions,
} from "./PptxExporter";

// PNG Exporter
export {
  exportToPng,
  exportToPngBlob,
  type PngExportOptions,
} from "./PngExporter";

// Utilities
export {
  sanitizeFilename,
  stripHtml,
  formatColor,
  toInches,
  SLIDE_WIDTH_PX,
  SLIDE_HEIGHT_PX,
  PPTX_WIDTH_IN,
  PPTX_HEIGHT_IN,
} from "./utils";

// Re-export types needed for exporters
export type { Presentation, Slide } from "../types";
