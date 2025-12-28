/**
 * Export Dialog - UI for exporting presentations to PPTX/PDF
 */

import React, { useState } from "react";
import {
  Download,
  FileText,
  Presentation,
  X,
  Loader2,
  Check,
} from "lucide-react";

import { exportPresentationToPdf } from "../services/PdfExporter";
import type { Presentation as PresentationType } from "../types/slide-schema";
import { exportToPptx } from "@/services/ExportService";

interface ExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  presentation: PresentationType;
}

export const ExportDialog: React.FC<ExportDialogProps> = ({
  isOpen,
  onClose,
  presentation,
}) => {
  const [selectedFormat, setSelectedFormat] = useState<"pptx" | "pdf">("pptx");
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState({ current: 0, total: 0 });

  if (!isOpen) return null;

  const handleExport = async () => {
    setIsExporting(true);
    setError(null);
    setExportSuccess(false);

    try {
      if (selectedFormat === "pdf") {
        // Use dedicated PDF exporter
        await exportPresentationToPdf(
          presentation,
          presentation.metadata.title,
          (current, total) => setProgress({ current, total })
        );
      } else {
        // Use PPTX export
        await exportToPptx(presentation, presentation.metadata.title);
      }

      setExportSuccess(true);

      // Auto-close after success
      setTimeout(() => {
        onClose();
        setExportSuccess(false);
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Export failed");
    } finally {
      setIsExporting(false);
      setProgress({ current: 0, total: 0 });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="relative bg-gray-900 rounded-xl border border-gray-700 shadow-2xl w-full max-w-md p-6 m-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/20 rounded-lg">
              <Download className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">
                Export Presentation
              </h2>
              <p className="text-sm text-gray-400">
                {presentation.slides.length} slides
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Format Selection */}
        <div className="space-y-3 mb-6">
          <p className="text-sm font-medium text-gray-300">Choose format</p>

          {/* PPTX Option */}
          <button
            onClick={() => setSelectedFormat("pptx")}
            className={`w-full flex items-center gap-4 p-4 rounded-lg border-2 transition-all ${
              selectedFormat === "pptx"
                ? "border-indigo-500 bg-indigo-500/10"
                : "border-gray-700 hover:border-gray-600 bg-gray-800/50"
            }`}
          >
            <div
              className={`p-3 rounded-lg ${
                selectedFormat === "pptx" ? "bg-orange-500/20" : "bg-gray-700"
              }`}
            >
              <Presentation
                className={`w-6 h-6 ${
                  selectedFormat === "pptx"
                    ? "text-orange-400"
                    : "text-gray-400"
                }`}
              />
            </div>
            <div className="flex-1 text-left">
              <p className="font-medium text-white">PowerPoint (.pptx)</p>
              <p className="text-sm text-gray-400">
                Editable presentation for Microsoft PowerPoint
              </p>
            </div>
            {selectedFormat === "pptx" && (
              <div className="w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center">
                <Check className="w-3 h-3 text-white" />
              </div>
            )}
          </button>

          {/* PDF Option */}
          <button
            onClick={() => setSelectedFormat("pdf")}
            className={`w-full flex items-center gap-4 p-4 rounded-lg border-2 transition-all ${
              selectedFormat === "pdf"
                ? "border-indigo-500 bg-indigo-500/10"
                : "border-gray-700 hover:border-gray-600 bg-gray-800/50"
            }`}
          >
            <div
              className={`p-3 rounded-lg ${
                selectedFormat === "pdf" ? "bg-red-500/20" : "bg-gray-700"
              }`}
            >
              <FileText
                className={`w-6 h-6 ${
                  selectedFormat === "pdf" ? "text-red-400" : "text-gray-400"
                }`}
              />
            </div>
            <div className="flex-1 text-left">
              <p className="font-medium text-white">PDF Document (.pdf)</p>
              <p className="text-sm text-gray-400">
                High-quality document for sharing and printing
              </p>
            </div>
            {selectedFormat === "pdf" && (
              <div className="w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center">
                <Check className="w-3 h-3 text-white" />
              </div>
            )}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {/* Export Button */}
        <button
          onClick={handleExport}
          disabled={isExporting}
          className={`w-full py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
            exportSuccess
              ? "bg-green-500 text-white"
              : isExporting
              ? "bg-gray-700 text-gray-400 cursor-not-allowed"
              : "bg-indigo-500 hover:bg-indigo-600 text-white"
          }`}
        >
          {exportSuccess ? (
            <>
              <Check className="w-5 h-5" />
              Downloaded!
            </>
          ) : isExporting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              {progress.total > 0
                ? `Exporting slide ${progress.current}/${progress.total}...`
                : "Exporting..."}
            </>
          ) : (
            <>
              <Download className="w-5 h-5" />
              Export as {selectedFormat.toUpperCase()}
            </>
          )}
        </button>

        {/* Info */}
        <p className="mt-4 text-xs text-gray-500 text-center">
          {selectedFormat === "pptx"
            ? "Opens in PowerPoint, Keynote, or Google Slides"
            : "Perfect for sharing via email or printing"}
        </p>
      </div>
    </div>
  );
};

export default ExportDialog;
