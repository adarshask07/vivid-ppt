// ============================================================================
// CHART ELEMENT COMPONENT
// ============================================================================

import React from "react";
import type { ChartElement as ChartElementType } from "../../types";
import { resolveColor } from "../../utils";

export interface ChartElementProps {
  element: ChartElementType;
}

function polarToCartesian(cx: number, cy: number, r: number, angle: number) {
  const rad = (angle * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
}

// Bar Chart
const BarChart: React.FC<{ element: ChartElementType }> = ({ element }) => {
  const { data, options } = element;
  const maxValue = Math.max(...data.datasets.flatMap((d) => d.data));

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {options?.title && (
        <div
          style={{
            fontSize: 14,
            fontWeight: 600,
            marginBottom: 8,
            textAlign: "center",
          }}
        >
          {options.title}
        </div>
      )}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-around",
          gap: 8,
          padding: "0 16px 32px 16px",
          position: "relative",
        }}
      >
        {/* Grid lines */}
        {options?.showGrid !== false && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              pointerEvents: "none",
              opacity: 0.2,
            }}
          >
            {[...Array(5)].map((_, i) => (
              <div key={i} style={{ borderTop: "1px solid currentColor" }} />
            ))}
          </div>
        )}

        {/* Bars */}
        {data.labels.map((label, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              flex: 1,
              height: "100%",
              justifyContent: "flex-end",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                gap: 4,
                height: "100%",
                paddingBottom: 4,
              }}
            >
              {data.datasets.map((dataset, j) => {
                const height = (dataset.data[i] / maxValue) * 100;
                const color =
                  resolveColor(dataset.color as string) || "#3b82f6";
                return (
                  <div
                    key={j}
                    style={{
                      height: `${height}%`,
                      width: Math.max(20, 60 / data.datasets.length),
                      backgroundColor: color,
                      borderRadius: "4px 4px 0 0",
                      minHeight: 4,
                      transition: "all 0.5s",
                    }}
                  />
                );
              })}
            </div>
            {options?.showLabels !== false && (
              <span
                style={{
                  fontSize: 10,
                  marginTop: 8,
                  textAlign: "center",
                  opacity: 0.7,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  maxWidth: "100%",
                }}
              >
                {label}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Legend */}
      {options?.showLegend && data.datasets.length > 1 && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 16,
            marginTop: 8,
            flexWrap: "wrap",
          }}
        >
          {data.datasets.map((dataset, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontSize: 12,
              }}
            >
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 4,
                  backgroundColor:
                    resolveColor(dataset.color as string) || "#3b82f6",
                }}
              />
              <span style={{ opacity: 0.7 }}>{dataset.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Line Chart
const LineChart: React.FC<{ element: ChartElementType }> = ({ element }) => {
  const { data, options } = element;
  const maxValue = Math.max(...data.datasets.flatMap((d) => d.data));
  const padding = 40;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        padding: 16,
      }}
    >
      {options?.title && (
        <div
          style={{
            fontSize: 14,
            fontWeight: 600,
            marginBottom: 8,
            textAlign: "center",
          }}
        >
          {options.title}
        </div>
      )}
      <svg
        style={{ flex: 1, width: "100%" }}
        viewBox="0 0 400 200"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Grid lines */}
        {options?.showGrid !== false && (
          <g style={{ opacity: 0.2 }}>
            {[...Array(5)].map((_, i) => (
              <line
                key={i}
                x1={padding}
                y1={padding + (i * (200 - padding * 2)) / 4}
                x2={400 - padding}
                y2={padding + (i * (200 - padding * 2)) / 4}
                stroke="currentColor"
                strokeDasharray="4"
              />
            ))}
          </g>
        )}

        {/* Lines */}
        {data.datasets.map((dataset, j) => {
          const points = dataset.data
            .map((value, i) => {
              const x =
                padding + (i / (data.labels.length - 1)) * (400 - padding * 2);
              const y =
                200 - padding - (value / maxValue) * (200 - padding * 2);
              return `${x},${y}`;
            })
            .join(" ");

          const color = resolveColor(dataset.color as string) || "#3b82f6";

          return (
            <g key={j}>
              <polyline
                points={points}
                fill="none"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {dataset.data.map((value, i) => {
                const x =
                  padding +
                  (i / (data.labels.length - 1)) * (400 - padding * 2);
                const y =
                  200 - padding - (value / maxValue) * (200 - padding * 2);
                return <circle key={i} cx={x} cy={y} r="4" fill={color} />;
              })}
            </g>
          );
        })}

        {/* X-axis labels */}
        {options?.showLabels !== false &&
          data.labels.map((label, i) => {
            const x =
              padding + (i / (data.labels.length - 1)) * (400 - padding * 2);
            return (
              <text
                key={i}
                x={x}
                y={200 - 10}
                textAnchor="middle"
                fill="currentColor"
                opacity={0.7}
                fontSize="10"
              >
                {label}
              </text>
            );
          })}
      </svg>
    </div>
  );
};

