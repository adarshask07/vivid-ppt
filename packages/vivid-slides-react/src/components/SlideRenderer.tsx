// ============================================================================
// SLIDE RENDERER - CORE RENDERING ENGINE
// ============================================================================

import React from "react";
import { motion } from "framer-motion";
import type {
  Slide,
  SlideElement,
  SlideBackground,
  GradientStop,
} from "../types";
import {
  getBaseElementStyles,
  getAnimationConfig,
  resolveColor,
} from "../utils";

// Element Components
import {
  TextElement,
  ImageElement,
  ShapeElement,
  ChartElement,
  TableElement,
  ListElement,
  MetricElement,
  ProgressElement,
  CalloutElement,
  DividerElement,
  IconElement,
  CodeElement,
} from "./elements";

// Default slide dimensions (16:9 aspect ratio)
export const SLIDE_WIDTH = 960;
export const SLIDE_HEIGHT = 540;

export interface SlideRendererProps {
  /** The slide to render */
  slide: Slide;
  /** Scale factor (1 = 100%) */
  scale?: number;
  /** Preview mode disables animations */
  isPreview?: boolean;
  /** Custom width override */
  width?: number;
  /** Custom height override */
  height?: number;
  /** Custom className */
  className?: string;
  /** Custom styles */
  style?: React.CSSProperties;
}

// --- ELEMENT WRAPPER WITH ANIMATION ---
interface ElementWrapperProps {
  element: SlideElement;
  children: React.ReactNode;
  isPreview?: boolean;
}

const ElementWrapper: React.FC<ElementWrapperProps> = ({
  element,
  children,
  isPreview,
}) => {
  const style = getBaseElementStyles(element);
  const animationConfig = isPreview
    ? { initial: {}, animate: {}, transition: {} }
    : getAnimationConfig(element.animation);

  return (
    <motion.div
      initial={animationConfig.initial}
      animate={animationConfig.animate}
      transition={animationConfig.transition}
      style={style}
      data-element-id={element.id}
      data-element-type={element.type}
    >
      {children}
    </motion.div>
  );
};

// --- ELEMENT FACTORY ---
interface ElementFactoryProps {
  element: SlideElement;
  isPreview?: boolean;
}

const ElementFactory: React.FC<ElementFactoryProps> = ({
  element,
  isPreview,
}) => {
  const renderElement = () => {
    switch (element.type) {
      case "text":
        return <TextElement element={element} />;
      case "image":
        return <ImageElement element={element} />;
      case "shape":
        return <ShapeElement element={element} />;
      case "chart":
        return <ChartElement element={element} />;
      case "table":
        return <TableElement element={element} />;
      case "list":
        return <ListElement element={element} />;
      case "metric":
        return <MetricElement element={element} />;
      case "progress":
        return <ProgressElement element={element} />;
      case "callout":
        return <CalloutElement element={element} />;
      case "divider":
        return <DividerElement element={element} />;
      case "icon":
        return <IconElement element={element} />;
      case "code":
        return <CodeElement element={element} />;
      case "group":
        return (
          <div style={{ width: "100%", height: "100%", position: "relative" }}>
            {element.children.map((child) => (
              <ElementFactory
                key={child.id}
                element={child}
                isPreview={isPreview}
              />
            ))}
          </div>
        );
      default:
        return (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 14,
              opacity: 0.5,
              border: "1px dashed rgba(255,255,255,0.2)",
              borderRadius: 4,
            }}
          >
            {(element as SlideElement).type} element
          </div>
        );
    }
  };

  return (
    <ElementWrapper element={element} isPreview={isPreview}>
      {renderElement()}
    </ElementWrapper>
  );
};

// --- BACKGROUND RENDERER ---
interface SlideBackgroundRendererProps {
  background?: SlideBackground;
}

const SlideBackgroundRenderer: React.FC<SlideBackgroundRendererProps> = ({
  background,
}) => {
  if (!background) {
    return (
      <div
        style={{ position: "absolute", inset: 0, backgroundColor: "#0f172a" }}
      />
    );
  }

  const getBackgroundStyle = (): React.CSSProperties => {
    switch (background.type) {
      case "solid":
        return { backgroundColor: resolveColor(background.color, "#0f172a") };

      case "gradient":
        if (background.gradient) {
          const { gradient } = background;
          const stops = gradient.stops
            .map((s: GradientStop) => `${resolveColor(s.color)} ${s.position}%`)
            .join(", ");

          if (gradient.type === "linear") {
            return {
              background: `linear-gradient(${gradient.angle}deg, ${stops})`,
            };
          }
          return {
            background: `radial-gradient(circle at ${gradient.centerX} ${gradient.centerY}, ${stops})`,
          };
        }
        return {};

      case "image":
        if (background.image) {
          return {
            backgroundImage: `url(${background.image.src})`,
            backgroundSize: background.image.fit,
            backgroundPosition: background.image.position
              ? `${background.image.position.x} ${background.image.position.y}`
              : "center",
          };
        }
        return {};

      default:
        return { backgroundColor: "#0f172a" };
    }
  };

  const overlay = background.type === "image" && background.image?.overlay;

  return (
    <>
      <div
        style={{ position: "absolute", inset: 0, ...getBackgroundStyle() }}
      />
      {overlay && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: resolveColor(overlay.color),
            opacity: overlay.opacity,
          }}
        />
      )}
    </>
  );
};

// --- MAIN SLIDE RENDERER ---
export const SlideRenderer: React.FC<SlideRendererProps> = ({
  slide,
  scale = 1,
  isPreview = false,
  width = SLIDE_WIDTH,
  height = SLIDE_HEIGHT,
  className,
  style,
}) => {
  // Sort elements by zIndex
  const sortedElements = [...slide.elements].sort(
    (a, b) => (a.zIndex || 0) - (b.zIndex || 0)
  );

  return (
    <div
      className={`vivid-slide-renderer ${className || ""}`}
      style={{
        position: "relative",
        overflow: "hidden",
        width: width * scale,
        height: height * scale,
        backgroundColor: "#0f172a",
        ...style,
      }}
    >
      {/* Scaled container */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width,
          height,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }}
      >
        {/* Background */}
        <SlideBackgroundRenderer background={slide.background} />

        {/* Elements */}
        {sortedElements.map((element) => (
          <ElementFactory
            key={element.id}
            element={element}
            isPreview={isPreview}
          />
        ))}
      </div>
    </div>
  );
};
