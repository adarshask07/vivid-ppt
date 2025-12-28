/**
 * VividPackageDemo - Demonstrates using the @vivid/slides-react package
 *
 * This component shows how to integrate the npm package into your app.
 * Access this by pressing Ctrl+Shift+Alt+V in the app.
 */

import React, { useState, useCallback } from "react";
import {
  VividProvider,
  SlideViewer,
  SlideRail,
  ExportButton,
  StreamingIndicator,
  useVivid,
  useSlideNavigation,
  useSlideStream,
  type Presentation,
} from "@vivid/slides-react";
import customPresentation from "../data/customPresentation.json";

// Demo content component that uses the package hooks
const DemoContent: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { slides, streamingStatus } = useVivid();
  const { currentIndex, totalSlides, goToSlide, nextSlide, previousSlide } =
    useSlideNavigation();
  const { loadFromJSON, reset } = useSlideStream();
  const [loadMode, setLoadMode] = useState<"sample" | "streaming" | null>(null);

  // Load custom presentation from JSON file
  const handleLoadSample = useCallback(() => {
    // Cast to package's Presentation type (structure is compatible)
    loadFromJSON(customPresentation as unknown as Presentation);
    setLoadMode("sample");
  }, [loadFromJSON]);

  // Simulate streaming generation
  const handleSimulateStreaming = useCallback(async () => {
    reset();
    setLoadMode("streaming");
    await loadFromJSON(customPresentation as unknown as Presentation);
  }, [loadFromJSON, reset]);

  // Reset to initial state
  const handleReset = useCallback(() => {
    reset();
    setLoadMode(null);
  }, [reset]);

  // Show welcome screen if no slides loaded
  if (slides.length === 0) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
          >
            <span className="text-xl">←</span>
            <span>Back to App</span>
          </button>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
              <span className="text-white font-bold text-sm">V</span>
            </div>
            <span className="text-white font-semibold">
              @vivid/slides-react Demo
            </span>
          </div>
        </header>

        {/* Welcome Content */}
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-2xl px-6">
            <h1 className="text-4xl font-bold text-white mb-4">
              Vivid Slides React Package
            </h1>
            <p className="text-xl text-white/60 mb-8">
              A production-ready React component library for rendering and
              streaming AI-generated presentations.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleLoadSample}
                className="flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-orange-700 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-medium rounded-xl transition-all shadow-lg shadow-orange-500/25"
              >
                <span className="text-xl">🏰</span>
                <span>Load Maratha Empire Presentation</span>
              </button>

              <button
                onClick={handleSimulateStreaming}
                className="flex items-center justify-center gap-3 px-6 py-4 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl transition-all border border-white/10"
              >
                <span className="text-xl">▶️</span>
                <span>Simulate Streaming</span>
              </button>
            </div>

            {/* Package Usage Example */}
            <div className="mt-12 text-left bg-black/30 rounded-xl p-6 border border-white/10">
              <h3 className="text-white font-semibold mb-3">Quick Usage</h3>
              <pre className="text-sm text-white/70 overflow-x-auto">
                {`import { VividProvider, SlideViewer, SlideRail } from '@vivid/slides-react';

                    function App() {
                    return (
                        <VividProvider>
                        <div className="flex">
                            <SlideRail />
                            <SlideViewer />
                        </div>
                        </VividProvider>
                    );
                    }`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show presentation viewer
  return (
    <div className="fixed inset-0 bg-slate-900 flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 bg-slate-800 border-b border-white/10">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-white/70 hover:text-white transition-colors text-lg"
          >
            ←
          </button>
          <div>
            <h1 className="text-white font-medium">
              {loadMode === "sample"
                ? "Sample Presentation"
                : "Streamed Presentation"}
            </h1>
            <p className="text-white/50 text-sm">
              Slide {currentIndex + 1} of {totalSlides}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Streaming indicator */}
          {streamingStatus !== "idle" && streamingStatus !== "complete" && (
            <StreamingIndicator showProgress showCount />
          )}

          {/* Reset button */}
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-3 py-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <span>↻</span>
            <span className="text-sm">Reset</span>
          </button>

          {/* Export button - uses package's built-in exporters */}
          <ExportButton
            formats={["pptx", "pdf", "png", "json"]}
            onExportStart={(format) => {
              console.log(`Starting ${format} export...`);
            }}
            onExportComplete={(format) => {
              console.log(`${format} export completed!`);
            }}
            onExportError={(format, error) => {
              console.error(`Export ${format} failed:`, error);
            }}
          />
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Slide Rail (Thumbnails) */}
        <div className="w-52 bg-slate-800/50 border-r border-white/10 overflow-y-auto">
          <SlideRail
            showNumbers
            thumbnailWidth={160}
            onSlideClick={goToSlide}
          />
        </div>

        {/* Main Viewer */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 p-6">
            <SlideViewer showControls enableKeyboard />
          </div>

          {/* Bottom Navigation */}
          <div className="flex items-center justify-center gap-4 py-4 bg-slate-800/50 border-t border-white/10">
            <button
              onClick={previousSlide}
              disabled={currentIndex === 0}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
            >
              Previous
            </button>
            <div className="flex gap-1">
              {Array.from({ length: totalSlides }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => goToSlide(i)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === currentIndex
                      ? "bg-violet-500 w-6"
                      : "bg-white/30 hover:bg-white/50"
                  }`}
                />
              ))}
            </div>
            <button
              onClick={nextSlide}
              disabled={currentIndex === totalSlides - 1}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main demo component wrapped in VividProvider
export const VividPackageDemo: React.FC<{ onBack: () => void }> = ({
  onBack,
}) => {
  return (
    <VividProvider>
      <DemoContent onBack={onBack} />
    </VividProvider>
  );
};

export default VividPackageDemo;
