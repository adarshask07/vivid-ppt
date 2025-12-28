import React from "react";
import type { CalloutElement as CalloutElementType } from "../../types/slide-schema";
import { resolveColor, fillToCSS } from "./utils";
import {
  Info,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Lightbulb,
  FileText,
  Quote,
} from "lucide-react";

interface CalloutElementProps {
  element: CalloutElementType;
}

const variantConfig = {
  quote: {
    icon: Quote,
    defaultAccent: "#8b5cf6",
    defaultBg: "rgba(139, 92, 246, 0.1)",
  },
  info: {
    icon: Info,
    defaultAccent: "#3b82f6",
    defaultBg: "rgba(59, 130, 246, 0.1)",
  },
  warning: {
    icon: AlertTriangle,
    defaultAccent: "#f59e0b",
    defaultBg: "rgba(245, 158, 11, 0.1)",
  },
  success: {
    icon: CheckCircle,
    defaultAccent: "#22c55e",
    defaultBg: "rgba(34, 197, 94, 0.1)",
  },
  error: {
    icon: XCircle,
    defaultAccent: "#ef4444",
    defaultBg: "rgba(239, 68, 68, 0.1)",
  },
  tip: {
    icon: Lightbulb,
    defaultAccent: "#06b6d4",
    defaultBg: "rgba(6, 182, 212, 0.1)",
  },
  note: {
    icon: FileText,
    defaultAccent: "#64748b",
    defaultBg: "rgba(100, 116, 139, 0.1)",
  },
};

export const CalloutElement: React.FC<CalloutElementProps> = ({ element }) => {
  const {
    content,
    variant,
    icon,
    author,
    authorTitle,
    fill,
    accentColor,
    textStyle,
  } = element;

  const config = variantConfig[variant] || variantConfig.note;
  const IconComponent = config.icon;
  const accent = resolveColor(accentColor, config.defaultAccent);
  const bgStyle = fill
    ? fillToCSS(fill)
    : { backgroundColor: config.defaultBg };

  if (variant === "quote") {
    return (
      <div
        className="w-full h-full rounded-xl p-6 flex flex-col justify-center relative overflow-hidden"
        style={bgStyle}
      >
        {/* Large quote mark */}
        <div
          className="absolute top-4 left-6 text-6xl font-serif opacity-20"
          style={{ color: accent }}
        >
          "
        </div>

        {/* Quote content */}
        <blockquote
          className="relative z-10 pl-8"
          style={{
            fontSize: textStyle?.fontSize || 20,
            fontWeight: textStyle?.fontWeight || 400,
            fontStyle: "italic",
            color: resolveColor(textStyle?.color, "#ffffff"),
            lineHeight: textStyle?.lineHeight || 1.6,
          }}
        >
          <p dangerouslySetInnerHTML={{ __html: content }} />
        </blockquote>

        {/* Attribution */}
        {(author || authorTitle) && (
          <div className="mt-4 pl-8 flex items-center gap-2">
            <div
              className="w-8 h-0.5 rounded"
              style={{ backgroundColor: accent }}
            />
            <div className="text-sm">
              {author && (
                <span className="font-semibold opacity-90">{author}</span>
              )}
              {author && authorTitle && <span className="opacity-50"> — </span>}
              {authorTitle && <span className="opacity-60">{authorTitle}</span>}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className="w-full h-full rounded-xl p-5 flex gap-4 items-start"
      style={{
        ...bgStyle,
        borderLeft: `4px solid ${accent}`,
      }}
    >
      {/* Icon */}
      <div className="flex-shrink-0 mt-0.5" style={{ color: accent }}>
        {icon ? (
          <span className="text-xl">{icon}</span>
        ) : (
          <IconComponent size={22} />
        )}
      </div>

      {/* Content */}
      <div
        className="flex-1"
        style={{
          fontSize: textStyle?.fontSize || 16,
          fontWeight: textStyle?.fontWeight || 400,
          color: resolveColor(textStyle?.color, "#ffffff"),
          lineHeight: textStyle?.lineHeight || 1.6,
        }}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
};
