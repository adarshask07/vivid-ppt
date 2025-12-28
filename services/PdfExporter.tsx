/**
 * PDF Exporter - Renders slides to PDF using html2canvas
 * This creates a temporary container, renders each slide, captures it, then removes
 */

import React from "react";
import { createRoot } from "react-dom/client";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
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
    // Create slide wrapper
    const slideWrapper = document.createElement("div");
    slideWrapper.style.width = `${SLIDE_WIDTH}px`;
    slideWrapper.style.height = `${SLIDE_HEIGHT}px`;
    slideWrapper.style.position = "relative";
    slideWrapper.style.overflow = "hidden";
    container.appendChild(slideWrapper);

    // Add a style tag to override overflow behavior for PDF export
    // This ensures content fits and doesn't get clipped
    const styleTag = document.createElement("style");
    styleTag.textContent = `
      /* PDF Export: Prevent overflow and ensure content fits */
      .pdf-export-container * {
        overflow: visible !important;
        overflow-x: visible !important;
        overflow-y: visible !important;
      }
      
      /* Scale down text in lists/callouts if needed */
      .pdf-export-container [data-element-type="list"],
      .pdf-export-container [data-element-type="callout"],
      .pdf-export-container [data-element-type="text"] {
        overflow: hidden !important;
        text-overflow: ellipsis;
      }
      
      /* Ensure items don't have scrollbars */
      .pdf-export-container ::-webkit-scrollbar {
        display: none !important;
      }
    `;
    slideWrapper.appendChild(styleTag);
    slideWrapper.classList.add("pdf-export-container");

    // Create React root and render slide
    const root = createRoot(slideWrapper);

    // Render the slide with PDF export mode
    root.render(
      <div style={{ width: SLIDE_WIDTH, height: SLIDE_HEIGHT }}>
        <SlideRenderer slide={slide} isPreview={true} />
      </div>
    );

    // Wait for render and fonts to load
    setTimeout(async () => {
      try {
        const canvas = await html2canvas(slideWrapper, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: null,
          logging: false,
          width: SLIDE_WIDTH,
          height: SLIDE_HEIGHT,
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
    }, 300);
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

  // Create hidden container for rendering
  const container = document.createElement("div");
  container.style.position = "fixed";
  container.style.left = "0";
  container.style.top = "0";
  container.style.width = `${SLIDE_WIDTH}px`;
  container.style.height = `${SLIDE_HEIGHT}px`;
  container.style.zIndex = "-9999";
  container.style.opacity = "1"; // Must be visible for html2canvas
  container.style.pointerEvents = "none";
  container.style.overflow = "hidden";
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
