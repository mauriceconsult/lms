"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { toast } from "react-hot-toast";

interface Tutor {
  id: string;
  title: string;
}

interface ApiResponse {
  success: boolean;
  data?: Tutor[];
  message?: string;
}

const CourseNavbar = () => {
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState(true);
  const { isSignedIn } = useUser();
  const params = useParams<{ courseId: string }>();

  useEffect(() => {
    if (!isSignedIn || !params.courseId) return;

    const fetchTutors = async () => {
      try {
        const response = await fetch(
          `${
            process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
          }/api/courses/${params.courseId}/tutors`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          }
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const result: ApiResponse = await response.json();
        if (result.success && result.data) {
          setTutors(result.data);
        } else {
          throw new Error(result.message || "Failed to load tutors");
        }
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : "Unexpected error occurred";
        console.error(
          `[${new Date().toISOString()} CourseNavbar] Error fetching tutors:`,
          error
        );
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchTutors();
  }, [isSignedIn, params.courseId]);

  if (loading) {
    return (
      <div className="bg-slate-50 h-[80px] flex items-center px-6">
        Loading...
      </div>
    );
  }

  return (
    <div className="bg-slate-50 h-[80px] flex items-center px-6 space-x-4 overflow-x-auto">
      <Link
        href={`/courses/${params.courseId}`}
        className="text-sm text-blue-600 hover:underline"
      >
        Home
      </Link>
      <div className="relative group">
        <span className="text-sm text-blue-600 cursor-pointer">Tutors</span>
        <div className="absolute hidden group-hover:block bg-white shadow-md rounded-md p-2 mt-1 min-w-[200px]">
          {tutors.length === 0 ? (
            <p className="text-sm text-slate-500">No tutors</p>
          ) : (
            tutors.map((tutor) => (
              <Link
                key={tutor.id}
                href={`/tutor/${tutor.id}`}
                className="block text-sm text-blue-600 hover:underline py-1"
              >
                {tutor.title}
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseNavbar;
