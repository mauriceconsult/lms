"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

interface AdminCardProps {
  id: string;
  title: string;
  imageUrl: string;
  description: string;
  admin: string;
}

export const AdminCard: React.FC<AdminCardProps> = ({
  id,
  title,
  imageUrl,
  description,
  admin,
}) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/admins/${id}`);
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
