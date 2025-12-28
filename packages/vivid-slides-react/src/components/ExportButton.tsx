// ============================================================================
// EXPORT BUTTON - EXPORT PRESENTATIONS TO VARIOUS FORMATS
// ============================================================================

import React, { useState, useCallback } from "react";
import { useVividContext } from "../context";
import { exportToPdfBlob } from "../exports/PdfExporter";
import { exportToPptxBlob } from "../exports/PptxExporter";
import { exportToPngBlob } from "../exports/PngExporter";
import type { Presentation, Slide } from "../types";

export type ExportFormat = "pptx" | "pdf" | "png" | "json";

export interface ExportOptions {
  /** Export format */
  format: ExportFormat;
  /** Custom filename (without extension) */
  filename?: string;
  /** For image export: slide indices to export (default: all) */
  slideIndices?: number[];
  /** For image export: scale factor */
  scale?: number;
  /** For PDF: include notes */
  includeNotes?: boolean;
}

export interface ExportButtonProps {
  /** Supported export formats */
  formats?: ExportFormat[];
  /** Custom className */
  className?: string;
  /** Custom style */
  style?: React.CSSProperties;
  /** Callback before export starts */
  onExportStart?: (format: ExportFormat) => void;
  /** Callback after export completes */
  onExportComplete?: (format: ExportFormat, blob: Blob) => void;
  /** Callback on export error */
  onExportError?: (format: ExportFormat, error: Error) => void;
  /** Custom export handlers (override default) */
  customExporters?: Partial<
    Record<
      ExportFormat,
      (presentation: Presentation, slides: Slide[]) => Promise<Blob>
    >
  >;
  /** Render as dropdown or individual buttons */
  variant?: "dropdown" | "buttons";
  /** Button label */
  label?: string;
  /** Children for custom rendering */
  children?: React.ReactNode;
}

// Default JSON exporter
const exportToJSON = async (
  presentation: Presentation,
  slides: Slide[]
): Promise<Blob> => {
  const data = {
    ...presentation,
    slides,
    exportedAt: new Date().toISOString(),
  };
  return new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
};

export const ExportButton: React.FC<ExportButtonProps> = ({
  formats = ["pptx", "pdf", "json"],
  className,
  style,
  onExportStart,
  onExportComplete,
  onExportError,
  customExporters = {},
  variant = "dropdown",
  label = "Export",
  children,
}) => {
  const { presentation, slides } = useVividContext();
  const [isOpen, setIsOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportingFormat, setExportingFormat] = useState<ExportFormat | null>(
    null
  );

  const handleExport = useCallback(
    async (format: ExportFormat) => {
      if (!presentation || slides.length === 0) {
        onExportError?.(format, new Error("No presentation to export"));
        return;
      }

      setIsExporting(true);
      setExportingFormat(format);
      onExportStart?.(format);

      try {
        let blob: Blob;

        // Check for custom exporter
        if (customExporters[format]) {
          blob = await customExporters[format]!(presentation, slides);
        } else {
          // Built-in exporters
          switch (format) {
            case "json":
              blob = await exportToJSON(presentation, slides);
              break;
            case "pptx":
              blob = await exportToPptxBlob(presentation, slides);
              break;
            case "pdf":
              blob = await exportToPdfBlob(presentation, slides);
              break;
            case "png":
              blob = await exportToPngBlob(presentation, slides, {
                slideIndex: 1,
              });
              break;
            default:
              throw new Error(`Unknown export format: ${format}`);
          }
        }

        // Trigger download
        const filename = presentation.metadata?.title || "presentation";
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${filename}.${format}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        onExportComplete?.(format, blob);
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        onExportError?.(format, error);
        console.error("Export error:", error);
      } finally {
        setIsExporting(false);
        setExportingFormat(null);
        setIsOpen(false);
      }
    },
    [
      presentation,
      slides,
      customExporters,
      onExportStart,
      onExportComplete,
      onExportError,
    ]
  );

  const formatLabels: Record<ExportFormat, string> = {
    pptx: "PowerPoint (.pptx)",
    pdf: "PDF Document",
    png: "Images (.png)",
    json: "JSON Data",
  };

  const formatIcons: Record<ExportFormat, React.ReactNode> = {
    pptx: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z" />
        <polyline points="13 2 13 9 20 9" />
      </svg>
    ),
    pdf: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
    png: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </svg>
    ),
    json: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
  };

  // Custom render
  if (children) {
    return <>{children}</>;
  }

  // Individual buttons variant
  if (variant === "buttons") {
    return (
      <div className={className} style={{ display: "flex", gap: 8, ...style }}>
        {formats.map((format) => (
          <button
            key={format}
            onClick={() => handleExport(format)}
            disabled={isExporting || slides.length === 0}
            className="vivid-export-button"
          >
            {formatIcons[format]}
            {exportingFormat === format ? "Exporting..." : format.toUpperCase()}
          </button>
        ))}
      </div>
    );
  }

  // Dropdown variant
  return (
    <div className={className} style={{ position: "relative", ...style }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isExporting || slides.length === 0}
        className="vivid-export-button"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          padding: "8px 16px",
          backgroundColor: "var(--vivid-primary, #3b82f6)",
          color: "var(--vivid-text-primary, white)",
          border: "none",
          borderRadius: "var(--vivid-radius-md, 8px)",
          fontFamily: "var(--vivid-font-body, inherit)",
          fontSize: 14,
          fontWeight: 500,
          cursor: "pointer",
        }}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        {isExporting ? "Exporting..." : label}
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          style={{
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s",
          }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setIsOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 99,
            }}
          />
          {/* Dropdown menu */}
          <div
            className="vivid-export-button__dropdown"
            style={{
              position: "absolute",
              top: "100%",
              right: 0,
              marginTop: 4,
              minWidth: 180,
              backgroundColor: "var(--vivid-surface, #1e293b)",
              border: "1px solid var(--vivid-border, #334155)",
              borderRadius: "var(--vivid-radius-md, 8px)",
              boxShadow: "0 10px 15px rgba(0,0,0,0.3)",
              overflow: "hidden",
              zIndex: 100,
            }}
          >
            {formats.map((format) => (
              <button
                key={format}
                onClick={() => handleExport(format)}
                className="vivid-export-button__option"
                disabled={isExporting}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  width: "100%",
                  padding: "8px 16px",
                  background: "none",
                  border: "none",
                  color: "var(--vivid-text-primary, #f8fafc)",
                  fontFamily: "var(--vivid-font-body, inherit)",
                  fontSize: 14,
                  textAlign: "left",
                  cursor: "pointer",
                }}
              >
                {formatIcons[format]}
                {formatLabels[format]}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
