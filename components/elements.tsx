import React from 'react';
import { 
    TextElement, 
    ImageElement, 
    ShapeElement, 
    ChartElement,
    TableElement 
} from '../types/presentation-schema';
import { useThemeStore } from '../store/themeStore';
import { cn } from '../lib/utils';
import { TypographyStylePath } from '../types/theme';

export const SlideText: React.FC<{ config: TextElement }> = ({ config }) => {
    const { resolveTypography, resolveColor, currentTheme } = useThemeStore();
    
    // Resolve theme styles based on semantic token
    const typography = resolveTypography(config.style as TypographyStylePath);
    const color = config.color?.startsWith('theme.') 
        ? resolveColor(config.color.replace('theme.', '') as any) 
        : (config.color || currentTheme.colors.text.primary);

    const style: React.CSSProperties = {
        fontSize: `${typography.fontSize}px`,
        fontWeight: typography.fontWeight,
        lineHeight: typography.lineHeight,
        letterSpacing: typography.letterSpacing,
        color: color,
        textAlign: config.align || 'left',
        fontFamily: ['h1', 'h2', 'h3'].includes(config.style) 
            ? currentTheme.typography.fontFamily.heading 
            : currentTheme.typography.fontFamily.body,
        width: '100%',
        height: '100%'
    };

    return (
        <div 
            style={style}
            dangerouslySetInnerHTML={{ __html: config.content }}
        />
    );
};

export const SlideImage: React.FC<{ config: ImageElement }> = ({ config }) => {
    return (
        <div className="w-full h-full overflow-hidden relative" style={{ borderRadius: config.borderRadius }}>
            <img 
                src={config.src} 
                alt={config.alt} 
                className="w-full h-full object-cover"
                draggable={false}
            />
        </div>
    );
};

export const SlideShape: React.FC<{ config: ShapeElement }> = ({ config }) => {
    const { resolveColor } = useThemeStore();
    
    const fill = config.fill?.startsWith('theme.') 
        ? resolveColor(config.fill.replace('theme.', '') as any) 
        : config.fill;

    const stroke = config.stroke?.startsWith('theme.')
        ? resolveColor(config.stroke.replace('theme.', '') as any)
        : config.stroke;

    const commonProps = {
        width: "100%",
        height: "100%",
        fill: fill,
        stroke: stroke,
        strokeWidth: config.strokeWidth || 0
    };

    if (config.variant === 'rect') {
        return (
            <svg width="100%" height="100%">
                <rect x="0" y="0" width="100%" height="100%" {...commonProps} />
            </svg>
        );
    }
    
    if (config.variant === 'circle') {
        return (
            <svg width="100%" height="100%">
                <ellipse cx="50%" cy="50%" rx="50%" ry="50%" {...commonProps} />
            </svg>
        );
    }
    
    // Fallback for other shapes
    return (
        <div 
            style={{ backgroundColor: fill, width: '100%', height: '100%', border: `${config.strokeWidth}px solid ${stroke}` }} 
        />
    );
};

export const SlideChart: React.FC<{ config: ChartElement }> = ({ config }) => {
    // Placeholder visualization for charts
    return (
        <div className="w-full h-full bg-white/5 border border-white/10 p-4 rounded-lg flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-gradient-to-tr from-blue-500 to-purple-500" />
            <h4 className="font-semibold text-xs uppercase tracking-widest mb-2 z-10">{config.chartType} Chart</h4>
            <div className="flex items-end gap-2 h-32 w-full justify-center px-4 z-10">
                {config.data.datasets[0].data.map((val, i) => (
                    <div 
                        key={i} 
                        className="w-8 bg-blue-500 rounded-t-sm opacity-80"
                        style={{ height: `${val}%`, backgroundColor: config.data.datasets[0].color }}
                    />
                ))}
            </div>
        </div>
    );
};

// Assuming Table support for future
export const SlideTable: React.FC<{ config: TableElement }> = ({ config }) => {
    return (
        <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-white/10">
                <tr>
                    {config.headers.map((h, i) => <th key={i} className="px-6 py-3">{h}</th>)}
                </tr>
            </thead>
            <tbody>
                {config.rows.map((row, i) => (
                    <tr key={i} className={cn("border-b border-white/5", config.striped && i % 2 === 1 ? 'bg-white/5' : '')}>
                        {row.map((cell, j) => <td key={j} className="px-6 py-4">{cell}</td>)}
                    </tr>
                ))}
            </tbody>
        </table>
    );
};