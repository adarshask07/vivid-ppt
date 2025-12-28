import React, { useState } from "react";
import { SlideRenderer } from "./slides";
import { SAMPLE_PRESENTATION } from "../data/samplePresentation";
import { ChevronLeft, ChevronRight, Grid, Maximize2 } from "lucide-react";

/**
 * Demo page to preview the new slide rendering system.
 * Access this by setting showDemo={true} in App.tsx or importing directly.
 */
export const SlideDemo: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showThumbnails, setShowThumbnails] = useState(true);

  const presentation = SAMPLE_PRESENTATION;
  const currentSlide = presentation.slides[currentIndex];
  const totalSlides = presentation.slides.length;

  const goToSlide = (index: number) => {
    if (index >= 0 && index < totalSlides) {
      setCurrentIndex(index);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight" || e.key === " ") {
      goToSlide(currentIndex + 1);
    } else if (e.key === "ArrowLeft") {
      goToSlide(currentIndex - 1);
    }
  };

  return (
    <div
      className="min-h-screen bg-gray-950 text-white flex flex-col"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* Header */}
      <div className="h-14 border-b border-gray-800 flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <h1 className="font-semibold text-lg">
            {presentation.metadata.title}
          </h1>
          <span className="text-sm text-gray-500">
            Slide {currentIndex + 1} of {totalSlides}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowThumbnails(!showThumbnails)}
            className={`p-2 rounded-lg transition-colors ${
              showThumbnails ? "bg-blue-600" : "bg-gray-800 hover:bg-gray-700"
            }`}
            title="Toggle thumbnails"
          >
            <Grid size={18} />
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Thumbnail Rail */}
        {showThumbnails && (
          <div className="w-48 border-r border-gray-800 overflow-y-auto p-3 space-y-3">
            {presentation.slides.map((slide, index) => (
              <button
                key={slide.id}
                onClick={() => goToSlide(index)}
                className={`w-full aspect-video rounded-lg overflow-hidden border-2 transition-all ${
                  index === currentIndex
                    ? "border-blue-500 ring-2 ring-blue-500/30"
                    : "border-gray-700 hover:border-gray-600"
                }`}
              >
                <div className="w-full h-full bg-gray-900 relative">
                  <div
                    className="absolute inset-0"
                    style={{
                      transform: "scale(0.15)",
                      transformOrigin: "top left",
                    }}
                  >
                    <div style={{ width: 960, height: 540 }}>
                      <SlideRenderer slide={slide} isPreview={true} />
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-1 right-1 text-xs bg-black/50 px-1.5 py-0.5 rounded">
                  {index + 1}
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Main Canvas */}
        <div className="flex-1 flex items-center justify-center p-8 bg-gray-900/50">
          <div
            className="relative bg-gray-900 rounded-xl overflow-hidden shadow-2xl"
            style={{
              width: "min(100%, 960px)",
              aspectRatio: "16/9",
            }}
          >
            <SlideRenderer slide={currentSlide} />
          </div>
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="h-16 border-t border-gray-800 flex items-center justify-center gap-4">
        <button
          onClick={() => goToSlide(currentIndex - 1)}
          disabled={currentIndex === 0}
          className="p-3 rounded-lg bg-gray-800 hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={20} />
        </button>

        <div className="flex items-center gap-2">
          {presentation.slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex
                  ? "w-6 bg-blue-500"
                  : "bg-gray-600 hover:bg-gray-500"
              }`}
            />
          ))}
        </div>

        <button
          onClick={() => goToSlide(currentIndex + 1)}
          disabled={currentIndex === totalSlides - 1}
          className="p-3 rounded-lg bg-gray-800 hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Keyboard hint */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 text-xs text-gray-600">
        Use ← → arrow keys to navigate
      </div>
    </div>
  );
};

export default SlideDemo;
