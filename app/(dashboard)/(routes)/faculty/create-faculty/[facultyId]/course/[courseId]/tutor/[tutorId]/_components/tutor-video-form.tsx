"use client";

import { useState } from "react";
import MuxPlayer from "@mux/mux-player-react";
import Link from "next/link";

interface TutorVideoFormProps {
  initialData: {
    muxData: {
      id: string;
      createdAt: Date;
      updatedAt: Date;
      tutorId: string | null;
      playbackId: string | null;
      assetId: string;
    } | null;
  };
  tutorId: string;
  courseId: string;
  facultyId: string;
}

interface VideoPlayerProps {
  playbackId: string | null;
  title: string;
  tutorId: string;
  courseId: string;
  facultyId: string;
  nextTutorId: string | undefined;
  isLocked: boolean;
  completeOnEnd: boolean;
  isEligible: boolean;
  additionalPlaybacks?: string[];
}

export function TutorVideoForm({
  initialData,
  tutorId,
  courseId,
  facultyId,
}: TutorVideoFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasVideo = !!initialData.muxData?.playbackId;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    if (selectedFile && !selectedFile.type.startsWith("video/")) {
      setError("Please select a video file.");
      setFile(null);
      return;
    }
    setError(null);
    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) {
      setError("No file selected.");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("video", file);
      formData.append("tutorId", tutorId);
      formData.append("courseId", courseId);
      formData.append("facultyId", facultyId);

      const response = await fetch("/api/upload-video", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to upload video.");
      }

      window.location.reload();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An error occurred during upload."
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <h3 className="text-lg font-medium mb-4">Tutor Video</h3>
      {hasVideo ? (
        <div>
          <p className="text-sm text-gray-600 mb-2">Current video:</p>
          <MuxPlayer
            streamType="on-demand"
            playbackId={initialData.muxData?.playbackId ?? null}
            className="w-full max-w-md mx-auto"
          />
          <p className="text-sm text-gray-600 mt-2">
            Upload a new video to replace the current one.
          </p>
        </div>
      ) : (
        <p className="text-sm text-gray-600 mb-2">No video uploaded yet.</p>
      )}
      <div className="flex flex-col gap-4 mt-4">
        <input
          type="file"
          accept="video/*"
          onChange={handleFileChange}
          className="file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700"
          disabled={uploading}
        />
        {error && <p className="text-red-600">{error}</p>}
        <button
          onClick={handleUpload}
          disabled={uploading || !file}
          className={`px-4 py-2 rounded text-white ${
            uploading || !file
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {uploading ? "Uploading..." : "Upload Video"}
        </button>
      </div>
    </div>
  );
}

export function VideoPlayer({
  playbackId,
  title,
  tutorId,
  courseId,
  facultyId,
  nextTutorId,
  isLocked,
  completeOnEnd,
  isEligible,
}: VideoPlayerProps) {
  const handleVideoEnd = async () => {
    if (completeOnEnd && nextTutorId) {
      try {
        const response = await fetch("/api/complete-tutor", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tutorId }),
        });

        if (!response.ok) {
          throw new Error("Failed to mark tutor as completed.");
        }
      } catch (err) {
        console.error("Failed to mark tutor as completed:", err);
      }
    }
  };

  if (!playbackId || isLocked || !isEligible) {
    return (
      <div className="mt-6 p-4 bg-gray-100 rounded-lg">
        <p className="text-red-600">
          {isLocked
            ? "This video is locked."
            : !isEligible
            ? "You are not eligible to view this video."
            : "No video available."}
        </p>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <h2 className="text-lg font-medium mb-4">{title}</h2>
      <MuxPlayer
        streamType="on-demand"
        playbackId={playbackId}
        metadata={{
          video_id: tutorId,
          video_title: title,
        }}
        onEnded={handleVideoEnd}
        className="w-full max-w-4xl mx-auto"
      />
      {nextTutorId && (
        <div className="mt-4">
          <Link
            href={`/faculty/${facultyId}/course/${courseId}/tutor/${nextTutorId}`}
            className="inline-block px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Next Tutor
          </Link>
        </div>
      )}
    </div>
  );
}
