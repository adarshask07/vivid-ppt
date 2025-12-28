// ============================================================================
// CODE ELEMENT COMPONENT
// ============================================================================

import React from "react";
import type { CodeElement as CodeElementType } from "../../types";

export interface CodeElementProps {
  element: CodeElementType;
}

const themeStyles: Record<
  string,
  { bg: string; text: string; keyword: string; string: string; comment: string }
> = {
  dark: {
    bg: "#1e1e1e",
    text: "#d4d4d4",
    keyword: "#569cd6",
    string: "#ce9178",
    comment: "#6a9955",
  },
  light: {
    bg: "#ffffff",
    text: "#333333",
    keyword: "#0000ff",
    string: "#a31515",
    comment: "#008000",
  },
  monokai: {
    bg: "#272822",
    text: "#f8f8f2",
    keyword: "#f92672",
    string: "#e6db74",
    comment: "#75715e",
  },
  dracula: {
    bg: "#282a36",
    text: "#f8f8f2",
    keyword: "#ff79c6",
    string: "#f1fa8c",
    comment: "#6272a4",
  },
  github: {
    bg: "#f6f8fa",
    text: "#24292e",
    keyword: "#d73a49",
    string: "#032f62",
    comment: "#6a737d",
  },
};

// Basic syntax highlighting (no external library)
function highlightCode(
  code: string,
  _language: string,
  theme: typeof themeStyles.dark
): string {
  // Simple keyword-based highlighting (language-aware highlighting could be added)
  const keywords = [
    "const",
    "let",
    "var",
    "function",
    "return",
    "if",
    "else",
    "for",
    "while",
    "class",
    "import",
    "export",
    "from",
    "default",
    "async",
    "await",
    "try",
    "catch",
    "throw",
    "new",
    "this",
    "true",
    "false",
    "null",
    "undefined",
  ];

  let result = code
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Comments
  result = result.replace(
    /(\/\/.*$)/gm,
    `<span style="color:${theme.comment}">$1</span>`
  );
  result = result.replace(
    /(\/\*[\s\S]*?\*\/)/g,
    `<span style="color:${theme.comment}">$1</span>`
  );

  // Strings
  result = result.replace(
    /("(?:[^"\\]|\\.)*")/g,
    `<span style="color:${theme.string}">$1</span>`
  );
  result = result.replace(
    /('(?:[^'\\]|\\.)*')/g,
    `<span style="color:${theme.string}">$1</span>`
  );
  result = result.replace(
    /(`(?:[^`\\]|\\.)*`)/g,
    `<span style="color:${theme.string}">$1</span>`
  );

  // Keywords
  keywords.forEach((keyword) => {
    const regex = new RegExp(`\\b(${keyword})\\b`, "g");
    result = result.replace(
      regex,
      `<span style="color:${theme.keyword}">$1</span>`
    );
  });

  return result;
}

export const CodeElement: React.FC<CodeElementProps> = ({ element }) => {
  const {
    code,
    language,
    theme = "dark",
    showLineNumbers,
    highlightLines,
    fontSize = 14,
  } = element;

  const themeStyle = themeStyles[theme] || themeStyles.dark;
  const highlightedCode = highlightCode(code, language, themeStyle);
  const highlightedLines = highlightedCode.split("\n");

  return (
    <div
      className="vivid-code-element"
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: themeStyle.bg,
        borderRadius: 8,
        overflow: "auto",
        fontFamily: "'Fira Code', 'Monaco', 'Consolas', monospace",
        fontSize,
        lineHeight: 1.5,
      }}
    >
      {/* Language badge */}
      <div
        style={{
          padding: "8px 16px",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
          fontSize: 12,
          color: themeStyle.text,
          opacity: 0.6,
          textTransform: "uppercase",
        }}
      >
        {language}
      </div>

      {/* Code content */}
      <pre style={{ margin: 0, padding: 16 }}>
        <code>
          {highlightedLines.map((line, index) => {
            const lineNum = index + 1;
            const isHighlighted = highlightLines?.includes(lineNum);

            return (
              <div
                key={index}
                style={{
                  display: "flex",
                  backgroundColor: isHighlighted
                    ? "rgba(255,255,0,0.1)"
                    : "transparent",
                  marginLeft: showLineNumbers ? 0 : -16,
                  marginRight: -16,
                  paddingLeft: showLineNumbers ? 0 : 16,
                  paddingRight: 16,
                }}
              >
                {showLineNumbers && (
                  <span
                    style={{
                      width: 40,
                      flexShrink: 0,
                      color: themeStyle.text,
                      opacity: 0.3,
                      textAlign: "right",
                      paddingRight: 16,
                      userSelect: "none",
                    }}
                  >
                    {lineNum}
                  </span>
                )}
                <span
                  style={{ color: themeStyle.text }}
                  dangerouslySetInnerHTML={{ __html: line || "&nbsp;" }}
                />
              </div>
            );
          })}
        </code>
      </pre>
    </div>
  );
};
