import { create } from 'zustand';
import { DesignSystem, ThemeColorPath, TypographyStylePath, TextStyle } from '../types/theme';

const DEFAULT_THEMES: DesignSystem[] = [
  {
    id: 'corporate-day',
    name: 'Corporate Day',
    colors: {
      background: { default: '#ffffff', accent: '#f1f5f9' },
      text: { primary: '#1e293b', secondary: '#64748b', accent: '#2563eb' },
      brand: { primary: '#2563eb', secondary: '#1d4ed8' },
      ui: { border: '#e2e8f0' }
    },
    typography: {
      fontFamily: { heading: '"Inter", sans-serif', body: '"Inter", sans-serif' },
      styles: {
        h1: { fontSize: 48, fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.02em' },
        h2: { fontSize: 36, fontWeight: 700, lineHeight: 1.2, letterSpacing: '-0.01em' },
        h3: { fontSize: 24, fontWeight: 600, lineHeight: 1.3, letterSpacing: '0em' },
        body: { fontSize: 16, fontWeight: 400, lineHeight: 1.5, letterSpacing: '0em' },
        caption: { fontSize: 14, fontWeight: 400, lineHeight: 1.5, letterSpacing: '0.01em' }
      }
    },
    shape: { borderRadius: 8 }
  },
  {
    id: 'cyber-dark',
    name: 'Cyber Dark',
    colors: {
      background: { default: '#0F172A', accent: '#1e293b' },
      text: { primary: '#f8fafc', secondary: '#94a3b8', accent: '#f472b6' },
      brand: { primary: '#f472b6', secondary: '#818cf8' },
      ui: { border: '#334155' }
    },
    typography: {
      fontFamily: { heading: '"Roboto", sans-serif', body: '"Roboto", sans-serif' },
      styles: {
        h1: { fontSize: 64, fontWeight: 800, lineHeight: 1.1, letterSpacing: '0.05em' },
        h2: { fontSize: 42, fontWeight: 700, lineHeight: 1.2, letterSpacing: '0.02em' },
        h3: { fontSize: 28, fontWeight: 600, lineHeight: 1.3, letterSpacing: '0.01em' },
        body: { fontSize: 16, fontWeight: 400, lineHeight: 1.6, letterSpacing: '0.02em' },
        caption: { fontSize: 12, fontWeight: 500, lineHeight: 1.5, letterSpacing: '0.05em' }
      }
    },
    shape: { borderRadius: 0 }
  }
];

interface ThemeState {
  currentTheme: DesignSystem;
  availableThemes: DesignSystem[];
  setTheme: (themeId: string) => void;
  resolveColor: (path: ThemeColorPath) => string;
  resolveTypography: (path: TypographyStylePath) => TextStyle;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  currentTheme: DEFAULT_THEMES[0],
  availableThemes: DEFAULT_THEMES,

  setTheme: (themeId: string) => {
    const theme = get().availableThemes.find(t => t.id === themeId);
    if (theme) {
      set({ currentTheme: theme });
    }
  },

  resolveColor: (path: ThemeColorPath): string => {
    const { currentTheme } = get();
    const [category, key] = path.split('.') as [keyof typeof currentTheme.colors, string];
    // @ts-ignore - Strict typing for nested keys is complex in generic access, trusting input here based on type definition
    return currentTheme.colors[category][key] || '#000000';
  },

  resolveTypography: (path: TypographyStylePath): TextStyle => {
    const { currentTheme } = get();
    return currentTheme.typography.styles[path];
  }
}));