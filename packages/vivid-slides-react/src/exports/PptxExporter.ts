/**
 * PPTX Exporter - Export presentation to PowerPoint format
 * Uses pptxgenjs for native PPTX generation
 */

import pptxgen from "pptxgenjs";
import {
  toInches,
  formatColor,
  stripHtml,
  sanitizeFilename,
  PPTX_WIDTH_IN,
  PPTX_HEIGHT_IN,
} from "./utils";
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
} from "../types";

export interface PptxExportOptions {
  /** Output filename (without extension) */
  filename?: string;
  /** Author name */
  author?: string;
  /** Company name */
  company?: string;
}

/**
 * Export presentation to PPTX and return as Blob
 */
export async function exportToPptxBlob(
  presentation: Presentation,
  slides: Slide[],
  options: PptxExportOptions = {}
): Promise<Blob> {
  const pptx = new pptxgen();

  // Set presentation metadata
  pptx.author = options.author || presentation.metadata?.author || "Vivid AI";
  pptx.title = presentation.metadata?.title || "Presentation";
  pptx.subject = presentation.metadata?.description || "";
  pptx.company = options.company || "Vivid Presentations";

  // Set slide size (16:9)
  pptx.defineLayout({
    name: "CUSTOM_16x9",
    width: PPTX_WIDTH_IN,
    height: PPTX_HEIGHT_IN,
  });
  pptx.layout = "CUSTOM_16x9";

  const theme = presentation.theme;

  // Process each slide
  for (const slide of slides) {
    const pptxSlide = pptx.addSlide();

    // Apply background
    renderBackground(pptxSlide, slide, theme);

    // Render each element
    for (const element of slide.elements) {
      renderElement(pptxSlide, element, theme);
    }
  }

  // Generate blob
  const data = await pptx.write({ outputType: "blob" });
  return data as Blob;
}

/**
 * Export presentation to PPTX and trigger download
 */
export async function exportToPptx(
  presentation: Presentation,
  slides: Slide[],
  options: PptxExportOptions = {}
): Promise<void> {
  const blob = await exportToPptxBlob(presentation, slides, options);

  const filename =
    options.filename ||
    sanitizeFilename(presentation.metadata?.title || "presentation");

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filename}.pptx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ============================================================================
// ELEMENT RENDERERS
// ============================================================================

function renderBackground(
  pptxSlide: pptxgen.Slide,
  slide: Slide,
  theme: PresentationTheme
): void {
  const bg = slide.background;

  if (bg?.type === "solid" && bg.color) {
    pptxSlide.background = { color: formatColor(bg.color) };
  } else if (
    bg?.type === "gradient" &&
    bg.gradient?.stops &&
    bg.gradient.stops.length >= 2
  ) {
    const stops = bg.gradient.stops;
    pptxSlide.background = { color: formatColor(stops[0].color) };
  } else {
    pptxSlide.background = {
      color: formatColor(theme?.colors?.background || "#0f172a"),
    };
  }
}

