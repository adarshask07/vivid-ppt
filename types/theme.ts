export type ThemeColorPath = 
  | 'background.default' | 'background.accent'
  | 'text.primary' | 'text.secondary' | 'text.accent'
  | 'brand.primary' | 'brand.secondary'
  | 'ui.border';

export type TypographyStylePath = 'h1' | 'h2' | 'h3' | 'body' | 'caption';

export interface TextStyle {
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
      h1: TextStyle;
      h2: TextStyle;
      h3: TextStyle;
      body: TextStyle;
      caption: TextStyle;
    };
  };
  shape: { borderRadius: number };
}