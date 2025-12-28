/**
 * AI Stream Service - Mock streaming service for presentation generation
 * Simulates LLM response by yielding slides one at a time with realistic delays
 */

import type {
  Slide,
  Presentation,
  PresentationMetadata,
  PresentationTheme,
} from "../types/slide-schema";
import { getMockPresentation } from "../data/mockPromptResponses";
import customPresentationData from "../data/customPresentation.json";

// Custom presentation loaded from JSON file - cast to Presentation type
const customPresentation = customPresentationData as unknown as Presentation;

/**
 * Validate that the custom presentation JSON has required fields
 * Returns the presentation if valid, or null with console error if invalid
 */
function validateCustomPresentation(data: unknown): Presentation | null {
  try {
    const p = data as Presentation;

    // Check required top-level fields
    if (!p || typeof p !== "object") {
      throw new Error("Presentation must be an object");
    }
    if (!p.id || typeof p.id !== "string") {
      throw new Error("Missing or invalid 'id' field");
    }
    if (!p.metadata || typeof p.metadata !== "object") {
      throw new Error("Missing or invalid 'metadata' field");
    }
    if (!p.metadata.title) {
      throw new Error("Missing 'metadata.title' field");
    }
    if (!p.theme || typeof p.theme !== "object") {
      throw new Error("Missing or invalid 'theme' field");
    }
    if (!p.theme.colors || typeof p.theme.colors !== "object") {
      throw new Error("Missing or invalid 'theme.colors' field");
    }
    if (!p.slides || !Array.isArray(p.slides)) {
      throw new Error("Missing or invalid 'slides' array");
    }
    if (p.slides.length === 0) {
      throw new Error("'slides' array is empty - need at least one slide");
    }

    // Validate each slide has required fields
    for (let i = 0; i < p.slides.length; i++) {
      const slide = p.slides[i];
      if (!slide.id) {
        throw new Error(`Slide ${i + 1}: missing 'id' field`);
      }
      if (!slide.elements || !Array.isArray(slide.elements)) {
        throw new Error(
          `Slide ${i + 1} (${slide.id}): missing 'elements' array`
        );
      }
      if (!slide.background) {
        throw new Error(
          `Slide ${i + 1} (${slide.id}): missing 'background' field`
        );
      }
    }

    console.log("[AiStreamService] ✓ Custom presentation JSON is valid");
    return p;
  } catch (error) {
    const msg =
      error instanceof Error ? error.message : "Unknown validation error";
    console.error(
      `[AiStreamService] ✗ Invalid customPresentation.json: ${msg}`
    );
    console.error(
      "[AiStreamService] Falling back to default pitch-deck template"
    );
    return null;
  }
}

/**
 * Get validated custom presentation or fallback
 */
function getCustomPresentation(): Presentation {
  const validated = validateCustomPresentation(customPresentation);
  if (validated) {
    return validated;
  }
  // Fallback to pitch-deck if custom JSON is invalid
  return getMockPresentation("pitch-deck");
}

// Generation event types
export type GenerationEventType = "metadata" | "slide" | "complete" | "error";

export interface MetadataEvent {
  type: "metadata";
  data: PresentationMetadata;
  theme: PresentationTheme;
  progress: number;
  totalSlides: number;
}

export interface SlideEvent {
  type: "slide";
  data: Slide;
  slideIndex: number;
  progress: number;
}

export interface CompleteEvent {
  type: "complete";
  progress: 100;
}

export interface ErrorEvent {
  type: "error";
  error: Error;
  progress: number;
}

export type GenerationEvent =
  | MetadataEvent
  | SlideEvent
  | CompleteEvent
  | ErrorEvent;

export interface GenerationOptions {
  signal?: AbortSignal;
  delayBetweenSlides?: number; // ms, default 1500
  simulateTyping?: boolean;
}

/**
 * Async generator that streams presentation generation events
 * Simulates real-time LLM generation with configurable delays
 */
