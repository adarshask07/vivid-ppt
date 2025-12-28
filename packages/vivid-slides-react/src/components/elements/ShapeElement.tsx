// ============================================================================
// SHAPE ELEMENT COMPONENT
// ============================================================================

import React from "react";
import type { ShapeElement as ShapeElementType } from "../../types";
import { resolveColor } from "../../utils";

export interface ShapeElementProps {
  element: ShapeElementType;
}

export const ShapeElement: React.FC<ShapeElementProps> = ({ element }) => {
  const fillColor =
    element.fill?.type === "solid"
      ? resolveColor(element.fill.color)
      : "transparent";

  const strokeColor = element.stroke?.color
    ? resolveColor(element.stroke.color)
    : "transparent";
  const strokeWidth = element.stroke?.width || 0;
  const strokeDasharray =
    element.stroke?.dashArray?.join(" ") ||
    (element.stroke?.style === "dashed"
      ? "8 4"
      : element.stroke?.style === "dotted"
      ? "2 2"
      : undefined);

  const cornerRadius =
    typeof element.cornerRadius === "number" ? element.cornerRadius : 0;

  // Stroke styling applied directly (avoiding type issues with spread on SVG elements)
  const getStrokeStyle = () => ({
    stroke: strokeColor,
    strokeWidth,
    strokeDasharray,
    strokeLinecap: (element.stroke?.lineCap || "round") as
      | "round"
      | "butt"
      | "square",
    strokeLinejoin: (element.stroke?.lineJoin || "round") as
      | "round"
      | "miter"
      | "bevel",
  });

  // Generate gradient if needed
  const renderGradient = () => {
    if (element.fill?.type !== "gradient") return null;

    const { gradient } = element.fill;
    const gradientId = `gradient-${element.id}`;

    if (gradient.type === "linear") {
      const angle = gradient.angle || 0;
      const rad = (angle * Math.PI) / 180;
      const x1 = 50 - Math.cos(rad) * 50;
      const y1 = 50 - Math.sin(rad) * 50;
      const x2 = 50 + Math.cos(rad) * 50;
      const y2 = 50 + Math.sin(rad) * 50;

      return (
        <linearGradient
          id={gradientId}
          x1={`${x1}%`}
          y1={`${y1}%`}
          x2={`${x2}%`}
          y2={`${y2}%`}
        >
          {gradient.stops.map((stop, i) => (
            <stop
              key={i}
              offset={`${stop.position}%`}
              stopColor={resolveColor(stop.color)}
            />
          ))}
        </linearGradient>
      );
    }

    return (
      <radialGradient
        id={gradientId}
        cx={gradient.centerX}
        cy={gradient.centerY}
        r={gradient.radius}
      >
        {gradient.stops.map((stop, i) => (
          <stop
            key={i}
            offset={`${stop.position}%`}
            stopColor={resolveColor(stop.color)}
          />
        ))}
      </radialGradient>
    );
  };

  const getFill = () => {
    if (element.fill?.type === "gradient") {
      return `url(#gradient-${element.id})`;
    }
    return fillColor;
  };

  const renderShape = () => {
    const { bounds } = element;
    const w = bounds.width;
    const h = bounds.height;
    const strokeStyle = getStrokeStyle();

    switch (element.variant) {
      case "rectangle":
      case "rounded-rect":
      case "square":
        return (
          <rect
            x={strokeWidth / 2}
            y={strokeWidth / 2}
            width={w - strokeWidth}
            height={h - strokeWidth}
            rx={cornerRadius}
            ry={cornerRadius}
            fill={getFill()}
            {...strokeStyle}
          />
        );

      case "circle": {
        const radius = Math.min(w, h) / 2 - strokeWidth / 2;
        return (
          <circle
            cx={w / 2}
            cy={h / 2}
            r={radius}
            fill={getFill()}
            {...strokeStyle}
          />
        );
      }

      case "ellipse":
      case "oval":
        return (
          <ellipse
            cx={w / 2}
            cy={h / 2}
            rx={w / 2 - strokeWidth / 2}
            ry={h / 2 - strokeWidth / 2}
            fill={getFill()}
            {...strokeStyle}
          />
        );

      case "triangle":
        return (
          <polygon
            points={`${w / 2},${strokeWidth} ${w - strokeWidth},${
              h - strokeWidth
            } ${strokeWidth},${h - strokeWidth}`}
            fill={getFill()}
            {...strokeStyle}
          />
        );

      case "diamond":
        return (
          <polygon
            points={`${w / 2},${strokeWidth} ${w - strokeWidth},${h / 2} ${
              w / 2
            },${h - strokeWidth} ${strokeWidth},${h / 2}`}
            fill={getFill()}
            {...strokeStyle}
          />
        );

      case "star":
      case "star-4":
      case "star-6": {
        const points =
          element.variant === "star-4"
            ? 4
            : element.variant === "star-6"
            ? 6
            : 5;
        const outerRadius = Math.min(w, h) / 2 - strokeWidth;
        const innerRadius = outerRadius * (element.innerRadius || 0.4);
        const cx = w / 2;
        const cy = h / 2;

        const starPoints: string[] = [];
        for (let i = 0; i < points * 2; i++) {
          const r = i % 2 === 0 ? outerRadius : innerRadius;
          const angle = (i * Math.PI) / points - Math.PI / 2;
          starPoints.push(
            `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`
          );
        }

        return (
          <polygon
            points={starPoints.join(" ")}
            fill={getFill()}
            {...strokeStyle}
          />
        );
      }

      case "hexagon": {
        const cx = w / 2;
        const cy = h / 2;
        const r = Math.min(w, h) / 2 - strokeWidth;
        const hexPoints: string[] = [];
        for (let i = 0; i < 6; i++) {
          const angle = (i * Math.PI) / 3 - Math.PI / 6;
          hexPoints.push(
            `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`
          );
        }
        return (
          <polygon
            points={hexPoints.join(" ")}
            fill={getFill()}
            {...strokeStyle}
          />
        );
      }

      case "arrow-right":
        return (
          <polygon
            points={`${strokeWidth},${h * 0.25} ${w * 0.6},${h * 0.25} ${
              w * 0.6
            },${strokeWidth} ${w - strokeWidth},${h / 2} ${w * 0.6},${
              h - strokeWidth
            } ${w * 0.6},${h * 0.75} ${strokeWidth},${h * 0.75}`}
            fill={getFill()}
            {...strokeStyle}
          />
        );

      case "line":
        return (
          <line
            x1={strokeWidth}
            y1={h / 2}
            x2={w - strokeWidth}
            y2={h / 2}
            {...strokeStyle}
          />
        );

      case "custom":
        if (element.path) {
          return <path d={element.path} fill={getFill()} {...strokeStyle} />;
        }
        return null;

      default:
        return (
          <rect
            x={strokeWidth / 2}
            y={strokeWidth / 2}
            width={w - strokeWidth}
            height={h - strokeWidth}
            rx={cornerRadius}
            fill={getFill()}
            {...strokeStyle}
          />
        );
    }
  };

  return (
    <svg
      width="100%"
      height="100%"
      viewBox={`0 0 ${element.bounds.width} ${element.bounds.height}`}
      preserveAspectRatio="none"
      className="vivid-shape-element"
    >
      <defs>{renderGradient()}</defs>
      {renderShape()}
    </svg>
  );
};
