"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

interface FacultyCardProps {
  id: string;
  title: string;
  imageUrl: string;
  description: string;
  school: string;
  role: "admin" | "student" | null;
}

export const FacultyCard: React.FC<FacultyCardProps> = ({
  id,
  title,
  imageUrl,
  description,
  school,
  role,
}) => {
  const router = useRouter();

  // For admins, fetch the first course ID dynamically (client-side)
  const handleClick = async () => {
    if (role === "admin") {
      try {
        const response = await fetch(`/api/faculties/${id}/courses?role=admin`);
        const courses = await response.json();
        const firstCourseId = courses?.[0]?.id;
        if (firstCourseId) {
          router.push(`/faculties/${id}/courses/${firstCourseId}?role=admin`);
        } else {
          router.push(`/faculties/${id}/courses/list`);
        }
      } catch (error) {
        console.error("Failed to fetch courses:", error);
        router.push(`/faculties/${id}/courses/list`);
      }
    } else {
      router.push(`/faculties/${id}/courses`);
    }
  };

  return (
    <Card
      className="cursor-pointer hover:shadow-lg transition"
      onClick={handleClick}
    >
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative h-40 w-full mb-4">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover rounded-md"
          />
        </div>
        <p className="text-sm text-gray-600 truncate">
          {description ? description.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim() : "No description available"}
        </p>
        <p className="text-xs text-gray-500 mt-2">School: {school}</p>
      </CardContent>
    </Card>
  );
};