// ============================================================================
// LIST ELEMENT COMPONENT
// ============================================================================

import React from "react";
import { motion } from "framer-motion";
import { Check, ChevronRight, Circle, Minus, Square } from "lucide-react";
import type { ListElement as ListElementType, ListItem } from "../../types";
import { resolveColor } from "../../utils";

export interface ListElementProps {
  element: ListElementType;
}

const getBulletIcon = (type: string, color: string, size: number) => {
  const props = { size, color, style: { flexShrink: 0 } };

  switch (type) {
    case "circle":
      return <Circle {...props} />;
    case "square":
      return <Square {...props} />;
    case "dash":
      return <Minus {...props} />;
    case "arrow":
      return <ChevronRight {...props} />;
    case "check":
      return <Check {...props} />;
    case "disc":
    default:
      return (
        <span
          style={{
            flexShrink: 0,
            borderRadius: "50%",
            width: size * 0.4,
            height: size * 0.4,
            backgroundColor: color,
          }}
        />
      );
  }
};

export const ListElement: React.FC<ListElementProps> = ({ element }) => {
  const {
    items,
    listType,
    textStyle,
    bulletStyle,
    spacing = 12,
    indent = 24,
    animation,
  } = element;

  const textColor = resolveColor(textStyle?.color, "#ffffff");
  const bulletColor = resolveColor(bulletStyle?.color, textColor);
  const bulletSize = bulletStyle?.size || 16;

  const renderItem = (item: ListItem, index: number, level: number = 0) => {
    const itemContent = (
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: "12px",
          marginLeft: level * indent,
          marginBottom: spacing,
        }}
      >
        {/* Bullet/Number/Checkbox */}
        <span
          style={{
            marginTop: "4px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minWidth: bulletSize,
          }}
        >
          {listType === "numbered" ? (
            <span
              style={{
                color: bulletColor,
                fontSize: textStyle?.fontSize || 16,
              }}
            >
              {index + 1}.
            </span>
          ) : listType === "checklist" ? (
            <span
              style={{
                width: 16,
                height: 16,
                borderRadius: 4,
                border: item.checked ? "none" : "1px solid #9ca3af",
                backgroundColor: item.checked ? "#3b82f6" : "transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {item.checked && <Check size={12} color="white" />}
            </span>
          ) : listType === "icon" && item.icon ? (
            <span style={{ color: bulletColor }}>{item.icon}</span>
          ) : (
            getBulletIcon(bulletStyle?.type || "disc", bulletColor, bulletSize)
          )}
        </span>

        {/* Content */}
        <span
          style={{
            color: textColor,
            fontSize: textStyle?.fontSize || 16,
            fontWeight: textStyle?.fontWeight,
            lineHeight: textStyle?.lineHeight || 1.5,
            textDecoration: item.checked ? "line-through" : undefined,
            opacity: item.checked ? 0.6 : 1,
          }}
          dangerouslySetInnerHTML={{ __html: item.content }}
        />
      </div>
    );

    const subItems = item.subItems?.map((subItem, subIndex) =>
      renderItem(subItem, subIndex, level + 1)
    );

    if (animation?.staggerChildren) {
      return (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            delay: index * ((animation.stagger || 100) / 1000),
            duration: (animation.duration || 300) / 1000,
          }}
        >
          {itemContent}
          {subItems}
        </motion.div>
      );
    }

    return (
      <div key={index}>
        {itemContent}
        {subItems}
      </div>
    );
  };

  return (
    <div
      className="vivid-list-element"
      style={{ width: "100%", height: "100%", overflow: "hidden" }}
    >
      {items.map((item, index) => renderItem(item, index))}
    </div>
  );
};
