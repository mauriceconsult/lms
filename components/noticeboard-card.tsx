"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface NoticeboardCardProps {
  id: string;
  title: string;
  description: string;
  admin: string;
}

export const NoticeboardCard: React.FC<NoticeboardCardProps> = ({
  id,
  title,
  description,
  admin,
}) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/admins/${id}/noticeboards/${id}`);
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
        <p className="text-xs text-gray-500 mt-2">Admin: {admin}</p>
      </CardContent>
    </Card>
  );
};
