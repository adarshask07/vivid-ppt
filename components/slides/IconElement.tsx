import React from "react";
import type { IconElement as IconElementType } from "../../types/slide-schema";
import { resolveColor } from "./utils";
import * as LucideIcons from "lucide-react";

interface IconElementProps {
  element: IconElementType;
}

export const IconElement: React.FC<IconElementProps> = ({ element }) => {
  const { icon, color, strokeWidth = 2, fill } = element;

  const iconColor = resolveColor(color, "#ffffff");
  const fillColor = fill ? resolveColor(fill, "none") : "none";

  // Get icon from Lucide
  const IconComponent =
    (LucideIcons as any)[toPascalCase(icon)] || LucideIcons.HelpCircle;

  return (
    <div className="w-full h-full flex items-center justify-center">
      <IconComponent
        size="100%"
        color={iconColor}
        strokeWidth={strokeWidth}
        fill={fillColor}
        className="w-full h-full"
      />
    </div>
  );
};

// Convert kebab-case to PascalCase for Lucide icons
function toPascalCase(str: string): string {
  return str
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join("");
}
