"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { uploadVideo } from "@/actions/video";

interface VideoUploadFormProps {
  tutorId: string;
  courseId: string;
  facultyId: string;
}

const VideoUploadForm = ({
  tutorId,
  courseId,
  facultyId,
}: VideoUploadFormProps) => {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      try {
        await uploadVideo({ tutorId });
        setError(null);
        router.push(
          `/faculties/${facultyId}/courses/${courseId}/tutors/${tutorId}`
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : "Upload failed");
      }
    });
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Upload Onboarding Video</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
          disabled={isPending}
        >
          {isPending ? "Uploading..." : "Upload Video"}
        </button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </form>
    </div>
  );
};

export default VideoUploadForm;
