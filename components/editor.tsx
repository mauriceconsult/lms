// components/Editor.tsx
"use client";

import dynamic from "next/dynamic";
import { useMemo, useRef, useState, useEffect } from "react";
import "react-quill/dist/quill.snow.css";
import sanitizeHtml from "sanitize-html";
import toast from "react-hot-toast";
import debounce from "lodash.debounce";
import ReactQuill from "react-quill";

interface ToolbarConfig {
  headers?: boolean;
  font?: boolean;
  size?: boolean;
  formatting?: boolean;
  colors?: boolean;
  lists?: boolean;
  link?: boolean;
  image?: boolean;
  align?: boolean;
  clean?: boolean;
  blockquote?: boolean;
  codeBlock?: boolean;
}

interface EditorProps {
  onValueChangeAction: (value: string) => void;
  value: string | undefined;
  onErrorAction?: (error: string) => void;
  maxFileSize?: number;
  allowedFileTypes?: string[];
  debounceDelay?: number;
  toolbarConfig?: ToolbarConfig;
  maxLength?: number;
  onCharCountChangeAction?: (count: number) => void;
}

export const Editor = ({
  onValueChangeAction,
  value = "",
  onErrorAction,
  maxFileSize = 5 * 1024 * 1024,
  allowedFileTypes = ["image/jpeg", "image/png", "image/gif"],
  debounceDelay = 300,
  toolbarConfig = {
    headers: true,
    font: true,
    size: true,
    formatting: true,
    colors: true,
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
  const ReactQuillComponent = useMemo(
    () =>
      dynamic(() => import("react-quill"), {
        ssr: false,
        loading: () => <div>Loading editor...</div>,
      }) as typeof ReactQuill,
    []
  );
  const quillRef = useRef<ReactQuill>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSanitizing, setIsSanitizing] = useState(false);
  const [charCount, setCharCount] = useState(value?.length || 0);

  // Define the sanitization function
  const sanitizeContent = (content: string) => {
    if (content.length > maxLength) {
      const message = `Content exceeds ${maxLength} characters`;
      toast.error(message);
      // onErrorAction?.(message) ?? toast.error(message);
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
    onValueChangeAction(sanitizedContent);
    setIsSanitizing(false);
  };

  // Create debounced version of sanitizeContent
  const debouncedSanitize = useMemo(
    () => debounce(sanitizeContent, debounceDelay),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      sanitizeContent,
      debounceDelay,
      maxLength,
      onValueChangeAction,
      onErrorAction,
    ]
  );

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      debouncedSanitize.cancel();
    };
  }, [debouncedSanitize]);

  const handleChange = (content: string) => {
    setCharCount(content.length);
    onCharCountChangeAction?.(content.length);
    debouncedSanitize(content);
  };

  const modules = {
    toolbar: {
      container: [
        ...(toolbarConfig.headers
          ? [[{ header: [1, 2, 3, false], "aria-label": "Select header" }]]
          : []),
        ...(toolbarConfig.font
          ? [[{ font: [], "aria-label": "Select font" }]]
          : []),
        ...(toolbarConfig.size
          ? [
              [
                {
                  size: ["small", false, "large", "huge"],
                  "aria-label": "Select size",
                },
              ],
            ]
          : []),
        ...(toolbarConfig.formatting
          ? [
              [
                { bold: "bold", "aria-label": "Bold" },
                { italic: "italic", "aria-label": "Italic" },
                { underline: "underline", "aria-label": "Underline" },
                { strike: "strike", "aria-label": "Strikethrough" },
              ],
            ]
          : []),
        ...(toolbarConfig.colors
          ? [
              [
                { color: [], "aria-label": "Text color" },
                { background: [], "aria-label": "Background color" },
              ],
            ]
          : []),
        ...(toolbarConfig.lists
          ? [
              [
                { list: "ordered", "aria-label": "Ordered list" },
                { list: "bullet", "aria-label": "Bullet list" },
              ],
            ]
          : []),
        ...(toolbarConfig.link || toolbarConfig.image
          ? [
              [
                ...(toolbarConfig.link
                  ? [{ link: "link", "aria-label": "Insert link" }]
                  : []),
                ...(toolbarConfig.image
                  ? [{ image: "image", "aria-label": "Insert image" }]
                  : []),
              ],
            ]
          : []),
        ...(toolbarConfig.align
          ? [[{ align: [], "aria-label": "Text alignment" }]]
          : []),
        ...(toolbarConfig.blockquote
          ? [[{ blockquote: "blockquote", "aria-label": "Blockquote" }]]
          : []),
        ...(toolbarConfig.codeBlock
          ? [[{ "code-block": "code-block", "aria-label": "Code block" }]]
          : []),
        ...(toolbarConfig.clean
          ? [[{ clean: "clean", "aria-label": "Clear formatting" }]]
          : []),
      ],
      handlers: {
        image: async () => {
          if (!toolbarConfig.image) return;
          const input = document.createElement("input");
          input.setAttribute("type", "file");
          input.setAttribute("accept", allowedFileTypes.join(","));
          input.setAttribute("aria-label", "Upload image");
          input.click();
          input.onchange = async () => {
            const file = input.files?.[0];
            if (file && quillRef.current) {
              if (!allowedFileTypes.includes(file.type)) {
                const message = `Only ${allowedFileTypes.join(
                  ", "
                )} files are allowed`;
                toast.error(message);
                // onErrorAction?.(message) ?? toast.error(message);
                return;
              }
              if (file.size > maxFileSize) {
                const message = `Image must be less than ${
                  maxFileSize / (1024 * 1024)
                }MB`;
                toast.error(message);
                // onErrorAction?.(message) ?? toast.error(message);
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
                const quill = quillRef.current.getEditor();
                const range = quill.getSelection(true);
                quill.insertEmbed(range.index, "image", url);
                toast.success("Image uploaded successfully");
              } catch (error) {
                const message = "Failed to upload image";
                console.error("Image upload error:", error);
                toast.error(message);
                // onErrorAction?.(message) ?? toast.error(message);
              } finally {
                setIsUploading(false);
              }
            }
          };
        },
      },
    },
  };

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
      <ReactQuillComponent
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={handleChange}
        modules={modules}
        placeholder="Enter course description..."
        aria-label="Course description editor"
      />
      <div className="text-xs text-muted-foreground mt-1">
        {charCount}/{maxLength} characters
      </div>
    </div>
  );
};
