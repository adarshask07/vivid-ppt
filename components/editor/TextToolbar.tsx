import React, { useState, useEffect } from 'react';
import { Editor } from '@tiptap/react';
import { cn } from '../../lib/utils';
import { 
    Bold, Italic, Underline as UnderlineIcon, Strikethrough,
    AlignLeft, AlignCenter, AlignRight, AlignJustify,
    List, ListOrdered, 
    Highlighter, ChevronDown, 
    MoveVertical, Palette,
    Link as LinkIcon, Subscript, Superscript,
    RemoveFormatting, Code
} from 'lucide-react';
import { PRESET_FONTS, FONT_SIZES, COLORS, LINE_HEIGHTS } from './extensions/index';

interface TextToolbarProps {
    editor: Editor;
}

interface MenuButtonProps {
    isActive?: boolean; 
    onClick: () => void; 
    children: React.ReactNode;
    className?: string;
    title?: string;
}

const MenuButton: React.FC<MenuButtonProps> = ({ 
    isActive, 
    onClick, 
    children, 
    className,
    title
}) => (
    <button
        type="button"
        onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onClick();
        }}
        className={cn(
            "p-1.5 rounded hover:bg-zinc-700 text-zinc-300 transition-colors cursor-pointer flex items-center justify-center min-w-[28px] h-[28px]",
            isActive ? 'bg-zinc-700 text-white' : 'text-zinc-400',
            className
        )}
        title={title}
    >
        {children}
    </button>
);

interface ColorSwatchProps {
    color: string;
    isActive: boolean;
    onClick: () => void;
}

const ColorSwatch: React.FC<ColorSwatchProps> = ({ color, isActive, onClick }) => (
    <button
        type="button"
        onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onClick();
        }}
        className={cn(
            "w-6 h-6 rounded-full border border-zinc-600 transition-all hover:scale-110 cursor-pointer flex items-center justify-center",
            isActive ? 'ring-2 ring-white border-transparent' : 'hover:border-zinc-400'
        )}
        style={{ backgroundColor: color }}
        title={color}
    />
);

