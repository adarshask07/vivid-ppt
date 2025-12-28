/**
 * PDF Exporter - Renders slides to PDF using modern-screenshot
 * This creates a temporary container, renders each slide, captures it, then removes
 */

import React from "react";
import { createRoot } from "react-dom/client";
import { jsPDF } from "jspdf";
import { domToCanvas } from "modern-screenshot";
import { SlideRenderer } from "../components/slides/SlideRenderer";
import type { Presentation, Slide } from "../types/slide-schema";

const SLIDE_WIDTH = 960;
const SLIDE_HEIGHT = 540;

/**
 * Render a single slide to a container and capture it
 */
async function captureSlide(
  slide: Slide,
  container: HTMLDivElement
): Promise<HTMLCanvasElement> {
  return new Promise((resolve, reject) => {
    // Create slide wrapper with explicit dimensions and positioning context
    const slideWrapper = document.createElement("div");
    slideWrapper.style.cssText = `
      width: ${SLIDE_WIDTH}px;
      height: ${SLIDE_HEIGHT}px;
      position: relative;
      overflow: hidden;
      background: #0f172a;
    `;
    container.appendChild(slideWrapper);

    // Add styles to ensure proper rendering for PDF export
    const styleTag = document.createElement("style");
    styleTag.textContent = `
      /* PDF Export: Ensure absolute positioning works */
      .pdf-export-container {
        position: relative !important;
        width: ${SLIDE_WIDTH}px !important;
        height: ${SLIDE_HEIGHT}px !important;
      }
      
      .pdf-export-container .slide-renderer {
        position: relative !important;
        width: 100% !important;
        height: 100% !important;
      }
      
      /* Ensure all elements maintain absolute positioning */
      .pdf-export-container [data-element-id] {
        position: absolute !important;
      }
      
      /* Disable animations for static capture */
      .pdf-export-container * {
        animation: none !important;
        transition: none !important;
      }
      
      /* Hide scrollbars */
      .pdf-export-container ::-webkit-scrollbar {
        display: none !important;
      }
      
      /* Ensure text is visible */
      .pdf-export-container [data-element-type="text"],
      .pdf-export-container [data-element-type="list"],
      .pdf-export-container [data-element-type="callout"] {
        overflow: hidden !important;
      }
    `;
    slideWrapper.appendChild(styleTag);
    slideWrapper.classList.add("pdf-export-container");

    // Create the inner container for the slide
    const slideContainer = document.createElement("div");
    slideContainer.style.cssText = `
      width: ${SLIDE_WIDTH}px;
      height: ${SLIDE_HEIGHT}px;
      position: relative;
    `;
    slideWrapper.appendChild(slideContainer);

    // Create React root and render slide
    const root = createRoot(slideContainer);

    // Render the slide with PDF export mode (isPreview=true disables animations)
    root.render(<SlideRenderer slide={slide} isPreview={true} />);

    // Wait for render and fonts to load - increased timeout for complex slides
    setTimeout(async () => {
      try {
        const canvas = await domToCanvas(slideWrapper, {
          scale: 2,
          backgroundColor: "#0f172a",
          width: SLIDE_WIDTH,
          height: SLIDE_HEIGHT,
          style: {
            // Ensure proper positioning
            transform: 'none',
          },
        });

        // Cleanup
        root.unmount();
        container.removeChild(slideWrapper);

        resolve(canvas);
      } catch (error) {
        root.unmount();
        container.removeChild(slideWrapper);
        reject(error);
      }
    }, 500); // Increased timeout for better rendering
  });
}

/**
 * Export presentation to PDF with pixel-perfect rendering
 */
export async function exportPresentationToPdf(
  presentation: Presentation,
  filename?: string,
  onProgress?: (current: number, total: number) => void
): Promise<void> {
  const { slides, theme } = presentation;

  if (!slides.length) {
    throw new Error("No slides to export");
  }

  // Create hidden container for rendering - must be visible for html2canvas
  const container = document.createElement("div");
  container.style.cssText = `
    position: fixed;
    left: 0;
    top: 0;
    width: ${SLIDE_WIDTH}px;
    height: ${SLIDE_HEIGHT}px;
    z-index: 9999;
    background: #0f172a;
    pointer-events: none;
    overflow: hidden;
  `;
  document.body.appendChild(container);

  try {
    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "px",
      format: [SLIDE_WIDTH, SLIDE_HEIGHT],
      compress: true,
    });

    for (let i = 0; i < slides.length; i++) {
      const slide = slides[i];

      onProgress?.(i + 1, slides.length);
      console.log(
        `Capturing slide ${i + 1}/${slides.length}: ${slide.name || slide.id}`
      );

      try {
        const canvas = await captureSlide(slide, container);

        if (i > 0) {
          pdf.addPage([SLIDE_WIDTH, SLIDE_HEIGHT], "landscape");
        }

        const imgData = canvas.toDataURL("image/png", 1.0);
        pdf.addImage(imgData, "PNG", 0, 0, SLIDE_WIDTH, SLIDE_HEIGHT);
      } catch (error) {
        console.error(`Failed to capture slide ${i + 1}:`, error);
        // Continue with next slide
      }
    }

    // Save the PDF
    const finalFilename =
      filename || sanitizeFilename(presentation.metadata.title);
    pdf.save(`${finalFilename}.pdf`);
  } finally {
    // Cleanup container
    document.body.removeChild(container);
  }
}

/**
 * Sanitize filename for saving
 */
function sanitizeFilename(name: string): string {
  return name
    .replace(/[^a-z0-9\s\-_]/gi, "")
    .replace(/\s+/g, "-")
    .toLowerCase()
    .substring(0, 50);
}

export default exportPresentationToPdf;
