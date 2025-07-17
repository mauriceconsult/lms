"use client";

interface PreviewProps {
  value: string;
}

export const Preview = ({ value }: PreviewProps) => {
  return (
    <div
      className="prose prose-sm sm:prose lg:prose-lg xl:prose-2xl"
      dangerouslySetInnerHTML={{ __html: value }}
    />
  );
};
