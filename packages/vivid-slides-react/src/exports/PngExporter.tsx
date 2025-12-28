/**
 * PNG Exporter - Export slides as PNG images using modern-screenshot
 */

import { createRoot } from "react-dom/client";
import { domToPng } from "modern-screenshot";
import { SlideRenderer } from "../components/SlideRenderer";
import { SLIDE_WIDTH_PX, SLIDE_HEIGHT_PX, sanitizeFilename } from "./utils";
import type { Presentation, Slide } from "../types";

export interface PngExportOptions {
  /** Output filename (without extension) */
  filename?: string;
  /** Rendering scale (default: 2 for high quality) */
  scale?: number;
  /** Background color for slides */
  backgroundColor?: string;
  /** Which slide to export (1-indexed), default exports first slide */
  slideIndex?: number;
}

/**
 * Capture a single slide as PNG data URL
 */
async function captureSlideAsPng(
  slide: Slide,
  options: { scale: number; backgroundColor: string }
): Promise<string> {
  return new Promise((resolve, reject) => {
    // Create hidden container
    const container = document.createElement("div");
    container.style.cssText = `
      position: fixed;
      left: 0;
      top: 0;
      width: ${SLIDE_WIDTH_PX}px;
      height: ${SLIDE_HEIGHT_PX}px;
      z-index: 9999;
      background: ${options.backgroundColor};
      pointer-events: none;
      overflow: hidden;
    `;
    document.body.appendChild(container);

    // Create slide wrapper
    const slideWrapper = document.createElement("div");
    slideWrapper.style.cssText = `
      width: ${SLIDE_WIDTH_PX}px;
      height: ${SLIDE_HEIGHT_PX}px;
      position: relative;
      overflow: hidden;
      background: ${options.backgroundColor};
    `;
    container.appendChild(slideWrapper);

    // Add styles
    const styleTag = document.createElement("style");
    styleTag.textContent = `
      .png-export-container {
        position: relative !important;
        width: ${SLIDE_WIDTH_PX}px !important;
        height: ${SLIDE_HEIGHT_PX}px !important;
      }
      .png-export-container * {
        animation: none !important;
        transition: none !important;
      }
    `;
    slideWrapper.appendChild(styleTag);
    slideWrapper.classList.add("png-export-container");

    // Create inner container
    const slideContainer = document.createElement("div");
    slideContainer.style.cssText = `
      width: ${SLIDE_WIDTH_PX}px;
      height: ${SLIDE_HEIGHT_PX}px;
      position: relative;
    `;
    slideWrapper.appendChild(slideContainer);

    // Render slide
    const root = createRoot(slideContainer);
    root.render(<SlideRenderer slide={slide} isPreview={true} />);

    // Wait and capture
    setTimeout(async () => {
      try {
        const dataUrl = await domToPng(slideWrapper, {
          scale: options.scale,
          backgroundColor: options.backgroundColor,
          width: SLIDE_WIDTH_PX,
          height: SLIDE_HEIGHT_PX,
        });

        root.unmount();
        document.body.removeChild(container);
        resolve(dataUrl);
      } catch (error) {
        root.unmount();
        document.body.removeChild(container);
        reject(error);
      }
    }, 500);
  });
}

/**
 * Export a slide as PNG blob
 */
export async function exportToPngBlob(
  _presentation: Presentation,
  slides: Slide[],
  options: PngExportOptions = {}
): Promise<Blob> {
  const { scale = 2, backgroundColor = "#0f172a", slideIndex = 1 } = options;

  const idx = slideIndex - 1;
  if (idx < 0 || idx >= slides.length) {
    throw new Error(`Invalid slide index: ${slideIndex}`);
  }

  const slide = slides[idx];
  const dataUrl = await captureSlideAsPng(slide, { scale, backgroundColor });

  // Convert data URL to blob
  const response = await fetch(dataUrl);
  return response.blob();
}

/**
 * Export a slide as PNG and trigger download
 */
export async function exportToPng(
  presentation: Presentation,
  slides: Slide[],
  options: PngExportOptions = {}
): Promise<void> {
  const blob = await exportToPngBlob(presentation, slides, options);

  const filename =
    options.filename ||
    sanitizeFilename(presentation.metadata?.title || "presentation");
  const slideNum = options.slideIndex || 1;

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filename}-slide-${slideNum}.png`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export default exportToPng;
