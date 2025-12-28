// ============================================================================
// STYLE UTILITIES FOR SLIDE RENDERING
// ============================================================================

import React from "react";
import type {
  BaseElement,
  Fill,
  Color,
  Effects,
  Border,
  Transform,
  Animation,
} from "../types";

// Theme color mapping
const THEME_COLOR_MAP: Record<string, string> = {
  "theme.colors.primary": "#3b82f6",
  "theme.colors.secondary": "#6366f1",
  "theme.colors.accent": "#8b5cf6",
  "theme.colors.background": "#0f172a",
  "theme.colors.surface": "#1e293b",
  "theme.colors.text.primary": "#f8fafc",
  "theme.colors.text.secondary": "#94a3b8",
  "theme.colors.text.muted": "#64748b",
  "theme.colors.success": "#22c55e",
  "theme.colors.warning": "#f59e0b",
  "theme.colors.error": "#ef4444",
  "theme.colors.info": "#3b82f6",
  "theme.colors.border": "#334155",
};

/**
 * Resolve theme colors to actual CSS values
 */
export function resolveColor(
  color: Color | undefined,
  fallback: string = "transparent"
): string {
  if (!color) return fallback;
  if (color === "transparent") return "transparent";
  if (color.startsWith("theme.")) {
    return THEME_COLOR_MAP[color] || fallback;
  }
  return color;
}

/**
 * Convert Fill to CSS background properties
 */
export function fillToCSS(fill: Fill | undefined): React.CSSProperties {
  if (!fill) return {};

  switch (fill.type) {
    case "solid":
      return { backgroundColor: resolveColor(fill.color) };

    case "gradient": {
      const { gradient } = fill;
      const stops = gradient.stops
        .map((s) => `${resolveColor(s.color)} ${s.position}%`)
        .join(", ");

      if (gradient.type === "linear") {
        return {
          background: `linear-gradient(${gradient.angle}deg, ${stops})`,
        };
      }
      return {
        background: `radial-gradient(circle at ${gradient.centerX} ${gradient.centerY}, ${stops})`,
      };
    }

    case "image":
      return {
        backgroundImage: `url(${fill.src})`,
        backgroundSize: fill.fit,
        backgroundPosition: fill.position
          ? `${fill.position.x} ${fill.position.y}`
          : "center",
      };

    case "pattern":
      return { backgroundColor: resolveColor(fill.backgroundColor) };

    default:
      return {};
  }
}

/**
 * Convert Effects to CSS properties
 */
export function effectsToCSS(
  effects: Effects | undefined
): React.CSSProperties {
  if (!effects) return {};

  const style: React.CSSProperties = {};
  const filters: string[] = [];

  if (effects.opacity !== undefined) {
    style.opacity = effects.opacity;
  }

  if (effects.shadow) {
    const { shadow } = effects;
    style.boxShadow = `${shadow.offsetX}px ${shadow.offsetY}px ${
      shadow.blur
    }px ${shadow.spread || 0}px ${resolveColor(shadow.color)}`;
  }

  if (effects.blur) {
    filters.push(`blur(${effects.blur}px)`);
  }
  if (effects.brightness !== undefined) {
    filters.push(`brightness(${effects.brightness})`);
  }
  if (effects.contrast !== undefined) {
    filters.push(`contrast(${effects.contrast})`);
  }
  if (effects.saturation !== undefined) {
    filters.push(`saturate(${effects.saturation})`);
  }
  if (effects.grayscale !== undefined) {
    filters.push(`grayscale(${effects.grayscale})`);
  }

  if (filters.length > 0) {
    style.filter = filters.join(" ");
  }

  return style;
}

/**
 * Convert Border to CSS properties
 */
export function borderToCSS(border: Border | undefined): React.CSSProperties {
  if (!border) return {};

  const style: React.CSSProperties = {
    borderWidth: border.width,
    borderStyle: border.style,
    borderColor: resolveColor(border.color),
  };

  if (border.radius !== undefined) {
    if (typeof border.radius === "number") {
      style.borderRadius = border.radius;
    } else {
      style.borderRadius = `${border.radius.topLeft}px ${border.radius.topRight}px ${border.radius.bottomRight}px ${border.radius.bottomLeft}px`;
    }
  }

  return style;
}

/**
 * Convert Transform to CSS properties
 */
