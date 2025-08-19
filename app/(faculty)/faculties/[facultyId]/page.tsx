"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { LayoutDashboard, ListChecks } from "lucide-react";
import { IconBadge } from "@/components/icon-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "react-hot-toast";
import Image from "next/image";
import { CourseCard } from "@/components/course-card";

interface Course {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  isPublished: boolean;
  tutorId: string | null;
  amount: string | null;
  facultyId: string;
}

interface Faculty {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  isPublished: boolean;
  courses: Course[];
}

interface ApiResponse {
  success: boolean;
  data?: Faculty;
  message?: string;
}

const FacultyPage = () => {
  const [faculty, setFaculty] = useState<Faculty | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { isSignedIn, user } = useUser();
  const params = useParams<{ facultyId: string }>();

  useEffect(() => {
    if (!isSignedIn) {
      console.error(
        `[${new Date().toISOString()} FacultyPage] User not signed in`
      );
      router.push("/sign-in");
      return;
    }

    if (!params.facultyId) {
      console.error(
        `[${new Date().toISOString()} FacultyPage] No facultyId provided`
      );
      setError("No faculty ID provided");
      setLoading(false);
      return;
    }

    const fetchFaculty = async () => {
      try {
        console.log(
          `[${new Date().toISOString()} FacultyPage] Fetching from: /api/faculties/${
            params.facultyId
          }, User ID:`,
          user?.id
        );
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/faculties/${params.facultyId}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          }
        );
        console.log(
          `[${new Date().toISOString()} FacultyPage] Response status:`,
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
          `[${new Date().toISOString()} FacultyPage] Response data:`,
          result
        );
        if (result.success && result.data) {
          // Normalize imageUrl
          const facultyData = {
            ...result.data,
            imageUrl:
              result.data.imageUrl && result.data.imageUrl !== ""
                ? result.data.imageUrl
                : null,
            courses: result.data.courses.map((course) => ({
              ...course,
              imageUrl:
                course.imageUrl && course.imageUrl !== ""
                  ? course.imageUrl
                  : null,
            })),
          };
          setFaculty(facultyData);
        } else {
          throw new Error(result.message || "Failed to load faculty");
        }
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : "Unexpected error occurred";
        console.error(
          `[${new Date().toISOString()} FacultyPage] Error fetching faculty:`,
          error
        );
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchFaculty();
  }, [isSignedIn, router, user, params.facultyId]);

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

  if (!faculty) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-medium">Faculty Not Found</h2>
        <p>
          The requested faculty does not exist or you do not have access to it.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center gap-x-2 mb-6">
        <IconBadge icon={LayoutDashboard} />
        <h1 className="text-2xl font-medium">{faculty.title}</h1>
      </div>
      <Card className="border bg-slate-50 mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-x-2">
            <IconBadge icon={ListChecks} />
            <span>Faculty Details</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {faculty.imageUrl ? (
            <Image
              src={faculty.imageUrl}
              alt={faculty.title}
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
            {faculty.description || "No description available."}
          </p>
          <Badge variant={faculty.isPublished ? "default" : "secondary"}>
            {faculty.isPublished ? "Published" : "Draft"}
          </Badge>
        </CardContent>
      </Card>
      <div className="space-y-4">
        <h2 className="text-xl font-medium">Courses</h2>
        {faculty.courses.length === 0 ? (
          <p className="text-sm text-slate-500 italic">No courses available</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {faculty.courses.map((course) => (
              <CourseCard
                key={course.id}
                id={course.id}
                facultyId={course.facultyId}
                title={course.title}
                imageUrl={course.imageUrl}
                amount={course.amount}
                faculty={faculty.title}
                description={course.description}
                role={user?.publicMetadata?.role as "admin" | "student" | null}
              />
            ))}
          </div>
        )}
        <button
          onClick={() => {
            console.log(
              `[${new Date().toISOString()} FacultyPage] Test navigation to /courses/76d1ed13-eb74-49f3-872f-81ed4fe88ee0`
            );
            window.location.href =
              "/courses/76d1ed13-eb74-49f3-872f-81ed4fe88ee0";
          }}
          className="mt-4 p-2 bg-blue-600 text-white rounded"
        >
          Test Navigate to Course
        </button>
      </div>
    </div>
  );
};

export default FacultyPage;
