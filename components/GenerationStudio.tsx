/**
 * GenerationStudio - Full-screen live slide generation experience
 */

import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence, type HTMLMotionProps } from "framer-motion";
import {
  Download,
  FileText,
  Presentation as PresentationIcon,
} from "lucide-react";
import { useSlideGeneration } from "../hooks/useSlideGeneration";
import { SlideRenderer } from "./slides/SlideRenderer";

import { exportPresentationToPdf } from "../services/PdfExporter";
import type { Presentation } from "../types/slide-schema";
import { exportPresentation } from "@/services/ExportService";

// Type-safe motion components for framer-motion v11+
const MotionDiv = motion.div as React.FC<
  HTMLMotionProps<"div"> & { children?: React.ReactNode }
>;
const MotionButton = motion.button as React.FC<
  HTMLMotionProps<"button"> & { children?: React.ReactNode }
>;

interface GenerationStudioProps {
  prompt: string;
  onComplete: (presentation: Presentation) => void;
  onCancel: () => void;
}

export function GenerationStudio({
  prompt,
  onComplete,
  onCancel,
}: GenerationStudioProps) {
  const {
    state,
    startGeneration,
    cancelGeneration,
    slides,
    progress,
    isGenerating,
    isComplete,
  } = useSlideGeneration();

  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [isExporting, setIsExporting] = useState(false);

  // Export handler with loading state
  const handleExport = useCallback(
    async (format: "pptx" | "pdf") => {
      if (!state.presentation) return;

      setIsExporting(true);
      try {
        if (format === "pdf") {
          // Use dedicated PDF exporter that renders slides dynamically
          await exportPresentationToPdf(
            state.presentation,
            undefined,
            (current, total) =>
              console.log(`Exporting slide ${current}/${total}`)
          );
        } else {
          // Use standard PPTX export
          await exportPresentation(state.presentation, { format: "pptx" });
        }
      } catch (error) {
        console.error("Export failed:", error);
      } finally {
        setIsExporting(false);
      }
    },
    [state.presentation]
  );

  // Start generation on mount
  useEffect(() => {
    if (prompt) {
      startGeneration(prompt);
    }
  }, [prompt, startGeneration]);

  // Auto-advance to newest slide
  useEffect(() => {
    if (slides.length > 0) {
      setActiveSlideIndex(slides.length - 1);
    }
  }, [slides.length]);

  // No auto-navigation - user must click "Open in Editor" button

  const handleCancel = () => {
    cancelGeneration();
    onCancel();
  };

  const theme = state.presentation?.theme;
  const activeSlide = slides[activeSlideIndex];

  return (
    <div className="fixed inset-0 bg-[#0a0a0f] flex flex-col z-50">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">V</span>
          </div>
          <div>
            <h1 className="text-white font-medium">
              {state.presentation?.metadata.title ||
                "Generating presentation..."}
            </h1>
            <p className="text-white/50 text-sm truncate max-w-md">{prompt}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Progress indicator */}
          <div className="flex items-center gap-3">
            <div className="text-white/60 text-sm">
              {slides.length} / {state.totalSlides || "?"} slides
            </div>
            <div className="w-32 h-2 bg-white/10 rounded-full overflow-hidden">
              <MotionDiv
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* Timer */}
          <div className="text-white/40 text-sm font-mono">
            {formatTime(state.elapsedMs)}
          </div>

          {/* Cancel button */}
          {isGenerating && (
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Slide rail (thumbnails) */}
        <aside className="w-48 border-r border-white/10 overflow-y-auto p-3 space-y-2">
          <AnimatePresence mode="popLayout">
            {slides.filter(Boolean).map((slide, index) => (
              <MotionButton
                key={slide.id}
                initial={{ opacity: 0, x: -20, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                onClick={() => setActiveSlideIndex(index)}
                className={`w-full aspect-video rounded-lg overflow-hidden border-2 transition-all ${
                  index === activeSlideIndex
                    ? "border-indigo-500 ring-2 ring-indigo-500/30"
                    : "border-white/10 hover:border-white/30"
                }`}
              >
                {theme && (
                  <div className="w-full h-full transform scale-[0.15] origin-top-left">
                    <div style={{ width: 960, height: 540 }}>
                      <SlideRenderer slide={slide} theme={theme} />
                    </div>
                  </div>
                )}
              </MotionButton>
            ))}
          </AnimatePresence>

          {/* Placeholder for upcoming slides */}
          {isGenerating && state.totalSlides > slides.length && (
            <>
              {Array.from({ length: state.totalSlides - slides.length }).map(
                (_, i) => (
                  <MotionDiv
                    key={`placeholder-${i}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="w-full aspect-video rounded-lg bg-white/5 border border-dashed border-white/20 flex items-center justify-center"
                  >
                    <div className="w-4 h-4 border-2 border-white/30 border-t-transparent rounded-full animate-spin" />
                  </MotionDiv>
                )
              )}
            </>
          )}
        </aside>

        {/* Main slide preview */}
        <main className="flex-1 flex items-center justify-center p-8 bg-black/20">
          <AnimatePresence mode="wait">
            {activeSlide && theme ? (
              <MotionDiv
                key={activeSlide.id}
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="relative"
                style={{
                  width: 960,
                  height: 540,
                  maxWidth: "100%",
                  maxHeight: "100%",
                }}
              >
                {/* Slide frame */}
                <div className="w-full h-full rounded-xl overflow-hidden shadow-2xl shadow-black/50 ring-1 ring-white/10">
                  <SlideRenderer slide={activeSlide} theme={theme} />
                </div>

                {/* Slide number badge */}
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-3 py-1 bg-white/10 rounded-full text-white/60 text-sm">
                  Slide {activeSlideIndex + 1}
                  {activeSlide.name && ` — ${activeSlide.name}`}
                </div>
              </MotionDiv>
            ) : (
              <GeneratingPlaceholder />
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Footer with status */}
      <footer className="px-6 py-3 border-t border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <StatusIndicator status={state.status} />
          <span className="text-white/60 text-sm">
            {getStatusMessage(state.status, slides.length)}
          </span>
        </div>

        {isComplete && state.presentation && (
          <div className="flex items-center gap-3">
            {/* Export buttons */}
            <button
              onClick={() => handleExport("pptx")}
              disabled={isExporting}
              className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Download as PowerPoint"
            >
              <PresentationIcon className="w-4 h-4" />
              <span className="hidden sm:inline">
                {isExporting ? "Exporting..." : "PPTX"}
              </span>
            </button>
            <button
              onClick={() => handleExport("pdf")}
              disabled={isExporting}
              className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Download as PDF"
            >
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">
                {isExporting ? "Exporting..." : "PDF"}
              </span>
            </button>

            <MotionButton
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => onComplete(state.presentation!)}
              className="px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium rounded-lg hover:from-indigo-600 hover:to-purple-600 transition-all"
            >
              Open in Editor →
            </MotionButton>
          </div>
        )}
      </footer>

      {/* Error overlay */}
      {state.status === "error" && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
          <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-8 max-w-md text-center">
            <div className="text-red-400 text-4xl mb-4">⚠️</div>
            <h2 className="text-white text-xl font-semibold mb-2">
              Generation Failed
            </h2>
            <p className="text-white/60 mb-6">{state.error}</p>
            <button
              onClick={onCancel}
              className="px-6 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function GeneratingPlaceholder() {
  return (
    <MotionDiv
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-[960px] h-[540px] max-w-full max-h-full rounded-xl bg-white/5 border border-dashed border-white/20 flex flex-col items-center justify-center gap-4"
    >
      <div className="relative">
        <div className="w-16 h-16 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
        <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-b-purple-500 rounded-full animate-spin animation-delay-150" />
      </div>
      <div className="text-white/60">Preparing your presentation...</div>
    </MotionDiv>
  );
}

function StatusIndicator({ status }: { status: string }) {
  const colors: Record<string, string> = {
    idle: "bg-white/30",
    generating: "bg-indigo-500 animate-pulse",
    complete: "bg-green-500",
    error: "bg-red-500",
    cancelled: "bg-yellow-500",
  };

  return (
    <span className={`w-2 h-2 rounded-full ${colors[status] || colors.idle}`} />
  );
}

function getStatusMessage(status: string, slideCount: number): string {
  switch (status) {
    case "idle":
      return "Ready to generate";
    case "generating":
      return slideCount > 0
        ? `Creating slide ${slideCount + 1}...`
        : "Analyzing your prompt...";
    case "complete":
      return `${slideCount} slides generated successfully!`;
    case "error":
      return "Generation failed";
    case "cancelled":
      return "Generation cancelled";
    default:
      return "";
  }
}

function formatTime(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}
