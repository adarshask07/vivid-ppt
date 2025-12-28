// ============================================================================
// IMAGE ELEMENT COMPONENT
// ============================================================================

import React from "react";
import type { ImageElement as ImageElementType } from "../../types";

export interface ImageElementProps {
  element: ImageElementType;
}

const PLACEHOLDER_SVG =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"%3E%3Crect fill="%23374151" width="100" height="100"/%3E%3Ctext fill="%239CA3AF" x="50" y="50" text-anchor="middle" dy=".3em" font-size="12"%3EImage%3C/text%3E%3C/svg%3E';

export const ImageElement: React.FC<ImageElementProps> = ({ element }) => {
  const style: React.CSSProperties = {
    width: "100%",
    height: "100%",
    objectFit: element.fit || "cover",
    objectPosition: element.position
      ? `${element.position.x} ${element.position.y}`
      : "center",
    borderRadius: element.border?.radius
      ? typeof element.border.radius === "number"
        ? element.border.radius
        : `${element.border.radius.topLeft}px ${element.border.radius.topRight}px ${element.border.radius.bottomRight}px ${element.border.radius.bottomLeft}px`
      : undefined,
  };

  // Apply filters if present
  if (element.filters) {
    const filters: string[] = [];
    if (element.filters.brightness !== undefined)
      filters.push(`brightness(${element.filters.brightness})`);
    if (element.filters.contrast !== undefined)
      filters.push(`contrast(${element.filters.contrast})`);
    if (element.filters.saturation !== undefined)
      filters.push(`saturate(${element.filters.saturation})`);
    if (element.filters.grayscale !== undefined)
      filters.push(`grayscale(${element.filters.grayscale})`);
    if (element.filters.blur !== undefined)
      filters.push(`blur(${element.filters.blur}px)`);
    if (element.filters.sepia !== undefined)
      filters.push(`sepia(${element.filters.sepia})`);

    if (filters.length > 0) {
      style.filter = filters.join(" ");
    }
  }

  // Handle mask shapes
  if (element.mask) {
    switch (element.mask.type) {
      case "circle":
        style.clipPath = "circle(50%)";
        break;
      case "ellipse":
        style.clipPath = "ellipse(50% 50%)";
        break;
      case "custom":
        if (element.mask.path) {
          style.clipPath = `path('${element.mask.path}')`;
        }
        break;
    }
  }

  const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    target.src = element.placeholder || PLACEHOLDER_SVG;
  };

  return (
    <div
      className="vivid-image-element"
      style={{
        width: "100%",
        height: "100%",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <img
        src={element.src}
        alt={element.alt}
        style={style}
        draggable={false}
        loading="lazy"
        onError={handleError}
      />
    </div>
  );
};