const TextToolbar: React.FC<TextToolbarProps> = ({ editor }) => {
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);

    const toggleDropdown = (name: string) => {
        setOpenDropdown(prev => prev === name ? null : name);
    };

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = () => setOpenDropdown(null);
        window.addEventListener('mousedown', handleClickOutside);
        return () => window.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const currentFontSize = editor.getAttributes('textStyle').fontSize || '16px';
    const currentFontFamily = editor.getAttributes('textStyle').fontFamily || 'Inter';
    const currentLineHeight = editor.getAttributes('paragraph').lineHeight || editor.getAttributes('heading').lineHeight || '1.2';
    
    // Simplify font family display name
    const displayFont = PRESET_FONTS.find(f => currentFontFamily.includes(f.name))?.name || 'Font';

    const getActiveAlignIcon = () => {
        if (editor.isActive({ textAlign: 'center' })) return <AlignCenter className="w-3.5 h-3.5" />;
        if (editor.isActive({ textAlign: 'right' })) return <AlignRight className="w-3.5 h-3.5" />;
        if (editor.isActive({ textAlign: 'justify' })) return <AlignJustify className="w-3.5 h-3.5" />;
        return <AlignLeft className="w-3.5 h-3.5" />;
    };

    const handleSetLink = () => {
        const previousUrl = editor.getAttributes('link').href;
        const url = window.prompt('URL', previousUrl);
        
        // cancelled
        if (url === null) {
          return;
        }
        
        // empty
        if (url === '') {
          editor.chain().focus().extendMarkRange('link').unsetLink().run();
          return;
        }
        
        // update
        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }

    return (
        <div 
            className="absolute -top-12 left-1/2 -translate-x-1/2 -translate-y-full z-50 flex flex-wrap items-center justify-center bg-zinc-950 border border-zinc-800 rounded-lg shadow-2xl p-1 gap-1 select-none w-max max-w-[95vw] sm:max-w-none"
            onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation(); // Keep editor focused
            }}
        >
            {/* Group 1: Typography */}
            <div className="flex items-center gap-1">
                {/* Font Family */}
                <div className="relative">
                    <button
                        type="button"
                        onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); toggleDropdown('fontFamily'); }}
                        className="flex items-center gap-1 text-xs text-zinc-300 hover:bg-zinc-800 px-2 py-1.5 rounded w-24 sm:w-28 justify-between border border-transparent hover:border-zinc-700 transition-all"
                        title="Font Family"
                    >
                        <span className="truncate">{displayFont}</span>
                        <ChevronDown className="w-3 h-3 opacity-50" />
                    </button>
                    {openDropdown === 'fontFamily' && (
                        <div className="absolute top-full left-0 mt-1 bg-zinc-900 border border-zinc-700 rounded shadow-xl py-1 w-40 z-[60] flex flex-col max-h-60 overflow-y-auto" onMouseDown={e => e.stopPropagation()}>
                            {PRESET_FONTS.map(font => (
                                <button
                                    key={font.name}
                                    onMouseDown={(e) => {
                                        e.preventDefault();
                                        editor.chain().focus().setFontFamily(font.value).run();
                                        setOpenDropdown(null);
                                    }}
                                    className="px-3 py-2 text-left text-xs text-zinc-200 hover:bg-zinc-800 w-full"
                                    style={{ fontFamily: font.value }}
                                >
                                    {font.name}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Font Size */}
                <div className="relative">
                    <button
                        type="button"
                        onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); toggleDropdown('fontSize'); }}
                        className="flex items-center gap-1 text-xs text-zinc-300 hover:bg-zinc-800 px-2 py-1.5 rounded min-w-[3.5rem] justify-between border border-transparent hover:border-zinc-700"
                        title="Font Size"
                    >
                        <span>{currentFontSize.replace('px', '')}</span>
                        <ChevronDown className="w-3 h-3 opacity-50" />
                    </button>
                    {openDropdown === 'fontSize' && (
                        <div className="absolute top-full left-0 mt-1 bg-zinc-900 border border-zinc-700 rounded shadow-xl py-1 w-16 z-[60] flex flex-col max-h-60 overflow-y-auto" onMouseDown={e => e.stopPropagation()}>
                            {FONT_SIZES.map(size => (
                                <button
                                    key={size}
                                    onMouseDown={(e) => {
                                        e.preventDefault();
                                        (editor.chain() as any).setFontSize(size).run();
                                        setOpenDropdown(null);
                                    }}
                                    className="px-3 py-1.5 text-center text-xs text-zinc-200 hover:bg-zinc-800 w-full"
                                >
                                    {size.replace('px', '')}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="w-px h-5 bg-zinc-800 mx-1 hidden sm:block" />

            {/* Group 2: Basic Formatting */}
            <div className="flex items-center gap-0.5">
                <MenuButton onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')} title="Bold">
                    <Bold className="w-3.5 h-3.5" />
                </MenuButton>
                <MenuButton onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')} title="Italic">
                    <Italic className="w-3.5 h-3.5" />
                </MenuButton>
                <MenuButton onClick={() => editor.chain().focus().toggleUnderline().run()} isActive={editor.isActive('underline')} title="Underline">
                    <UnderlineIcon className="w-3.5 h-3.5" />
                </MenuButton>
                <MenuButton onClick={() => editor.chain().focus().toggleStrike().run()} isActive={editor.isActive('strike')} title="Strikethrough">
                    <Strikethrough className="w-3.5 h-3.5" />
                </MenuButton>
                    
                {/* Color Picker */}
                <div className="relative">
                <MenuButton onClick={() => toggleDropdown('color')} isActive={false} title="Text Color">
                    <Palette className="w-3.5 h-3.5" style={{ color: editor.getAttributes('textStyle').color || '#ccc' }} />
                </MenuButton>
                    {openDropdown === 'color' && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 bg-zinc-900 border border-zinc-700 rounded shadow-xl p-2 z-[60] w-40 grid grid-cols-5 gap-1" onMouseDown={e => e.stopPropagation()}>
                        {COLORS.map(color => (
                            <ColorSwatch 
                                key={color} 
                                color={color} 
                                isActive={editor.isActive('textStyle', { color })} 
                                onClick={() => {
                                    editor.chain().focus().setColor(color).run();
                                    setOpenDropdown(null);
                                }} 
                            />
                        ))}
                            <button
                            onMouseDown={(e) => {
                                e.preventDefault();
                                editor.chain().focus().unsetColor().run();
                                setOpenDropdown(null);
                            }}
                            className="col-span-5 text-[10px] text-zinc-400 hover:text-white mt-1 text-center border-t border-zinc-700 pt-1"
                        >
                            Reset Color
                        </button>
                    </div>
                )}
                </div>

                <MenuButton onClick={() => (editor.chain().focus() as any).toggleHighlight().run()} isActive={editor.isActive('highlight')} title="Highlight">
                    <Highlighter className="w-3.5 h-3.5" />
                </MenuButton>
            </div>

            <div className="w-px h-5 bg-zinc-800 mx-1 hidden sm:block" />

             {/* Group 3: Script & Code */}
             <div className="flex items-center gap-0.5">
                <MenuButton onClick={() => editor.chain().focus().toggleCode().run()} isActive={editor.isActive('code')} title="Code">
                    <Code className="w-3.5 h-3.5" />
                </MenuButton>
                <MenuButton onClick={() => (editor.chain().focus() as any).toggleSubscript().run()} isActive={editor.isActive('subscript')} title="Subscript">
                    <Subscript className="w-3.5 h-3.5" />
                </MenuButton>
                <MenuButton onClick={() => (editor.chain().focus() as any).toggleSuperscript().run()} isActive={editor.isActive('superscript')} title="Superscript">
                    <Superscript className="w-3.5 h-3.5" />
                </MenuButton>
            </div>

            <div className="w-px h-5 bg-zinc-800 mx-1 hidden sm:block" />

            {/* Group 4: Layout & Lists */}
            <div className="flex items-center gap-0.5">
                {/* Alignment Dropdown */}
                <div className="relative">
                    <MenuButton onClick={() => toggleDropdown('align')} isActive={false} title="Alignment">
                        {getActiveAlignIcon()}
                    </MenuButton>
                    {openDropdown === 'align' && (
                        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 bg-zinc-900 border border-zinc-700 rounded shadow-xl p-1 flex gap-1 z-[60]">
                            <MenuButton onClick={() => { editor.chain().focus().setTextAlign('left').run(); setOpenDropdown(null); }} isActive={editor.isActive({ textAlign: 'left' })}>
                                <AlignLeft className="w-3.5 h-3.5" />
                            </MenuButton>
                            <MenuButton onClick={() => { editor.chain().focus().setTextAlign('center').run(); setOpenDropdown(null); }} isActive={editor.isActive({ textAlign: 'center' })}>
                                <AlignCenter className="w-3.5 h-3.5" />
                            </MenuButton>
                            <MenuButton onClick={() => { editor.chain().focus().setTextAlign('right').run(); setOpenDropdown(null); }} isActive={editor.isActive({ textAlign: 'right' })}>
                                <AlignRight className="w-3.5 h-3.5" />
                            </MenuButton>
                            <MenuButton onClick={() => { editor.chain().focus().setTextAlign('justify').run(); setOpenDropdown(null); }} isActive={editor.isActive({ textAlign: 'justify' })}>
                                <AlignJustify className="w-3.5 h-3.5" />
                            </MenuButton>
                        </div>
                    )}
                </div>

                <MenuButton onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive('bulletList')} title="Bullet List">
                    <List className="w-3.5 h-3.5" />
                </MenuButton>
                <MenuButton onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive('orderedList')} title="Ordered List">
                    <ListOrdered className="w-3.5 h-3.5" />
                </MenuButton>
                
                {/* Line Height Dropdown */}
                <div className="relative">
                        <MenuButton onClick={() => toggleDropdown('lineHeight')} isActive={false} title="Line Height">
                        <MoveVertical className="w-3.5 h-3.5" />
                    </MenuButton>
                        {openDropdown === 'lineHeight' && (
                        <div className="absolute top-full right-0 mt-1 bg-zinc-900 border border-zinc-700 rounded shadow-xl py-1 w-16 z-[60] flex flex-col" onMouseDown={e => e.stopPropagation()}>
                            {LINE_HEIGHTS.map(lh => (
                                <button
                                    key={lh}
                                    onMouseDown={(e) => {
                                        e.preventDefault();
                                        (editor.chain() as any).setLineHeight(lh).run();
                                        setOpenDropdown(null);
                                    }}
                                    className={cn(
                                        "px-3 py-1.5 text-center text-xs w-full hover:bg-zinc-800",
                                        currentLineHeight === lh ? 'text-blue-400' : 'text-zinc-200'
                                    )}
                                >
                                    {lh}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="w-px h-5 bg-zinc-800 mx-1 hidden sm:block" />

            {/* Group 5: Insert & Actions */}
            <div className="flex items-center gap-0.5">
                 <MenuButton onClick={handleSetLink} isActive={editor.isActive('link')} title="Link">
                    <LinkIcon className="w-3.5 h-3.5" />
                </MenuButton>
                <MenuButton onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()} isActive={false} title="Clear Formatting">
                    <RemoveFormatting className="w-3.5 h-3.5 text-destructive" />
                </MenuButton>
            </div>
        </div>
    );
};

export default TextToolbar;