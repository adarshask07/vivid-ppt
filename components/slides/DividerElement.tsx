import React from "react";
import type { DividerElement as DividerElementType } from "../../types/slide-schema";
import { resolveColor } from "./utils";

interface DividerElementProps {
  element: DividerElementType;
}

export const DividerElement: React.FC<DividerElementProps> = ({ element }) => {
  const {
    orientation,
    style: dividerStyle,
    color,
    thickness = 1,
    gradient,
    decoratorStart,
    decoratorEnd,
  } = element;

  const lineColor = resolveColor(color, "rgba(255,255,255,0.2)");
  const isHorizontal = orientation === "horizontal";

  const renderDecorator = (
    type: string | undefined,
    position: "start" | "end"
  ) => {
    if (!type || type === "none") return null;

    const size = Math.max(thickness * 4, 8);

    switch (type) {
      case "dot":
        return (
          <span
            className="rounded-full flex-shrink-0"
            style={{
              width: size,
              height: size,
              backgroundColor: lineColor,
            }}
          />
        );
      case "diamond":
        return (
          <span
            className="flex-shrink-0"
            style={{
              width: size,
              height: size,
              backgroundColor: lineColor,
              transform: "rotate(45deg)",
            }}
          />
        );
      case "arrow":
        return (
          <span
            className="flex-shrink-0"
            style={{
              width: 0,
              height: 0,
              borderTop: `${size / 2}px solid transparent`,
              borderBottom: `${size / 2}px solid transparent`,
              ...(isHorizontal
                ? position === "start"
                  ? { borderRight: `${size}px solid ${lineColor}` }
                  : { borderLeft: `${size}px solid ${lineColor}` }
                : position === "start"
                ? {
                    borderBottom: `${size}px solid ${lineColor}`,
                    borderTop: "none",
                  }
                : {
                    borderTop: `${size}px solid ${lineColor}`,
                    borderBottom: "none",
                  }),
            }}
          />
        );
      default:
        return null;
    }
  };

  const getLineStyle = (): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      flex: 1,
      ...(isHorizontal
        ? { height: thickness, width: "100%" }
        : { width: thickness, height: "100%" }),
    };

    if (dividerStyle === "gradient" && gradient) {
      const stops = gradient.stops
        .map((s) => `${resolveColor(s.color)} ${s.position}%`)
        .join(", ");

      if (gradient.type === "linear") {
        baseStyle.background = `linear-gradient(${
          isHorizontal ? gradient.angle : gradient.angle + 90
        }deg, ${stops})`;
      }
    } else {
      baseStyle.backgroundColor = lineColor;

      if (dividerStyle === "dashed") {
        baseStyle.background = `repeating-linear-gradient(
          ${isHorizontal ? "90deg" : "0deg"},
          ${lineColor},
          ${lineColor} 8px,
          transparent 8px,
          transparent 16px
        )`;
        baseStyle.backgroundColor = "transparent";
      } else if (dividerStyle === "dotted") {
        baseStyle.background = `repeating-linear-gradient(
          ${isHorizontal ? "90deg" : "0deg"},
          ${lineColor},
          ${lineColor} 2px,
          transparent 2px,
          transparent 6px
        )`;
        baseStyle.backgroundColor = "transparent";
      }
    }

    return baseStyle;
  };

  return (
    <div
      className={`w-full h-full flex items-center justify-center gap-2 ${
        isHorizontal ? "flex-row" : "flex-col"
      }`}
    >
      {renderDecorator(decoratorStart, "start")}
      <div style={getLineStyle()} />
      {renderDecorator(decoratorEnd, "end")}
    </div>
  );
};
