"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { toast } from "react-hot-toast";

interface Faculty {
  id: string;
  title: string;
}

interface Course {
  id: string;
  title: string;
}

interface Tutor {
  id: string;
  title: string;
}

interface ApiResponse {
  success: boolean;
  data?: {
    faculties: Faculty[];
    courses: Course[];
    tutors: Tutor[];
  };
  message?: string;
}

const FacultyNavbar = () => {
  const [data, setData] = useState<{
    faculties: Faculty[];
    courses: Course[];
    tutors: Tutor[];
  }>({
    faculties: [],
    courses: [],
    tutors: [],
  });
  const [loading, setLoading] = useState(true);
  const { isSignedIn } = useUser();
  const params = useParams<{ facultyId: string }>();

  useEffect(() => {
    if (!isSignedIn || !params.facultyId) return;

    const fetchNavbarData = async () => {
      try {
        const response = await fetch(
          `${
            process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
          }/api/faculties/${params.facultyId}/navbar`,
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
          setData(result.data);
        } else {
          throw new Error(result.message || "Failed to load navbar data");
        }
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : "Unexpected error occurred";
        console.error(
          `[${new Date().toISOString()} FacultyNavbar] Error fetching navbar data:`,
          error
        );
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchNavbarData();
  }, [isSignedIn, params.facultyId]);

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
        href={`/faculties/${params.facultyId}`}
        className="text-sm text-blue-600 hover:underline"
      >
        Home
      </Link>
      <div className="relative group">
        <span className="text-sm text-blue-600 cursor-pointer">Faculties</span>
        <div className="absolute hidden group-hover:block bg-white shadow-md rounded-md p-2 mt-1 min-w-[200px]">
          {data.faculties.length === 0 ? (
            <p className="text-sm text-slate-500">No faculties</p>
          ) : (
            data.faculties.map((faculty) => (
              <Link
                key={faculty.id}
                href={`/faculties/${faculty.id}`}
                className="block text-sm text-blue-600 hover:underline py-1"
              >
                {faculty.title}
              </Link>
            ))
          )}
        </div>
      </div>
      <div className="relative group">
        <span className="text-sm text-blue-600 cursor-pointer">Courses</span>
        <div className="absolute hidden group-hover:block bg-white shadow-md rounded-md p-2 mt-1 min-w-[200px]">
          {data.courses.length === 0 ? (
            <p className="text-sm text-slate-500">No courses</p>
          ) : (
            data.courses.map((course) => (
              <Link
                key={course.id}
                href={`/courses/${course.id}`}
                className="block text-sm text-blue-600 hover:underline py-1"
              >
                {course.title}
              </Link>
            ))
          )}
        </div>
      </div>
      <div className="relative group">
        <span className="text-sm text-blue-600 cursor-pointer">Tutors</span>
        <div className="absolute hidden group-hover:block bg-white shadow-md rounded-md p-2 mt-1 min-w-[200px]">
          {data.tutors.length === 0 ? (
            <p className="text-sm text-slate-500">No tutors</p>
          ) : (
            data.tutors.map((tutor) => (
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

export default FacultyNavbar;
