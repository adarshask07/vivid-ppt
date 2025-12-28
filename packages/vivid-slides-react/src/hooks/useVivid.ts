// ============================================================================
// useVivid - MAIN HOOK FOR ACCESSING VIVID CONTEXT
// ============================================================================

import { useVividContext } from "../context";
import type { VividContextValue } from "../context";

/**
 * Main hook for accessing Vivid Slides context.
 * Must be used within a VividProvider.
 *
 * @example
 * ```tsx
 * const { presentation, currentSlide, goToSlide } = useVivid();
 * ```
 */
export function useVivid(): VividContextValue {
  return useVividContext();
}
