// ============================================================================
// THEME TYPES FOR DESIGN SYSTEM
// ============================================================================

export type ThemeColorPath =
  | "background.default"
  | "background.accent"
  | "text.primary"
  | "text.secondary"
  | "text.accent"
  | "brand.primary"
  | "brand.secondary"
  | "ui.border";

export type TypographyStylePath = "h1" | "h2" | "h3" | "body" | "caption";

export interface TypographyStyle {
  fontSize: number;
  fontWeight: 400 | 500 | 600 | 700 | 800;
  lineHeight: number;
  letterSpacing: string;
}

export interface DesignSystem {
  id: string;
  name: string;
  colors: {
    background: { default: string; accent: string };
    text: { primary: string; secondary: string; accent: string };
    brand: { primary: string; secondary: string };
    ui: { border: string };
  };
  typography: {
    fontFamily: { heading: string; body: string };
    styles: {
      h1: TypographyStyle;
      h2: TypographyStyle;
      h3: TypographyStyle;
      body: TypographyStyle;
      caption: TypographyStyle;
    };
  };
  shape: { borderRadius: number };
}

// Default themes
export const defaultLightTheme: DesignSystem = {
  id: "light",
  name: "Light",
  colors: {
    background: { default: "#ffffff", accent: "#f8fafc" },
    text: { primary: "#0f172a", secondary: "#475569", accent: "#3b82f6" },
    brand: { primary: "#3b82f6", secondary: "#8b5cf6" },
    ui: { border: "#e2e8f0" },
  },
  typography: {
    fontFamily: { heading: "Inter, sans-serif", body: "Inter, sans-serif" },
    styles: {
      h1: {
        fontSize: 48,
        fontWeight: 700,
        lineHeight: 1.2,
        letterSpacing: "-0.02em",
      },
      h2: {
        fontSize: 36,
        fontWeight: 600,
        lineHeight: 1.3,
        letterSpacing: "-0.01em",
      },
      h3: {
        fontSize: 24,
        fontWeight: 600,
        lineHeight: 1.4,
        letterSpacing: "0",
      },
      body: {
        fontSize: 16,
        fontWeight: 400,
        lineHeight: 1.6,
        letterSpacing: "0",
      },
      caption: {
        fontSize: 12,
        fontWeight: 400,
        lineHeight: 1.5,
        letterSpacing: "0.01em",
      },
    },
  },
  shape: { borderRadius: 8 },
};

export const defaultDarkTheme: DesignSystem = {
  id: "dark",
  name: "Dark",
  colors: {
    background: { default: "#0f172a", accent: "#1e293b" },
    text: { primary: "#f8fafc", secondary: "#94a3b8", accent: "#60a5fa" },
    brand: { primary: "#60a5fa", secondary: "#a78bfa" },
    ui: { border: "#334155" },
  },
  typography: {
    fontFamily: { heading: "Inter, sans-serif", body: "Inter, sans-serif" },
    styles: {
      h1: {
        fontSize: 48,
        fontWeight: 700,
        lineHeight: 1.2,
        letterSpacing: "-0.02em",
      },
      h2: {
        fontSize: 36,
        fontWeight: 600,
        lineHeight: 1.3,
        letterSpacing: "-0.01em",
      },
      h3: {
        fontSize: 24,
        fontWeight: 600,
        lineHeight: 1.4,
        letterSpacing: "0",
      },
      body: {
        fontSize: 16,
        fontWeight: 400,
        lineHeight: 1.6,
        letterSpacing: "0",
      },
      caption: {
        fontSize: 12,
        fontWeight: 400,
        lineHeight: 1.5,
        letterSpacing: "0.01em",
      },
    },
  },
  shape: { borderRadius: 8 },
};
