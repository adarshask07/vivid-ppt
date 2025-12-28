import React from "react";
import type { CodeElement as CodeElementType } from "../../types/slide-schema";

interface CodeElementProps {
  element: CodeElementType;
}

// Simple syntax highlighting themes
const themes = {
  dark: {
    background: "#1e1e1e",
    text: "#d4d4d4",
    comment: "#6a9955",
    keyword: "#569cd6",
    string: "#ce9178",
    number: "#b5cea8",
    function: "#dcdcaa",
  },
  light: {
    background: "#ffffff",
    text: "#1f1f1f",
    comment: "#008000",
    keyword: "#0000ff",
    string: "#a31515",
    number: "#098658",
    function: "#795e26",
  },
  monokai: {
    background: "#272822",
    text: "#f8f8f2",
    comment: "#75715e",
    keyword: "#f92672",
    string: "#e6db74",
    number: "#ae81ff",
    function: "#a6e22e",
  },
  dracula: {
    background: "#282a36",
    text: "#f8f8f2",
    comment: "#6272a4",
    keyword: "#ff79c6",
    string: "#f1fa8c",
    number: "#bd93f9",
    function: "#50fa7b",
  },
  github: {
    background: "#f6f8fa",
    text: "#24292f",
    comment: "#6a737d",
    keyword: "#d73a49",
    string: "#032f62",
    number: "#005cc5",
    function: "#6f42c1",
  },
};

export const CodeElement: React.FC<CodeElementProps> = ({ element }) => {
  const {
    code,
    language,
    theme = "dark",
    showLineNumbers = true,
    highlightLines = [],
    fontSize = 14,
  } = element;

  const colors = themes[theme] || themes.dark;
  const lines = code.split("\n");

  return (
    <div
      className="w-full h-full rounded-lg overflow-hidden font-mono"
      style={{
        backgroundColor: colors.background,
        fontSize,
      }}
    >
      {/* Language badge */}
      {language && (
        <div
          className="sticky top-0 right-0 float-right px-2 py-1 text-xs rounded-bl opacity-60"
          style={{
            backgroundColor: "rgba(128,128,128,0.2)",
            color: colors.text,
          }}
        >
          {language}
        </div>
      )}

      <pre className="p-4 m-0">
        <code style={{ color: colors.text }}>
          {lines.map((line, index) => {
            const lineNumber = index + 1;
            const isHighlighted = highlightLines.includes(lineNumber);

            return (
              <div
                key={index}
                className="flex"
                style={{
                  backgroundColor: isHighlighted
                    ? "rgba(255,255,0,0.1)"
                    : "transparent",
                  marginLeft: showLineNumbers ? 0 : -8,
                  paddingLeft: showLineNumbers ? 0 : 8,
                }}
              >
                {showLineNumbers && (
                  <span
                    className="select-none pr-4 text-right"
                    style={{
                      color: colors.comment,
                      minWidth: `${String(lines.length).length + 1}ch`,
                      opacity: 0.5,
                    }}
                  >
                    {lineNumber}
                  </span>
                )}
                <span className="flex-1">
                  {highlightSyntax(line, language, colors)}
                </span>
              </div>
            );
          })}
        </code>
      </pre>
    </div>
  );
};

// Basic syntax highlighting (simplified)
function highlightSyntax(
  line: string,
  language: string,
  colors: typeof themes.dark
): React.ReactNode {
  // Very basic keyword highlighting - in production use a proper library like Prism
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
    "def",
    "print",
    "True",
    "False",
    "None",
    "self",
    "lambda",
  ];

  // Simple regex-based highlighting
  const parts: { text: string; color: string }[] = [];
  let remaining = line;

  // Comments
  const commentMatch = remaining.match(/(\/\/.*|#.*|\/\*.*\*\/)/);
  if (commentMatch) {
    const idx = remaining.indexOf(commentMatch[0]);
    if (idx > 0) {
      parts.push({ text: remaining.slice(0, idx), color: colors.text });
    }
    parts.push({ text: commentMatch[0], color: colors.comment });
    remaining = remaining.slice(idx + commentMatch[0].length);
  }

  if (remaining && parts.length === 0) {
    // Strings
    const stringParts = remaining.split(/(".*?"|'.*?'|`.*?`)/g);
    stringParts.forEach((part, i) => {
      if (i % 2 === 1) {
        parts.push({ text: part, color: colors.string });
      } else if (part) {
        // Keywords and other
        const words = part.split(/(\s+)/);
        words.forEach((word) => {
          if (keywords.includes(word)) {
            parts.push({ text: word, color: colors.keyword });
          } else if (/^\d+$/.test(word)) {
            parts.push({ text: word, color: colors.number });
          } else if (/^\w+\(/.test(word)) {
            const funcName = word.slice(0, -1);
            parts.push({ text: funcName, color: colors.function });
            parts.push({ text: "(", color: colors.text });
          } else {
            parts.push({ text: word, color: colors.text });
          }
        });
      }
    });
  }

  if (parts.length === 0) {
    return line;
  }

  return parts.map((part, i) => (
    <span key={i} style={{ color: part.color }}>
      {part.text}
    </span>
  ));
}