// Pie Chart
const PieChart: React.FC<{
  element: ChartElementType;
  isDoughnut?: boolean;
}> = ({ element, isDoughnut }) => {
  const { data, options } = element;
  const dataset = data.datasets[0];
  const total = dataset.data.reduce((a, b) => a + b, 0);
  const defaultColors = [
    "#3b82f6",
    "#8b5cf6",
    "#ec4899",
    "#f59e0b",
    "#22c55e",
    "#06b6d4",
  ];

  let currentAngle = -90;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
    >
      {options?.title && (
        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>
          {options.title}
        </div>
      )}
      <svg
        viewBox="0 0 200 200"
        style={{ width: "100%", height: "100%", maxWidth: 200, maxHeight: 200 }}
      >
        {dataset.data.map((value, i) => {
          const percentage = value / total;
          const angle = percentage * 360;
          const startAngle = currentAngle;
          const endAngle = currentAngle + angle;
          currentAngle = endAngle;

          const start = polarToCartesian(100, 100, 80, startAngle);
          const end = polarToCartesian(100, 100, 80, endAngle);
          const largeArc = angle > 180 ? 1 : 0;

          const color =
            (options?.colors?.[i] && resolveColor(options.colors[i])) ||
            (dataset.color && resolveColor(dataset.color as string)) ||
            defaultColors[i % defaultColors.length];

          if (isDoughnut) {
            const innerStart = polarToCartesian(100, 100, 50, startAngle);
            const innerEnd = polarToCartesian(100, 100, 50, endAngle);

            const d = [
              `M ${start.x} ${start.y}`,
              `A 80 80 0 ${largeArc} 1 ${end.x} ${end.y}`,
              `L ${innerEnd.x} ${innerEnd.y}`,
              `A 50 50 0 ${largeArc} 0 ${innerStart.x} ${innerStart.y}`,
              "Z",
            ].join(" ");

            return <path key={i} d={d} fill={color} />;
          }

          const d = [
            "M 100 100",
            `L ${start.x} ${start.y}`,
            `A 80 80 0 ${largeArc} 1 ${end.x} ${end.y}`,
            "Z",
          ].join(" ");

          return <path key={i} d={d} fill={color} />;
        })}
      </svg>

      {/* Legend */}
      {options?.showLegend && (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 8,
            marginTop: 8,
          }}
        >
          {data.labels.map((label, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                fontSize: 10,
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  backgroundColor:
                    (options?.colors?.[i] && resolveColor(options.colors[i])) ||
                    defaultColors[i % defaultColors.length],
                }}
              />
              <span style={{ opacity: 0.7 }}>{label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const ChartElement: React.FC<ChartElementProps> = ({ element }) => {
  const renderChart = () => {
    switch (element.chartType) {
      case "bar":
      case "bar-horizontal":
      case "bar-stacked":
        return <BarChart element={element} />;

      case "line":
      case "area":
        return <LineChart element={element} />;

      case "pie":
        return <PieChart element={element} />;

      case "doughnut":
      case "semi-doughnut":
        return <PieChart element={element} isDoughnut />;

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
            }}
          >
            {element.chartType} chart
          </div>
        );
    }
  };

  return (
    <div
      className="vivid-chart-element"
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(255,255,255,0.05)",
        backdropFilter: "blur(8px)",
        borderRadius: 8,
        overflow: "hidden",
      }}
    >
      {renderChart()}
    </div>
  );
};