export function transformToCSS(
  transform: Transform | undefined
): React.CSSProperties {
  if (!transform) return {};

  const transforms: string[] = [];

  if (transform.rotation) {
    transforms.push(`rotate(${transform.rotation}deg)`);
  }
  if (transform.scaleX !== undefined || transform.scaleY !== undefined) {
    transforms.push(
      `scale(${transform.scaleX ?? 1}, ${transform.scaleY ?? 1})`
    );
  }
  if (transform.skewX) {
    transforms.push(`skewX(${transform.skewX}deg)`);
  }
  if (transform.skewY) {
    transforms.push(`skewY(${transform.skewY}deg)`);
  }

  const style: React.CSSProperties = {};

  if (transforms.length > 0) {
    style.transform = transforms.join(" ");
  }

  if (transform.originX !== undefined || transform.originY !== undefined) {
    style.transformOrigin = `${transform.originX ?? "50%"} ${
      transform.originY ?? "50%"
    }`;
  }

  return style;
}

// Animation easing mapping
const EASING_MAP: Record<string, string | number[]> = {
  linear: "linear",
  ease: "easeInOut",
  "ease-in": "easeIn",
  "ease-out": "easeOut",
  "ease-in-out": "easeInOut",
  spring: "spring",
};

// Animation preset configs
const ANIMATION_CONFIGS: Record<string, { initial: object; animate: object }> =
  {
    "fade-in": { initial: { opacity: 0 }, animate: { opacity: 1 } },
    "fade-out": { initial: { opacity: 1 }, animate: { opacity: 0 } },
    "slide-up": {
      initial: { opacity: 0, y: 30 },
      animate: { opacity: 1, y: 0 },
    },
    "slide-down": {
      initial: { opacity: 0, y: -30 },
      animate: { opacity: 1, y: 0 },
    },
    "slide-left": {
      initial: { opacity: 0, x: 30 },
      animate: { opacity: 1, x: 0 },
    },
    "slide-right": {
      initial: { opacity: 0, x: -30 },
      animate: { opacity: 1, x: 0 },
    },
    "zoom-in": {
      initial: { opacity: 0, scale: 0.8 },
      animate: { opacity: 1, scale: 1 },
    },
    "zoom-out": {
      initial: { opacity: 0, scale: 1.2 },
      animate: { opacity: 1, scale: 1 },
    },
    bounce: { initial: { opacity: 0, y: -50 }, animate: { opacity: 1, y: 0 } },
    "blur-in": {
      initial: { opacity: 0, filter: "blur(10px)" },
      animate: { opacity: 1, filter: "blur(0px)" },
    },
    "rotate-in": {
      initial: { opacity: 0, rotate: -10 },
      animate: { opacity: 1, rotate: 0 },
    },
    pulse: { initial: { scale: 1 }, animate: { scale: [1, 1.05, 1] } },
    shake: { initial: { x: 0 }, animate: { x: [-5, 5, -5, 5, 0] } },
  };

/**
 * Get framer-motion animation configuration
 */
export function getAnimationConfig(animation: Animation | undefined): {
  initial: object;
  animate: object;
  transition: object;
} {
  if (!animation || animation.type === "none") {
    return { initial: {}, animate: {}, transition: {} };
  }

  const duration = animation.duration / 1000;
  const delay = (animation.delay || 0) / 1000;

  const ease = Array.isArray(animation.easing)
    ? animation.easing
    : EASING_MAP[animation.easing || "ease-out"] || "easeOut";

  const config =
    ANIMATION_CONFIGS[animation.type] || ANIMATION_CONFIGS["fade-in"];

  return {
    initial: config.initial,
    animate: config.animate,
    transition: {
      duration,
      delay,
      ease,
      ...(animation.type === "bounce"
        ? { type: "spring", stiffness: 300, damping: 20 }
        : {}),
    },
  };
}

/**
 * Get base element positioning and styling
 */
export function getBaseElementStyles(
  element: BaseElement
): React.CSSProperties {
  return {
    position: "absolute",
    left: element.bounds.x,
    top: element.bounds.y,
    width: element.bounds.width,
    height: element.bounds.height,
    zIndex: element.zIndex ?? 1,
    ...transformToCSS(element.transform),
    ...effectsToCSS(element.effects),
    ...borderToCSS(element.border),
    visibility: element.hidden ? "hidden" : "visible",
    pointerEvents: element.locked ? "none" : "auto",
  };
}
