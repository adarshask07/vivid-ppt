import React from "react";
import { motion } from "framer-motion";
import type {
  Slide,
  SlideElement,
  SlideBackground,
} from "../../types/slide-schema";
import {
  getBaseElementStyles,
  getAnimationConfig,
  resolveColor,
} from "./utils";

// Element Components
import { TextElement } from "./TextElement";
import { ImageElement } from "./ImageElement";
import { ShapeElement } from "./ShapeElement";
import { ChartElement } from "./ChartElement";
import { TableElement } from "./TableElement";
import { ListElement } from "./ListElement";
import { MetricElement } from "./MetricElement";
import { ProgressElement } from "./ProgressElement";
import { CalloutElement } from "./CalloutElement";
import { DividerElement } from "./DividerElement";
import { IconElement } from "./IconElement";
import { CodeElement } from "./CodeElement";

interface SlideRendererProps {
  slide: Slide;
  scale?: number;
  isPreview?: boolean;
}

// Element wrapper with animation
const ElementWrapper: React.FC<{
  element: SlideElement;
  children: React.ReactNode;
  isPreview?: boolean;
}> = ({ element, children, isPreview }) => {
  const style = getBaseElementStyles(element);
  const animationConfig = isPreview
    ? { initial: {}, animate: {}, transition: {} }
    : getAnimationConfig(element.animation);

  return (
    <motion.div
      initial={animationConfig.initial}
      animate={animationConfig.animate}
      transition={animationConfig.transition}
      style={{
        ...style,
      }}
      data-element-id={element.id}
      data-element-type={element.type}
    >
      {children}
    </motion.div>
  );
};

// Element factory - renders the appropriate component based on type
const ElementFactory: React.FC<{
  element: SlideElement;
  isPreview?: boolean;
}> = ({ element, isPreview }) => {
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
          <div className="w-full h-full relative">
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
          <div className="w-full h-full flex items-center justify-center text-sm opacity-50 border border-dashed border-white/20 rounded">
            {(element as any).type} element
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

// Background renderer
const SlideBackgroundRenderer: React.FC<{ background?: SlideBackground }> = ({
  background,
}) => {
  if (!background) {
    return <div className="absolute inset-0 bg-slate-900" />;
  }

  const getBackgroundStyle = (): React.CSSProperties => {
    switch (background.type) {
      case "solid":
        return { backgroundColor: resolveColor(background.color, "#0f172a") };

      case "gradient":
        if (background.gradient) {
          const { gradient } = background;
          const stops = gradient.stops
            .map((s) => `${resolveColor(s.color)} ${s.position}%`)
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
      <div className="absolute inset-0" style={getBackgroundStyle()} />
      {overlay && (
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: resolveColor(overlay.color),
            opacity: overlay.opacity,
          }}
        />
      )}
    </>
  );
};

// Main SlideRenderer component
export const SlideRenderer: React.FC<SlideRendererProps> = ({
  slide,
  scale = 1,
  isPreview = false,
}) => {
  // Sort elements by zIndex
  const sortedElements = [...slide.elements].sort(
    (a, b) => (a.zIndex || 0) - (b.zIndex || 0)
  );

  return (
    <div
      className="slide-renderer relative overflow-hidden"
      style={{
        width: "100%",
        height: "100%",
        transform: scale !== 1 ? `scale(${scale})` : undefined,
        transformOrigin: "top left",
      }}
      data-slide-id={slide.id}
    >
      {/* Background */}
      <SlideBackgroundRenderer background={slide.background} />

      {/* Elements */}
      <div className="absolute inset-0">
        {sortedElements
          .filter((el) => !el.hidden)
          .map((element) => (
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

// Export individual components for flexibility
export { ElementFactory, ElementWrapper, SlideBackgroundRenderer };
