"use client";

import { useCallback, useMemo } from "react";
import {
  useEditor,
  EditorContent,
  Editor as TiptapEditor,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import { FileUpload } from "@/components/file-upload";
import debounce from "lodash.debounce";

interface EditorProps {
  value: string;
  onChangeAction: (value: string) => void;
  onErrorAction: (error: string) => void;
  maxFileSize: number;
  allowedFileTypes: string[];
  debounceDelay: number;
  maxLength: number;
  toolbarConfig: {
    headers: boolean;
    font: boolean;
    size: boolean;
    formatting: boolean;
    colors: boolean;
    lists: boolean;
    link: boolean;
    image: boolean;
    align: boolean;
    clean: boolean;
    blockquote: boolean;
    codeBlock: boolean;
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
  const handleImageUpload = useCallback(() => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", allowedFileTypes.join(","));
    input.onchange = async () => {
      const file = input.files?.[0];
      if (file && file.size > maxFileSize) {
        onErrorAction(`File size exceeds ${maxFileSize / 1024 / 1024}MB`);
        return;
      }
      if (file && !allowedFileTypes.includes(file.type)) {
        onErrorAction("Invalid file type. Only JPEG and PNG are allowed.");
        return;
      }
      // FileUpload below handles the upload
    };
    input.click();
  }, [maxFileSize, allowedFileTypes, onErrorAction]);

  const debouncedOnUpdate = useMemo(
    () =>
      debounce(({ editor }: { editor: TiptapEditor }) => {
        const html = editor.getHTML();
        if (html.length > maxLength) {
          onErrorAction(`Content exceeds ${maxLength} characters.`);
          return;
        }
        onChangeAction(html);
      }, debounceDelay),
    [onChangeAction, onErrorAction, maxLength, debounceDelay]
  );

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: toolbarConfig.headers ? { levels: [1, 2, 3] } : false,
        bold: toolbarConfig.formatting ? undefined : false,
        italic: toolbarConfig.formatting ? undefined : false,
        strike: toolbarConfig.formatting ? undefined : false,
        bulletList: toolbarConfig.lists ? undefined : false,
        orderedList: toolbarConfig.lists ? undefined : false,
        blockquote: toolbarConfig.blockquote ? undefined : false,
        codeBlock: toolbarConfig.codeBlock ? undefined : false,
      }),
      Image.configure({
        inline: true,
        allowBase64: false,
      }),
      Link.configure({
        openOnClick: false,
      }),
    ],
    content: value,
    onUpdate: debouncedOnUpdate,
    immediatelyRender: false,
  });

  const toolbar = useMemo(
    () => (
      <div className="border-b border-slate-300 p-2 bg-slate-50 rounded-t-md">
        {toolbarConfig.headers && (
          <>
            <button
              onClick={() =>
                editor?.chain().focus().toggleHeading({ level: 1 }).run()
              }
              className={`px-2 py-1 ${
                editor?.isActive("heading", { level: 1 }) ? "bg-slate-200" : ""
              }`}
            >
              H1
            </button>
            <button
              onClick={() =>
                editor?.chain().focus().toggleHeading({ level: 2 }).run()
              }
              className={`px-2 py-1 ${
                editor?.isActive("heading", { level: 2 }) ? "bg-slate-200" : ""
              }`}
            >
              H2
            </button>
            <button
              onClick={() =>
                editor?.chain().focus().toggleHeading({ level: 3 }).run()
              }
              className={`px-2 py-1 ${
                editor?.isActive("heading", { level: 3 }) ? "bg-slate-200" : ""
              }`}
            >
              H3
            </button>
          </>
        )}
        {toolbarConfig.formatting && (
          <>
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
              onClick={() => editor?.chain().focus().toggleStrike().run()}
              className={`px-2 py-1 ${
                editor?.isActive("strike") ? "bg-slate-200" : ""
              }`}
            >
              S
            </button>
          </>
        )}
        {toolbarConfig.lists && (
          <>
            <button
              onClick={() => editor?.chain().focus().toggleBulletList().run()}
              className={`px-2 py-1 ${
                editor?.isActive("bulletList") ? "bg-slate-200" : ""
              }`}
            >
              • List
            </button>
            <button
              onClick={() => editor?.chain().focus().toggleOrderedList().run()}
              className={`px-2 py-1 ${
                editor?.isActive("orderedList") ? "bg-slate-200" : ""
              }`}
            >
              1. List
            </button>
          </>
        )}
        {toolbarConfig.link && (
          <button
            onClick={() => {
              const url = prompt("Enter URL");
              if (url) editor?.chain().focus().setLink({ href: url }).run();
            }}
            className={`px-2 py-1 ${
              editor?.isActive("link") ? "bg-slate-200" : ""
            }`}
          >
            Link
          </button>
        )}
        {toolbarConfig.image && (
          <button
            onClick={handleImageUpload}
            className={`px-2 py-1 ${
              editor?.isActive("image") ? "bg-slate-200" : ""
            }`}
          >
            Image
          </button>
        )}
        {toolbarConfig.blockquote && (
          <button
            onClick={() => editor?.chain().focus().toggleBlockquote().run()}
            className={`px-2 py-1 ${
              editor?.isActive("blockquote") ? "bg-slate-200" : ""
            }`}
          >
            Quote
          </button>
        )}
        {toolbarConfig.codeBlock && (
          <button
            onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
            className={`px-2 py-1 ${
              editor?.isActive("codeBlock") ? "bg-slate-200" : ""
            }`}
          >
            Code
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
        className="border border-slate-300 bg-white rounded-b-md p-4"
      />
      <FileUpload
        endpoint="courseImage" // Use "courseImage" for CourseDescriptionForm
        onChange={(url) => {
          if (url && editor) {
            editor.chain().focus().setImage({ src: url }).run();
          }
        }}
      />
    </div>
  );
};

export default Editor;
