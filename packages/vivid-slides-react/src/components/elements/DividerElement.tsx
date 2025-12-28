// ============================================================================
// DIVIDER ELEMENT COMPONENT
// ============================================================================

import React from "react";
import type { DividerElement as DividerElementType } from "../../types";
import { resolveColor } from "../../utils";

export interface DividerElementProps {
  element: DividerElementType;
}

export const DividerElement: React.FC<DividerElementProps> = ({ element }) => {
  const {
    orientation,
    style: dividerStyle,
    color,
    thickness = 2,
    gradient,
    decoratorStart,
    decoratorEnd,
  } = element;

  const dividerColor = resolveColor(color, "rgba(255,255,255,0.2)");
  const isHorizontal = orientation === "horizontal";

  const getDecoratorStyle = (): React.CSSProperties => ({
    width: 8,
    height: 8,
    backgroundColor: dividerColor,
    flexShrink: 0,
  });

  const renderDecorator = (type: typeof decoratorStart) => {
    if (!type || type === "none") return null;

    const baseStyle = getDecoratorStyle();

    switch (type) {
      case "dot":
        return <span style={{ ...baseStyle, borderRadius: "50%" }} />;
      case "diamond":
        return <span style={{ ...baseStyle, transform: "rotate(45deg)" }} />;
      case "arrow":
        return (
          <span
            style={{
              width: 0,
              height: 0,
              borderLeft: `6px solid transparent`,
              borderRight: `6px solid transparent`,
              borderBottom: `8px solid ${dividerColor}`,
              transform: isHorizontal ? "rotate(-90deg)" : "rotate(180deg)",
            }}
          />
        );
      default:
        return null;
    }
  };

  const lineStyle: React.CSSProperties = {
    flex: 1,
    backgroundColor: dividerColor,
    ...(isHorizontal
      ? { height: thickness, width: "100%" }
      : { width: thickness, height: "100%" }),
  };

  if (dividerStyle === "dashed") {
    lineStyle.background = `repeating-linear-gradient(${
      isHorizontal ? "90deg" : "0deg"
    }, ${dividerColor} 0px, ${dividerColor} 8px, transparent 8px, transparent 16px)`;
    lineStyle.backgroundColor = "transparent";
  } else if (dividerStyle === "dotted") {
    lineStyle.background = `repeating-linear-gradient(${
      isHorizontal ? "90deg" : "0deg"
    }, ${dividerColor} 0px, ${dividerColor} 4px, transparent 4px, transparent 8px)`;
    lineStyle.backgroundColor = "transparent";
  } else if (dividerStyle === "gradient" && gradient) {
    const stops = gradient.stops
      .map((s) => `${resolveColor(s.color)} ${s.position}%`)
      .join(", ");
    if (gradient.type === "linear") {
      lineStyle.background = `linear-gradient(${
        isHorizontal ? "90deg" : "180deg"
      }, ${stops})`;
    } else {
      lineStyle.background = `radial-gradient(circle, ${stops})`;
    }
    lineStyle.backgroundColor = "transparent";
  }

  return (
    <div
      className="vivid-divider-element"
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: isHorizontal ? "row" : "column",
        gap: 8,
      }}
    >
      {renderDecorator(decoratorStart)}
      <div style={lineStyle} />
      {renderDecorator(decoratorEnd)}
    </div>
  );
};
