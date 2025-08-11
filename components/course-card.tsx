
"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

interface CourseCardProps {
  id: string;
  facultyId: string;
  title: string;
  imageUrl?: string | null;
  amount: string | null;
  faculty: string;
  description?: string | null;
  createdAt: Date;
  role: "admin" | "student" | null;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  id,
  facultyId,
  title,
  imageUrl,
  amount,
  faculty,
  description,
  createdAt,
  role,
}) => {
  const router = useRouter();
  const placeholderImage = "/placeholder.png";
  const isValidImageUrl =
    imageUrl && imageUrl.startsWith("https://utfs.io/")
      ? imageUrl
      : placeholderImage;

  console.log(`[${new Date().toISOString()} CourseCard] Rendering course:`, {
    id,
    facultyId,
    title,
    amount,
    amountType: typeof amount,
    imageUrl,
    isValidImageUrl,
    role,
  });

  const handleClick = () => {
    if (!id || typeof id !== "string" || id === "undefined") {
      console.error(
        `[${new Date().toISOString()} CourseCard] Invalid courseId:`,
        { id }
      );
      return;
    }
    if (role === "admin") {
      console.log(
        `[${new Date().toISOString()} CourseCard] Navigating to: /courses/${id}`
      );
      router.push(`/courses/${id}`);
    } else {
      console.log(
        `[${new Date().toISOString()} CourseCard] Navigating to: /courses/${id}/tutors`
      );
      router.push(`/courses/${id}/tutors`);
    }
  };

  const formattedAmount = amount != null ? amount : "0.00";
  console.log(`[${new Date().toISOString()} CourseCard] Formatted amount:`, {
    id,
    amount,
    formattedAmount,
  });

  if (!isValidImageUrl) {
    console.log(
      `[${new Date().toISOString()} CourseCard] Using placeholder image for course:`,
      { id, imageSrc: isValidImageUrl }
    );
  }

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
            src={imageUrl || placeholderImage}
            alt={title}
            fill
            className="object-cover rounded-md"
          />
        </div>
        <p className="text-sm text-gray-600 truncate">
          {description
            ? description
                .replace(/<[^>]+>/g, "")
                .replace(/\s+/g, " ")
                .trim()
            : "No description available"}
        </p>
        <p className="text-xs text-gray-500 mt-2">Faculty: {faculty}</p>
        <p className="text-xs text-gray-500">Amount: ${formattedAmount}</p>
        <p className="text-xs text-gray-500">
          Created: {new Date(createdAt).toLocaleDateString()}
        </p>
      </CardContent>
    </Card>
  );
};
