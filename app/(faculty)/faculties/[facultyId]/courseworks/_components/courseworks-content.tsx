"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LayoutDashboard } from "lucide-react";
import { Banner } from "@/components/banner";
import { IconBadge } from "@/components/icon-badge";
import Link from "next/link";

interface Attachment {
  id: string;
  name: string;
  url: string;
  createdAt: Date;
  updatedAt: Date;
  facultyId: string | null;
  courseId: string | null;
  noticeboardId: string | null;
  courseworkId: string | null;
  facultyPayrollId: string | null;
}

interface Coursework {
  id: string;
  title: string;
  description: string | null;
  isPublished: boolean;
  facultyId: string | null;
  createdBy: string | null;
  attachments: Attachment[];
}

interface CourseworksContentProps {
  courseworks: Coursework[];
  facultyId: string;
  userId: string;
}

export default function CourseworksContent({ courseworks, facultyId, userId }: CourseworksContentProps) {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<"admin" | "student">("admin");
  const [newCourseworkTitle, setNewCourseworkTitle] = useState("");
  const [error, setError] = useState<string | null>(null);

  const toggleViewMode = () => {
    const newMode = viewMode === "admin" ? "student" : "admin";
    setViewMode(newMode);
    void router.push(`/faculties/${facultyId}/courseworks?view=${newMode}`, {
      scroll: false,
    });
  };

  const handleCreateCoursework = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseworkTitle.trim()) {
      setError("Coursework title is required");
      return;
    }

    try {
      const response = await fetch(`/api/faculties/${facultyId}/courseworks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newCourseworkTitle, isPublished: false, createdBy: userId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create coursework");
      }

      setNewCourseworkTitle("");
      setError(null);
      router.refresh();
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message || "Failed to create coursework");
      } else {
        setError("Failed to create coursework");
      }
    }
  };

  const filteredCourseworks =
    viewMode === "student" ? courseworks.filter((cw) => cw.isPublished) : courseworks;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div className="w-full">
          <div className="flex items-center justify-between w-full mt-4">
            <div className="flex flex-col gap-y-2">
              <h1 className="text-2xl font-medium">Faculty Courseworks</h1>
              <div className="text-sm text-slate-700">
                {filteredCourseworks.length} courseworks available
              </div>
            </div>
            <button
              onClick={toggleViewMode}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Switch to {viewMode === "admin" ? "Student" : "Admin"} View
            </button>
          </div>
        </div>
      </div>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {viewMode === "admin" && (
        <form onSubmit={handleCreateCoursework} className="mt-6 mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              value={newCourseworkTitle}
              onChange={(e) => setNewCourseworkTitle(e.target.value)}
              placeholder="Enter coursework title"
              className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
            >
              Create Coursework
            </button>
          </div>
        </form>
      )}

      {filteredCourseworks.length === 0 ? (
        <p className="text-slate-500 mt-16 text-center">
          {viewMode === "student" ? "No coursework available." : "No courseworks found."}
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
          {filteredCourseworks.map((coursework) => (
            <div
              key={coursework.id}
              className="space-y-4 p-4 border rounded-lg shadow-sm hover:shadow-md transition"
            >
              {viewMode === "admin" && !coursework.isPublished && (
                <Banner variant="warning" label="This Coursework is unpublished." />
              )}
              <div className="flex items-center gap-x-2">
                <IconBadge icon={LayoutDashboard} />
                <h2 className="text-xl">{coursework.title}</h2>
              </div>
              <p className="text-slate-600">
                {(coursework.description || "No description").substring(0, 100)}...
              </p>
              <Link
                href={`/faculties/${facultyId}/courseworks/${coursework.id}`}
                className="text-blue-600 hover:underline"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
