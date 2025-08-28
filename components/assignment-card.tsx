"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AssignmentCardProps {
  id: string;
  title: string;
  description: string;
  courseId: string;
  adminId: string;
  tutorialId: string | undefined;
}

export const AssignmentCard: React.FC<AssignmentCardProps> = ({
  id,
  title,
  description,
  courseId,
  adminId,
  tutorialId,
}) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/admin/admins/${adminId}/course/${courseId}/tutorial/${tutorialId}/assignment/${id}`);
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
        <p className="text-sm text-gray-600 truncate">
          {description
            ? description
                .replace(/<[^>]+>/g, "")
                .replace(/\s+/g, " ")
                .trim()
            : "No description available"}
        </p>
      </CardContent>
    </Card>
  );
};
