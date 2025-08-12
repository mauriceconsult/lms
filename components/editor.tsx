"use client";

import { useCallback, useMemo, useEffect } from "react";
import {
  useEditor,
  EditorContent,
  Editor as TiptapEditor,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import debounce from "lodash.debounce";
import { Table } from "@tiptap/extension-table";

interface EditorProps {
  value: string;
  onChangeAction: (value: string) => void;
  onErrorAction: (error: string) => void;
  maxFileSize: number;
  allowedFileTypes: string[];
  debounceDelay: number;
  maxLength: number;
  toolbarConfig: {
    formatting: boolean;
    image: boolean;
    align: boolean;
    clean: boolean;
    table: boolean;
  };
}

export const Editor = ({
  value,
  onChangeAction,
  onErrorAction,
  maxFileSize,
  allowedFileTypes,
  debounceDelay,
  maxLength,
  toolbarConfig,
}: EditorProps) => {
  const debouncedOnUpdate = useMemo(
    () =>
      debounce(({ editor }: { editor: TiptapEditor }) => {
        const html = editor.getHTML();
        if (html.length > maxLength) {
          onErrorAction(`Content exceeds ${maxLength} characters.`);
          return;
        }
        // Only trigger onChangeAction if content has changed
        if (html !== value) {
          onChangeAction(html);
        }
      }, debounceDelay),
    [onChangeAction, onErrorAction, maxLength, debounceDelay, value]
  );

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        bulletList: false,
        orderedList: false,
        blockquote: false,
        codeBlock: false,
        bold: toolbarConfig.formatting ? undefined : false,
        italic: toolbarConfig.formatting ? undefined : false,
        paragraph: undefined, // Enable paragraph with default settings
      }),
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      Image.configure({
        inline: true,
        allowBase64: false,
      }),
    ],
    content: value ?? "",
    onUpdate: debouncedOnUpdate,
    immediatelyRender: false,
  });

  const handleImageUpload = useCallback(() => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", allowedFileTypes.join(","));
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return; // Type guard to ensure file is defined
      if (file.size > maxFileSize) {
        onErrorAction(`File size exceeds ${maxFileSize / 1024 / 1024}MB`);
        return;
      }
      if (!allowedFileTypes.includes(file.type)) {
        onErrorAction("Invalid file type. Only JPEG and PNG are allowed.");
        return;
      }
      // Simulate image upload (replace with actual upload logic)
      const url = URL.createObjectURL(file);
      editor?.chain().focus().setImage({ src: url }).run();
    };
    input.click();
  }, [maxFileSize, allowedFileTypes, onErrorAction, editor]);

  useEffect(() => {
    return () => {
      debouncedOnUpdate.cancel();
    };
  }, [debouncedOnUpdate]);

  const toolbar = useMemo(
    () => (
      <div className="border-b border-slate-300 p-2 bg-slate-50 rounded-t-md">
        {toolbarConfig.formatting && (
          <>
            <button
              onClick={() => editor?.chain().focus().setParagraph().run()}
              className={`px-2 py-1 ${
                editor?.isActive("paragraph") ? "bg-slate-200" : ""
              }`}
            >
              P
            </button>
            <button
              onClick={() => editor?.chain().focus().toggleBold().run()}
              className={`px-2 py-1 ${
                editor?.isActive("bold") ? "bg-slate-200" : ""
              }`}
            >
              B
            </button>
            <button
              onClick={() => editor?.chain().focus().toggleItalic().run()}
              className={`px-2 py-1 ${
                editor?.isActive("italic") ? "bg-slate-200" : ""
              }`}
            >
              I
            </button>
            <button
              onClick={() => editor?.chain().focus().toggleUnderline().run()}
              className={`px-2 py-1 ${
                editor?.isActive("underline") ? "bg-slate-200" : ""
              }`}
            >
              U
            </button>
          </>
        )}
        {toolbarConfig.align && (
          <>
            <button
              onClick={() => editor?.chain().focus().setTextAlign("left").run()}
              className={`px-2 py-1 ${
                editor?.isActive({ textAlign: "left" }) ? "bg-slate-200" : ""
              }`}
            >
              Left
            </button>
            <button
              onClick={() => editor?.chain().focus().setTextAlign("center").run()}
              className={`px-2 py-1 ${
                editor?.isActive({ textAlign: "center" }) ? "bg-slate-200" : ""
              }`}
            >
              Center
            </button>
            <button
              onClick={() => editor?.chain().focus().setTextAlign("right").run()}
              className={`px-2 py-1 ${
                editor?.isActive({ textAlign: "right" }) ? "bg-slate-200" : ""
              }`}
            >
              Right
            </button>
          </>
        )}
        {toolbarConfig.table && (
          <>
            <button
              onClick={() =>
                editor
                  ?.chain()
                  .focus()
                  .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
                  .run()
              }
              className="px-2 py-1"
            >
              Table
            </button>
            <button
              onClick={() => editor?.chain().focus().deleteTable().run()}
              className="px-2 py-1"
              disabled={!editor?.can().deleteTable()}
            >
              Del Table
            </button>
            <button
              onClick={() => editor?.chain().focus().addRowAfter().run()}
              className="px-2 py-1"
              disabled={!editor?.can().addRowAfter()}
            >
              Add Row
            </button>
            <button
              onClick={() => editor?.chain().focus().addColumnAfter().run()}
              className="px-2 py-1"
              disabled={!editor?.can().addColumnAfter()}
            >
              Add Col
            </button>
            <button
              onClick={() => editor?.chain().focus().deleteRow().run()}
              className="px-2 py-1"
              disabled={!editor?.can().deleteRow()}
            >
              Del Row
            </button>
            <button
              onClick={() => editor?.chain().focus().deleteColumn().run()}
              className="px-2 py-1"
              disabled={!editor?.can().deleteColumn()}
            >
              Del Col
            </button>
          </>
        )}
        {toolbarConfig.image && (
          <button
            onClick={handleImageUpload}
            className={`px-2 py-1 ${
              editor?.isActive("image") ? "bg-slate-200" : ""
            }`}
            disabled={!editor}
          >
            Image
          </button>
        )}
        {toolbarConfig.clean && (
          <button
            onClick={() =>
              editor?.chain().focus().clearNodes().unsetAllMarks().run()
            }
            className="px-2 py-1"
          >
            Clear
          </button>
        )}
      </div>
    ),
    [editor, toolbarConfig, handleImageUpload]
  );

  if (!editor) {
    return <div>Loading editor...</div>;
  }

  return (
    <div className="relative">
      {toolbar}
      <EditorContent
        editor={editor}
        className="border border-slate-300 bg-white rounded-b-md p-4 prose max-w-none"
      />
    </div>
  );
};

export default Editor;