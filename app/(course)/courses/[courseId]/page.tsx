"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { LayoutDashboard } from "lucide-react";
import { IconBadge } from "@/components/icon-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "react-hot-toast";
import Image from "next/image";
import Link from "next/link";

interface Tutor {
  id: string;
  title: string;
  description: string | null;
  videoUrl: string | null;
  isPublished: boolean;
}

interface Course {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  isPublished: boolean;
  tutors: Tutor[];
}

interface ApiResponse {
  success: boolean;
  data?: Course;
  message?: string;
}

const CoursePage = () => {
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { isSignedIn, user } = useUser();
  const params = useParams<{ courseId: string }>();

  useEffect(() => {
    if (!isSignedIn) {
      console.error(
        `[${new Date().toISOString()} CoursePage] User not signed in`
      );
      router.push("/sign-in");
      return;
    }

    if (!params.courseId) {
      console.error(
        `[${new Date().toISOString()} CoursePage] No courseId provided`
      );
      setError("No course ID provided");
      setLoading(false);
      return;
    }

    const fetchCourse = async () => {
      try {
        console.log(
          `[${new Date().toISOString()} CoursePage] Fetching from: /api/courses/${
            params.courseId
          }, User ID:`,
          user?.id
        );
        const response = await fetch(
          `${
            process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
          }/api/courses/${params.courseId}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          }
        );
        console.log(
          `[${new Date().toISOString()} CoursePage] Response status:`,
          response.status,
          response.statusText
        );
        if (!response.ok) {
          throw new Error(
            `HTTP error! Status: ${response.status} ${response.statusText}`
          );
        }
        const result: ApiResponse = await response.json();
        console.log(
          `[${new Date().toISOString()} CoursePage] Response data:`,
          result
        );
        if (result.success && result.data) {
          setCourse(result.data);
        } else {
          throw new Error(result.message || "Failed to load course");
        }
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : "Unexpected error occurred";
        console.error(
          `[${new Date().toISOString()} CoursePage] Error fetching course:`,
          error
        );
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [isSignedIn, router, user, params.courseId]);

  if (loading) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-medium">Loading...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-medium">Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-medium">Course Not Found</h2>
        <p>
          The requested course does not exist or you do not have access to it.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center gap-x-2 mb-6">
        <IconBadge icon={LayoutDashboard} />
        <h1 className="text-2xl font-medium">{course.title}</h1>
      </div>
      <Card className="border bg-slate-50 mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-x-2">
            <IconBadge icon={LayoutDashboard} />
            <span>Course Details</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {course.imageUrl ? (
            <Image
              src={course.imageUrl}
              alt={course.title}
              width={200}
              height={200}
              className="rounded-md object-cover"
            />
          ) : (
            <div className="w-[200px] h-[200px] bg-slate-200 rounded-md flex items-center justify-center">
              <span className="text-sm text-slate-500">No Image</span>
            </div>
          )}
          <p className="text-sm text-slate-600">
            {course.description || "No description available."}
          </p>
          <Badge variant={course.isPublished ? "default" : "secondary"}>
            {course.isPublished ? "Published" : "Draft"}
          </Badge>
        </CardContent>
      </Card>
      <div className="space-y-4">
        <h2 className="text-xl font-medium">Tutors</h2>
        {course.tutors.length === 0 ? (
          <p className="text-sm text-slate-500 italic">No tutors available</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {course.tutors.map((tutor) => (
              <Card key={tutor.id} className="border bg-slate-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-x-2">
                    <IconBadge icon={LayoutDashboard} />
                    <span>{tutor.title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    {tutor.videoUrl ? (
                      <video
                        controls
                        src={tutor.videoUrl}
                        className="w-full h-auto rounded-md"
                      />
                    ) : (
                      <p className="text-sm text-slate-500 italic">
                        No video available
                      </p>
                    )}
                    <p className="text-sm text-slate-600 mt-1">
                      {tutor.description && tutor.description.length > 100
                        ? `${tutor.description.slice(0, 100)}...`
                        : tutor.description || "No description available"}
                    </p>
                    <Badge
                      variant={tutor.isPublished ? "default" : "secondary"}
                    >
                      {tutor.isPublished ? "Published" : "Draft"}
                    </Badge>
                    <Link
                      href={`/tutor/${tutor.id}`}
                      className="inline-block mt-2 text-sm text-blue-600 hover:underline"
                    >
                      View Tutor
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursePage;
