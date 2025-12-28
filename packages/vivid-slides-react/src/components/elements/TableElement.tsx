// ============================================================================
// TABLE ELEMENT COMPONENT
// ============================================================================

import React from "react";
import type { TableElement as TableElementType } from "../../types";
import { resolveColor, fillToCSS } from "../../utils";

export interface TableElementProps {
  element: TableElementType;
}

export const TableElement: React.FC<TableElementProps> = ({ element }) => {
  const { headers, rows, style, columnWidths } = element;

  const headerBg = style?.headerFill
    ? fillToCSS(style.headerFill)
    : { backgroundColor: "rgba(255,255,255,0.1)" };
  const rowBg = style?.rowFill ? fillToCSS(style.rowFill) : {};
  const altRowBg = style?.alternateRowFill
    ? fillToCSS(style.alternateRowFill)
    : { backgroundColor: "rgba(255,255,255,0.05)" };

  const cellPadding = style?.cellPadding || {
    top: 12,
    right: 16,
    bottom: 12,
    left: 16,
  };
  const borderColor = resolveColor(style?.borderColor, "rgba(255,255,255,0.1)");
  const borderWidth = style?.borderWidth || 1;

  const tableStyle: React.CSSProperties = {
    width: "100%",
    height: "100%",
    borderCollapse: "collapse",
    borderRadius: style?.roundedCorners,
    overflow: "hidden",
  };

  const getCellStyle = (
    isHeader: boolean,
    rowIndex: number
  ): React.CSSProperties => ({
    padding: `${cellPadding.top}px ${cellPadding.right}px ${cellPadding.bottom}px ${cellPadding.left}px`,
    ...(style?.showRowBorders && {
      borderBottom: `${borderWidth}px solid ${borderColor}`,
    }),
    ...(style?.showColumnBorders && {
      borderRight: `${borderWidth}px solid ${borderColor}`,
    }),
    ...(isHeader ? headerBg : rowIndex % 2 === 1 ? altRowBg : rowBg),
  });

  return (
    <div
      className="vivid-table-element"
      style={{ width: "100%", height: "100%", overflow: "hidden" }}
    >
      <table style={tableStyle}>
        {columnWidths && (
          <colgroup>
            {columnWidths.map((width, i) => (
              <col
                key={i}
                style={{ width: width === "auto" ? "auto" : width }}
              />
            ))}
          </colgroup>
        )}

        {headers && (
          <thead>
            <tr>
              {headers.cells.map((cell, i) => (
                <th
                  key={i}
                  colSpan={cell.colSpan}
                  rowSpan={cell.rowSpan}
                  style={{
                    ...getCellStyle(true, -1),
                    textAlign: cell.align || "left",
                    verticalAlign: cell.verticalAlign || "middle",
                    fontWeight: 600,
                    fontSize: style?.headerTextStyle?.fontSize || 14,
                    color: resolveColor(
                      style?.headerTextStyle?.color,
                      "inherit"
                    ),
                    ...(cell.fill && fillToCSS(cell.fill)),
                  }}
                >
                  <span dangerouslySetInnerHTML={{ __html: cell.content }} />
                </th>
              ))}
            </tr>
          </thead>
        )}

        <tbody>
          {rows.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              style={{
                height: row.height,
                ...(row.fill && fillToCSS(row.fill)),
              }}
            >
              {row.cells.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  colSpan={cell.colSpan}
                  rowSpan={cell.rowSpan}
                  style={{
                    ...getCellStyle(false, rowIndex),
                    textAlign: cell.align || "left",
                    verticalAlign: cell.verticalAlign || "middle",
                    ...(cell.textStyle && {
                      fontSize: cell.textStyle.fontSize,
                      fontWeight: cell.textStyle.fontWeight,
                      color: resolveColor(cell.textStyle.color, "inherit"),
                    }),
                    ...(cell.fill && fillToCSS(cell.fill)),
                  }}
                >
                  <span dangerouslySetInnerHTML={{ __html: cell.content }} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
