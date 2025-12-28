import React, { useMemo } from 'react';
import { SlideElement } from '../types';
import { useThemeStore } from '../store/themeStore';

export const useElementStyles = (element: SlideElement): React.CSSProperties => {
  const { currentTheme, resolveTypography } = useThemeStore();

  const styles = useMemo(() => {
    const baseStyles: React.CSSProperties = {
      // Default to body font if no token is present
      fontFamily: currentTheme.typography.fontFamily.body,
      color: currentTheme.colors.text.primary,
    };

    // 1. Apply Semantic Typography Token (if present)
    if (element.styleToken) {
      const typeStyle = resolveTypography(element.styleToken);
      
      // Update font family if it's a heading vs body
      if (['h1', 'h2', 'h3'].includes(element.styleToken)) {
        baseStyles.fontFamily = currentTheme.typography.fontFamily.heading;
      }

      baseStyles.fontSize = `${typeStyle.fontSize}px`;
      baseStyles.fontWeight = typeStyle.fontWeight;
      baseStyles.lineHeight = typeStyle.lineHeight;
      baseStyles.letterSpacing = typeStyle.letterSpacing;
    }

    // 2. Apply Element-Specific Overrides (Legacy or Manual)
    // These take precedence over theme defaults
    const combinedStyles: React.CSSProperties = {
      ...baseStyles,
      ...element.style, // This spreads manual overrides like explicit backgroundColor, etc.
    };

    // Explicitly handle color override logic if needed
    // If element.style.color exists, it overrides theme.colors.text.primary
    
    return combinedStyles;
  }, [element.styleToken, element.style, currentTheme]);

  return styles;
};