export async function* generatePresentationStream(
  prompt: string,
  options: GenerationOptions = {}
): AsyncGenerator<GenerationEvent> {
  const { signal, delayBetweenSlides = 1500 } = options;

  try {
    // Get mock presentation based on prompt
    const presentation = await matchPromptToPresentation(prompt);
    const totalSlides = presentation.slides.length;

    // Check for cancellation
    if (signal?.aborted) {
      throw new Error("Generation cancelled");
    }

    // Yield metadata first (10% progress)
    await delay(800, signal);
    yield {
      type: "metadata",
      data: presentation.metadata,
      theme: presentation.theme,
      progress: 10,
      totalSlides,
    };

    // Yield slides one by one
    for (let i = 0; i < presentation.slides.length; i++) {
      if (signal?.aborted) {
        throw new Error("Generation cancelled");
      }

      // Variable delay to feel more natural
      const slideDelay = delayBetweenSlides + Math.random() * 500;
      await delay(slideDelay, signal);

      const progress = 10 + ((i + 1) / totalSlides) * 85; // 10-95%

      yield {
        type: "slide",
        data: presentation.slides[i],
        slideIndex: i,
        progress: Math.round(progress),
      };
    }

    // Final completion event
    await delay(500, signal);
    yield {
      type: "complete",
      progress: 100,
    };
  } catch (error) {
    if (error instanceof Error && error.message === "Generation cancelled") {
      throw error; // Re-throw cancellation
    }
    yield {
      type: "error",
      error: error instanceof Error ? error : new Error("Unknown error"),
      progress: 0,
    };
  }
}

/**
 * Match user prompt to a mock presentation
 * Uses keyword matching to find the best template
 */
async function matchPromptToPresentation(
  prompt: string
): Promise<Presentation> {
  // Simulate initial "thinking" delay
  await delay(500);

  const lowerPrompt = prompt.toLowerCase();

  // Keyword matching
  if (
    lowerPrompt.includes("pitch") ||
    lowerPrompt.includes("startup") ||
    lowerPrompt.includes("investor")
  ) {
    return getMockPresentation("pitch-deck");
  }
  if (
    lowerPrompt.includes("quarterly") ||
    lowerPrompt.includes("financial") ||
    lowerPrompt.includes("report")
  ) {
    return getMockPresentation("quarterly-report");
  }
  if (
    lowerPrompt.includes("product") ||
    lowerPrompt.includes("launch") ||
    lowerPrompt.includes("feature")
  ) {
    return getMockPresentation("product-launch");
  }
  if (
    lowerPrompt.includes("education") ||
    lowerPrompt.includes("learn") ||
    lowerPrompt.includes("course") ||
    lowerPrompt.includes("teach")
  ) {
    return getMockPresentation("educational");
  }
  if (
    lowerPrompt.includes("marketing") ||
    lowerPrompt.includes("campaign") ||
    lowerPrompt.includes("brand")
  ) {
    return getMockPresentation("marketing");
  }
  if (
    lowerPrompt.includes("team") ||
    lowerPrompt.includes("company") ||
    lowerPrompt.includes("about us")
  ) {
    return getMockPresentation("company-intro");
  }

  // For any other prompt, use the custom presentation from JSON file
  // Paste LLM-generated JSON into data/customPresentation.json to test
  console.log(
    "[AiStreamService] No mock matched - using customPresentation.json"
  );
  return getCustomPresentation();
}

/**
 * Helper to delay with cancellation support
 */
function delay(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new Error("Generation cancelled"));
      return;
    }

    const timeout = setTimeout(resolve, ms);

    signal?.addEventListener("abort", () => {
      clearTimeout(timeout);
      reject(new Error("Generation cancelled"));
    });
  });
}

/**
 * Get estimated generation time based on slide count
 */
export function estimateGenerationTime(
  slideCount: number,
  delayMs: number = 1500
): number {
  // metadata delay + slides + completion
  return 800 + slideCount * (delayMs + 250) + 500;
}
