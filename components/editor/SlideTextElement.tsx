import React, { useEffect, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import { useSlideStore } from '../../store/useSlideStore';
import { SlideElement } from '../../types';
import { getExtensions } from './extensions/index';
import TextToolbar from './TextToolbar';
import { useElementStyles } from '../../hooks/useThemeStyles';

interface SlideTextElementProps {
  element: SlideElement;
  isEditing: boolean;
}

const ActiveEditor: React.FC<SlideTextElementProps> = ({ element, isEditing }) => {
    const { updateElement } = useSlideStore();
    const hasChanged = useRef(false);
    
    // Calculate styles from theme + element state
    const themeStyles = useElementStyles(element);

    const editor = useEditor({
        extensions: getExtensions(),
        content: element.content?.html || '',
        
        // Auto-Height Logic
        onUpdate: ({ editor }) => {
            hasChanged.current = true;
            const contentHeight = editor.view.dom.scrollHeight;
            if (contentHeight > element.height && contentHeight < 800) {
                 updateElement(element.id, { height: contentHeight + 20 });
            }
        },

        onBlur: ({ editor }) => {
            if (hasChanged.current) {
                updateElement(element.id, {
                    content: {
                        json: editor.getJSON(),
                        html: editor.getHTML(),
                    }
                });
                hasChanged.current = false;
            }
        },
        
        autofocus: true,
        editable: true,
        editorProps: {
            attributes: {
                class: 'outline-none h-full w-full',
                style: 'min-height: 100%;' 
            },
        },
    });

    // Save on unmount
    useEffect(() => {
        return () => {
            if (editor && !editor.isDestroyed && hasChanged.current) {
                 updateElement(element.id, {
                    content: {
                        json: editor.getJSON(),
                        html: editor.getHTML(),
                    }
                });
            }
        };
    }, [editor, element.id, updateElement]);

    // Focus when entering edit mode
    useEffect(() => {
        if (editor && isEditing) {
            editor.commands.focus();
        }
    }, [editor, isEditing]);

    if (!editor) {
        return null;
    }

    return (
        <div 
            className="w-full h-full cursor-text text-element-wrapper relative"
            onMouseDown={(e) => e.stopPropagation()} 
            style={{
                // Apply computed styles to the wrapper
                // Tiptap inherits these because it has a transparent background by default
                color: themeStyles.color,
                fontFamily: themeStyles.fontFamily,
                fontSize: themeStyles.fontSize,
                fontWeight: themeStyles.fontWeight,
                lineHeight: themeStyles.lineHeight,
                letterSpacing: themeStyles.letterSpacing,
            }}
        >
            <TextToolbar editor={editor} />

            <EditorContent 
                editor={editor} 
                className="h-full w-full outline-none prose prose-invert prose-sm max-w-none prose-p:my-0 prose-headings:my-0" 
                // Override prose defaults with our theme values
                style={{ 
                    fontFamily: 'inherit',
                    color: 'inherit',
                    lineHeight: 'inherit'
                }}
            />
        </div>
    );
}

const SlideTextElement: React.FC<SlideTextElementProps> = ({ element, isEditing }) => {
  // Use the hook to get styles for View Mode as well
  const themeStyles = useElementStyles(element);

  // STATE A: VIEW MODE
  if (!isEditing) {
    return (
      <div 
        className="w-full h-full pointer-events-none prose prose-invert prose-sm max-w-none prose-p:my-0 prose-headings:my-0"
        style={{
             wordWrap: 'break-word',
             // Apply Theme Styles
             color: themeStyles.color,
             fontFamily: themeStyles.fontFamily,
             fontSize: themeStyles.fontSize,
             fontWeight: themeStyles.fontWeight,
             lineHeight: themeStyles.lineHeight,
             letterSpacing: themeStyles.letterSpacing,
             // Apply any specific container styles (bg, border) if they exist
             ...element.style
        }}
        dangerouslySetInnerHTML={{ __html: element.content?.html || '' }}
      />
    );
  }

  // STATE B: EDIT MODE
  return <ActiveEditor element={element} isEditing={isEditing} />;
};

export default SlideTextElement;