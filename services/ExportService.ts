/**
 * Export Service v2 - Production-grade PPTX and PDF export
 * Properly handles all element types with correct formatting
 */

import pptxgen from "pptxgenjs";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import type {
  Presentation,
  Slide,
  SlideElement,
  PresentationTheme,
  TextElement,
  ListElement,
  MetricElement,
  CalloutElement,
  ChartElement,
  TableElement,
  CodeElement,
  ProgressElement,
  DividerElement,
} from "../types/slide-schema";

// Conversion constants
const SLIDE_WIDTH_PX = 960;
const SLIDE_HEIGHT_PX = 540;
const PPTX_WIDTH_IN = 10; // inches (16:9)
const PPTX_HEIGHT_IN = 5.625; // inches

// Helper to convert pixels to inches
const toInches = (px: number, isWidth: boolean = true): number => {
  const ratio = isWidth
    ? PPTX_WIDTH_IN / SLIDE_WIDTH_PX
    : PPTX_HEIGHT_IN / SLIDE_HEIGHT_PX;
  return px * ratio;
};

// Convert hex color to PPTX format (without #)
const formatColor = (hex: string): string => {
  if (!hex) return "FFFFFF";
  return hex.replace("#", "").toUpperCase();
};

// Strip HTML tags and decode entities
const stripHtml = (html: string): string => {
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
 * Export presentation to PPTX format
 */
export async function exportToPptx(
  presentation: Presentation,
  filename?: string
): Promise<void> {
  const pptx = new pptxgen();

  // Set presentation metadata
  pptx.author = presentation.metadata.author || "Vivid AI";
  pptx.title = presentation.metadata.title;
  pptx.subject = presentation.metadata.description || "";
  pptx.company = "Vivid Presentations";

  // Set slide size (16:9)
  pptx.defineLayout({
    name: "CUSTOM_16x9",
    width: PPTX_WIDTH_IN,
    height: PPTX_HEIGHT_IN,
  });
  pptx.layout = "CUSTOM_16x9";

  const theme = presentation.theme;

  // Process each slide
  for (const slide of presentation.slides) {
    const pptxSlide = pptx.addSlide();

    // Apply background
    renderBackground(pptxSlide, slide, theme);

    // Render each element
    for (const element of slide.elements) {
      renderElement(pptxSlide, element, theme);
    }
  }

  // Generate and download
  const finalFilename =
    filename || sanitizeFilename(presentation.metadata.title);
  await pptx.writeFile({ fileName: `${finalFilename}.pptx` });
}

/**
 * Render slide background
 */
function renderBackground(
  pptxSlide: pptxgen.Slide,
  slide: Slide,
  theme: PresentationTheme
): void {
  const bg = slide.background;

  if (bg.type === "solid" && bg.color) {
    pptxSlide.background = { color: formatColor(bg.color) };
  } else if (bg.type === "gradient" && bg.gradient?.stops?.length >= 2) {
    // Use gradient - pptxgenjs does support this
    const stops = bg.gradient.stops;
    pptxSlide.background = {
      color: formatColor(stops[0].color),
    };
  } else {
    pptxSlide.background = { color: formatColor(theme.colors.background) };
  }
}

/**
 * Render element to PPTX slide
 */
function renderElement(
  pptxSlide: pptxgen.Slide,
  element: SlideElement,
  theme: PresentationTheme
): void {
  const { bounds } = element;

  // Convert bounds to inches
  const pos = {
    x: toInches(bounds.x, true),
    y: toInches(bounds.y, false),
    w: toInches(bounds.width, true),
    h: toInches(bounds.height, false),
  };

  switch (element.type) {
    case "text":
      renderTextElement(pptxSlide, element as TextElement, theme, pos);
      break;
    case "list":
      renderListElement(pptxSlide, element as ListElement, theme, pos);
      break;
    case "metric":
      renderMetricElement(pptxSlide, element as MetricElement, theme, pos);
      break;
    case "callout":
      renderCalloutElement(pptxSlide, element as CalloutElement, theme, pos);
      break;
    case "chart":
      renderChartElement(pptxSlide, element as ChartElement, theme, pos);
      break;
    case "table":
      renderTableElement(pptxSlide, element as TableElement, theme, pos);
      break;
    case "code":
      renderCodeElement(pptxSlide, element as CodeElement, theme, pos);
      break;
    case "progress":
      renderProgressElement(pptxSlide, element as ProgressElement, theme, pos);
      break;
    case "divider":
      renderDividerElement(pptxSlide, element as DividerElement, theme, pos);
      break;
  }
}

/**
 * Text Element
 */
function renderTextElement(
  slide: pptxgen.Slide,
  element: TextElement,
  theme: PresentationTheme,
  pos: { x: number; y: number; w: number; h: number }
): void {
  const style = element.textStyle || {};
  const semantic = element.semanticStyle || "body";

  // Font size based on semantic style
  const fontSizes: Record<string, number> = {
    h1: 44,
    h2: 32,
    h3: 24,
    body: 18,
    caption: 14,
  };

  const fontSize = style.fontSize || fontSizes[semantic] || 18;
  const color = style.color || theme.colors.text.primary;
  const isBold = semantic === "h1" || semantic === "h2";
  const fontFace =
    semantic === "h1" || semantic === "h2" || semantic === "h3"
      ? theme.typography.headingFont
      : theme.typography.bodyFont;

  // Clean text content
  const text = stripHtml(element.content);

  slide.addText(text, {
    x: pos.x,
    y: pos.y,
    w: pos.w,
    h: pos.h,
    fontSize,
    fontFace: fontFace || "Arial",
    color: formatColor(color),
    bold: isBold,
    align: (style.textAlign as "left" | "center" | "right") || "left",
    valign: "top",
    wrap: true,
    autoFit: true,
  });
}

/**
 * List Element
 */
function renderListElement(
  slide: pptxgen.Slide,
  element: ListElement,
  theme: PresentationTheme,
  pos: { x: number; y: number; w: number; h: number }
): void {
  const style = element.textStyle || {};
  const fontSize = style.fontSize || 16;
  const color = style.color || theme.colors.text.primary;
  const spacing = element.spacing || 12;

  // Build text items
  const textProps: pptxgen.TextProps[] = element.items.map((item, idx) => {
    let bulletPrefix = "";

    if (element.listType === "numbered") {
      bulletPrefix = `${idx + 1}. `;
    } else if (element.listType === "checklist") {
      bulletPrefix = item.checked ? "✓ " : "○ ";
    } else if (element.listType === "icon" && item.icon) {
      bulletPrefix = `${item.icon} `;
    }

    const isBullet = element.listType === "bullet";

    return {
      text: isBullet ? item.content : `${bulletPrefix}${item.content}`,
      options: {
        fontSize,
        fontFace: theme.typography.bodyFont || "Arial",
        color: formatColor(color),
        bullet: isBullet ? { type: "bullet" } : false,
        paraSpaceAfter: spacing,
        breakLine: true,
      },
    };
  });

  slide.addText(textProps, {
    x: pos.x,
    y: pos.y,
    w: pos.w,
    h: pos.h,
    valign: "top",
    autoFit: true,
  });
}

/**
 * Metric Element (KPI Cards)
 */
function renderMetricElement(
  slide: pptxgen.Slide,
  element: MetricElement,
  theme: PresentationTheme,
  pos: { x: number; y: number; w: number; h: number }
): void {
  const valueStyle = element.valueStyle || {};
  const valueColor = valueStyle.color || theme.colors.primary;
  const valueFontSize = valueStyle.fontSize || 48;

  // Background card
  if (element.fill) {
    const bgColor =
      element.fill.type === "solid" ? element.fill.color : theme.colors.surface;

    slide.addShape("roundRect", {
      x: pos.x,
      y: pos.y,
      w: pos.w,
      h: pos.h,
      fill: { color: formatColor(bgColor) },
      line: { color: formatColor(bgColor), width: 0 },
      rectRadius: 0.1,
    });
  }

  // Main value - centered in upper portion
  slide.addText(element.value, {
    x: pos.x,
    y: pos.y + pos.h * 0.15,
    w: pos.w,
    h: pos.h * 0.45,
    fontSize: valueFontSize,
    fontFace: theme.typography.headingFont || "Arial",
    color: formatColor(valueColor),
    bold: true,
    align: "center",
    valign: "middle",
  });

  // Label - below value
  slide.addText(element.label, {
    x: pos.x + 0.1,
    y: pos.y + pos.h * 0.55,
    w: pos.w - 0.2,
    h: pos.h * 0.25,
    fontSize: 13,
    fontFace: theme.typography.bodyFont || "Arial",
    color: formatColor(theme.colors.text.secondary),
    align: "center",
    valign: "top",
    wrap: true,
    autoFit: true,
  });

  // Change indicator
  if (element.change) {
    const changeColor =
      element.change.direction === "up"
        ? theme.colors.success
        : element.change.direction === "down"
        ? theme.colors.error
        : theme.colors.text.muted;

    const arrow =
      element.change.direction === "up"
        ? "▲ "
        : element.change.direction === "down"
        ? "▼ "
        : "";

    const changeText = `${arrow}${element.change.value}${
      element.change.label ? ` ${element.change.label}` : ""
    }`;

    slide.addText(changeText, {
      x: pos.x,
      y: pos.y + pos.h * 0.8,
      w: pos.w,
      h: pos.h * 0.15,
      fontSize: 11,
      fontFace: theme.typography.bodyFont || "Arial",
      color: formatColor(changeColor),
      align: "center",
      valign: "top",
    });
  }
}

/**
 * Callout Element (Info boxes, quotes, etc.)
 */
function renderCalloutElement(
  slide: pptxgen.Slide,
  element: CalloutElement,
  theme: PresentationTheme,
  pos: { x: number; y: number; w: number; h: number }
): void {
  // Variant colors and icons
  const variants: Record<
    string,
    { color: string; icon: string; bgOpacity: string }
  > = {
    info: { color: theme.colors.info, icon: "i", bgOpacity: "1E293B" },
    success: { color: theme.colors.success, icon: "✓", bgOpacity: "1E293B" },
    warning: { color: theme.colors.warning, icon: "!", bgOpacity: "1E293B" },
    error: { color: theme.colors.error, icon: "x", bgOpacity: "1E293B" },
    tip: { color: theme.colors.accent, icon: "*", bgOpacity: "1E293B" },
    quote: { color: theme.colors.primary, icon: '"', bgOpacity: "1E293B" },
  };

  const variant = variants[element.variant] || variants.info;
  const isQuote = element.variant === "quote";

  // Background with rounded corners
  slide.addShape("roundRect", {
    x: pos.x,
    y: pos.y,
    w: pos.w,
    h: pos.h,
    fill: { color: variant.bgOpacity },
    line: { color: formatColor(variant.color), width: 1.5 },
    rectRadius: 0.08,
  });

  // Left accent bar for non-quote callouts
  if (!isQuote) {
    slide.addShape("rect", {
      x: pos.x,
      y: pos.y,
      w: 0.05,
      h: pos.h,
      fill: { color: formatColor(variant.color) },
      line: { width: 0 },
    });
  }

  // Icon circle for non-quote
  if (!isQuote) {
    slide.addShape("ellipse", {
      x: pos.x + 0.15,
      y: pos.y + 0.15,
      w: 0.28,
      h: 0.28,
      fill: { color: formatColor(variant.color) },
      line: { width: 0 },
    });

    // Icon text
    slide.addText(variant.icon, {
      x: pos.x + 0.15,
      y: pos.y + 0.15,
      w: 0.28,
      h: 0.28,
      fontSize: 11,
      fontFace: "Arial",
      color: "FFFFFF",
      bold: true,
      align: "center",
      valign: "middle",
    });
  }

  // Content text
  const contentText = stripHtml(element.content);
  const textX = isQuote ? pos.x + 0.2 : pos.x + 0.55;
  const textW = isQuote ? pos.w - 0.4 : pos.w - 0.7;
  const textH = isQuote && element.author ? pos.h - 0.5 : pos.h - 0.3;

  slide.addText(contentText, {
    x: textX,
    y: pos.y + 0.15,
    w: textW,
    h: textH,
    fontSize: isQuote ? 14 : 13,
    fontFace: theme.typography.bodyFont || "Arial",
    color: formatColor(theme.colors.text.primary),
    italic: isQuote,
    valign: isQuote ? "middle" : "top",
    wrap: true,
    autoFit: true,
  });

  // Quote author
  if (isQuote && element.author) {
    const authorText = `- ${element.author}${
      element.authorTitle ? `, ${element.authorTitle}` : ""
    }`;
    slide.addText(authorText, {
      x: textX,
      y: pos.y + pos.h - 0.35,
      w: textW,
      h: 0.25,
      fontSize: 11,
      fontFace: theme.typography.bodyFont || "Arial",
      color: formatColor(theme.colors.text.muted),
      align: "right",
      valign: "bottom",
    });
  }
}

/**
 * Chart Element
 */
function renderChartElement(
  slide: pptxgen.Slide,
  element: ChartElement,
  theme: PresentationTheme,
  pos: { x: number; y: number; w: number; h: number }
): void {
  const chartTypes: Record<string, pptxgen.CHART_NAME> = {
    bar: "bar",
    line: "line",
    pie: "pie",
    donut: "doughnut",
    area: "area",
  };

  const chartType = chartTypes[element.chartType] || "bar";

  // Transform data
  const chartData = element.data.datasets.map((ds) => ({
    name: ds.label,
    labels: element.data.labels,
    values: ds.data,
  }));

  const chartColors = element.data.datasets.map((ds) =>
    formatColor(ds.color || theme.colors.primary)
  );

  try {
    slide.addChart(chartType, chartData, {
      x: pos.x,
      y: pos.y,
      w: pos.w,
      h: pos.h,
      showLegend: element.options?.showLegend ?? false,
      legendPos: "b",
      showTitle: false,
      chartColors,
      barDir: "bar",
      barGapWidthPct: 50,
      valAxisHidden: !element.options?.showGrid,
      catAxisHidden: false,
      catAxisLabelColor: formatColor(theme.colors.text.secondary),
      valAxisLabelColor: formatColor(theme.colors.text.secondary),
      catGridLine: { style: "none" },
      valGridLine: element.options?.showGrid
        ? { color: "3F3F3F", style: "solid", size: 0.5 }
        : { style: "none" },
    });
  } catch (e) {
    // Fallback: render as placeholder
    slide.addShape("rect", {
      ...pos,
      fill: { color: formatColor(theme.colors.surface) },
      line: { color: formatColor(theme.colors.text.muted), width: 1 },
    });
    slide.addText(`[${element.chartType} Chart]`, {
      ...pos,
      fontSize: 14,
      color: formatColor(theme.colors.text.muted),
      align: "center",
      valign: "middle",
    });
  }
}

/**
 * Table Element
 */
function renderTableElement(
  slide: pptxgen.Slide,
  element: TableElement,
  theme: PresentationTheme,
  pos: { x: number; y: number; w: number; h: number }
): void {
  const rows: pptxgen.TableRow[] = [];

  // Header row
  if (element.headers?.cells) {
    const headerFill =
      element.style?.headerFill?.type === "solid"
        ? element.style.headerFill.color
        : theme.colors.primary;

    const headerRow: pptxgen.TableCell[] = element.headers.cells.map(
      (cell) => ({
        text: cell.content,
        options: {
          bold: true,
          fill: { color: formatColor(headerFill) },
          color: formatColor(theme.colors.text.inverse),
          fontSize: 12,
          fontFace: theme.typography.bodyFont || "Arial",
          align: "center" as const,
          valign: "middle" as const,
        },
      })
    );
    rows.push(headerRow);
  }

  // Data rows
  const altRowFill =
    element.style?.alternateRowFill?.type === "solid"
      ? element.style.alternateRowFill.color
      : theme.colors.surface;

  element.rows.forEach((row, idx) => {
    const rowFill = idx % 2 === 1 ? altRowFill : theme.colors.background;

    const dataRow: pptxgen.TableCell[] = row.cells.map((cell) => ({
      text: cell.content,
      options: {
        fill: { color: formatColor(rowFill) },
        color: formatColor(theme.colors.text.primary),
        fontSize: 11,
        fontFace: theme.typography.bodyFont || "Arial",
        valign: "middle" as const,
      },
    }));
    rows.push(dataRow);
  });

  slide.addTable(rows, {
    x: pos.x,
    y: pos.y,
    w: pos.w,
    h: pos.h,
    fontFace: theme.typography.bodyFont || "Arial",
    border: {
      type: "solid",
      color: formatColor(element.style?.borderColor || "333333"),
      pt: 0.5,
    },
    colW: Array(element.headers?.cells?.length || 3).fill(
      pos.w / (element.headers?.cells?.length || 3)
    ),
    autoPage: false,
    autoPageRepeatHeader: false,
  });
}

/**
 * Code Element
 */
function renderCodeElement(
  slide: pptxgen.Slide,
  element: CodeElement,
  theme: PresentationTheme,
  pos: { x: number; y: number; w: number; h: number }
): void {
  // Dark background
  slide.addShape("roundRect", {
    x: pos.x,
    y: pos.y,
    w: pos.w,
    h: pos.h,
    fill: { color: "1E1E1E" },
    line: { color: "3C3C3C", width: 1 },
    rectRadius: 0.05,
  });

  // Language badge
  if (element.language) {
    slide.addShape("roundRect", {
      x: pos.x + pos.w - 0.8,
      y: pos.y + 0.08,
      w: 0.7,
      h: 0.22,
      fill: { color: "3C3C3C" },
      line: { width: 0 },
      rectRadius: 0.03,
    });

    slide.addText(element.language, {
      x: pos.x + pos.w - 0.8,
      y: pos.y + 0.08,
      w: 0.7,
      h: 0.22,
      fontSize: 9,
      fontFace: theme.typography.codeFont || "Consolas",
      color: "9D9D9D",
      align: "center",
      valign: "middle",
    });
  }

  // Code content
  slide.addText(element.code, {
    x: pos.x + 0.15,
    y: pos.y + 0.15,
    w: pos.w - 0.3,
    h: pos.h - 0.3,
    fontSize: element.fontSize || 11,
    fontFace: theme.typography.codeFont || "Consolas",
    color: "D4D4D4",
    valign: "top",
    wrap: true,
    autoFit: true,
  });
}

/**
 * Progress Element
 */
function renderProgressElement(
  slide: pptxgen.Slide,
  element: ProgressElement,
  theme: PresentationTheme,
  pos: { x: number; y: number; w: number; h: number }
): void {
  const colors = element.colors || {
    track: theme.colors.surface,
    fill: theme.colors.primary,
    text: theme.colors.text.primary,
  };

  const value = Math.min(Math.max(element.value, 0), 100);

  if (element.variant === "bar" || !element.variant) {
    const barHeight = 0.15;
    const barY = pos.y + pos.h * 0.4;

    // Track
    slide.addShape("roundRect", {
      x: pos.x,
      y: barY,
      w: pos.w,
      h: barHeight,
      fill: { color: formatColor(colors.track) },
      line: { width: 0 },
      rectRadius: 0.05,
    });

    // Fill
    if (value > 0) {
      slide.addShape("roundRect", {
        x: pos.x,
        y: barY,
        w: pos.w * (value / 100),
        h: barHeight,
        fill: { color: formatColor(colors.fill) },
        line: { width: 0 },
        rectRadius: 0.05,
      });
    }

    // Label
    if (element.label) {
      slide.addText(element.label, {
        x: pos.x,
        y: pos.y,
        w: pos.w,
        h: pos.h * 0.35,
        fontSize: 12,
        fontFace: theme.typography.bodyFont || "Arial",
        color: formatColor(colors.text),
        valign: "bottom",
      });
    }

    // Value
    if (element.showValue) {
      slide.addText(`${value}%`, {
        x: pos.x,
        y: barY + barHeight + 0.05,
        w: pos.w,
        h: pos.h * 0.2,
        fontSize: 14,
        fontFace: theme.typography.bodyFont || "Arial",
        color: formatColor(colors.fill),
        bold: true,
        align: "right",
      });
    }
  } else {
    // Circle variant - simplified representation
    slide.addText(`${value}%`, {
      x: pos.x,
      y: pos.y,
      w: pos.w,
      h: pos.h * 0.7,
      fontSize: 32,
      fontFace: theme.typography.headingFont || "Arial",
      color: formatColor(colors.fill),
      bold: true,
      align: "center",
      valign: "middle",
    });

    if (element.label) {
      slide.addText(element.label, {
        x: pos.x,
        y: pos.y + pos.h * 0.65,
        w: pos.w,
        h: pos.h * 0.3,
        fontSize: 12,
        fontFace: theme.typography.bodyFont || "Arial",
        color: formatColor(colors.text),
        align: "center",
        valign: "top",
      });
    }
  }
}

/**
 * Divider Element
 */
function renderDividerElement(
  slide: pptxgen.Slide,
  element: DividerElement,
  theme: PresentationTheme,
  pos: { x: number; y: number; w: number; h: number }
): void {
  let color = theme.colors.text.muted;

  if (element.style === "gradient" && element.gradient?.stops?.length) {
    color = element.gradient.stops[0].color;
  } else if (element.color) {
    color = element.color;
  }

  slide.addShape("rect", {
    x: pos.x,
    y: pos.y,
    w: pos.w,
    h: Math.max(pos.h, 0.03),
    fill: { color: formatColor(color) },
    line: { width: 0 },
  });
}

// ============================================================================
// PDF EXPORT - Using HTML2Canvas for pixel-perfect rendering
// ============================================================================

/**
 * Export to PDF by capturing rendered slides from DOM
 */
export async function exportToPdf(
  presentation: Presentation,
  slideElements: HTMLElement[],
  filename?: string
): Promise<void> {
  if (!slideElements || slideElements.length === 0) {
    console.warn("No slide elements provided, using schema-based PDF export");
    await exportToPdfFromSchema(presentation, filename);
    return;
  }

  const pdf = new jsPDF({
    orientation: "landscape",
    unit: "px",
    format: [SLIDE_WIDTH_PX, SLIDE_HEIGHT_PX],
    compress: true,
  });

  for (let i = 0; i < slideElements.length; i++) {
    const slideEl = slideElements[i];

    try {
      // Clone the element to ensure it's in a visible position for capture
      const clone = slideEl.cloneNode(true) as HTMLElement;
      clone.style.position = "fixed";
      clone.style.left = "0";
      clone.style.top = "0";
      clone.style.width = `${SLIDE_WIDTH_PX}px`;
      clone.style.height = `${SLIDE_HEIGHT_PX}px`;
      clone.style.zIndex = "-9999";
      clone.style.opacity = "1";
      clone.style.transform = "none";
      clone.style.overflow = "hidden";
      document.body.appendChild(clone);

      // Wait for fonts and images to load
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Capture with high quality
      const canvas = await html2canvas(clone, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        logging: false,
        imageTimeout: 15000,
        width: SLIDE_WIDTH_PX,
        height: SLIDE_HEIGHT_PX,
      });

      // Remove clone
      document.body.removeChild(clone);

      if (i > 0) {
        pdf.addPage([SLIDE_WIDTH_PX, SLIDE_HEIGHT_PX], "landscape");
      }

      const imgData = canvas.toDataURL("image/png", 1.0);
      pdf.addImage(imgData, "PNG", 0, 0, SLIDE_WIDTH_PX, SLIDE_HEIGHT_PX);
    } catch (error) {
      console.error(`Failed to capture slide ${i + 1}:`, error);
    }
  }

  const finalFilename =
    filename || sanitizeFilename(presentation.metadata.title);
  pdf.save(`${finalFilename}.pdf`);
}

