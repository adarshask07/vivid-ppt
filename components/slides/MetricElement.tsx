import React from "react";
import type { MetricElement as MetricElementType } from "../../types/slide-schema";
import { resolveColor, fillToCSS } from "./utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface MetricElementProps {
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
    switch (change.direction) {
      case "up":
        return <TrendingUp size={size} className="text-green-500" />;
      case "down":
        return <TrendingDown size={size} className="text-red-500" />;
      default:
        return <Minus size={size} className="text-gray-400" />;
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
      className="w-full h-full rounded-xl p-6 flex flex-col justify-center"
      style={bgStyle}
    >
      {/* Icon */}
      {icon && (
        <div className="mb-2 opacity-60">
          <span className="text-2xl">{icon}</span>
        </div>
      )}

      {/* Value */}
      <div
        className="flex items-baseline gap-1"
        style={{
          fontSize: valueStyle?.fontSize || 36,
          fontWeight: valueStyle?.fontWeight || 700,
          color: resolveColor(valueStyle?.color, "#ffffff"),
          lineHeight: 1.2,
        }}
      >
        {prefix && <span className="text-[0.6em] opacity-70">{prefix}</span>}
        <span>{value}</span>
        {suffix && <span className="text-[0.6em] opacity-70">{suffix}</span>}
      </div>

      {/* Label */}
      <div
        className="mt-1"
        style={{
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
          className="flex items-center gap-1.5 mt-3"
          style={{ color: getChangeColor() }}
        >
          {getChangeIcon()}
          <span className="text-sm font-medium">{change.value}</span>
          {change.label && (
            <span className="text-xs opacity-70">{change.label}</span>
          )}
        </div>
      )}
    </div>
  );
};
