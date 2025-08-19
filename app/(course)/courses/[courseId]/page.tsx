"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { LayoutDashboard } from "lucide-react";
import { IconBadge } from "@/components/icon-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import Image from "next/image";
import Link from "next/link";
import { sanitizeDescription } from "@/lib/sanitize";

interface Tutor {
  id: string;
  title: string;
  description: string | null;
  videoUrl: string | null;
  isPublished: boolean;
  position: number;
}

interface Course {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  isPublished: boolean;
  facultyId: string;
  tutors: Tutor[];
}

interface ApiResponse {
  success: boolean;
  data?: Course;
  message?: string;
}

interface EnrollmentResponse {
  success: boolean;
  isEnrolled: boolean;
  message?: string;
}

const CoursePage = () => {
  const [course, setCourse] = useState<Course | null>(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { isSignedIn } = useUser();
  const params = useParams<{ courseId: string }>();

  useEffect(() => {
    console.log(`[${new Date().toISOString()} CoursePage] Params:`, params);
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

    const fetchCourseAndEnrollment = async (retryCount = 0) => {
      try {
        setLoading(true);
        const courseUrl = `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
        }/api/courses/${params.courseId}`;
        console.log(
          `[${new Date().toISOString()} CoursePage] Fetching course from:`,
          courseUrl
        );
        const courseResponse = await fetch(courseUrl, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        const courseResult: ApiResponse = await courseResponse.json();
        console.log(
          `[${new Date().toISOString()} CoursePage] Course response:`,
          courseResult
        );
        if (!courseResponse.ok) {
          throw new Error(
            `Course fetch failed: ${courseResponse.status} ${
              courseResult.message || courseResponse.statusText
            }`
          );
        }
        if (!courseResult.success || !courseResult.data) {
          throw new Error(courseResult.message || "Failed to load course");
        }
        // Normalize imageUrl and videoUrl
        const courseData = {
          ...courseResult.data,
          imageUrl:
            courseResult.data.imageUrl && courseResult.data.imageUrl !== ""
              ? courseResult.data.imageUrl
              : null,
          tutors: courseResult.data.tutors.map((tutor) => ({
            ...tutor,
            videoUrl:
              tutor.videoUrl && tutor.videoUrl !== "" ? tutor.videoUrl : null,
          })),
        };
        setCourse(courseData);

        const enrollmentUrl = `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
        }/api/courses/${params.courseId}/enrollment`;
        console.log(
          `[${new Date().toISOString()} CoursePage] Fetching enrollment from:`,
          enrollmentUrl
        );
        const enrollmentResponse = await fetch(enrollmentUrl, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        const enrollmentResult: EnrollmentResponse =
          await enrollmentResponse.json();
        console.log(
          `[${new Date().toISOString()} CoursePage] Enrollment response:`,
          enrollmentResult
        );
        if (!enrollmentResponse.ok && enrollmentResponse.status !== 404) {
          throw new Error(
            `Enrollment fetch failed: ${enrollmentResponse.status} ${
              enrollmentResult.message || "Unknown error"
            }`
          );
        }
        setIsEnrolled(enrollmentResult.success && enrollmentResult.isEnrolled);
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : "Unexpected error occurred";
        console.error(`[${new Date().toISOString()} CoursePage] Error:`, error);
        if (retryCount < 2) {
          console.log(
            `[${new Date().toISOString()} CoursePage] Retrying (${
              retryCount + 1
            }/2)...`
          );
          setTimeout(() => fetchCourseAndEnrollment(retryCount + 1), 1000);
          return;
        }
        setError(errorMessage);
        toast.error(`Failed to load course details: ${errorMessage}`);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseAndEnrollment();
  }, [isSignedIn, router, params]);

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
    <ErrorBoundary>
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
              {sanitizeDescription(course.description) || "No description"}
            </p>
            <Badge variant={course.isPublished ? "default" : "secondary"}>
              {course.isPublished ? "Published" : "Draft"}
            </Badge>
          </CardContent>
        </Card>
        <div className="space-y-4">
          <h2 className="text-xl font-medium">Tutorials</h2>
          {course.tutors.length === 0 ? (
            <p className="text-sm text-slate-500 italic">
              No tutorials available
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {course.tutors.map((tutor, index) => (
                <Card key={tutor.id} className="border bg-slate-50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-x-2">
                      <IconBadge icon={LayoutDashboard} />
                      <span>Tutorial {index + 1}</span>
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
                        {sanitizeDescription(tutor.description) ||
                          "No description"}
                      </p>
                      <Badge
                        variant={tutor.isPublished ? "default" : "secondary"}
                      >
                        {tutor.isPublished ? "Published" : "Draft"}
                      </Badge>
                      <Link
                        href={`/faculty/create-faculty/${
                          course.facultyId || "default-faculty"
                        }/course/${params.courseId}/tutor/${tutor.id}`}
                        className="inline-block mt-2 text-sm text-blue-600 hover:underline"
                      >
                        View Tutorial
                      </Link>
                      {index === 0 && !isEnrolled && (
                        <Link href={`/courses/${params.courseId}/payment`}>
                          <Button className="mt-4 w-full">Course Enroll</Button>
                        </Link>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
};

const ErrorBoundary = ({ children }: { children: React.ReactNode }) => {
  try {
    return <>{children}</>;
  } catch (error) {
    console.error(
      `[${new Date().toISOString()} CoursePage] Rendering error:`,
      error
    );
    return (
      <div className="p-6">
        <h2 className="text-2xl font-medium">Error</h2>
        <p className="text-red-500">Failed to render course page</p>
      </div>
    );
  }
};

export default CoursePage;