/**
 * Export to PDF directly from schema (without DOM)
 * This is a fallback and won't be as accurate as DOM capture
 */
export async function exportToPdfFromSchema(
  presentation: Presentation,
  filename?: string
): Promise<void> {
  const pdf = new jsPDF({
    orientation: "landscape",
    unit: "px",
    format: [SLIDE_WIDTH_PX, SLIDE_HEIGHT_PX],
  });

  const theme = presentation.theme;

  for (let i = 0; i < presentation.slides.length; i++) {
    const slide = presentation.slides[i];

    if (i > 0) {
      pdf.addPage([SLIDE_WIDTH_PX, SLIDE_HEIGHT_PX], "landscape");
    }

    // Background
    let bgColor = theme.colors.background;
    if (slide.background.type === "solid" && slide.background.color) {
      bgColor = slide.background.color;
    } else if (
      slide.background.type === "gradient" &&
      slide.background.gradient?.stops?.[0]
    ) {
      bgColor = slide.background.gradient.stops[0].color;
    }

    pdf.setFillColor(bgColor);
    pdf.rect(0, 0, SLIDE_WIDTH_PX, SLIDE_HEIGHT_PX, "F");

    // Render elements
    for (const element of slide.elements) {
      renderElementToPdf(pdf, element, theme);
    }
  }

  const finalFilename =
    filename || sanitizeFilename(presentation.metadata.title);
  pdf.save(`${finalFilename}.pdf`);
}

