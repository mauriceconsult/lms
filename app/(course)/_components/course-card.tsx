"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Banner } from "@/components/banner";
import Image from "next/image";

interface CourseCardProps {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string;
  faculty: string;
  facultyId: string;
  isPublished: boolean;
  isAdmin: boolean;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  id,
  title,
  description,
  imageUrl,
  faculty,
  facultyId,
  isPublished,
  isAdmin,
}) => {
  const router = useRouter();
  const basePath = `/faculties/${facultyId}/courses/${id}${
    isAdmin ? "?role=admin" : ""
  }`;

  // Utility function to strip HTML tags
  const stripHtmlTags = (html: string | null): string => {
    if (!html) return "";
    return html
      .replace(/<[^>]+>/g, "")
      .replace(/\s+/g, " ")
      .trim();
  };

  return (
    <Card
      className="cursor-pointer hover:shadow-lg transition"
      onClick={() => router.push(basePath)}
    >
      <CardHeader>
        <CardTitle>{title || "Untitled Course"}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative h-40 w-full mb-4">
          <Image
            src={imageUrl}
            alt={title}
            width={400}
            height={160}
            className="object-cover rounded-md"
          />
        </div>
        <p className="text-sm text-gray-600 truncate">
          {stripHtmlTags(description) || "No description available"}
        </p>
        <p className="text-xs text-gray-500 mt-2">Faculty: {faculty}</p>
        {!isPublished && isAdmin && (
          <Banner variant="warning" label="This course is unpublished." />
        )}
      </CardContent>
    </Card>
  );
};
