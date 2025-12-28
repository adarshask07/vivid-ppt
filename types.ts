import React from 'react';
import { TypographyStylePath } from './types/theme';

export type NavItem = 'home' | 'templates' | 'trash' | 'settings' | 'create';

export type ProjectType = 'AI' | 'Manual' | 'Template';

export interface Project {
  id: string;
  title: string;
  description?: string;
  type: ProjectType;
  updatedAt: string; // ISO string
  createdAt: string; // ISO string
  thumbnail?: string;
  isDeleted: boolean;
  tags?: string[];
  // Data for the editor
  slides?: Slide[];
  theme?: PresentationTheme;
}

export interface Template {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  tags: string[];
}

// --- Editor Types ---

export type ElementType = 'text' | 'image' | 'shape';

export interface SlideElement {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  zIndex: number;
  opacity: number;
  
  // Semantic Style Token (e.g., 'h1', 'body')
  // If present, the element inherits styles from the active theme
  styleToken?: TypographyStylePath;

  // Content Model
  // For Text: { json: TiptapJSON, html: string }
  // For Image: { src: string, alt: string }
  // For Shape: {}
  content: any; 

  // Visual Styles
  style?: React.CSSProperties & {
    backgroundColor?: string;
    borderWidth?: number;
    borderColor?: string;
    borderStyle?: 'solid' | 'dashed' | 'dotted' | 'none';
    borderRadius?: number;
    boxShadow?: string;
  };
}

export interface Slide {
  id: string;
  elements: SlideElement[];
  background: string;
  notes?: string;
}

export interface PresentationTheme {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    accent: string;
  };
}