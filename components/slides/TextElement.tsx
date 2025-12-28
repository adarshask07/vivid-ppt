import React from "react";
import type {
  TextElement as TextElementType,
  TextStyle,
} from "../../types/slide-schema";
import { resolveColor, fillToCSS } from "./utils";

interface TextElementProps {
  element: TextElementType;
}

const semanticStyleDefaults: Record<string, Partial<TextStyle>> = {
  h1: { fontSize: 48, fontWeight: 700, lineHeight: 1.2 },
  h2: { fontSize: 36, fontWeight: 600, lineHeight: 1.3 },
  h3: { fontSize: 28, fontWeight: 600, lineHeight: 1.4 },
  h4: { fontSize: 22, fontWeight: 500, lineHeight: 1.4 },
  body: { fontSize: 18, fontWeight: 400, lineHeight: 1.6 },
  "body-small": { fontSize: 14, fontWeight: 400, lineHeight: 1.5 },
  caption: { fontSize: 12, fontWeight: 400, lineHeight: 1.4 },
  quote: {
    fontSize: 24,
    fontWeight: 400,
    lineHeight: 1.5,
    fontStyle: "italic",
  },
  code: {
    fontSize: 14,
    fontWeight: 400,
    lineHeight: 1.5,
    fontFamily: "monospace",
  },
};

export const TextElement: React.FC<TextElementProps> = ({ element }) => {
  const baseStyle = element.semanticStyle
    ? semanticStyleDefaults[element.semanticStyle] || {}
    : {};

  const mergedStyle = { ...baseStyle, ...element.textStyle };

  const style: React.CSSProperties = {
    width: "100%",
    height: "100%",
    fontSize: mergedStyle.fontSize,
    fontWeight: mergedStyle.fontWeight,
    fontStyle: mergedStyle.fontStyle,
    fontFamily: mergedStyle.fontFamily,
    color: resolveColor(mergedStyle.color, "#ffffff"),
    lineHeight: mergedStyle.lineHeight,
    letterSpacing: mergedStyle.letterSpacing,
    wordSpacing: mergedStyle.wordSpacing,
    textAlign:
      mergedStyle.textAlign || element.paragraphStyle?.listStyle
        ? "left"
        : "left",
    textDecoration: mergedStyle.textDecoration,
    textTransform: mergedStyle.textTransform,
    display: "flex",
    flexDirection: "column",
    justifyContent:
      element.verticalAlign === "middle"
        ? "center"
        : element.verticalAlign === "bottom"
        ? "flex-end"
        : "flex-start",
    overflow: "hidden",
    ...fillToCSS(element.fill),
    ...(element.padding && {
      paddingTop: element.padding.top,
      paddingRight: element.padding.right,
      paddingBottom: element.padding.bottom,
      paddingLeft: element.padding.left,
    }),
  };

  // Handle columns
  if (element.columns && element.columns > 1) {
    style.columnCount = element.columns;
    style.columnGap = element.columnGap || 20;
  }

  return (
    <div
      style={style}
      className="text-element"
      dangerouslySetInnerHTML={{ __html: element.content }}
    />
  );
};
