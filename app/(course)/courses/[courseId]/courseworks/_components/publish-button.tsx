"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface PublishButtonProps {
  facultyId: string;
  isPublished: boolean;
  canPublish: boolean;
}

export default function PublishButton({
  facultyId,
  isPublished,
  canPublish,
}: PublishButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePublish = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/faculties/${facultyId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished: !isPublished }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update faculty");
      }

      router.refresh();
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message || "Failed to update faculty");
      } else {
        setError("Failed to update faculty");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-end">
      <button
        onClick={handlePublish}
        disabled={isLoading || (!isPublished && !canPublish)}
        className={`px-4 py-2 rounded-lg transition ${
          isPublished
            ? "bg-red-600 text-white hover:bg-red-700"
            : "bg-green-600 text-white hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
        }`}
      >
        {isLoading ? "Processing..." : isPublished ? "Unpublish" : "Publish"}
      </button>
      {!canPublish && !isPublished && (
        <p className="text-sm text-gray-500 mt-2">
          Requires: 1 published coursework, 1 course with an assignment, 1 tutor with a video.
        </p>
      )}
      {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
    </div>
  );
}
