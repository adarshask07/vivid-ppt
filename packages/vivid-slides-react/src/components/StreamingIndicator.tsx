// ============================================================================
// STREAMING INDICATOR - SHOWS AI GENERATION PROGRESS
// ============================================================================

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useVividContext } from "../context";
import type { StreamingStatus } from "../types";

export interface StreamingIndicatorProps {
  /** Custom className */
  className?: string;
  /** Custom style */
  style?: React.CSSProperties;
  /** Show progress bar */
  showProgress?: boolean;
  /** Show slide count */
  showCount?: boolean;
  /** Custom messages for each status */
  messages?: Partial<Record<StreamingStatus, string>>;
  /** Variant style */
  variant?: "bar" | "pill" | "minimal";
  /** Position (for fixed positioning) */
  position?: "top" | "bottom" | "inline";
}

const defaultMessages: Record<StreamingStatus, string> = {
  idle: "Ready",
  connecting: "Connecting...",
  streaming: "Generating slides...",
  complete: "Complete!",
  error: "Error occurred",
  cancelled: "Cancelled",
};

const statusColors: Record<StreamingStatus, string> = {
  idle: "#666",
  connecting: "#f59e0b",
  streaming: "#3b82f6",
  complete: "#22c55e",
  error: "#ef4444",
  cancelled: "#9ca3af",
};

export const StreamingIndicator: React.FC<StreamingIndicatorProps> = ({
  className,
  style,
  showProgress = true,
  showCount = true,
  messages = {},
  variant = "bar",
  position = "inline",
}) => {
  const { streamingStatus, streamingProgress, streamingError, slides } =
    useVividContext();

  const isActive =
    streamingStatus === "connecting" || streamingStatus === "streaming";
  const message = messages[streamingStatus] || defaultMessages[streamingStatus];
  const progress =
    streamingProgress.total > 0
      ? (streamingProgress.current / streamingProgress.total) * 100
      : 0;

  // Don't show if idle
  if (streamingStatus === "idle") {
    return null;
  }

  const positionStyles: React.CSSProperties =
    position === "inline"
      ? {}
      : {
          position: "fixed",
          left: 0,
          right: 0,
          [position]: 0,
          zIndex: 9999,
        };

  // Minimal variant
  if (variant === "minimal") {
    return (
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={className}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              color: statusColors[streamingStatus],
              fontSize: 13,
              ...positionStyles,
              ...style,
            }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              style={{
                width: 14,
                height: 14,
                border: "2px solid currentColor",
                borderTopColor: "transparent",
                borderRadius: "50%",
              }}
            />
            {message}
            {showCount && streamingProgress.total > 0 && (
              <span style={{ opacity: 0.7 }}>
                ({streamingProgress.current}/{streamingProgress.total})
              </span>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  // Pill variant
  if (variant === "pill") {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className={className}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            padding: "8px 16px",
            backgroundColor: "rgba(0,0,0,0.8)",
            borderRadius: 20,
            backdropFilter: "blur(10px)",
            border: `1px solid ${statusColors[streamingStatus]}40`,
            ...positionStyles,
            ...style,
          }}
        >
          {isActive && (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              style={{
                width: 16,
                height: 16,
                border: `2px solid ${statusColors[streamingStatus]}`,
                borderTopColor: "transparent",
                borderRadius: "50%",
              }}
            />
          )}
          {streamingStatus === "complete" && (
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke={statusColors.complete}
              strokeWidth="2"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
          {streamingStatus === "error" && (
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke={statusColors.error}
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
          )}
          <span style={{ color: "#fff", fontSize: 13, fontWeight: 500 }}>
            {message}
          </span>
          {showCount && streamingProgress.total > 0 && (
            <span style={{ color: "#888", fontSize: 12 }}>
              {streamingProgress.current}/{streamingProgress.total} slides
            </span>
          )}
        </motion.div>
      </AnimatePresence>
    );
  }

  // Bar variant (default)
  return (
    <div
      className={className}
      style={{
        backgroundColor: "#1a1a1a",
        borderBottom: "1px solid rgba(255,255,255,0.1)",
        ...positionStyles,
        ...style,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 16px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {isActive && (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              style={{
                width: 16,
                height: 16,
                border: `2px solid ${statusColors[streamingStatus]}`,
                borderTopColor: "transparent",
                borderRadius: "50%",
              }}
            />
          )}
          {streamingStatus === "complete" && (
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke={statusColors.complete}
              strokeWidth="2"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
          {streamingStatus === "error" && (
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke={statusColors.error}
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
          )}
          <span style={{ color: "#fff", fontSize: 14 }}>{message}</span>
          {streamingError && (
            <span style={{ color: statusColors.error, fontSize: 12 }}>
              {streamingError.message}
            </span>
          )}
        </div>

        {showCount && (
          <div style={{ color: "#888", fontSize: 13 }}>
            {slides.length} slide{slides.length !== 1 ? "s" : ""} generated
          </div>
        )}
      </div>

      {/* Progress bar */}
      {showProgress && isActive && streamingProgress.total > 0 && (
        <div style={{ height: 3, backgroundColor: "rgba(255,255,255,0.1)" }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
            style={{
              height: "100%",
              backgroundColor: statusColors.streaming,
            }}
          />
        </div>
      )}

      {/* Indeterminate progress for connecting */}
      {showProgress && streamingStatus === "connecting" && (
        <div
          style={{
            height: 3,
            backgroundColor: "rgba(255,255,255,0.1)",
            overflow: "hidden",
          }}
        >
          <motion.div
            animate={{ x: ["0%", "100%"] }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            style={{
              width: "30%",
              height: "100%",
              backgroundColor: statusColors.connecting,
            }}
          />
        </div>
      )}
    </div>
  );
};
