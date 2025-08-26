"use client";

interface PreviewProps {
  value: string | null;
}

export const Preview = ({ value }: PreviewProps) => {
  // Function to strip HTML tags
  const stripHtml = (html: string | null) => {
    if (!html) return "No description";
    return html.replace(/<[^>]+>/g, "").trim();
  };

  return (
    <span className="text-sm text-slate-600 mt-1 block">
      {stripHtml(value).length > 100
        ? `${stripHtml(value).slice(0, 100)}...`
        : stripHtml(value)}
    </span>
  );
};
