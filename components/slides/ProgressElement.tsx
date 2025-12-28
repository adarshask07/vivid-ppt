import React from "react";
import type { ProgressElement as ProgressElementType } from "../../types/slide-schema";
import { resolveColor } from "./utils";

interface ProgressElementProps {
  element: ProgressElementType;
}

export const ProgressElement: React.FC<ProgressElementProps> = ({
  element,
}) => {
  const {
    value,
    max = 100,
    variant,
    label,
    showValue,
    valueFormat = "{value}%",
    colors,
    thickness = 8,
    animated = true,
  } = element;

  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  const trackColor = resolveColor(colors?.track, "rgba(255,255,255,0.1)");
  const fillColor = resolveColor(colors?.fill, "#3b82f6");
  const textColor = resolveColor(colors?.text, "#ffffff");

  const formattedValue = valueFormat
    .replace("{value}", String(value))
    .replace("{percentage}", `${Math.round(percentage)}`);

  // Bar variant
  if (variant === "bar") {
    return (
      <div className="w-full h-full flex flex-col justify-center">
        {(label || showValue) && (
          <div className="flex justify-between items-center mb-2 text-sm">
            {label && <span style={{ color: textColor }}>{label}</span>}
            {showValue && (
              <span style={{ color: textColor }}>{formattedValue}</span>
            )}
          </div>
        )}
        <div
          className="w-full rounded-full overflow-hidden"
          style={{ backgroundColor: trackColor, height: thickness }}
        >
          <div
            className={`h-full rounded-full ${
              animated ? "transition-all duration-1000 ease-out" : ""
            }`}
            style={{
              width: `${percentage}%`,
              backgroundColor: fillColor,
            }}
          />
        </div>
      </div>
    );
  }

  // Circle variant
  if (variant === "circle" || variant === "semicircle") {
    const size = Math.min(element.bounds.width, element.bounds.height);
    const strokeWidth = thickness;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const isSemi = variant === "semicircle";
    const arcLength = isSemi ? circumference / 2 : circumference;
    const offset = arcLength - (percentage / 100) * arcLength;

    return (
      <div className="w-full h-full flex items-center justify-center">
        <div
          className="relative"
          style={{ width: size, height: isSemi ? size / 2 : size }}
        >
          <svg
            width={size}
            height={isSemi ? size / 2 + strokeWidth : size}
            viewBox={`0 0 ${size} ${isSemi ? size / 2 + strokeWidth : size}`}
            style={{ transform: isSemi ? "none" : "rotate(-90deg)" }}
          >
            {/* Track */}
            <circle
              cx={size / 2}
              cy={isSemi ? size / 2 + strokeWidth / 2 : size / 2}
              r={radius}
              fill="none"
              stroke={trackColor}
              strokeWidth={strokeWidth}
              strokeDasharray={
                isSemi ? `${arcLength} ${circumference}` : circumference
              }
              strokeLinecap="round"
              transform={
                isSemi
                  ? `rotate(180, ${size / 2}, ${size / 2 + strokeWidth / 2})`
                  : undefined
              }
            />
            {/* Progress */}
            <circle
              cx={size / 2}
              cy={isSemi ? size / 2 + strokeWidth / 2 : size / 2}
              r={radius}
              fill="none"
              stroke={fillColor}
              strokeWidth={strokeWidth}
              strokeDasharray={isSemi ? arcLength : circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              transform={
                isSemi
                  ? `rotate(180, ${size / 2}, ${size / 2 + strokeWidth / 2})`
                  : undefined
              }
              className={
                animated ? "transition-all duration-1000 ease-out" : ""
              }
            />
          </svg>

          {/* Center text */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center"
            style={{
              color: textColor,
              top: isSemi ? "20%" : 0,
            }}
          >
            {showValue && (
              <span className="text-2xl font-bold">{formattedValue}</span>
            )}
            {label && <span className="text-xs opacity-70">{label}</span>}
          </div>
        </div>
      </div>
    );
  }

  // Gauge variant
  if (variant === "gauge") {
    const size = Math.min(element.bounds.width, element.bounds.height);
    const strokeWidth = thickness * 2;
    const radius = (size - strokeWidth) / 2;
    const startAngle = 135;
    const endAngle = 405;
    const range = endAngle - startAngle;
    const valueAngle = startAngle + (percentage / 100) * range;

    const polarToCartesian = (
      cx: number,
      cy: number,
      r: number,
      angle: number
    ) => {
      const rad = (angle * Math.PI) / 180;
      return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
    };

    const describeArc = (
      cx: number,
      cy: number,
      r: number,
      start: number,
      end: number
    ) => {
      const startPoint = polarToCartesian(cx, cy, r, start);
      const endPoint = polarToCartesian(cx, cy, r, end);
      const largeArc = end - start > 180 ? 1 : 0;
      return `M ${startPoint.x} ${startPoint.y} A ${r} ${r} 0 ${largeArc} 1 ${endPoint.x} ${endPoint.y}`;
    };

    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="relative" style={{ width: size, height: size * 0.75 }}>
          <svg
            width={size}
            height={size * 0.75}
            viewBox={`0 0 ${size} ${size * 0.75}`}
          >
            {/* Track */}
            <path
              d={describeArc(size / 2, size / 2, radius, startAngle, endAngle)}
              fill="none"
              stroke={trackColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            {/* Progress */}
            <path
              d={describeArc(
                size / 2,
                size / 2,
                radius,
                startAngle,
                valueAngle
              )}
              fill="none"
              stroke={fillColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              className={
                animated ? "transition-all duration-1000 ease-out" : ""
              }
            />
          </svg>

          {/* Center text */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-end pb-4"
            style={{ color: textColor }}
          >
            {showValue && (
              <span className="text-3xl font-bold">{formattedValue}</span>
            )}
            {label && <span className="text-sm opacity-70">{label}</span>}
          </div>
        </div>
      </div>
    );
  }

  return null;
};
