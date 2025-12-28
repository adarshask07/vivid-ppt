// ============================================================================
// ICON ELEMENT COMPONENT
// ============================================================================

import React from "react";
import * as LucideIcons from "lucide-react";
import type { IconElement as IconElementType } from "../../types";
import { resolveColor } from "../../utils";

export interface IconElementProps {
  element: IconElementType;
}

export const IconElement: React.FC<IconElementProps> = ({ element }) => {
  const { icon, color, strokeWidth = 2, fill } = element;

  // Try to find the icon in Lucide
  const iconName = icon
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");

  // Access lucide icons dynamically
  const icons = LucideIcons as unknown as Record<
    string,
    React.FC<LucideIcons.LucideProps>
  >;
  const IconComponent = icons[iconName];

  if (!IconComponent) {
    // Fallback: show icon name
    return (
      <div
        className="vivid-icon-element"
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: resolveColor(color, "#ffffff"),
          fontSize: 14,
          opacity: 0.5,
        }}
      >
        {icon}
      </div>
    );
  }

  return (
    <div
      className="vivid-icon-element"
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <IconComponent
        size="100%"
        color={resolveColor(color, "#ffffff")}
        strokeWidth={strokeWidth}
        fill={fill ? resolveColor(fill, "none") : "none"}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
};
