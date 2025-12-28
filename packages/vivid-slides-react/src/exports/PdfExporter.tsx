/**
 * PDF Exporter - Renders slides to PDF using modern-screenshot
 * Provides pixel-perfect PDF generation from slide data
 */

import { createRoot } from "react-dom/client";
import { jsPDF } from "jspdf";
import { domToCanvas } from "modern-screenshot";
import { SlideRenderer } from "../components/SlideRenderer";
import { SLIDE_WIDTH_PX, SLIDE_HEIGHT_PX, sanitizeFilename } from "./utils";
import type { Presentation, Slide } from "../types";

export interface PdfExportOptions {
  /** Output filename (without extension) */
  filename?: string;
  /** Rendering scale (default: 2 for high quality) */
  scale?: number;
  /** Background color for slides */
  backgroundColor?: string;
  /** Progress callback */
  onProgress?: (current: number, total: number) => void;
}

/**
 * Render a single slide to a container and capture it as canvas
 */
async function captureSlide(
  slide: Slide,
  container: HTMLDivElement,
  options: { scale: number; backgroundColor: string }
): Promise<HTMLCanvasElement> {
  return new Promise((resolve, reject) => {
    // Create slide wrapper with explicit dimensions
    const slideWrapper = document.createElement("div");
    slideWrapper.style.cssText = `
      width: ${SLIDE_WIDTH_PX}px;
      height: ${SLIDE_HEIGHT_PX}px;
      position: relative;
      overflow: hidden;
      background: ${options.backgroundColor};
    `;
    container.appendChild(slideWrapper);

    // Add styles for proper PDF rendering
    const styleTag = document.createElement("style");
    styleTag.textContent = `
      .pdf-export-container {
        position: relative !important;
        width: ${SLIDE_WIDTH_PX}px !important;
        height: ${SLIDE_HEIGHT_PX}px !important;
      }
      .pdf-export-container .slide-renderer {
        position: relative !important;
        width: 100% !important;
        height: 100% !important;
      }
      .pdf-export-container [data-element-id] {
        position: absolute !important;
      }
      .pdf-export-container * {
        animation: none !important;
        transition: none !important;
      }
      .pdf-export-container ::-webkit-scrollbar {
        display: none !important;
      }
    `;
    slideWrapper.appendChild(styleTag);
    slideWrapper.classList.add("pdf-export-container");

    // Create inner container for the slide
    const slideContainer = document.createElement("div");
    slideContainer.style.cssText = `
      width: ${SLIDE_WIDTH_PX}px;
      height: ${SLIDE_HEIGHT_PX}px;
      position: relative;
    `;
    slideWrapper.appendChild(slideContainer);

    // Create React root and render slide
    const root = createRoot(slideContainer);
    root.render(<SlideRenderer slide={slide} isPreview={true} />);

    // Wait for render and capture
    setTimeout(async () => {
      try {
        const canvas = await domToCanvas(slideWrapper, {
          scale: options.scale,
          backgroundColor: options.backgroundColor,
          width: SLIDE_WIDTH_PX,
          height: SLIDE_HEIGHT_PX,
          style: {
            transform: "none",
          },
        });

        root.unmount();
        container.removeChild(slideWrapper);
        resolve(canvas);
      } catch (error) {
        root.unmount();
        container.removeChild(slideWrapper);
        reject(error);
      }
    }, 500);
  });
}

/**
 * Export presentation to PDF with pixel-perfect rendering
 * Returns a Blob for flexible handling (download, upload, etc.)
 */
export async function exportToPdfBlob(
  _presentation: Presentation,
  slides: Slide[],
  options: PdfExportOptions = {}
): Promise<Blob> {
  const { scale = 2, backgroundColor = "#0f172a", onProgress } = options;

  if (!slides.length) {
    throw new Error("No slides to export");
  }

  // Create hidden container for rendering
  const container = document.createElement("div");
  container.style.cssText = `
    position: fixed;
    left: 0;
    top: 0;
    width: ${SLIDE_WIDTH_PX}px;
    height: ${SLIDE_HEIGHT_PX}px;
    z-index: 9999;
    background: ${backgroundColor};
    pointer-events: none;
    overflow: hidden;
  `;
  document.body.appendChild(container);

  try {
    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "px",
      format: [SLIDE_WIDTH_PX, SLIDE_HEIGHT_PX],
      compress: true,
    });

    for (let i = 0; i < slides.length; i++) {
      const slide = slides[i];
      onProgress?.(i + 1, slides.length);

      try {
        const canvas = await captureSlide(slide, container, {
          scale,
          backgroundColor,
        });

        if (i > 0) {
          pdf.addPage([SLIDE_WIDTH_PX, SLIDE_HEIGHT_PX], "landscape");
        }

        const imgData = canvas.toDataURL("image/png", 1.0);
        pdf.addImage(imgData, "PNG", 0, 0, SLIDE_WIDTH_PX, SLIDE_HEIGHT_PX);
      } catch (error) {
        console.error(`Failed to capture slide ${i + 1}:`, error);
      }
    }

    return pdf.output("blob");
  } finally {
    document.body.removeChild(container);
  }
}

/**
 * Export presentation to PDF and trigger download
 */
export async function exportToPdf(
  presentation: Presentation,
  slides: Slide[],
  options: PdfExportOptions = {}
): Promise<void> {
  const blob = await exportToPdfBlob(presentation, slides, options);

  const filename =
    options.filename ||
    sanitizeFilename(presentation.metadata?.title || "presentation");

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filename}.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export default exportToPdf;
