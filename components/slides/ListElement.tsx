import React from "react";
import type { ListElement as ListElementType } from "../../types/slide-schema";
import { resolveColor } from "./utils";
import { motion } from "framer-motion";
import { Check, ChevronRight, Circle, Minus, Square } from "lucide-react";

interface ListElementProps {
  element: ListElementType;
}

const getBulletIcon = (type: string, color: string, size: number) => {
  const props = { size, color, className: "flex-shrink-0" };

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
          className="flex-shrink-0 rounded-full"
          style={{
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

  const renderItem = (
    item: (typeof items)[0],
    index: number,
    level: number = 0
  ) => {
    const itemContent = (
      <div
        className="flex items-start gap-3"
        style={{
          marginLeft: level * indent,
          marginBottom: spacing,
        }}
      >
        {/* Bullet/Number/Checkbox */}
        <span
          className="mt-1 flex items-center justify-center"
          style={{ minWidth: bulletSize }}
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
              className={`w-4 h-4 rounded border flex items-center justify-center ${
                item.checked ? "bg-blue-500 border-blue-500" : "border-gray-400"
              }`}
            >
              {item.checked && <Check size={12} className="text-white" />}
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
    <div className="w-full h-full overflow-hidden">
      {items.map((item, index) => renderItem(item, index))}
    </div>
  );
};
