// ============================================================================
// PROGRESS ELEMENT COMPONENT
// ============================================================================

import React from "react";
import type { ProgressElement as ProgressElementType } from "../../types";
import { resolveColor } from "../../utils";

export interface ProgressElementProps {
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
    valueFormat,
    colors,
    thickness = 8,
  } = element;

  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  const trackColor = resolveColor(colors?.track, "rgba(255,255,255,0.1)");
  const fillColor = resolveColor(colors?.fill, "#3b82f6");
  const textColor = resolveColor(colors?.text, "#ffffff");

  const formatValue = () => {
    if (valueFormat) {
      return valueFormat.replace("{value}", String(Math.round(value)));
    }
    return `${Math.round(percentage)}%`;
  };

  if (variant === "bar") {
    return (
      <div
        className="vivid-progress-element"
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        {label && (
          <div
            style={{
              marginBottom: 8,
              fontSize: 14,
              color: textColor,
              opacity: 0.8,
            }}
          >
            {label}
          </div>
        )}
        <div
          style={{
            width: "100%",
            height: thickness,
            backgroundColor: trackColor,
            borderRadius: thickness / 2,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${percentage}%`,
              backgroundColor: fillColor,
              borderRadius: thickness / 2,
              transition: "width 0.5s ease-out",
            }}
          />
        </div>
        {showValue && (
          <div
            style={{
              marginTop: 8,
              fontSize: 14,
              color: textColor,
              fontWeight: 500,
            }}
          >
            {formatValue()}
          </div>
        )}
      </div>
    );
  }

  if (variant === "circle" || variant === "semicircle" || variant === "gauge") {
    const size = Math.min(element.bounds.width, element.bounds.height);
    const strokeWidth = thickness;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const isSemi = variant === "semicircle" || variant === "gauge";
    const dashOffset =
      circumference -
      (percentage / 100) * (isSemi ? circumference / 2 : circumference);

    return (
      <div
        className="vivid-progress-element"
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            position: "relative",
            width: size,
            height: isSemi ? size / 2 : size,
          }}
        >
          <svg
            width={size}
            height={isSemi ? size / 2 : size}
            viewBox={`0 0 ${size} ${isSemi ? size / 2 : size}`}
          >
            {/* Track */}
            <circle
              cx={size / 2}
              cy={isSemi ? size / 2 : size / 2}
              r={radius}
              fill="none"
              stroke={trackColor}
              strokeWidth={strokeWidth}
              strokeDasharray={
                isSemi ? `${circumference / 2} ${circumference}` : undefined
              }
              strokeLinecap="round"
              transform={
                isSemi ? `rotate(180 ${size / 2} ${size / 2})` : undefined
              }
            />
            {/* Progress */}
            <circle
              cx={size / 2}
              cy={isSemi ? size / 2 : size / 2}
              r={radius}
              fill="none"
              stroke={fillColor}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
              transform={`rotate(${isSemi ? 180 : -90} ${size / 2} ${
                isSemi ? size / 2 : size / 2
              })`}
              style={{ transition: "stroke-dashoffset 0.5s ease-out" }}
            />
          </svg>
          {/* Center value */}
          {showValue && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: size / 4,
                fontWeight: 600,
                color: textColor,
              }}
            >
              {formatValue()}
            </div>
          )}
        </div>
        {label && (
          <div
            style={{
              marginTop: 8,
              fontSize: 14,
              color: textColor,
              opacity: 0.8,
            }}
          >
            {label}
          </div>
        )}
      </div>
    );
  }

  return null;
};
