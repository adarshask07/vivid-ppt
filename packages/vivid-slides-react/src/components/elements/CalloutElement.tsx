// ============================================================================
// CALLOUT ELEMENT COMPONENT
// ============================================================================

import React from "react";
import {
  Info,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Lightbulb,
  FileText,
  Quote,
} from "lucide-react";
import type { CalloutElement as CalloutElementType } from "../../types";
import { resolveColor, fillToCSS } from "../../utils";

export interface CalloutElementProps {
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
        className="vivid-callout-element"
        style={{
          ...bgStyle,
          width: "100%",
          height: "100%",
          borderRadius: 12,
          padding: 24,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Large quote mark */}
        <div
          style={{
            position: "absolute",
            top: 16,
            left: 24,
            fontSize: 48,
            fontFamily: "serif",
            opacity: 0.2,
            color: accent,
          }}
        >
          "
        </div>

        {/* Quote content */}
        <blockquote
          style={{
            position: "relative",
            zIndex: 1,
            paddingLeft: 32,
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
          <div
            style={{
              marginTop: 16,
              paddingLeft: 32,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <div
              style={{
                width: 32,
                height: 2,
                borderRadius: 1,
                backgroundColor: accent,
              }}
            />
            <div style={{ fontSize: 14 }}>
              {author && (
                <span style={{ fontWeight: 600, opacity: 0.9 }}>{author}</span>
              )}
              {author && authorTitle && (
                <span style={{ opacity: 0.5 }}> — </span>
              )}
              {authorTitle && (
                <span style={{ opacity: 0.6 }}>{authorTitle}</span>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className="vivid-callout-element"
      style={{
        ...bgStyle,
        width: "100%",
        height: "100%",
        borderRadius: 12,
        padding: 20,
        display: "flex",
        gap: 16,
        alignItems: "flex-start",
        borderLeft: `4px solid ${accent}`,
      }}
    >
      {/* Icon */}
      <div style={{ flexShrink: 0, marginTop: 2, color: accent }}>
        {icon ? (
          <span style={{ fontSize: 20 }}>{icon}</span>
        ) : (
          <IconComponent size={22} />
        )}
      </div>

      {/* Content */}
      <div
        style={{
          flex: 1,
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
