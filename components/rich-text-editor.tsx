import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import TextAlign from "@tiptap/extension-text-align";
import { useImperativeHandle, forwardRef, useState, ForwardedRef } from "react";
import { Table } from "@tiptap/extension-table";

// Define props interface for TypeScript
interface RichTextEditorProps {
  content: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

// Toolbar Component
interface ToolbarProps {
  editor: Editor | null;
}

const Toolbar = ({ editor }: ToolbarProps) => {
  if (!editor) return null;

  const addTable = () => {
    editor
      .chain()
      .focus()
      .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
      .run();
  };

  return (
    <div className="toolbar sticky top-0 bg-white z-10 p-2 border-b flex gap-2 flex-wrap">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={
          editor.isActive("heading", { level: 1 })
            ? "is-active bg-gray-200 p-1 rounded"
            : "p-1 rounded"
        }
        title="Heading 1"
        aria-label="Toggle Heading 1"
      >
        H1
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={
          editor.isActive("heading", { level: 2 })
            ? "is-active bg-gray-200 p-1 rounded"
            : "p-1 rounded"
        }
        title="Heading 2"
        aria-label="Toggle Heading 2"
      >
        H2
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().setParagraph().run()}
        className={
          editor.isActive("paragraph")
            ? "is-active bg-gray-200 p-1 rounded"
            : "p-1 rounded"
        }
        title="Paragraph"
        aria-label="Set Paragraph"
      >
        P
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={
          editor.isActive("bold")
            ? "is-active bg-gray-200 p-1 rounded"
            : "p-1 rounded"
        }
        title="Bold"
        aria-label="Toggle Bold"
      >
        <b>B</b>
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={
          editor.isActive("italic")
            ? "is-active bg-gray-200 p-1 rounded"
            : "p-1 rounded"
        }
        title="Italic"
        aria-label="Toggle Italic"
      >
        <i>I</i>
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
        className={
          editor.isActive({ textAlign: "left" })
            ? "is-active bg-gray-200 p-1 rounded"
            : "p-1 rounded"
        }
        title="Align Left"
        aria-label="Align Left"
      >
        ←
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        className={
          editor.isActive({ textAlign: "center" })
            ? "is-active bg-gray-200 p-1 rounded"
            : "p-1 rounded"
        }
        title="Align Center"
        aria-label="Align Center"
      >
        ↔
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
        className={
          editor.isActive({ textAlign: "right" })
            ? "is-active bg-gray-200 p-1 rounded"
            : "p-1 rounded"
        }
        title="Align Right"
        aria-label="Align Right"
      >
        →
      </button>
      <button
        type="button"
        onClick={addTable}
        className="p-1 rounded"
        title="Insert Table"
        aria-label="Insert Table"
      >
        Table
      </button>
    </div>
  );
};

// RichTextEditor Component
const RichTextEditor = forwardRef(
  (
    { content, onChange, disabled }: RichTextEditorProps,
    ref: ForwardedRef<unknown>
  ) => {
    const [charCount, setCharCount] = useState(0);

    const editor = useEditor({
      extensions: [
        StarterKit.configure({
          heading: {
            levels: [1, 2],
          },
        }),
        Table.configure({
          resizable: true,
        }),
        TableRow,
        TableHeader,
        TableCell,
        TextAlign.configure({
          types: ["heading", "paragraph"],
          alignments: ["left", "center", "right"],
        }),
      ],
      content,
      onUpdate: ({ editor }) => {
        const text = editor.getText();
        setCharCount(text.length);
        if (text.length <= 5000) {
          onChange(editor.getHTML());
        } else {
          editor.commands.setContent(editor.getHTML().slice(0, 5000));
          alert("Maximum character limit of 5000 reached!");
        }
      },
      editorProps: {
        attributes: {
          class:
            "prose max-w-4xl p-4 border rounded-lg focus:outline-none min-h-[200px]",
        },
      },
      editable: !disabled,
      immediatelyRender: false, // Fix SSR hydration mismatch
    });

    useImperativeHandle(ref, () => ({
      getHTML: () => editor?.getHTML(),
      getText: () => editor?.getText(),
      getJSON: () => editor?.getJSON(),
    }));

    if (!editor) return null;

    return (
      <div>
        <Toolbar editor={editor} />
        <EditorContent editor={editor} />
        <div className="text-sm text-gray-500 mt-2">
          {charCount}/5000 characters
        </div>
      </div>
    );
  }
);

RichTextEditor.displayName = "RichTextEditor";

export default RichTextEditor;
