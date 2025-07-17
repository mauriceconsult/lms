"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { createLowlight } from "lowlight";
import ts from "highlight.js/lib/languages/typescript";
import js from "highlight.js/lib/languages/javascript";
import css from "highlight.js/lib/languages/css";
import { useMemo, useState, useEffect, useCallback } from "react";
import sanitizeHtml from "sanitize-html";
import toast from "react-hot-toast";
import debounce from "lodash.debounce";
import { Button } from "@/components/ui/button";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Link as LinkIcon,
  Image as ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Code,
  Quote,
  List,
  ListOrdered,
  X,
} from "lucide-react";
import {
  EditorProps,
  // ToolbarConfig
} from "@/types/editor";

export const Editor = ({
  onChangeAction,
  value = "",
  onErrorAction,
  maxFileSize = 5 * 1024 * 1024,
  allowedFileTypes = ["image/jpeg", "image/png", "image/gif"],
  debounceDelay = 300,
  toolbarConfig = {
    headers: true,
    font: false,
    size: false,
    formatting: true,
    colors: false,
    lists: true,
    link: true,
    image: true,
    align: true,
    clean: true,
    blockquote: true,
    codeBlock: true,
  },
  maxLength = 5000,
  onCharCountChangeAction,
}: EditorProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isSanitizing, setIsSanitizing] = useState(false);
  const [charCount, setCharCount] = useState(value?.length || 0);

  // Create lowlight instance and register languages
  const lowlight = useMemo(() => {
    const instance = createLowlight();
    instance.register("typescript", ts);
    instance.register("javascript", js);
    instance.register("css", css);
    return instance;
  }, []);

  const sanitizeContent = useCallback(
    (content: string) => {
      if (content.length > maxLength) {
        const message = `Content exceeds ${maxLength} characters`;
        toast.error(message);
        onErrorAction?.(message);
        return;
      }
      setIsSanitizing(true);
      const sanitizedContent = sanitizeHtml(content, {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat([
          "h1",
          "h2",
          "h3",
          "img",
          "blockquote",
          "pre",
        ]),
        allowedAttributes: {
          ...sanitizeHtml.defaults.allowedAttributes,
          a: ["href"],
          img: ["src"],
          pre: ["class"],
        },
      });
      console.log(
        `[${new Date().toISOString()} Editor] sanitizeContent: onChangeAction type:`,
        typeof onChangeAction
      );
      if (typeof onChangeAction === "function") {
        onChangeAction(sanitizedContent);
      } else {
        console.error(
          `[${new Date().toISOString()} Editor] onChangeAction is not a function:`,
          onChangeAction
        );
        onErrorAction?.("Editor error: onChangeAction is not a function");
      }
      setIsSanitizing(false);
    },
    [maxLength, onChangeAction, onErrorAction]
  );

  const debouncedSanitize = useMemo(
    () => debounce(sanitizeContent, debounceDelay),
    [sanitizeContent, debounceDelay]
  );

  useEffect(() => {
    return () => {
      debouncedSanitize.cancel();
    };
  }, [debouncedSanitize]);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: toolbarConfig.headers ? { levels: [1, 2, 3] } : false,
        bulletList: toolbarConfig.lists ? {} : false,
        orderedList: toolbarConfig.lists ? {} : false,
        blockquote: toolbarConfig.blockquote ? {} : false,
        codeBlock: false,
      }),
      Image.configure({
        inline: true,
        allowBase64: false,
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
        alignments: ["left", "center", "right"],
      }),
      CodeBlockLowlight.configure({
        lowlight,
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setCharCount(html.length);
      onCharCountChangeAction?.(html.length);
      if (typeof onChangeAction === "function") {
        console.log(
          `[${new Date().toISOString()} Editor] onUpdate: calling debouncedSanitize`
        );
        debouncedSanitize(html);
      } else {
        console.log(
          `[${new Date().toISOString()} Editor] onUpdate: skipping debouncedSanitize, onChangeAction is`,
          typeof onChangeAction
        );
      }
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none min-h-[150px] p-4",
      },
    },
    immediatelyRender: false,
  });

  const handleImageUpload = () => {
    if (!toolbarConfig.image || !editor) return;
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", allowedFileTypes.join(","));
    input.setAttribute("aria-label", "Upload image");
    input.click();
    input.onchange = async () => {
      const file = input.files?.[0];
      if (file) {
        if (!allowedFileTypes.includes(file.type)) {
          const message = `Only ${allowedFileTypes.join(
            ", "
          )} files are allowed`;
          toast.error(message);
          onErrorAction?.(message);
          return;
        }
        if (file.size > maxFileSize) {
          const message = `Image must be less than ${
            maxFileSize / (1024 * 1024)
          }MB`;
          toast.error(message);
          onErrorAction?.(message);
          return;
        }
        setIsUploading(true);
        try {
          const formData = new FormData();
          formData.append("file", file);
          const response = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          });
          if (!response.ok) throw new Error("Image upload failed");
          const { url } = await response.json();
          editor.chain().focus().setImage({ src: url }).run();
          toast.success("Image uploaded successfully");
        } catch (error) {
          const message = "Failed to upload image";
          console.error(
            `[${new Date().toISOString()} Editor] Image upload error:`,
            error
          );
          toast.error(message);
          onErrorAction?.(message);
        } finally {
          setIsUploading(false);
        }
      }
    };
  };

  const handleLinkInsert = () => {
    if (!editor) return;
    const url = prompt("Enter the URL");
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const handleClearFormatting = () => {
    if (!editor) return;
    editor.chain().focus().clearNodes().unsetAllMarks().run();
  };

  if (!editor) {
    return <div>Loading editor...</div>;
  }

  return (
    <div
      className="bg-white rounded-md relative shadow-sm"
      aria-label="Rich text editor"
    >
      {isUploading && (
        <div
          className="absolute inset-0 bg-gray-200/50 flex items-center justify-center rounded-md"
          role="status"
          aria-live="polite"
        >
          <span className="text-sm text-gray-600">Uploading image...</span>
        </div>
      )}
      {isSanitizing && (
        <div
          className="absolute top-2 right-2 text-xs text-gray-500 bg-white/80 px-2 py-1 rounded"
          role="status"
          aria-live="polite"
        >
          Sanitizing...
        </div>
      )}
      <div className="flex flex-wrap gap-2 p-2 border-b border-gray-200">
        {toolbarConfig.headers && (
          <>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 1 }).run()
              }
              className={
                editor.isActive("heading", { level: 1 }) ? "bg-gray-200" : ""
              }
              aria-label="Toggle heading 1"
            >
              H1
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 2 }).run()
              }
              className={
                editor.isActive("heading", { level: 2 }) ? "bg-gray-200" : ""
              }
              aria-label="Toggle heading 2"
            >
              H2
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 3 }).run()
              }
              className={
                editor.isActive("heading", { level: 3 }) ? "bg-gray-200" : ""
              }
              aria-label="Toggle heading 3"
            >
              H3
            </Button>
          </>
        )}
        {toolbarConfig.formatting && (
          <>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={editor.isActive("bold") ? "bg-gray-200" : ""}
              aria-label="Toggle bold"
            >
              <Bold className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={editor.isActive("italic") ? "bg-gray-200" : ""}
              aria-label="Toggle italic"
            >
              <Italic className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              className={editor.isActive("underline") ? "bg-gray-200" : ""}
              aria-label="Toggle underline"
            >
              <Underline className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleStrike().run()}
              className={editor.isActive("strike") ? "bg-gray-200" : ""}
              aria-label="Toggle strikethrough"
            >
              <Strikethrough className="h-4 w-4" />
            </Button>
          </>
        )}
        {toolbarConfig.lists && (
          <>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={editor.isActive("bulletList") ? "bg-gray-200" : ""}
              aria-label="Toggle bullet list"
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={editor.isActive("orderedList") ? "bg-gray-200" : ""}
              aria-label="Toggle ordered list"
            >
              <ListOrdered className="h-4 w-4" />
            </Button>
          </>
        )}
        {toolbarConfig.link && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleLinkInsert}
            className={editor.isActive("link") ? "bg-gray-200" : ""}
            aria-label="Insert link"
          >
            <LinkIcon className="h-4 w-4" />
          </Button>
        )}
        {toolbarConfig.image && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleImageUpload}
            aria-label="Insert image"
          >
            <ImageIcon className="h-4 w-4" />
          </Button>
        )}
        {toolbarConfig.align && (
          <>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().setTextAlign("left").run()}
              className={
                editor.isActive({ textAlign: "left" }) ? "bg-gray-200" : ""
              }
              aria-label="Align left"
            >
              <AlignLeft className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() =>
                editor.chain().focus().setTextAlign("center").run()
              }
              className={
                editor.isActive({ textAlign: "center" }) ? "bg-gray-200" : ""
              }
              aria-label="Align center"
            >
              <AlignCenter className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().setTextAlign("right").run()}
              className={
                editor.isActive({ textAlign: "right" }) ? "bg-gray-200" : ""
              }
              aria-label="Align right"
            >
              <AlignRight className="h-4 w-4" />
            </Button>
          </>
        )}
        {toolbarConfig.blockquote && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={editor.isActive("blockquote") ? "bg-gray-200" : ""}
            aria-label="Toggle blockquote"
          >
            <Quote className="h-4 w-4" />
          </Button>
        )}
        {toolbarConfig.codeBlock && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={editor.isActive("codeBlock") ? "bg-gray-200" : ""}
            aria-label="Toggle code block"
          >
            <Code className="h-4 w-4" />
          </Button>
        )}
        {toolbarConfig.clean && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClearFormatting}
            aria-label="Clear formatting"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      <EditorContent editor={editor} className="bg-white p-4 rounded-b-md" />
      <div className="text-xs text-muted-foreground mt-1 px-4">
        {charCount}/{maxLength} characters
      </div>
    </div>
  );
};
