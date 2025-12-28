// ============================================================================
// useTheme - THEME ACCESS HOOK
// ============================================================================

import { useCallback, useMemo } from "react";
import { useVividContext } from "../context";
import type { DesignSystem } from "../types";

export interface ThemeResult {
  /** Current theme */
  theme: DesignSystem;
  /** Update theme */
  setTheme: (theme: DesignSystem) => void;
  /** Get color from palette */
  getColor: (path: string) => string | undefined;
  /** Check if theme is dark mode (based on background color) */
  isDark: boolean;
}

/**
 * Hook for accessing and manipulating theme.
 *
 * @example
 * ```tsx
 * const { theme, getColor, isDark } = useTheme();
 * const primaryColor = getColor('brand.primary');
 * ```
 */
export function useTheme(): ThemeResult {
  const { theme, setTheme } = useVividContext();

  const getColor = useCallback(
    (path: string): string | undefined => {
      const parts = path.split(".");
      let current: unknown = theme.colors;
      for (const part of parts) {
        if (current && typeof current === "object" && part in current) {
          current = (current as Record<string, unknown>)[part];
        } else {
          return undefined;
        }
      }
      return typeof current === "string" ? current : undefined;
    },
    [theme]
  );

  // Simple dark mode detection based on background color
  const isDark = useMemo(() => {
    const bg = theme?.colors?.background?.default;
    if (!bg) return true; // Default to dark

    // Check if background is a dark color
    if (bg.startsWith("#")) {
      const hex = bg.replace("#", "");
      const r = parseInt(hex.substr(0, 2), 16);
      const g = parseInt(hex.substr(2, 2), 16);
      const b = parseInt(hex.substr(4, 2), 16);
      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      return luminance < 0.5;
    }

    return true;
  }, [theme]);

  return useMemo(
    () => ({
      theme,
      setTheme,
      getColor,
      isDark,
    }),
    [theme, setTheme, getColor, isDark]
  );
}
