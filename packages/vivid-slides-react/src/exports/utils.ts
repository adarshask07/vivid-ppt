/**
 * Export Utilities
 * Shared helper functions for PDF and PPTX export
 */

// Conversion constants
export const SLIDE_WIDTH_PX = 960;
export const SLIDE_HEIGHT_PX = 540;
export const PPTX_WIDTH_IN = 10; // inches (16:9)
export const PPTX_HEIGHT_IN = 5.625; // inches

/**
 * Convert pixels to inches for PPTX
 */
export const toInches = (px: number, isWidth: boolean = true): number => {
  const ratio = isWidth
    ? PPTX_WIDTH_IN / SLIDE_WIDTH_PX
    : PPTX_HEIGHT_IN / SLIDE_HEIGHT_PX;
  return px * ratio;
};

/**
 * Convert hex color to PPTX format (without #)
 */
export const formatColor = (hex: string): string => {
  if (!hex) return "FFFFFF";
  return hex.replace("#", "").toUpperCase();
};

/**
 * Strip HTML tags and decode entities
 */
export const stripHtml = (html: string): string => {
  if (!html) return "";
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
};

/**
 * Sanitize filename for saving
 */
export const sanitizeFilename = (name: string): string => {
  return name
    .replace(/[^a-z0-9\s\-_]/gi, "")
    .replace(/\s+/g, "-")
    .toLowerCase()
    .substring(0, 50);
};
