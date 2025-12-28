import React from 'react';
import type { ChartElement as ChartElementType } from '../../types/slide-schema';
import { resolveColor } from './utils';

interface ChartElementProps {
  element: ChartElementType;
}

// Simple bar chart renderer
const BarChart: React.FC<{ element: ChartElementType }> = ({ element }) => {
  const { data, options } = element;
  const maxValue = Math.max(...data.datasets.flatMap(d => d.data));
  const barWidth = 100 / data.labels.length;
  
  return (
    <div className="w-full h-full flex flex-col">
      {options?.title && (
        <div className="text-sm font-semibold mb-2 text-center">{options.title}</div>
      )}
      <div className="flex-1 flex items-end justify-around gap-2 px-4 pb-8 relative">
        {/* Y-axis grid lines */}
        {options?.showGrid !== false && (
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="border-t border-current" />
            ))}
          </div>
        )}
        
        {/* Bars */}
        {data.labels.map((label, i) => (
          <div key={i} className="flex flex-col items-center flex-1 h-full justify-end">
            <div className="flex items-end gap-1 h-full pb-1">
              {data.datasets.map((dataset, j) => {
                const height = (dataset.data[i] / maxValue) * 100;
                const color = resolveColor(dataset.color as any) || '#3b82f6';
                return (
                  <div
                    key={j}
                    className="rounded-t transition-all duration-500"
                    style={{
                      height: `${height}%`,
                      width: `${Math.max(20, 60 / data.datasets.length)}px`,
                      backgroundColor: color,
                      minHeight: '4px',
                    }}
                  />
                );
              })}
            </div>
            {options?.showLabels !== false && (
              <span className="text-xs mt-2 text-center truncate max-w-full opacity-70">
                {label}
              </span>
            )}
          </div>
        ))}
      </div>
      
      {/* Legend */}
      {options?.showLegend && data.datasets.length > 1 && (
        <div className="flex justify-center gap-4 mt-2 flex-wrap">
          {data.datasets.map((dataset, i) => (
            <div key={i} className="flex items-center gap-2 text-xs">
              <div 
                className="w-3 h-3 rounded"
                style={{ backgroundColor: resolveColor(dataset.color as any) || '#3b82f6' }}
              />
              <span className="opacity-70">{dataset.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Simple line chart renderer
const LineChart: React.FC<{ element: ChartElementType }> = ({ element }) => {
  const { data, options } = element;
  const maxValue = Math.max(...data.datasets.flatMap(d => d.data));
  const padding = 40;
  
  return (
    <div className="w-full h-full flex flex-col p-4">
      {options?.title && (
        <div className="text-sm font-semibold mb-2 text-center">{options.title}</div>
      )}
      <svg className="flex-1 w-full" viewBox="0 0 400 200" preserveAspectRatio="xMidYMid meet">
        {/* Grid lines */}
        {options?.showGrid !== false && (
          <g className="opacity-20">
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
          const points = dataset.data.map((value, i) => {
            const x = padding + (i / (data.labels.length - 1)) * (400 - padding * 2);
            const y = 200 - padding - (value / maxValue) * (200 - padding * 2);
            return `${x},${y}`;
          }).join(' ');
          
          const color = resolveColor(dataset.color as any) || '#3b82f6';
          
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
              {/* Data points */}
              {dataset.data.map((value, i) => {
                const x = padding + (i / (data.labels.length - 1)) * (400 - padding * 2);
                const y = 200 - padding - (value / maxValue) * (200 - padding * 2);
                return (
                  <circle
                    key={i}
                    cx={x}
                    cy={y}
                    r="4"
                    fill={color}
                  />
                );
              })}
            </g>
          );
        })}
        
        {/* X-axis labels */}
        {options?.showLabels !== false && data.labels.map((label, i) => {
          const x = padding + (i / (data.labels.length - 1)) * (400 - padding * 2);
          return (
            <text
              key={i}
              x={x}
              y={200 - 10}
              textAnchor="middle"
              className="text-xs fill-current opacity-70"
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

// Simple pie chart renderer
const PieChart: React.FC<{ element: ChartElementType; isDoughnut?: boolean }> = ({ element, isDoughnut }) => {
  const { data, options } = element;
  const dataset = data.datasets[0];
  const total = dataset.data.reduce((a, b) => a + b, 0);
  const defaultColors = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#22c55e', '#06b6d4'];
  
  let currentAngle = -90;
  
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4">
      {options?.title && (
        <div className="text-sm font-semibold mb-2">{options.title}</div>
      )}
      <svg viewBox="0 0 200 200" className="w-full h-full max-w-[200px] max-h-[200px]">
        {dataset.data.map((value, i) => {
          const percentage = value / total;
          const angle = percentage * 360;
          const startAngle = currentAngle;
          const endAngle = currentAngle + angle;
          currentAngle = endAngle;
          
          const start = polarToCartesian(100, 100, 80, startAngle);
          const end = polarToCartesian(100, 100, 80, endAngle);
          const largeArc = angle > 180 ? 1 : 0;
          
          const color = (options?.colors?.[i] && resolveColor(options.colors[i])) 
            || (dataset.color && resolveColor(dataset.color as any))
            || defaultColors[i % defaultColors.length];
          
          if (isDoughnut) {
            const innerStart = polarToCartesian(100, 100, 50, startAngle);
            const innerEnd = polarToCartesian(100, 100, 50, endAngle);
            
            const d = [
              `M ${start.x} ${start.y}`,
              `A 80 80 0 ${largeArc} 1 ${end.x} ${end.y}`,
              `L ${innerEnd.x} ${innerEnd.y}`,
              `A 50 50 0 ${largeArc} 0 ${innerStart.x} ${innerStart.y}`,
              'Z'
            ].join(' ');
            
            return <path key={i} d={d} fill={color} />;
          }
          
          const d = [
            'M 100 100',
            `L ${start.x} ${start.y}`,
            `A 80 80 0 ${largeArc} 1 ${end.x} ${end.y}`,
            'Z'
          ].join(' ');
          
          return <path key={i} d={d} fill={color} />;
        })}
      </svg>
      
      {/* Legend */}
      {options?.showLegend && (
        <div className="flex flex-wrap justify-center gap-2 mt-2">
          {data.labels.map((label, i) => (
            <div key={i} className="flex items-center gap-1 text-xs">
              <div 
                className="w-2 h-2 rounded-full"
                style={{ 
                  backgroundColor: (options?.colors?.[i] && resolveColor(options.colors[i])) 
                    || defaultColors[i % defaultColors.length] 
                }}
              />
              <span className="opacity-70">{label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

function polarToCartesian(cx: number, cy: number, r: number, angle: number) {
  const rad = (angle * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
}

export const ChartElement: React.FC<ChartElementProps> = ({ element }) => {
  const renderChart = () => {
    switch (element.chartType) {
      case 'bar':
      case 'bar-horizontal':
      case 'bar-stacked':
        return <BarChart element={element} />;
      
      case 'line':
      case 'area':
        return <LineChart element={element} />;
      
      case 'pie':
        return <PieChart element={element} />;
      
      case 'doughnut':
      case 'semi-doughnut':
        return <PieChart element={element} isDoughnut />;
      
      default:
        return (
          <div className="w-full h-full flex items-center justify-center text-sm opacity-50">
            {element.chartType} chart
          </div>
        );
    }
  };

  return (
    <div className="w-full h-full bg-white/5 backdrop-blur-sm rounded-lg overflow-hidden">
      {renderChart()}
    </div>
  );
};