function renderElement(
  pptxSlide: pptxgen.Slide,
  element: SlideElement,
  theme: PresentationTheme
): void {
  const { bounds } = element;

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

function renderTextElement(
  slide: pptxgen.Slide,
  element: TextElement,
  theme: PresentationTheme,
  pos: { x: number; y: number; w: number; h: number }
): void {
  const style = element.textStyle || {};
  const semantic = element.semanticStyle || "body";

  const fontSizes: Record<string, number> = {
    h1: 44,
    h2: 32,
    h3: 24,
    body: 18,
    caption: 14,
  };

  const fontSize = style.fontSize || fontSizes[semantic] || 18;
  const color = style.color || theme?.colors?.text?.primary || "#ffffff";
  const isBold = semantic === "h1" || semantic === "h2";
  const fontFace =
    semantic === "h1" || semantic === "h2" || semantic === "h3"
      ? theme?.typography?.headingFont || "Arial"
      : theme?.typography?.bodyFont || "Arial";

  const text = stripHtml(element.content);

  slide.addText(text, {
    x: pos.x,
    y: pos.y,
    w: pos.w,
    h: pos.h,
    fontSize,
    fontFace,
    color: formatColor(color),
    bold: isBold,
    align: (style.textAlign as "left" | "center" | "right") || "left",
    valign: "top",
    wrap: true,
    autoFit: true,
  });
}

function renderListElement(
  slide: pptxgen.Slide,
  element: ListElement,
  theme: PresentationTheme,
  pos: { x: number; y: number; w: number; h: number }
): void {
  const style = element.textStyle || {};
  const fontSize = style.fontSize || 16;
  const color = style.color || theme?.colors?.text?.primary || "#ffffff";
  const spacing = element.spacing || 12;

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
        fontFace: theme?.typography?.bodyFont || "Arial",
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

function renderMetricElement(
  slide: pptxgen.Slide,
  element: MetricElement,
  theme: PresentationTheme,
  pos: { x: number; y: number; w: number; h: number }
): void {
  const valueStyle = element.valueStyle || {};
  const valueColor = valueStyle.color || theme?.colors?.primary || "#3b82f6";
  const valueFontSize = valueStyle.fontSize || 48;

  if (element.fill) {
    const bgColor =
      element.fill.type === "solid"
        ? element.fill.color
        : theme?.colors?.surface || "#1e293b";

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

  slide.addText(element.value, {
    x: pos.x,
    y: pos.y + pos.h * 0.15,
    w: pos.w,
    h: pos.h * 0.45,
    fontSize: valueFontSize,
    fontFace: theme?.typography?.headingFont || "Arial",
    color: formatColor(valueColor),
    bold: true,
    align: "center",
    valign: "middle",
  });

  slide.addText(element.label, {
    x: pos.x + 0.1,
    y: pos.y + pos.h * 0.55,
    w: pos.w - 0.2,
    h: pos.h * 0.25,
    fontSize: 13,
    fontFace: theme?.typography?.bodyFont || "Arial",
    color: formatColor(theme?.colors?.text?.secondary || "#94a3b8"),
    align: "center",
    valign: "top",
    wrap: true,
    autoFit: true,
  });

  if (element.change) {
    const changeColor =
      element.change.direction === "up"
        ? theme?.colors?.success || "#22c55e"
        : element.change.direction === "down"
        ? theme?.colors?.error || "#ef4444"
        : theme?.colors?.text?.muted || "#64748b";

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
      fontFace: theme?.typography?.bodyFont || "Arial",
      color: formatColor(changeColor),
      align: "center",
      valign: "top",
    });
  }
}

function renderCalloutElement(
  slide: pptxgen.Slide,
  element: CalloutElement,
  theme: PresentationTheme,
  pos: { x: number; y: number; w: number; h: number }
): void {
  const variants: Record<string, { color: string; icon: string }> = {
    info: { color: theme?.colors?.info || "#3b82f6", icon: "i" },
    success: { color: theme?.colors?.success || "#22c55e", icon: "✓" },
    warning: { color: theme?.colors?.warning || "#f59e0b", icon: "!" },
    error: { color: theme?.colors?.error || "#ef4444", icon: "x" },
    tip: { color: theme?.colors?.accent || "#8b5cf6", icon: "*" },
    quote: { color: theme?.colors?.primary || "#3b82f6", icon: '"' },
  };

  const variant = variants[element.variant] || variants.info;
  const isQuote = element.variant === "quote";

  slide.addShape("roundRect", {
    x: pos.x,
    y: pos.y,
    w: pos.w,
    h: pos.h,
    fill: { color: "1E293B" },
    line: { color: formatColor(variant.color), width: 1.5 },
    rectRadius: 0.08,
  });

  if (!isQuote) {
    slide.addShape("rect", {
      x: pos.x,
      y: pos.y,
      w: 0.05,
      h: pos.h,
      fill: { color: formatColor(variant.color) },
      line: { width: 0 },
    });

    slide.addShape("ellipse", {
      x: pos.x + 0.15,
      y: pos.y + 0.15,
      w: 0.28,
      h: 0.28,
      fill: { color: formatColor(variant.color) },
      line: { width: 0 },
    });

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
    fontFace: theme?.typography?.bodyFont || "Arial",
    color: formatColor(theme?.colors?.text?.primary || "#ffffff"),
    italic: isQuote,
    valign: isQuote ? "middle" : "top",
    wrap: true,
    autoFit: true,
  });

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
      fontFace: theme?.typography?.bodyFont || "Arial",
      color: formatColor(theme?.colors?.text?.muted || "#64748b"),
      align: "right",
      valign: "bottom",
    });
  }
}

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

  const chartData = element.data.datasets.map((ds) => ({
    name: ds.label,
    labels: element.data.labels,
    values: ds.data,
  }));

  const chartColors = element.data.datasets.map((ds) =>
    formatColor(ds.color || theme?.colors?.primary || "#3b82f6")
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
      catAxisLabelColor: formatColor(
        theme?.colors?.text?.secondary || "#94a3b8"
      ),
      valAxisLabelColor: formatColor(
        theme?.colors?.text?.secondary || "#94a3b8"
      ),
      catGridLine: { style: "none" },
      valGridLine: element.options?.showGrid
        ? { color: "3F3F3F", style: "solid", size: 0.5 }
        : { style: "none" },
    });
  } catch {
    slide.addShape("rect", {
      ...pos,
      fill: { color: formatColor(theme?.colors?.surface || "#1e293b") },
      line: {
        color: formatColor(theme?.colors?.text?.muted || "#64748b"),
        width: 1,
      },
    });
    slide.addText(`[${element.chartType} Chart]`, {
      ...pos,
      fontSize: 14,
      color: formatColor(theme?.colors?.text?.muted || "#64748b"),
      align: "center",
      valign: "middle",
    });
  }
}

