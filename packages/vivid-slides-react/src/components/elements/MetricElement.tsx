// ============================================================================
// METRIC ELEMENT COMPONENT
// ============================================================================

import React from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { MetricElement as MetricElementType } from "../../types";
import { resolveColor, fillToCSS } from "../../utils";

export interface MetricElementProps {
  element: MetricElementType;
}

export const MetricElement: React.FC<MetricElementProps> = ({ element }) => {
  const {
    value,
    label,
    prefix,
    suffix,
    change,
    icon,
    fill,
    valueStyle,
    labelStyle,
  } = element;

  const bgStyle = fill
    ? fillToCSS(fill)
    : { backgroundColor: "rgba(255,255,255,0.05)" };

  const getChangeIcon = () => {
    if (!change) return null;
    const size = 16;
    const iconStyle = {
      color:
        change.direction === "up"
          ? "#22c55e"
          : change.direction === "down"
          ? "#ef4444"
          : "#9ca3af",
    };
    switch (change.direction) {
      case "up":
        return <TrendingUp size={size} style={iconStyle} />;
      case "down":
        return <TrendingDown size={size} style={iconStyle} />;
      default:
        return <Minus size={size} style={iconStyle} />;
    }
  };

  const getChangeColor = () => {
    if (!change) return "inherit";
    switch (change.direction) {
      case "up":
        return "#22c55e";
      case "down":
        return "#ef4444";
      default:
        return "#9ca3af";
    }
  };

  return (
    <div
      className="vivid-metric-element"
      style={{
        ...bgStyle,
        width: "100%",
        height: "100%",
        borderRadius: 12,
        padding: 24,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      {/* Icon */}
      {icon && (
        <div style={{ marginBottom: 8, opacity: 0.6 }}>
          <span style={{ fontSize: 24 }}>{icon}</span>
        </div>
      )}

      {/* Value */}
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: 4,
          fontSize: valueStyle?.fontSize || 36,
          fontWeight: valueStyle?.fontWeight || 700,
          color: resolveColor(valueStyle?.color, "#ffffff"),
          lineHeight: 1.2,
        }}
      >
        {prefix && (
          <span style={{ fontSize: "0.6em", opacity: 0.7 }}>{prefix}</span>
        )}
        <span>{value}</span>
        {suffix && (
          <span style={{ fontSize: "0.6em", opacity: 0.7 }}>{suffix}</span>
        )}
      </div>

      {/* Label */}
      <div
        style={{
          marginTop: 4,
          fontSize: labelStyle?.fontSize || 14,
          fontWeight: labelStyle?.fontWeight || 400,
          color: resolveColor(labelStyle?.color, "rgba(255,255,255,0.7)"),
        }}
      >
        {label}
      </div>

      {/* Change indicator */}
      {change && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            marginTop: 12,
            color: getChangeColor(),
          }}
        >
          {getChangeIcon()}
          <span style={{ fontSize: 14, fontWeight: 500 }}>{change.value}</span>
          {change.label && (
            <span style={{ fontSize: 12, opacity: 0.7 }}>{change.label}</span>
          )}
        </div>
      )}
    </div>
  );
};