/**
 * Render element to PDF
 */
function renderElementToPdf(
  pdf: jsPDF,
  element: SlideElement,
  theme: PresentationTheme
): void {
  const { bounds } = element;

  switch (element.type) {
    case "text": {
      const el = element as TextElement;
      const semantic = el.semanticStyle || "body";
      const fontSizes: Record<string, number> = {
        h1: 44,
        h2: 32,
        h3: 24,
        body: 18,
        caption: 14,
      };
      const fontSize = el.textStyle?.fontSize || fontSizes[semantic] || 18;
      const color = el.textStyle?.color || theme.colors.text.primary;

      pdf.setFontSize(fontSize);
      pdf.setTextColor(color);

      const text = stripHtml(el.content);
      const align = el.textStyle?.textAlign || "left";

      let x = bounds.x;
      if (align === "center") x = bounds.x + bounds.width / 2;
      else if (align === "right") x = bounds.x + bounds.width;

      pdf.text(text, x, bounds.y + fontSize, {
        align: align as "left" | "center" | "right",
        maxWidth: bounds.width,
      });
      break;
    }

    case "metric": {
      const el = element as MetricElement;
      const valueColor = el.valueStyle?.color || theme.colors.primary;
      const valueFontSize = el.valueStyle?.fontSize || 48;

      // Background
      if (el.fill?.type === "solid") {
        pdf.setFillColor(el.fill.color);
        pdf.roundedRect(
          bounds.x,
          bounds.y,
          bounds.width,
          bounds.height,
          8,
          8,
          "F"
        );
      }

      // Value
      pdf.setFontSize(valueFontSize);
      pdf.setTextColor(valueColor);
      pdf.text(
        el.value,
        bounds.x + bounds.width / 2,
        bounds.y + bounds.height * 0.4,
        { align: "center" }
      );

      // Label
      pdf.setFontSize(13);
      pdf.setTextColor(theme.colors.text.secondary);
      pdf.text(
        el.label,
        bounds.x + bounds.width / 2,
        bounds.y + bounds.height * 0.65,
        { align: "center", maxWidth: bounds.width - 20 }
      );
      break;
    }

    case "callout": {
      const el = element as CalloutElement;
      const variantColors: Record<string, string> = {
        info: theme.colors.info,
        success: theme.colors.success,
        warning: theme.colors.warning,
        error: theme.colors.error,
        tip: theme.colors.accent,
        quote: theme.colors.primary,
      };
      const accentColor = variantColors[el.variant] || theme.colors.info;

      // Background
      pdf.setFillColor(theme.colors.surface);
      pdf.roundedRect(
        bounds.x,
        bounds.y,
        bounds.width,
        bounds.height,
        6,
        6,
        "F"
      );

      // Border
      pdf.setDrawColor(accentColor);
      pdf.setLineWidth(2);
      pdf.roundedRect(
        bounds.x,
        bounds.y,
        bounds.width,
        bounds.height,
        6,
        6,
        "S"
      );

      // Content
      pdf.setFontSize(13);
      pdf.setTextColor(theme.colors.text.primary);
      const content = stripHtml(el.content);
      pdf.text(content, bounds.x + 15, bounds.y + 25, {
        maxWidth: bounds.width - 30,
      });

      // Author for quotes
      if (el.variant === "quote" && el.author) {
        pdf.setFontSize(11);
        pdf.setTextColor(theme.colors.text.muted);
        const authorText = `- ${el.author}${
          el.authorTitle ? `, ${el.authorTitle}` : ""
        }`;
        pdf.text(
          authorText,
          bounds.x + bounds.width - 15,
          bounds.y + bounds.height - 15,
          { align: "right" }
        );
      }
      break;
    }

    case "list": {
      const el = element as ListElement;
      const fontSize = el.textStyle?.fontSize || 16;
      const color = el.textStyle?.color || theme.colors.text.primary;
      const spacing = el.spacing || 12;

      pdf.setFontSize(fontSize);
      pdf.setTextColor(color);

      let y = bounds.y + fontSize;
      el.items.forEach((item, idx) => {
        let prefix = "";
        if (el.listType === "bullet") prefix = "• ";
        else if (el.listType === "numbered") prefix = `${idx + 1}. `;
        else if (el.listType === "checklist")
          prefix = item.checked ? "✓ " : "○ ";
        else if (el.listType === "icon" && item.icon) prefix = `${item.icon} `;

        pdf.text(`${prefix}${item.content}`, bounds.x, y, {
          maxWidth: bounds.width,
        });
        y += fontSize + spacing;
      });
      break;
    }
  }
}

// ============================================================================
// UTILITIES
// ============================================================================

/**
 * Sanitize filename
 */
function sanitizeFilename(name: string): string {
  return name
    .replace(/[^a-z0-9\s\-_]/gi, "")
    .replace(/\s+/g, "-")
    .toLowerCase()
    .substring(0, 50);
}

/**
 * Export options
 */
export interface ExportOptions {
  format: "pptx" | "pdf";
  filename?: string;
  quality?: "standard" | "high";
}

/**
 * Main export function
 */
export async function exportPresentation(
  presentation: Presentation,
  options: ExportOptions,
  slideElements?: HTMLElement[]
): Promise<void> {
  const filename = options.filename || presentation.metadata.title;

  if (options.format === "pptx") {
    await exportToPptx(presentation, filename);
  } else if (options.format === "pdf") {
    if (slideElements && slideElements.length > 0) {
      await exportToPdf(presentation, slideElements, filename);
    } else {
      await exportToPdfFromSchema(presentation, filename);
    }
  }
}
