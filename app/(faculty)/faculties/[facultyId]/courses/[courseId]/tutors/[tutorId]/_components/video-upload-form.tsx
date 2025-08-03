"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { uploadVideo } from "@/actions/video";

// Define prop interface
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
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a video file");
      return;
    }

    startTransition(async () => {
      try {
        await uploadVideo({ file, tutorId }); // Removed courseId and facultyId
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
        <input
          type="file"
          accept="video/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          disabled={isPending}
        />
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