function renderTableElement(
  slide: pptxgen.Slide,
  element: TableElement,
  theme: PresentationTheme,
  pos: { x: number; y: number; w: number; h: number }
): void {
  const rows: pptxgen.TableRow[] = [];

  if (element.headers?.cells) {
    const headerFill =
      element.style?.headerFill?.type === "solid"
        ? element.style.headerFill.color
        : theme?.colors?.primary || "#3b82f6";

    const headerRow: pptxgen.TableCell[] = element.headers.cells.map(
      (cell) => ({
        text: cell.content,
        options: {
          bold: true,
          fill: { color: formatColor(headerFill) },
          color: formatColor(theme?.colors?.text?.inverse || "#ffffff"),
          fontSize: 12,
          fontFace: theme?.typography?.bodyFont || "Arial",
          align: "center" as const,
          valign: "middle" as const,
        },
      })
    );
    rows.push(headerRow);
  }

  const altRowFill =
    element.style?.alternateRowFill?.type === "solid"
      ? element.style.alternateRowFill.color
      : theme?.colors?.surface || "#1e293b";

  element.rows.forEach((row, idx) => {
    const rowFill =
      idx % 2 === 1 ? altRowFill : theme?.colors?.background || "#0f172a";

    const dataRow: pptxgen.TableCell[] = row.cells.map((cell) => ({
      text: cell.content,
      options: {
        fill: { color: formatColor(rowFill) },
        color: formatColor(theme?.colors?.text?.primary || "#ffffff"),
        fontSize: 11,
        fontFace: theme?.typography?.bodyFont || "Arial",
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
    fontFace: theme?.typography?.bodyFont || "Arial",
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

function renderCodeElement(
  slide: pptxgen.Slide,
  element: CodeElement,
  theme: PresentationTheme,
  pos: { x: number; y: number; w: number; h: number }
): void {
  slide.addShape("roundRect", {
    x: pos.x,
    y: pos.y,
    w: pos.w,
    h: pos.h,
    fill: { color: "1E1E1E" },
    line: { color: "3C3C3C", width: 1 },
    rectRadius: 0.05,
  });

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
      fontFace: theme?.typography?.codeFont || "Consolas",
      color: "9D9D9D",
      align: "center",
      valign: "middle",
    });
  }

  slide.addText(element.code, {
    x: pos.x + 0.15,
    y: pos.y + 0.15,
    w: pos.w - 0.3,
    h: pos.h - 0.3,
    fontSize: element.fontSize || 11,
    fontFace: theme?.typography?.codeFont || "Consolas",
    color: "D4D4D4",
    valign: "top",
    wrap: true,
    autoFit: true,
  });
}

function renderProgressElement(
  slide: pptxgen.Slide,
  element: ProgressElement,
  theme: PresentationTheme,
  pos: { x: number; y: number; w: number; h: number }
): void {
  const colors: { track: string; fill: string; text: string } = {
    track: element.colors?.track || theme?.colors?.surface || "#1e293b",
    fill: element.colors?.fill || theme?.colors?.primary || "#3b82f6",
    text: element.colors?.text || theme?.colors?.text?.primary || "#ffffff",
  };

  const value = Math.min(Math.max(element.value, 0), 100);

  if (element.variant === "bar" || !element.variant) {
    const barHeight = 0.15;
    const barY = pos.y + pos.h * 0.4;

    slide.addShape("roundRect", {
      x: pos.x,
      y: barY,
      w: pos.w,
      h: barHeight,
      fill: { color: formatColor(colors.track) },
      line: { width: 0 },
      rectRadius: 0.05,
    });

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

    if (element.label) {
      slide.addText(element.label, {
        x: pos.x,
        y: pos.y,
        w: pos.w,
        h: pos.h * 0.35,
        fontSize: 12,
        fontFace: theme?.typography?.bodyFont || "Arial",
        color: formatColor(colors.text),
        valign: "bottom",
      });
    }

    if (element.showValue) {
      slide.addText(`${value}%`, {
        x: pos.x,
        y: barY + barHeight + 0.05,
        w: pos.w,
        h: pos.h * 0.2,
        fontSize: 14,
        fontFace: theme?.typography?.bodyFont || "Arial",
        color: formatColor(colors.fill),
        bold: true,
        align: "right",
      });
    }
  } else {
    slide.addText(`${value}%`, {
      x: pos.x,
      y: pos.y,
      w: pos.w,
      h: pos.h * 0.7,
      fontSize: 32,
      fontFace: theme?.typography?.headingFont || "Arial",
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
        fontFace: theme?.typography?.bodyFont || "Arial",
        color: formatColor(colors.text),
        align: "center",
        valign: "top",
      });
    }
  }
}

function renderDividerElement(
  slide: pptxgen.Slide,
  element: DividerElement,
  theme: PresentationTheme,
  pos: { x: number; y: number; w: number; h: number }
): void {
  let color = theme?.colors?.text?.muted || "#64748b";

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

export default exportToPptx;
