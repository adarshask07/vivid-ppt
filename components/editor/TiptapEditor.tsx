import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { useSlideStore } from '../../store/useSlideStore';

interface TiptapEditorProps {
  elementId: string;
  initialContent: any;
  isEditing: boolean;
}

const TiptapEditor: React.FC<TiptapEditorProps> = ({ elementId, initialContent, isEditing }) => {
  const updateElement = useSlideStore((state) => state.updateElement);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Type something...',
      }),
    ],
    content: initialContent?.json || initialContent?.html || '<p></p>',
    editable: isEditing,
    onUpdate: ({ editor }) => {
      // Sync content back to store
      updateElement(elementId, {
        content: {
          json: editor.getJSON(),
          html: editor.getHTML(),
        }
      });
    },
    editorProps: {
        attributes: {
            class: 'h-full w-full outline-none'
        }
    }
  });

  // Focus when entering edit mode
  useEffect(() => {
    if (isEditing && editor) {
      editor.commands.focus();
    }
  }, [isEditing, editor]);

  return (
    <EditorContent editor={editor} className="h-full w-full cursor-text" />
  );
};

export default TiptapEditor;